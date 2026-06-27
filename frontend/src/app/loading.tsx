'use client';

import { useState, useEffect } from 'react';

export default function Loading() {
  const [text, setText] = useState('Loading');

  useEffect(() => {
    const states = ['Loading', 'Fetching', 'Almost there'];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % states.length;
      setText(states[i]);
    }, 1500); // 1.5 seconds per state
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-base/80 backdrop-blur-md">
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
        {/* Glow behind */}
        <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse"></div>
        {/* Spinner rings */}
        <div className="absolute inset-0 rounded-full border-2 border-border-subtle"></div>
        <div className="absolute inset-0 rounded-full border-[3px] border-accent border-r-transparent border-t-transparent animate-spin"></div>
        {/* Center logo piece */}
        <div className="h-6 w-6 rounded flex items-center justify-center text-[12px] font-bold text-accent shadow-sm shadow-accent/50 bg-accent-subtle">
          A
        </div>
      </div>
      
      {/* Animated Text Container */}
      <div className="flex flex-col items-center overflow-hidden h-6">
        <span 
          key={text}
          className="animate-slide-up text-[13px] font-medium uppercase tracking-[0.15em] text-accent drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
        >
          {text}...
        </span>
      </div>
    </div>
  );
}
