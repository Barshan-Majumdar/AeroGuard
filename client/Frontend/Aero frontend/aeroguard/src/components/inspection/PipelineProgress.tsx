'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Loader2, XCircle, Box, FileText, AlertTriangle } from 'lucide-react';
import { useInspectionStore } from '@/stores/inspection.store';

export default function PipelineProgress() {
  const { pipelineStages, isPipelineRunning, pipelineComplete, startPipeline } = useInspectionStore();

  useEffect(() => {
    if (!isPipelineRunning && !pipelineComplete) {
      startPipeline();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const statusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'running':  return <Loader2 className="h-5 w-5 text-accent animate-spin" />;
      case 'error':    return <XCircle className="h-5 w-5 text-danger" />;
      default:         return <Circle className="h-5 w-5 text-text-tertiary/40" />;
    }
  };

  return (
    <div className="animate-slide-up space-y-5">
      <div>
        <h2 className="text-[18px] font-medium text-text-primary mb-1">AI Pipeline</h2>
        <p className="text-[13px] text-text-secondary">Processing your inspection video through the detection pipeline.</p>
      </div>

      <div className="rounded-lg border border-border-subtle bg-surface p-6">
        <div className="space-y-1">
          {pipelineStages.map((stage, i) => (
            <div key={stage.name}>
              <div className="flex items-center gap-4 rounded-md px-3 py-2.5">
                {statusIcon(stage.status)}
                <div className="flex-1">
                  <span className={`text-[14px] font-medium ${stage.status === 'pending' ? 'text-text-tertiary' : 'text-text-primary'}`}>
                    {stage.label}
                  </span>
                  {stage.progress && (
                    <span className="ml-3 text-[12px] font-mono text-accent">{stage.progress}</span>
                  )}
                </div>
                {stage.duration && (
                  <span className="text-[12px] font-mono text-text-tertiary">{stage.duration}</span>
                )}
              </div>
              {i < pipelineStages.length - 1 && (
                <div className="ml-[29px] h-3 w-px bg-border-subtle" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Results summary */}
      {pipelineComplete && (
        <div className="animate-slide-up rounded-lg border border-success/30 bg-success-subtle p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-success shrink-0" />
            <div>
              <h3 className="text-[15px] font-medium text-text-primary mb-1">Pipeline Complete</h3>
              <p className="text-[13px] text-text-secondary mb-4">3 defects detected across 1,247 analyzed frames.</p>
              <div className="mb-4 flex gap-3">
                <span className="rounded border border-danger/30 bg-danger-subtle px-2.5 py-1 text-[11px] font-medium text-danger">1 Critical</span>
                <span className="rounded border border-warning/30 bg-warning-subtle px-2.5 py-1 text-[11px] font-medium text-warning">1 Major</span>
                <span className="rounded border border-[rgba(234,88,12,0.3)] bg-[rgba(234,88,12,0.1)] px-2.5 py-1 text-[11px] font-medium text-[#EA580C]">1 Moderate</span>
              </div>
              <div className="flex gap-3">
                <Link href="/app/models/demo" className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-white hover:bg-accent-hover transition-colors">
                  <Box className="h-3.5 w-3.5" /> View 3D Twin
                </Link>
                <Link href="/app/reports" className="flex items-center gap-1.5 rounded-md border border-border-default px-4 py-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors">
                  <FileText className="h-3.5 w-3.5" /> Download Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPipelineRunning && (
        <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning-subtle px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-[13px] text-text-secondary">Do not close this page while pipeline is running.</span>
        </div>
      )}
    </div>
  );
}
