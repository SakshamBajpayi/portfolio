'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '../lib/gsap';
import { Shard, RecurringTriangle } from './GeometricLayer';

/* ═══════════════════════════════════════════════════════════════
   OBSESSIONS — Section 04
   "Changes frequently. That's the point."
   ═══════════════════════════════════════════════════════════════ */

// ── SVG Icons ──

const SpiderIcon: React.FC = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx={24} cy={24} r={4} stroke="var(--ink)" strokeWidth={1.4} fill="none" />
    {/* 8 thin angled legs radiating from center */}
    <line x1={24} y1={20} x2={16} y2={6} stroke="var(--ink)" strokeWidth={1} />
    <line x1={24} y1={20} x2={32} y2={6} stroke="var(--ink)" strokeWidth={1} />
    <line x1={20} y1={24} x2={4} y2={16} stroke="var(--ink)" strokeWidth={1} />
    <line x1={28} y1={24} x2={44} y2={16} stroke="var(--ink)" strokeWidth={1} />
    <line x1={20} y1={24} x2={4} y2={32} stroke="var(--ink)" strokeWidth={1} />
    <line x1={28} y1={24} x2={44} y2={32} stroke="var(--ink)" strokeWidth={1} />
    <line x1={24} y1={28} x2={16} y2={42} stroke="var(--ink)" strokeWidth={1} />
    <line x1={24} y1={28} x2={32} y2={42} stroke="var(--ink)" strokeWidth={1} />
  </svg>
);

const RLIcon: React.FC = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    {/* 3 circles connected by arrows */}
    <circle cx={8} cy={24} r={4} stroke="var(--ink)" strokeWidth={1.4} fill="none" />
    <circle cx={24} cy={24} r={4} stroke="var(--ink)" strokeWidth={1.4} fill="none" />
    <circle cx={40} cy={24} r={4} stroke="var(--ink)" strokeWidth={1.4} fill="none" />
    {/* Arrow: circle1 → circle2 */}
    <line x1={12} y1={24} x2={19} y2={24} stroke="var(--ink)" strokeWidth={1} />
    <polyline points="17,22 19,24 17,26" stroke="var(--ink)" strokeWidth={1} fill="none" />
    {/* Arrow: circle2 → circle3 */}
    <line x1={28} y1={24} x2={35} y2={24} stroke="var(--ink)" strokeWidth={1} />
    <polyline points="33,22 35,24 33,26" stroke="var(--ink)" strokeWidth={1} fill="none" />
    {/* Feedback arrow curving back from circle3 to circle1 */}
    <path
      d="M38,20 Q38,10 24,10 Q10,10 10,20"
      stroke="var(--ink)"
      strokeWidth={0.8}
      fill="none"
      strokeDasharray="2 2"
    />
    <polyline points="8,18 10,20 12,18" stroke="var(--ink)" strokeWidth={0.8} fill="none" />
  </svg>
);

const WebIcon: React.FC = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    {/* Rectangle (browser window) */}
    <rect x={6} y={10} width={36} height={28} rx={2} stroke="var(--ink)" strokeWidth={1.4} fill="none" />
    {/* Top bar line */}
    <line x1={6} y1={17} x2={42} y2={17} stroke="var(--ink)" strokeWidth={0.8} />
    {/* 3 dots in title bar */}
    <circle cx={11} cy={13.5} r={1.2} fill="var(--ink)" />
    <circle cx={15.5} cy={13.5} r={1.2} fill="var(--ink)" />
    <circle cx={20} cy={13.5} r={1.2} fill="var(--ink)" />
    {/* Small spark/star at corner */}
    <line x1={38} y1={6} x2={38} y2={12} stroke="var(--accent-magenta)" strokeWidth={1.2} />
    <line x1={35} y1={9} x2={41} y2={9} stroke="var(--accent-magenta)" strokeWidth={1.2} />
    <line x1={35.8} y1={6.8} x2={40.2} y2={11.2} stroke="var(--accent-magenta)" strokeWidth={0.8} />
    <line x1={40.2} y1={6.8} x2={35.8} y2={11.2} stroke="var(--accent-magenta)" strokeWidth={0.8} />
  </svg>
);

const HumanoidIcon: React.FC = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    {/* Round head */}
    <circle cx={24} cy={10} r={5} stroke="var(--ink)" strokeWidth={1.4} fill="none" />
    {/* Body */}
    <line x1={24} y1={15} x2={24} y2={30} stroke="var(--ink)" strokeWidth={1.4} />
    {/* Arms */}
    <line x1={24} y1={20} x2={14} y2={26} stroke="var(--ink)" strokeWidth={1.2} />
    <line x1={24} y1={20} x2={34} y2={26} stroke="var(--ink)" strokeWidth={1.2} />
    {/* Legs */}
    <line x1={24} y1={30} x2={16} y2={42} stroke="var(--ink)" strokeWidth={1.2} />
    <line x1={24} y1={30} x2={32} y2={42} stroke="var(--ink)" strokeWidth={1.2} />
  </svg>
);

const BroadcastIcon: React.FC = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    {/* Center dot */}
    <circle cx={24} cy={38} r={2.5} fill="var(--ink)" />
    {/* 3 concentric arc lines */}
    <path d="M16,30 A12,12 0 0 1 32,30" stroke="var(--ink)" strokeWidth={1.2} fill="none" />
    <path d="M10,24 A18,18 0 0 1 38,24" stroke="var(--ink)" strokeWidth={1.1} fill="none" />
    <path d="M4,18 A24,24 0 0 1 44,18" stroke="var(--ink)" strokeWidth={1.0} fill="none" />
  </svg>
);

// ── Obsession Data ──

interface ObsessionItem {
  label: string;
  annotation: string;
  borderColor: string;
  icon: React.ReactNode | null;
  marginTop: number;
  rotation: number;
  widthOffset: number;
  heightOffset: number;
  animFrom: { x?: number; y?: number };
  isLast?: boolean;
  annotationStyle?: React.CSSProperties;
}

const obsessions: ObsessionItem[] = [
  {
    label: 'robot spiders',
    annotation: '(8 legs still not enough)',
    borderColor: 'var(--accent-orange)',
    icon: <SpiderIcon />,
    marginTop: -20,
    rotation: -2,
    widthOffset: 0,
    heightOffset: 5,
    animFrom: { y: 40 },
    annotationStyle: { fontSize: '17px', fontWeight: 700, color: '#6B6560', opacity: 0.8, transform: 'rotate(-2deg)' },
  },
  {
    label: 'reinforcement learning',
    annotation: '(reward is everything)',
    borderColor: 'var(--accent-cyan)',
    icon: <RLIcon />,
    marginTop: 10,
    rotation: 1,
    widthOffset: -5,
    heightOffset: -10,
    animFrom: { x: -40 },
  },
  {
    label: 'making websites unnecessarily cool',
    annotation: '(this one, for example)',
    borderColor: 'var(--accent-magenta)',
    icon: <WebIcon />,
    marginTop: -5,
    rotation: -3,
    widthOffset: 10,
    heightOffset: 0,
    animFrom: { y: 50 },
  },
  {
    label: 'humanoid robots',
    annotation: '(walking is hard, ok?)',
    borderColor: 'var(--accent-orange)',
    icon: <HumanoidIcon />,
    marginTop: 15,
    rotation: 2,
    widthOffset: -10,
    heightOffset: 10,
    animFrom: { x: 40 },
  },
  {
    label: 'building in public',
    annotation: '(hi if you\'re reading this)',
    borderColor: 'var(--accent-purple)',
    icon: <BroadcastIcon />,
    marginTop: -10,
    rotation: -1,
    widthOffset: 5,
    heightOffset: -5,
    animFrom: { y: 30 },
    annotationStyle: { fontSize: '20px', fontWeight: 700, color: '#0D0C0B', opacity: 1 },
  },
  {
    label: '→ more coming soon',
    annotation: '(always)',
    borderColor: 'var(--accent-yellow)',
    icon: null,
    marginTop: 5,
    rotation: 0,
    widthOffset: 0,
    heightOffset: 0,
    animFrom: { x: -30 },
    isLast: true,
  },
];

// ── Module Component ──

const ObsessionModule: React.FC<{
  item: ObsessionItem;
  index: number;
}> = ({ item, index }) => {
  const baseW = 160 + item.widthOffset;
  const baseH = 160 + item.heightOffset;

  return (
    <motion.div
      className="obsession-module"
      data-index={index}
      style={{
        width: baseW,
        height: baseH,
        marginTop: item.marginTop,
        transform: `rotate(${item.rotation}deg)`,
        background: 'rgba(242,237,228,0.5)',
        boxShadow: '0 2px 16px rgba(13,12,11,0.06)',
        borderBottom: `2px solid ${item.borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '20px 14px 16px',
        position: 'relative',
        cursor: 'none',
        willChange: 'transform',
        flexShrink: 0,
      }}
      whileHover={{
        scale: 1.04,
        borderBottomWidth: '4px',
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
    >
      {/* Icon */}
      {item.icon && (
        <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {item.icon}
        </div>
      )}

      {/* Label */}
      <span
        className="font-accent"
        style={{
          fontWeight: 700,
          fontSize: 16,
          color: 'var(--ink)',
          textAlign: 'center',
          lineHeight: 1.2,
          ...(item.isLast ? { fontStyle: 'italic' } : {}),
        }}
      >
        {item.label}
      </span>

      {/* Annotation */}
      <motion.span
        className="font-accent"
        style={{
          fontWeight: 700,
          fontSize: '16px',
          color: item.isLast ? 'var(--accent-yellow)' : 'var(--ink-muted)',
          fontStyle: 'italic',
          textAlign: 'center',
          opacity: 0.7,
          lineHeight: 1.3,
          ...item.annotationStyle,
        }}
        whileHover={{
          y: -4,
          opacity: 0.8,
          transition: { duration: 0.2, ease: 'easeOut' },
        }}
      >
        {item.annotation}
      </motion.span>
    </motion.div>
  );
};

// ── Main Component ──

const Obsessions: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const modulesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = modulesRef.current;
    if (!section || !container) return;

    const modules = container.querySelectorAll<HTMLElement>('.obsession-module');
    if (modules.length === 0) return;

    const ctx = gsap.context(() => {
      // Fix A: Late render / flash of unstyled content
      const shapes = document.querySelectorAll('.obsessions-shape');
      shapes.forEach((el, i) => {
        const targetEl = el as HTMLElement;
        const finalOp = targetEl.style.opacity || '1';
        gsap.set(targetEl, { opacity: 0 });
        gsap.to(targetEl, {
          opacity: parseFloat(finalOp),
          duration: 0.5,
          delay: i * 0.08,
          scrollTrigger: {
            trigger: section,
            start: 'top 100%',
            toggleActions: 'play none none reverse',
          }
        });
      });

      modules.forEach((mod, i) => {
        const item = obsessions[i];
        if (!item) return;

        gsap.fromTo(
          mod,
          {
            opacity: 0,
            x: item.animFrom.x ?? 0,
            y: item.animFrom.y ?? 0,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-cream"
      data-section="5"
      style={{
        position: 'relative',
        padding: `var(--section-pad) clamp(1.5rem, 5vw, 6rem)`,
        overflow: 'hidden',
        minHeight: '80vh',
      }}
    >
      {/* ── Dark overlay — diagonal rip transition ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'var(--bg-dark)',
          clipPath: 'polygon(0 0, 100% 0, 100% 15%, 0 25%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div
        className="obsessions-colour-zone"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '400px',
          height: '300px',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <div className="obsessions-shape" style={{ position: 'absolute', inset: 0, background: '#6B21C8', opacity: 0.82, mixBlendMode: 'multiply', clipPath: 'polygon(20% 0%, 100% 0%, 100% 70%, 10% 65%)' }} />
        <div className="obsessions-shape" style={{ position: 'absolute', inset: 0, background: '#E8155A', opacity: 0.78, mixBlendMode: 'multiply', clipPath: 'polygon(0% 20%, 55% 15%, 50% 55%, 0% 58%)' }} />
        <div className="obsessions-shape" style={{ position: 'absolute', inset: 0, background: '#7CB800', opacity: 0.85, mixBlendMode: 'multiply', clipPath: 'polygon(35% 5%, 75% 0%, 80% 30%, 30% 32%)' }} />
        <div className="obsessions-shape" style={{ position: 'absolute', inset: 0, background: '#00BFC8', opacity: 0.70, mixBlendMode: 'multiply', clipPath: 'polygon(60% 55%, 100% 50%, 100% 80%, 55% 82%)' }} />
        <svg className="obsessions-shape" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.60 }}>
          <defs>
            <clipPath id="obs-purple-clip">
              <polygon points="20% 0%, 100% 0%, 100% 70%, 10% 65%" />
            </clipPath>
          </defs>
          <g clipPath="url(#obs-purple-clip)">
            {Array.from({ length: 40 }).map((_, i) => (
              <line key={`obs-hatch-${i}`} x1={`${i * 5}px`} y1="-50" x2={`${i * 5 - 200}px`} y2="600" stroke="#0D0C0B" strokeWidth="1.5" />
            ))}
          </g>
        </svg>
      </div>

      {/* ── Content Container ── */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto' }}>
        {/* ── Section Label ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 16,
          }}
        >
          <span
            className="font-heading"
            style={{
              fontWeight: 700,
              fontSize: 11,
              color: 'var(--ink-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            05 / OBSESSIONS
          </span>
        </div>

        {/* ── Header ── */}
        <div style={{ marginBottom: 56 }}>
          <span className="font-accent" style={{ fontSize: '16px', fontWeight: 700, color: '#6B6560', opacity: 0.8, marginBottom: '8px', display: 'block' }}>
            // chapter 05
          </span>
          <h2
            className="font-heading"
            style={{
              fontWeight: 700,
              fontSize: 'var(--fs-h2)',
              color: 'var(--ink)',
              textTransform: 'uppercase',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            CURRENT
            <br />
            OBSESSIONS
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 6 }}>
            <span
              className="font-accent"
              style={{
                fontWeight: 700,
                fontStyle: 'italic',
                fontSize: '20px',
                color: '#6B6560',
                opacity: 0.85,
              }}
            >
              (changes frequently)
            </span>
            <span className="font-accent" style={{ fontSize: '18px', fontWeight: 700, fontStyle: 'italic', color: '#6B6560', opacity: 0.8 }}>
              (last updated: 3am)
            </span>
          </div>
        </div>

        {/* ── Modules Grid (scattered) ── */}
        <div
          ref={modulesRef}
          className="obsessions-modules"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '28px 24px',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {obsessions.map((item, i) => (
            <ObsessionModule key={i} item={item} index={i} />
          ))}

          {/* ── Recurring Yellow Triangle — near robot spiders ── */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -10,
              left: 140,
              opacity: 0.18,
              pointerEvents: 'none',
            }}
          >
            <RecurringTriangle
              size={24}
              filled={true}
              color="var(--accent-yellow)"
              rotation={45}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════ AMBIENT COLOUR BLOBS ════════════════════ */}

      {/* Yellow blob — top-left, colour accumulation */}
      <Shard
        points="15,10 80,5 90,50 60,90 10,75"
        size={380}
        color="var(--accent-yellow)"
        opacity={0.12}
        rotation={20}
        className="blend-multiply"
        style={{
          position: 'absolute',
          top: '10%',
          left: '-10%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Purple blob — bottom-right, reveals at 60% scroll */}
      <Shard
        points="5,20 70,0 95,40 85,85 25,95"
        size={340}
        color="var(--accent-purple)"
        opacity={0.10}
        rotation={-15}
        className="blend-multiply"
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '-8%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
        {/* Floating Note */}
        <span
          className="font-accent"
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '10%',
            fontSize: '18px',
            fontWeight: 700,
            color: '#6B6560',
            opacity: 0.75,
          }}
        >
          curiosity is the only constant →
        </span>
    </section>
  );
};

export default Obsessions;
