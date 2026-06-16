'use client';

import { create } from 'zustand';
import { PipelineStage, PipelineStageStatus } from '@/types/inspection';

const STAGE_DEFAULTS: PipelineStage[] = [
  { name: 'upload', label: 'Upload Complete', status: 'pending' },
  { name: 'frame_extraction', label: 'Frame Extraction', status: 'pending' },
  { name: 'enhancement', label: 'AI Enhancement', status: 'pending' },
  { name: 'defect_detection', label: 'Defect Detection', status: 'pending' },
  { name: 'reconstruction', label: '3D Reconstruction', status: 'pending' },
  { name: 'report_generation', label: 'Report Generation', status: 'pending' },
  { name: 'inventory_check', label: 'Inventory Check', status: 'pending' },
  { name: 'maintenance_recommendations', label: 'Maintenance Recommendations', status: 'pending' },
];

interface InspectionState {
  currentStep: number;
  aircraftModel: string;
  registrationNumber: string;
  tailNumber: string;
  inspectionType: string;
  uploadProgress: number;
  uploadedFile: { name: string; size: string } | null;
  pipelineStages: PipelineStage[];
  isUploading: boolean;
  isPipelineRunning: boolean;
  pipelineComplete: boolean;
  setStep: (step: number) => void;
  setField: (field: string, value: string) => void;
  startUpload: (fileName: string) => void;
  startPipeline: () => void;
  reset: () => void;
}

export const useInspectionStore = create<InspectionState>()((set, get) => ({
  currentStep: 1,
  aircraftModel: '',
  registrationNumber: '',
  tailNumber: '',
  inspectionType: '',
  uploadProgress: 0,
  uploadedFile: null,
  pipelineStages: STAGE_DEFAULTS.map((s) => ({ ...s })),
  isUploading: false,
  isPipelineRunning: false,
  pipelineComplete: false,

  setStep: (step) => set({ currentStep: step }),
  setField: (field, value) => set({ [field]: value } as any),

  startUpload: (fileName) => {
    set({ isUploading: true, uploadProgress: 0, uploadedFile: null });
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        set({
          uploadProgress: 100,
          isUploading: false,
          uploadedFile: { name: fileName, size: '2.4 GB' },
        });
      } else {
        set({ uploadProgress: Math.min(progress, 99) });
      }
    }, 200);
  },

  startPipeline: () => {
    const stages = STAGE_DEFAULTS.map((s) => ({ ...s }));
    stages[0].status = 'complete' as PipelineStageStatus;
    stages[0].duration = '48s';
    set({ isPipelineRunning: true, pipelineStages: stages, pipelineComplete: false });

    let currentIndex = 1;
    const runNext = () => {
      if (currentIndex >= stages.length) {
        set({ isPipelineRunning: false, pipelineComplete: true });
        return;
      }
      stages[currentIndex].status = 'running';
      const progressTexts: Record<string, string> = {
        frame_extraction: '1,247 / 3,840 frames',
        enhancement: 'Super-resolution pass',
        defect_detection: 'Analyzing 1,247 frames',
        reconstruction: 'Building point cloud',
        report_generation: 'Compiling findings',
        inventory_check: 'Cross-referencing parts',
        maintenance_recommendations: 'Generating advisories',
      };
      stages[currentIndex].progress = progressTexts[stages[currentIndex].name] || '';
      set({ pipelineStages: [...stages] });

      const delay = 1500 + Math.random() * 2000;
      setTimeout(() => {
        const durations = ['12s', '8s', '24s', '18s', '6s', '3s', '2s'];
        stages[currentIndex].status = 'complete';
        stages[currentIndex].duration = durations[currentIndex - 1] || '5s';
        stages[currentIndex].progress = undefined;
        currentIndex++;
        set({ pipelineStages: [...stages] });
        runNext();
      }, delay);
    };
    runNext();
  },

  reset: () =>
    set({
      currentStep: 1,
      aircraftModel: '',
      registrationNumber: '',
      tailNumber: '',
      inspectionType: '',
      uploadProgress: 0,
      uploadedFile: null,
      pipelineStages: STAGE_DEFAULTS.map((s) => ({ ...s })),
      isUploading: false,
      isPipelineRunning: false,
      pipelineComplete: false,
    }),
}));
