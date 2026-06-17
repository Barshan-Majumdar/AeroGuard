import express from 'express';
import cors from 'cors';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Cloudflare R2 configuration
const r2UrlStr = process.env.CLOUDFLARE_R2_URL || 's3://dummy-key:dummy-secret@dummy-account.r2.cloudflarestorage.com/aeroguard-videos';
const r2Url = new URL(r2UrlStr);
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${r2Url.host}`,
  credentials: {
    accessKeyId: r2Url.username,
    secretAccessKey: r2Url.password,
  },
});
const bucketName = r2Url.pathname.replace(/^\//, '');

import Redis from 'ioredis';

// BullMQ configuration
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const connection = new Redis(redisUrl, { maxRetriesPerRequest: null });

const videoQueue = new Queue('videoProcessing', { connection });

// 1. Generate Presigned URL
app.post('/api/upload/presigned-url', async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const key = `uploads/${Date.now()}-${filename}`;
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType || 'video/mp4',
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    res.json({
      uploadUrl: presignedUrl,
      key: key,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate presigned URL' });
  }
});

// 2. Webhook / Upload Success -> Add job to BullMQ
app.post('/api/upload/success', async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    // Add job to BullMQ
    const job = await videoQueue.add('process-video', {
      videoKey: key,
    });

    res.json({
      message: 'Job queued successfully',
      jobId: job.id,
    });
  } catch (error) {
    console.error('Error queueing job:', error);
    res.status(500).json({ error: 'Failed to queue job' });
  }
});

app.listen(PORT, () => {
  console.log(`Node.js Backend API listening on port ${PORT}`);
});
