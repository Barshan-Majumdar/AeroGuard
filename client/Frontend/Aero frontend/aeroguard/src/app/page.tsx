'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Upload,
  Cpu,
  Box,
  FileText,
  Package,
  Shield,
  ChevronRight,
  Play,
  Zap,
  Eye,
  BarChart3,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   Custom Hooks
   ═══════════════════════════════════════════ */

/** Intersection Observer hook for scroll-reveal animations */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/** Animated counter hook */
function useCounter(target: number, duration: number = 1200, shouldStart: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, shouldStart]);

  return count;
}


/* ═══════════════════════════════════════════
   Floating Particles Background
   ═══════════════════════════════════════════ */

function FloatingParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${5 + (i * 37 + 13) % 90}%`,
      top: `${5 + (i * 53 + 7) % 90}%`,
      size: `${1.5 + (i % 4) * 0.8}px`,
      dx: `${-60 + (i * 29) % 120}px`,
      dy: `${-80 + (i * 41) % 160}px`,
      duration: `${6 + (i % 5) * 2}s`,
      delay: `${(i * 1.1) % 8}s`,
      opacity: 0.15 + (i % 6) * 0.05,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            '--size': p.size,
            '--dx': p.dx,
            '--dy': p.dy,
            '--duration': p.duration,
            '--delay': p.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════
   Ambient Gradient Orbs
   ═══════════════════════════════════════════ */

function AmbientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="orb orb-primary"
        style={{ top: '30%', left: '60%', width: '600px', height: '600px' }}
      />
      <div
        className="orb orb-secondary"
        style={{ top: '60%', left: '20%', width: '500px', height: '500px' }}
      />
      <div
        className="orb orb-tertiary"
        style={{ top: '10%', left: '40%', width: '400px', height: '400px' }}
      />
    </div>
  );
}


/* ═══════════════════════════════════════════
   Scroll-aware Nav
   ═══════════════════════════════════════════ */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    setNavVisible(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex h-[56px] items-center justify-between px-6 transition-all duration-500 ${
        scrolled
          ? 'glass-nav border-b border-border-subtle shadow-lg'
          : 'bg-transparent'
      }`}
      style={{
        opacity: navVisible ? 1 : 0,
        transform: navVisible ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease, background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-white"
          style={{ boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' }}
        >
          A
        </div>
        <span className="text-[15px] font-semibold text-text-primary">AeroGuard</span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-[13px] text-text-secondary hover:text-text-primary transition-colors duration-300"
        >
          Sign In
        </Link>
        <Link
          href="/app/dashboard"
          className="btn-glow flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-1.5 text-[13px] font-medium text-white transition-all hover:bg-accent-hover"
        >
          Start Inspection
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </nav>
  );
}


/* ═══════════════════════════════════════════
   Typewriter Badge
   ═══════════════════════════════════════════ */

function TypewriterBadge() {
  const [text, setText] = useState('');
  const fullText = 'Aircraft Inspection AI';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface/80 px-3.5 py-1.5 float-badge hero-enter hero-delay-1">
      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
      <span
        className={text.length < fullText.length ? 'typewriter-cursor' : ''}
        style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#A1A1AA',
        }}
      >
        {text}
      </span>
    </div>
  );
}


/* ═══════════════════════════════════════════
   Hero Section
   ═══════════════════════════════════════════ */

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden noise-overlay">
      {/* Animated grid */}
      <div className="grid-overlay-animated absolute inset-0 pointer-events-none" />

      {/* Ambient orbs */}
      <AmbientOrbs />

      <div className="relative mx-auto flex w-full max-w-[1200px] items-center gap-16 px-6 pt-[56px]">
        {/* Left content */}
        <div className="flex-1 max-w-[560px]">
          <TypewriterBadge />

          <h1
            className="mb-5 gradient-text hero-enter hero-delay-2"
            style={{
              fontWeight: 600,
              fontSize: '52px',
              lineHeight: 1.08,
              fontFamily: 'var(--font-inter), sans-serif',
              letterSpacing: '-0.03em'
            }}
          >
            AI-Powered
            <br />
            Aircraft Inspection
          </h1>

          <p className="mb-8 max-w-[460px] text-[17px] leading-[1.7] text-text-secondary hero-enter hero-delay-3">
            Replace manual borescope video review with automated defect detection,
            3D digital twin visualization, and compliance reporting — all from one platform.
          </p>

          <div className="flex items-center gap-3 hero-enter hero-delay-4">
            <Link
              href="/app/dashboard"
              className="btn-glow flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-[14px] font-medium text-white"
            >
              <Sparkles className="h-4 w-4" />
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="flex items-center gap-2 rounded-lg border border-border-default px-5 py-2.5 text-[14px] font-medium text-text-secondary transition-all duration-300 hover:border-accent/40 hover:text-text-primary hover:bg-accent/5">
              <Play className="h-3.5 w-3.5" />
              Watch Demo
            </button>
          </div>

          <div className="mt-10 flex items-center gap-6 text-[12px] text-text-tertiary hero-enter hero-delay-5">
            {['FAA Compliant', 'EASA Approved', 'ISO 27001'].map((cert) => (
              <span key={cert} className="flex items-center gap-1.5 transition-colors duration-300 hover:text-text-secondary">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Pipeline diagram */}
        <div className="hidden flex-1 lg:block hero-enter hero-delay-5">
          <PipelineDiagram />
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   Animated Pipeline Diagram
   ═══════════════════════════════════════════ */

function PipelineDiagram() {
  const [activeStage, setActiveStage] = useState(0);
  const stages = [
    { icon: Upload, label: 'Upload', detail: '4K Video', color: '#2563EB' },
    { icon: Cpu, label: 'AI Detection', detail: '1,247 Frames', color: '#8B5CF6' },
    { icon: Eye, label: 'Enhancement', detail: 'Super-Res', color: '#06B6D4' },
    { icon: Zap, label: 'Defect Analysis', detail: '3 Found', color: '#F59E0B' },
    { icon: Box, label: '3D Twin', detail: 'Heatmap', color: '#10B981' },
    { icon: FileText, label: 'Report', detail: 'Compliant', color: '#EC4899' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div
      className="relative rounded-xl border border-border-subtle bg-surface/60 p-6 backdrop-blur-sm"
      style={{ boxShadow: '0 0 60px rgba(37, 99, 235, 0.05), 0 8px 32px rgba(0,0,0,0.3)' }}
    >
      {/* Progress bar at top */}
      <div className="mb-5 h-[3px] rounded-full bg-elevated overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-[2200ms] ease-linear"
          style={{
            width: `${((activeStage + 1) / stages.length) * 100}%`,
            background: 'linear-gradient(90deg, #2563EB, #8B5CF6, #06B6D4)',
          }}
        />
      </div>

      <div className="space-y-2">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = i === activeStage;
          const isComplete = i < activeStage;

          return (
            <div key={stage.label} className="pipeline-connector">
              <div
                className={`flex items-center gap-4 rounded-lg border px-4 py-3 transition-all duration-500 ${
                  isActive
                    ? 'border-accent/40 bg-accent-subtle stage-active-shimmer'
                    : isComplete
                    ? 'border-success/20 bg-success/5'
                    : 'border-transparent bg-transparent'
                }`}
                style={isActive ? { boxShadow: `0 0 30px ${stage.color}10` } : {}}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-500 ${
                    isActive
                      ? 'text-white scale-110'
                      : isComplete
                      ? 'bg-success/10 text-success'
                      : 'bg-elevated text-text-tertiary'
                  }`}
                  style={isActive ? { background: stage.color, boxShadow: `0 0 20px ${stage.color}40` } : {}}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Icon className={`h-4 w-4 ${isActive ? 'animate-pulse' : ''}`} />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`text-[13px] font-medium transition-colors duration-300 ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {stage.label}
                  </div>
                </div>
                <div
                  className={`text-[11px] font-mono transition-all duration-300 ${
                    isActive ? 'text-accent' : isComplete ? 'text-success' : 'text-text-tertiary'
                  }`}
                >
                  {isComplete ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Done
                    </span>
                  ) : isActive ? (
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      Running...
                    </span>
                  ) : (
                    stage.detail
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data flow indicator */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-elevated/80 px-4 py-2.5 border border-border-subtle">
        <span className="text-[11px] text-text-tertiary font-mono">Pipeline ETA</span>
        <span className="text-[13px] font-mono gradient-text-accent font-semibold">~12 min</span>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   Trusted By — Marquee
   ═══════════════════════════════════════════ */

function TrustedBy() {
  const { ref, isVisible } = useReveal(0.2);
  const logos = ['Lufthansa Technik', 'Delta TechOps', 'SIA Engineering', 'Air France KLM E&M', 'ST Aerospace', 'HAECO'];

  return (
    <section ref={ref} className="relative border-y border-border-subtle bg-surface/30 py-10 overflow-hidden">
      <div className="glow-divider absolute top-0 left-0 right-0" />

      <div className={`mx-auto max-w-[1200px] px-6 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
          Trusted by leading MRO organizations
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {logos.map((name) => (
            <span
              key={name}
              className="text-[15px] font-medium text-text-tertiary/50 transition-colors duration-300 hover:text-accent cursor-default select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   Single Stat Card (standalone component for hooks)
   ═══════════════════════════════════════════ */

function StatCard({ value, suffix, label, index, parentVisible }: {
  value: number;
  suffix: string;
  label: string;
  index: number;
  parentVisible: boolean;
}) {
  const count = useCounter(value, 1500, parentVisible);

  return (
    <div
      className={`text-center transition-all duration-700 ${parentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="text-[36px] font-semibold gradient-text-accent" style={{ letterSpacing: '-0.03em' }}>
        {value >= 10000 ? `${(count / 1000).toFixed(count < value ? 1 : 0)}k` : count}
        {suffix}
      </div>
      <div className="mt-1 text-[13px] text-text-tertiary">{label}</div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   Stats Section
   ═══════════════════════════════════════════ */

function Stats() {
  const { ref, isVisible } = useReveal(0.3);

  const stats = [
    { value: 97, suffix: '%+', label: 'Detection Accuracy' },
    { value: 80, suffix: '%', label: 'Time Reduction' },
    { value: 15, suffix: ' min', label: 'Average Processing' },
    { value: 10000, suffix: '+', label: 'Inspections Completed' },
  ];

  return (
    <section ref={ref} className="py-16 bg-surface/20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              index={i}
              parentVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   RevealCard — Card with individual scroll-reveal
   ═══════════════════════════════════════════ */

function RevealCard({
  index,
  children,
  className = '',
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isVisible } = useReveal(0.15);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group card card-glow cursor-default transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:border-accent/20 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {children}
    </div>
  );
}


/* ═══════════════════════════════════════════
   How It Works
   ═══════════════════════════════════════════ */

function HowItWorks() {
  const { ref: headerRef, isVisible: headerVisible } = useReveal(0.3);

  const steps = [
    { num: '01', title: 'Upload Video', desc: 'Drag & drop borescope footage in any format. Supports 4K, drone, and endoscopic video.' },
    { num: '02', title: 'Frame Extraction', desc: 'AI extracts and deduplicates key frames from hours of raw video footage.' },
    { num: '03', title: 'AI Enhancement', desc: 'Super-resolution and noise reduction brings out hidden defect details.' },
    { num: '04', title: 'Defect Detection', desc: 'Computer vision models identify cracks, erosion, FOD, and thermal damage.' },
    { num: '05', title: '3D Reconstruction', desc: 'Detected defects are mapped onto a 3D digital twin with severity heatmaps.' },
    { num: '06', title: 'Compliance Report', desc: 'FAA/EASA-compliant reports auto-generated with recommendations and part orders.' },
  ];

  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-[1200px] px-6">
        <div ref={headerRef} className={`mb-14 text-center reveal ${headerVisible ? 'visible' : ''}`}>
          <p className="mb-3" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#71717A' }}>
            How It Works
          </p>
          <h2
            className="gradient-text"
            style={{
              fontWeight: 500,
              fontSize: '36px',
              lineHeight: 1.15,
              fontFamily: 'var(--font-inter), sans-serif',
              letterSpacing: '-0.025em'
            }}
          >
            From Video to Report in 15 Minutes
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <RevealCard key={step.num} index={i} className="p-6">
              <span className="mb-3 block font-mono text-[12px] gradient-text-accent font-semibold">{step.num}</span>
              <h3 className="mb-2 text-[16px] font-medium text-text-primary group-hover:text-accent transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-[13px] leading-[1.6] text-text-secondary">{step.desc}</p>
            </RevealCard>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   Features
   ═══════════════════════════════════════════ */

function Features() {
  const { ref: headerRef, isVisible: headerVisible } = useReveal(0.3);

  const features: { icon: LucideIcon; title: string; desc: string; gradient: string }[] = [
    {
      icon: Cpu,
      title: 'Edge AI Detection',
      desc: 'Real-time defect detection with 97%+ accuracy on cracks, erosion, FOD, and thermal damage.',
      gradient: 'from-blue-500/10 to-violet-500/10',
    },
    {
      icon: Box,
      title: '3D Digital Twin',
      desc: 'Interactive engine visualization with severity heatmaps and component-level drill-down.',
      gradient: 'from-violet-500/10 to-pink-500/10',
    },
    {
      icon: FileText,
      title: 'Compliance Reports',
      desc: 'Auto-generated reports mapped to FAA AC 33.27, EASA Part-145, and airline-specific standards.',
      gradient: 'from-cyan-500/10 to-blue-500/10',
    },
    {
      icon: Package,
      title: 'Smart Procurement',
      desc: 'Automated parts ordering when critical defects are detected. Supplier matching and ETA tracking.',
      gradient: 'from-amber-500/10 to-orange-500/10',
    },
    {
      icon: BarChart3,
      title: 'Predictive Analytics',
      desc: 'Defect trend analysis, fleet health monitoring, and maintenance forecasting across your fleet.',
      gradient: 'from-emerald-500/10 to-teal-500/10',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      desc: 'SOC 2 Type II, ISO 27001, role-based access control, full audit trail, and data encryption at rest.',
      gradient: 'from-rose-500/10 to-red-500/10',
    },
  ];

  return (
    <section className="border-t border-border-subtle bg-surface/20 py-24 relative">
      <div className="glow-divider absolute top-0 left-0 right-0" />

      <div className="mx-auto max-w-[1200px] px-6">
        <div ref={headerRef} className={`mb-14 text-center reveal ${headerVisible ? 'visible' : ''}`}>
          <p className="mb-3" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#71717A' }}>
            Core Capabilities
          </p>
          <h2
            className="gradient-text"
            style={{
              fontWeight: 500,
              fontSize: '36px',
              lineHeight: 1.15,
              fontFamily: 'var(--font-inter), sans-serif',
              letterSpacing: '-0.025em'
            }}
          >
            Built for Mission-Critical Inspection
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <RevealCard key={feature.title} index={i} className="p-6">
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient} border border-border-subtle text-accent transition-all duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-[16px] font-medium text-text-primary group-hover:text-accent transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-[1.6] text-text-secondary">{feature.desc}</p>
              </RevealCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   Security
   ═══════════════════════════════════════════ */

function Security() {
  const { ref, isVisible } = useReveal(0.2);

  const certs = [
    { label: 'FAA Approved', detail: 'Part 145 Compliant' },
    { label: 'EASA', detail: 'Part-145 / Part-M' },
    { label: 'ISO 27001', detail: 'Information Security' },
    { label: 'SOC 2 Type II', detail: 'Trust Services' },
  ];

  return (
    <section ref={ref} className="py-20 relative">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className={`mb-10 text-center reveal ${isVisible ? 'visible' : ''}`}>
          <p className="mb-3" style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#71717A' }}>
            Security & Compliance
          </p>
          <h2
            className="mb-3 gradient-text"
            style={{
              fontWeight: 500,
              fontSize: '28px',
              lineHeight: 1.2,
              fontFamily: 'var(--font-inter), sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            Enterprise-Grade Trust
          </h2>
          <p className="mx-auto max-w-[500px] text-[14px] leading-[1.7] text-text-secondary">
            AeroGuard meets the highest aviation and information security standards.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {certs.map((cert, i) => (
            <div
              key={cert.label}
              className={`flex items-center gap-3 rounded-xl border border-border-subtle bg-surface/80 px-6 py-4 transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg cursor-default ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                transitionDelay: `${300 + i * 100}ms`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div>
                <div className="text-[13px] font-medium text-text-primary">{cert.label}</div>
                <div className="text-[11px] text-text-tertiary">{cert.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   CTA
   ═══════════════════════════════════════════ */

function FinalCTA() {
  const { ref, isVisible } = useReveal(0.3);

  return (
    <section className="border-t border-border-subtle py-24 relative overflow-hidden">
      <div className="glow-divider absolute top-0 left-0 right-0" />

      {/* Background orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div ref={ref} className={`relative mx-auto max-w-[600px] px-6 text-center reveal ${isVisible ? 'visible' : ''}`}>
        <h2
          className="mb-4 gradient-text"
          style={{
            fontWeight: 500,
            fontSize: '36px',
            lineHeight: 1.15,
            fontFamily: 'var(--font-inter), sans-serif',
            letterSpacing: '-0.025em'
          }}
        >
          Ready to Transform Your Inspection Workflow?
        </h2>
        <p className="mb-8 text-[15px] leading-[1.7] text-text-secondary">
          Join leading MRO organizations using AeroGuard to reduce inspection time by 80% and improve defect detection accuracy.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/app/dashboard"
            className="btn-glow flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-[14px] font-medium text-white"
          >
            <Sparkles className="h-4 w-4" />
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/app/dashboard"
            className="flex items-center gap-2 rounded-lg border border-border-default px-6 py-3 text-[14px] font-medium text-text-secondary transition-all duration-300 hover:border-accent/40 hover:text-text-primary hover:bg-accent/5"
          >
            Request Enterprise Demo
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   Footer
   ═══════════════════════════════════════════ */

function Footer() {
  const { ref, isVisible } = useReveal(0.1);

  const columns = [
    { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Changelog'] },
    { title: 'Resources', links: ['Documentation', 'API Reference', 'Status', 'Blog'] },
    { title: 'Company', links: ['About', 'Careers', 'Contact', 'Legal'] },
  ];

  return (
    <footer
      ref={ref}
      className={`border-t border-border-subtle bg-surface/30 py-12 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-start justify-between gap-8 px-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex h-6 w-6 items-center justify-center rounded bg-accent text-[10px] font-bold text-white"
              style={{ boxShadow: '0 0 15px rgba(37, 99, 235, 0.3)' }}
            >
              A
            </div>
            <span className="text-[14px] font-semibold text-text-primary">AeroGuard</span>
          </div>
          <p className="max-w-[220px] text-[12px] leading-[1.6] text-text-tertiary">
            AI-powered aircraft inspection platform for MRO organizations worldwide.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] text-text-secondary hover:text-accent transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-[1200px] border-t border-border-subtle px-6 pt-6">
        <p className="text-[11px] text-text-tertiary">
          © 2025 AeroGuard Aviation Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}


/* ═══════════════════════════════════════════
   Landing Page
   ═══════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-base">
      <Nav />
      <Hero />
      <TrustedBy />
      <Stats />
      <HowItWorks />
      <Features />
      <Security />
      <FinalCTA />
      <Footer />
    </div>
  );
}
