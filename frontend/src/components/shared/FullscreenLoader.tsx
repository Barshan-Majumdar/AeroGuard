'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function FullscreenLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < 2 ? s + 1 : 2));
    }, 1200); // Slower cycle as requested
    return () => clearInterval(interval);
  }, []);

  const steps = ['Loading', 'Fetching', 'Almost there'];

  return (
    <div className="absolute inset-0 z-[100] bg-base/40 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      <div className="sticky top-0 left-0 w-full h-[100dvh] flex flex-col items-center justify-center">
        {/* Glassmorphic Wrapper Card */}
        <div className="w-[340px] flex flex-col items-center rounded-2xl bg-surface/60 border border-white/5 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl relative overflow-hidden">
        {/* Subtle top highlight for glass effect */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* The line with three dots */}
        <div className="relative flex items-center justify-between w-full mb-8 mt-2">
          {/* Background line */}
          <div className="absolute left-0 top-1/2 h-[4px] w-full -translate-y-1/2 bg-border-subtle rounded-full shadow-inner" />
          
          {/* Active line with gradient */}
          <div 
            className="absolute left-0 top-1/2 h-[4px] -translate-y-1/2 bg-gradient-to-r from-accent to-blue-400 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(37,99,235,0.8)] rounded-full"
            style={{ width: `${(step / 2) * 100}%` }}
          />
          
          {/* Dots */}
          {[0, 1, 2].map((stepIdx) => (
            <div 
              key={stepIdx} 
              className={cn(
                "relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-[3px] transition-all duration-500",
                stepIdx <= step 
                  ? "border-blue-400 bg-accent shadow-[0_0_16px_rgba(37,99,235,1)] scale-110" 
                  : "border-border-default bg-surface scale-100"
              )}
            >
              {stepIdx === step && (
                <div className="absolute h-8 w-8 animate-ping rounded-full bg-blue-400/30" />
              )}
            </div>
          ))}
        </div>
        
        {/* Text */}
        <div className="h-6 overflow-hidden flex items-center justify-center">
          <span 
            key={step}
            className="animate-slide-up text-[13px] font-bold uppercase tracking-[0.2em] text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
          >
            {steps[step]}...
          </span>
        </div>
      </div>
      </div>
    </div>
  );
}
