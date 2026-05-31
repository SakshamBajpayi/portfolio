'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from '../lib/gsap';
import { ConstructionLine, NodeDot } from './GeometricLayer';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   EXPERIENCE SECTION — Horizontal Accordion Timeline
   Section 03 — "WHERE I'VE SHOWN UP."
   ═══════════════════════════════════════════════════════════════ */

// ── Data ──
interface ExperienceEntry {
  id: string;
  yearRange: string;
  company: string;
  role: string;
  accentVar: string;
  accentHex: string;
  domain: string;
  bullets: string[];
}

const experiences: ExperienceEntry[] = [
  {
    id: 'exp-1',
    yearRange: '2025 – PRESENT',
    company: 'Photonics & Quantum Technology Research Lab',
    role: 'Research Intern',
    accentVar: 'var(--accent-cyan)',
    accentHex: '#00BFC8',
    domain: 'RESEARCH',
    bullets: [
      'working at the intersection of photonics, quantum technology, and computer science',
      'applying ML and systems thinking to research problems in optics and quantum computing',
      'currently scoping initial problem sets and architecture approaches for upcoming experiments',
    ],
  },
  {
    id: 'exp-2',
    yearRange: '2024',
    company: 'PESU-Dev',
    role: 'Open Source Contributor',
    accentVar: 'var(--accent-purple)',
    accentHex: '#7B2FBE',
    domain: 'OPEN SOURCE',
    bullets: [
      'contributed to pesu-auth — a secure authentication API for PESU Academy credentials',
      'implemented backend auth flows without storing user credentials, improving privacy by design',
      'shipped via pull requests, code reviews, and documentation — real production code',
    ],
  },
  {
    id: 'exp-3',
    yearRange: '2021 – 2022',
    company: 'Pokemod',
    role: 'Beta Tester',
    accentVar: 'var(--accent-orange)',
    accentHex: '#F26419',
    domain: 'QA',
    bullets: [
      'structured pre-production testing of a large-scale gaming application across multiple builds',
      'identified functional bugs, edge cases, and performance regressions in diverse scenarios',
      'worked with developers to validate fixes and improve stability — first taste of shipping software',
    ],
  },
];

// ── Text Scramble ──
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

function scrambleText(element: HTMLElement, finalText: string, duration = 800) {
  let iteration = 0;
  const interval = setInterval(() => {
    element.textContent = finalText
      .split('')
      .map((char, i) => {
        if (i < iteration) return finalText[i];
        if (char === ' ') return ' ';
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join('');
    iteration += finalText.length / (duration / 30);
    if (iteration >= finalText.length) {
      element.textContent = finalText;
      clearInterval(interval);
    }
  }, 30);
}

// ── Expand/Collapse Variants ──
const expandVariants = {
  collapsed: {
    height: 56,
    opacity: 1,
  },
  expanded: {
    height: 180,
    opacity: 1,
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.12, duration: 0.25, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: 0.15 },
  },
};

// ── Pulse keyframe (injected via style tag for active NodeDot) ──
const pulseOnceKeyframes = `
@keyframes pulse-node-once {
  0% { transform: scale(1); opacity: 1; }
  30% { transform: scale(1.8); opacity: 0.6; }
  60% { transform: scale(1.2); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
}
`;

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════
const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerLine1Ref = useRef<HTMLSpanElement>(null);
  const headerLine2Ref = useRef<HTMLSpanElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const scrambledRef = useRef(false);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Combined active id (hover takes priority, then click-expanded)
  const activeId = hoveredId ?? expandedId;

  // Toggle expand on click
  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // ── GSAP Scroll Animations ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Check reduced motion
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      // Header slide up
      gsap.from('.exp-header', {
        y: 40,
        opacity: 0,
        duration: prefersReducedMotion ? 0 : 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.exp-header',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            if (!scrambledRef.current && !prefersReducedMotion) {
              scrambledRef.current = true;
              if (headerLine1Ref.current) {
                scrambleText(headerLine1Ref.current, "WHERE I'VE", 800);
              }
              if (headerLine2Ref.current) {
                scrambleText(headerLine2Ref.current, 'SHOWN UP.', 800);
              }
            }
          },
        },
      });

      // Section label
      gsap.from('.exp-section-label', {
        opacity: 0,
        x: 20,
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.exp-section-label',
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });

      // Entries stagger
      const entries = gsap.utils.toArray<HTMLElement>('.exp-entry');
      if (entries.length > 0) {
        gsap.from(entries, {
          x: -30,
          opacity: 0,
          duration: prefersReducedMotion ? 0 : 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: entriesRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Colour zone reveal
      gsap.fromTo('.exp-colour-zone',
        { scaleY: 0, transformOrigin: 'bottom center' },
        {
          scaleY: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Construction lines fade in
      gsap.from('.exp-construction-line', {
        opacity: 0,
        duration: prefersReducedMotion ? 0 : 0.8,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="3"
      className="section-cream"
      style={{
        minHeight: '80vh',
        paddingTop: 120,
        paddingBottom: 'var(--section-pad)',
        paddingLeft: 'var(--section-pad)',
        paddingRight: 'var(--section-pad)',
        position: 'relative',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      {/* ── Pulse-once keyframes ── */}
      <style dangerouslySetInnerHTML={{ __html: pulseOnceKeyframes }} />

      {/* ══════════════════════════════════════════
          GEOMETRY — Construction Lines (left edge)
          ══════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {[
          { x1: 0, y1: 120, x2: 180, y2: 200 },
          { x1: 0, y1: 200, x2: 160, y2: 320 },
          { x1: 0, y1: 300, x2: 140, y2: 440 },
          { x1: 0, y1: 400, x2: 120, y2: 500 },
          { x1: 0, y1: 500, x2: 200, y2: 560 },
          { x1: 0, y1: 160, x2: 220, y2: 100 },
        ].map((line, i) => (
          <div
            key={`cl-${i}`}
            className="exp-construction-line"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              opacity: 0.15,
              pointerEvents: 'none',
            }}
          >
            <ConstructionLine
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              color="var(--geo-black)"
            />
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          COLOUR ART ZONE — strictly right 40%
          ══════════════════════════════════════════ */}
      <div
        className="experience-colour-zone hidden md:block"
        style={{
          position: 'absolute',
          top: '-40px',
          bottom: '-40px',
          right: 0,
          width: '40%',
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'visible',
        }}
      >
        {/* Shape A: Hot magenta */}
        <div style={{ position: 'absolute', inset: 0, background: '#E8155A', opacity: 0.85, mixBlendMode: 'multiply', clipPath: 'polygon(15% 0%, 100% 0%, 100% 50%, 5% 55%)' }} />
        {/* Shape B: Deep forest green */}
        <div style={{ position: 'absolute', inset: 0, background: '#1A5C3A', opacity: 0.80, mixBlendMode: 'multiply', clipPath: 'polygon(0% 35%, 70% 28%, 75% 75%, 0% 80%)' }} />
        {/* Shape C: Electric yellow */}
        <div style={{ position: 'absolute', inset: 0, background: '#F5C400', opacity: 0.90, mixBlendMode: 'multiply', clipPath: 'polygon(30% 20%, 65% 15%, 60% 42%, 25% 46%)' }} />
        {/* Shape D: Hatching cluster */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
             <clipPath id="exp-magenta-clip">
               <polygon points="15% 0%, 100% 0%, 100% 50%, 5% 55%" />
             </clipPath>
          </defs>
          <g clipPath="url(#exp-magenta-clip)">
             {Array.from({ length: 40 }).map((_, i) => (
               <line key={`hatch-${i}`} x1={`${i * 6}px`} y1="-50" x2={`${i * 6 - 200}px`} y2="500" stroke="#0D0C0B" strokeWidth="1.5" opacity="0.65" />
             ))}
          </g>
        </svg>
        {/* Shape E: Small dark navy fragment */}
        <div style={{ position: 'absolute', inset: 0, background: '#1A1A3E', opacity: 0.70, mixBlendMode: 'multiply', clipPath: 'polygon(55% 60%, 90% 55%, 95% 85%, 50% 88%)' }} />
      </div>

      {/* ══════════════════════════════════════════
          TEXT ZONE — strictly left 60%
          ══════════════════════════════════════════ */}
      <div
        className="experience-text-zone w-full md:w-[60%]"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >

      {/* ══════════════════════════════════════════
          HEADER
          ══════════════════════════════════════════ */}
      <div
        className="exp-header"
        style={{
          position: 'relative',
          zIndex: 1,
          marginBottom: 64,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <span className="font-accent" style={{ fontSize: '16px', fontWeight: 700, color: '#6B6560', opacity: 0.8, marginBottom: '8px' }}>
          // chapter 03
        </span>

        {/* Section label top-right */}
        <span
          className="exp-section-label font-accent"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--ink-muted)',
            letterSpacing: '0.08em',
            userSelect: 'none',
          }}
        >
          03 / EXPERIENCE
        </span>

        {/* Main title */}
        <h2
          className="font-heading"
          style={{
            fontSize: 'var(--fs-h1)',
            fontWeight: 700,
            color: 'var(--ink)',
            textTransform: 'uppercase',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          <span ref={headerLine1Ref}>WHERE I&apos;VE</span>
          <br />
          <span ref={headerLine2Ref}>SHOWN UP.</span>
        </h2>

        {/* Subtitle */}
        <p
          className="font-accent"
          style={{
            fontSize: '18px',
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#6B6560',
            opacity: 0.85,
            marginTop: 12,
            letterSpacing: '0.02em',
          }}
        >
          (and what happened there)
        </p>
      </div>

      {/* ══════════════════════════════════════════
          TIMELINE ENTRIES — Horizontal Accordion
          ══════════════════════════════════════════ */}
      <div
        ref={entriesRef}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {experiences.map((exp) => {
          const isExpanded = activeId === exp.id;
          const isDimmed = activeId !== null && activeId !== exp.id;

          return (
            <motion.div
              key={exp.id}
              className="exp-entry"
              variants={expandVariants}
              animate={isExpanded ? 'expanded' : 'collapsed'}
              transition={{
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                cursor: 'pointer',
                opacity: isDimmed ? 0.5 : 1,
                transition: 'opacity 0.25s ease',
                borderLeft: isExpanded
                  ? `3px solid ${exp.accentHex}`
                  : '3px solid transparent',
              }}
              onClick={() => handleToggle(exp.id)}
              onMouseEnter={() => setHoveredId(exp.id)}
              onMouseLeave={() => setHoveredId(null)}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggle(exp.id);
                }
              }}
            >
              {/* ── NodeDot on left ── */}
              <div
                style={{
                  position: 'absolute',
                  left: 8,
                  top: 24,
                  zIndex: 2,
                  animation: isExpanded
                    ? 'pulse-node-once 0.6s ease-out 1'
                    : 'none',
                }}
              >
                <NodeDot
                  size={8}
                  color={exp.accentVar}
                  x={0}
                  y={0}
                  style={{ position: 'relative' }}
                />
              </div>

              {/* ── Compressed row ── */}
              <div
                className="exp-compressed-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 56,
                  paddingLeft: 32,
                  paddingRight: 16,
                  gap: 0,
                }}
              >
                {/* Year range */}
                <span
                  className="font-accent exp-year"
                  style={{
                    width: 120,
                    flexShrink: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--ink-muted)',
                    letterSpacing: '0.05em',
                    userSelect: 'none',
                  }}
                >
                  {exp.yearRange}
                </span>

                {/* Company name */}
                <span
                  className="font-heading exp-company"
                  style={{
                    flex: 1,
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'var(--ink)',
                    letterSpacing: '-0.01em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {exp.company}
                </span>

                {/* Role */}
                <span
                  className="font-accent exp-role"
                  style={{
                    width: 200,
                    flexShrink: 0,
                    fontSize: 16,
                    fontWeight: 400,
                    color: exp.accentVar,
                    textAlign: 'right',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {exp.role}
                </span>

                {/* Arrow */}
                <span
                  className="exp-arrow"
                  style={{
                    width: 30,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--ink-muted)',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    userSelect: 'none',
                  }}
                >
                  →
                </span>
              </div>

              {/* ── Expanded content ── */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                      paddingLeft: 32,
                      paddingRight: 48,
                      paddingBottom: 20,
                    }}
                  >
                    {/* Domain tag */}
                    <span
                      className="font-accent"
                      style={{
                        display: 'inline-block',
                        fontSize: 12,
                        fontWeight: 700,
                        color: exp.accentHex,
                        letterSpacing: '0.1em',
                        padding: '2px 10px',
                        border: `1px solid ${exp.accentHex}`,
                        borderRadius: 2,
                        marginBottom: 12,
                        userSelect: 'none',
                      }}
                    >
                      {exp.domain}
                    </span>

                    {/* Bullet points */}
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                      }}
                    >
                      {exp.bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="font-accent"
                          style={{
                            fontSize: '26px',
                            fontWeight: 700,
                            color: '#0D0C0B',
                            opacity: 0.85,
                            lineHeight: 1.5,
                            paddingLeft: 14,
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              color: exp.accentHex,
                              fontWeight: 700,
                            }}
                          >
                            ·
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        
        {/* Note below last entry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', marginTop: '16px' }}>
          <span className="font-accent" style={{ fontSize: '17px', fontWeight: 700, color: '#6B6560', opacity: 0.8 }}>more coming —</span>
          <svg width="24" height="2" viewBox="0 0 24 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 1H24" stroke="var(--ink-muted)" strokeWidth="1.5" strokeDasharray="4 2" />
          </svg>
        </div>
      </div>
      
      {/* Right margin note */}
      <span
        className="font-accent"
        style={{
          position: 'absolute',
          right: '20px',
          top: '300px',
          fontFamily: 'var(--ff-accent)',
          fontSize: '17px',
          fontWeight: 700,
          color: '#6B6560',
          opacity: 0.75,
          transform: 'rotate(90deg)',
          transformOrigin: 'right center',
          zIndex: 5,
        }}
      >
        (they trusted me with actual things)
      </span>

      {/* ── Bottom divider line ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: 48,
          height: 1,
          background: 'var(--ink)',
          opacity: 0.08,
        }}
      />
      </div>
    </section>
  );
};

export default Experience;
