'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from '../lib/gsap';
import { motion } from 'framer-motion';
import {
  RecurringTriangle,
  VelocityStreak,
  ConstructionLine,
  NodeDot,
} from './GeometricLayer';

/* ═══════════════════════════════════════════════════════════════
   CONTACT — Section 7
   "Let's build something weird."
   ═══════════════════════════════════════════════════════════════ */

// ── Text Scramble Effect ──
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>[]{}';

function useTextScramble(
  text: string,
  triggerRef: React.RefObject<HTMLElement | null>,
  duration = 800
) {
  const [display, setDisplay] = useState(text);
  const hasRun = useRef(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setDisplay(text);
      return;
    }

    const el = triggerRef.current;
    if (!el || hasRun.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true;
            observer.disconnect();

            const chars = text.split('');
            const totalFrames = Math.ceil(duration / 16);
            let frame = 0;

            const interval = setInterval(() => {
              frame++;
              const progress = frame / totalFrames;

              const scrambled = chars
                .map((char, i) => {
                  if (char === ' ') return ' ';
                  // Each character resolves at a different time
                  const resolveAt = (i / chars.length) * 0.7 + 0.3;
                  if (progress >= resolveAt) return char;
                  return SCRAMBLE_CHARS[
                    Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                  ];
                })
                .join('');

              setDisplay(scrambled);

              if (frame >= totalFrames) {
                clearInterval(interval);
                setDisplay(text);
              }
            }, 16);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [text, triggerRef, duration]);

  return display;
}

import { useMagnetic } from '../hooks/useMagnetic';
// ── Contact Link Data ──
interface ContactLinkData {
  label: string;
  href: string;
  accentColor: string;
  annotation: string;
  icon: React.ReactNode;
}

const LINKS: ContactLinkData[] = [
  {
    label: 'LINKEDIN',
    href: 'https://www.linkedin.com/in/saksham-bajpayi-7950253a5/',
    accentColor: 'var(--accent-cyan)',
    annotation: '(occasionally professional)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'GITHUB',
    href: 'https://github.com/SakshamBajpayi',
    accentColor: 'var(--accent-purple)',
    annotation: '(where the actual work lives)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
  {
    label: 'EMAIL',
    href: 'mailto:sakshambajpayii@gmail.com',
    accentColor: 'var(--accent-magenta)',
    annotation: '(slower but more real)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
  {
    label: 'RESUME',
    href: '/resume.pdf',
    accentColor: 'var(--accent-yellow)',
    annotation: '(the one-pager)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

// ── Single Contact Link Component ──
const ContactLink: React.FC<{
  data: ContactLinkData;
  index: number;
}> = ({ data, index }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  useMagnetic(linkRef, 0.3);

  return (
    <motion.a
      ref={linkRef}
      href={data.href}
      data-hover
      className="contact-link"
      rel="noopener noreferrer"
      target="_blank"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
        textDecoration: 'none',
        position: 'relative',
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
    >
      {/* Label row */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'var(--ff-heading)',
          fontWeight: 700,
          fontSize: '18px',
          color: hovered ? data.accentColor : 'var(--ink-light)',
          transition: 'color 0.3s ease',
          position: 'relative',
        }}
      >
        {/* Arrow */}
        <motion.span
          animate={{ x: hovered ? 6 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            color: 'var(--accent-magenta)',
            display: 'inline-block',
            fontWeight: 700,
          }}
        >
          →
        </motion.span>
        {/* Icon — inherits currentColor so it shifts with the hover colour */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: 'inherit',     // inherits the hover colour transition from parent
            opacity: 0.85,
            flexShrink: 0,
          }}
        >
          {data.icon}
        </span>
        {data.label}
      </span>

      {/* Underline draw */}
      <span
        style={{
          display: 'block',
          width: hovered ? '100%' : '0%',
          height: '1px',
          backgroundColor: data.accentColor,
          transition: 'width 0.3s ease',
          marginTop: '-4px',
        }}
      />

      {/* Annotation */}
      <span
        className="font-accent"
        style={{
          fontFamily: 'var(--ff-accent)',
          fontWeight: 400,
          fontSize: '13px',
          color: 'var(--ink-muted)',
          letterSpacing: '0.02em',
        }}
      >
        {data.annotation}
      </span>
    </motion.a>
  );
};

// ── Heart Curiosity Reward ──
const HeartReward: React.FC = () => {
  const [heartRevealed, setHeartRevealed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (!heartRevealed) {
      setHeartRevealed(true);
      setShowTooltip(true);
      tooltipTimeout.current = setTimeout(() => {
        setShowTooltip(false);
      }, 1500);
    }
  }, [heartRevealed]);

  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    };
  }, []);

  return (
    <span
      data-curiosity
      onMouseEnter={handleMouseEnter}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'default',
      }}
    >
      <span
        style={{
          opacity: heartRevealed ? 1 : 0,
          color: heartRevealed ? 'var(--accent-magenta)' : 'inherit',
          transition: 'opacity 0.4s ease, color 0.4s ease',
          display: 'inline',
        }}
      >
        ♥
      </span>

      {/* Tooltip */}
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{
          opacity: showTooltip ? 1 : 0,
          y: showTooltip ? -4 : 4,
        }}
        transition={{ duration: 0.3 }}
        className="font-accent"
        style={{
          position: 'absolute',
          bottom: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--ff-accent)',
          fontWeight: 400,
          fontSize: '13px',
          color: 'var(--accent-magenta)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        (made with actual love)
      </motion.span>
    </span>
  );
};

// ═════════════════════════════════════════════════════
// MAIN CONTACT COMPONENT
// ═════════════════════════════════════════════════════
const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const geometryRef = useRef<HTMLDivElement>(null);

  // Scramble text
  const scrambledText = useTextScramble("LET'S BUILD SOMETHING", headerRef);

  // ── GSAP Scroll Animations ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header words stagger
      const headerWords = headerRef.current?.querySelectorAll('.header-word');
      if (headerWords && headerWords.length > 0) {
        gsap.fromTo(
          headerWords,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Geometry fade + scale
      if (geometryRef.current) {
        const geoChildren = geometryRef.current.children;
        gsap.fromTo(
          geoChildren,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: geometryRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      gsap.to('.contact-shape', {
        rotation: '+=4',
        y: '-=8',
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 2,
      });

      // Transition Stripes
      gsap.fromTo(
        '.stripe-transition',
        { scaleX: 0 },
        {
          scaleX: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="7"
      data-dark
      className="section-dark"
      style={{
        background: 'var(--bg-dark)',
        padding: '120px 60px',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Transition Stripes ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '20vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <div className="stripe-transition" style={{ position: 'absolute', top: '-10vh', left: 0, width: '100%', height: '15vh', background: 'var(--accent-magenta)', transformOrigin: 'top left', clipPath: 'polygon(0 0, 100% 10vh, 100% 100%, 0 calc(100% - 10vh))' }} />
        <div className="stripe-transition" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '10vh', background: 'var(--accent-yellow)', transformOrigin: 'top left', clipPath: 'polygon(0 0, 100% 8vh, 100% 100%, 0 calc(100% - 8vh))' }} />
      </div>

      {/* ══════════════════════════════════════════
          HEADER
          ══════════════════════════════════════════ */}
      <div ref={headerRef} style={{ position: 'relative', zIndex: 2, marginBottom: '80px' }}>
        {/* LET'S BUILD SOMETHING — scrambled */}
        <div style={{ overflow: 'hidden' }}>
          <div
            className="header-word"
            style={{
              fontFamily: 'var(--ff-heading)',
              fontWeight: 700,
              fontSize: 'var(--fs-hero)',
              color: 'var(--ink-light)',
              textTransform: 'uppercase',
              lineHeight: 1.05,
              letterSpacing: '0.02em',
            }}
          >
            {scrambledText.split(' ').slice(0, 2).join(' ')}
          </div>
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div
            className="header-word"
            style={{
              fontFamily: 'var(--ff-heading)',
              fontWeight: 700,
              fontSize: 'var(--fs-hero)',
              color: 'var(--ink-light)',
              textTransform: 'uppercase',
              lineHeight: 1.05,
              letterSpacing: '0.1em',
            }}
          >
            {scrambledText.split(' ').slice(2).join(' ')}
          </div>
        </div>

        {/* WEIRD. */}
        <div style={{ overflow: 'hidden' }}>
          <div
            className="header-word font-accent"
            style={{
              fontFamily: 'var(--ff-accent)',
              fontWeight: 700,
              fontSize: '32px',
              color: 'var(--accent-yellow)',
              fontStyle: 'italic',
              lineHeight: 1.4,
              marginTop: '8px',
            }}
          >
            WEIRD.
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CONTACT LINKS
          ══════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '80px',
          position: 'relative',
          zIndex: 2,
          marginBottom: '60px',
        }}
      >
        {LINKS.map((link, i) => (
          <ContactLink key={link.label} data={link} index={i} />
        ))}
      </div>

      {/* ══════════════════════════════════════════
          PIGEON LINE
          ══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{
          position: 'relative',
          zIndex: 2,
          marginTop: '40px',
          marginBottom: '100px',
        }}
      >
        <span
          className="font-accent"
          style={{
            fontFamily: 'var(--ff-accent)',
            fontWeight: 400,
            fontSize: '16px',
            color: 'var(--ink-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          or send a pigeon{' '}
          <motion.span
            whileHover={{ rotate: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            style={{ display: 'inline-block', cursor: 'default' }}
          >
            🐦
          </motion.span>
        </span>
      </motion.div>

      {/* ══════════════════════════════════════════
          GEOMETRIC ELEMENTS — right side
          ══════════════════════════════════════════ */}
      <div
        ref={geometryRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '60px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '500px',
          height: '600px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {/* The FINAL triangle motif — evolved to cyan */}
        <div
          style={{
            position: 'absolute',
            right: '40px',
            top: '120px',
            mixBlendMode: 'screen',
          }}
        >
          <RecurringTriangle
            size={160}
            filled={true}
            color="var(--accent-cyan)"
            rotation={-20}
          />
        </div>

        {/* Velocity Streaks — pointing away from headline */}
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '80px',
            mixBlendMode: 'screen',
          }}
        >
          <VelocityStreak
            length={75}
            angle={-35}
            color="var(--accent-magenta)"
            x={0}
            y={0}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: '60px',
            top: '50px',
            mixBlendMode: 'screen',
          }}
        >
          <VelocityStreak
            length={55}
            angle={-20}
            color="var(--accent-cyan)"
            x={0}
            y={0}
            style={{ opacity: 0.6 }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: '10px',
            top: '140px',
            mixBlendMode: 'screen',
          }}
        >
          <VelocityStreak
            length={45}
            angle={-50}
            color="var(--accent-purple)"
            x={0}
            y={0}
            style={{ opacity: 0.5 }}
          />
        </div>

        {/* Construction Lines — pointing INWARD toward the triangle (the exhale) */}
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            mixBlendMode: 'screen',
          }}
        >
          {/* Line from bottom-left toward triangle */}
          <ConstructionLine
            x1={30}
            y1={420}
            x2={260}
            y2={200}
            color="var(--ink-muted)"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            mixBlendMode: 'screen',
          }}
        >
          {/* Line from top-left toward triangle */}
          <ConstructionLine
            x1={10}
            y1={40}
            x2={240}
            y2={170}
            color="var(--ink-muted)"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            mixBlendMode: 'screen',
          }}
        >
          {/* Line from right-bottom toward triangle */}
          <ConstructionLine
            x1={380}
            y1={400}
            x2={280}
            y2={230}
            color="var(--ink-muted)"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            mixBlendMode: 'screen',
          }}
        >
          {/* Line from far right toward triangle */}
          <ConstructionLine
            x1={390}
            y1={100}
            x2={300}
            y2={180}
            color="var(--ink-muted)"
          />
        </div>

        {/* Node dots at construction line intersections */}
        <div style={{ position: 'absolute', mixBlendMode: 'screen' }}>
          <NodeDot x={270} y={195} size={5} color="var(--accent-cyan)" />
        </div>
        <div style={{ position: 'absolute', mixBlendMode: 'screen' }}>
          <NodeDot x={300} y={185} size={4} color="var(--accent-magenta)" />
        </div>
        <div style={{ position: 'absolute', mixBlendMode: 'screen' }}>
          <NodeDot x={250} y={210} size={3} color="var(--accent-purple)" />
        </div>

        {/* Large magenta shard */}
        <div
          className="contact-shape"
          style={{
            position: 'absolute',
            top: '-20px',
            right: '80px',
            width: '280px',
            height: '220px',
            background: '#E8155A',
            opacity: 0.22,
            mixBlendMode: 'screen',
            clipPath: 'polygon(40% 0%, 100% 15%, 85% 80%, 10% 70%)',
            transform: 'rotate(8deg)',
          }}
        />

        {/* Yellow diagonal slash */}
        <div
          className="contact-shape"
          style={{
            position: 'absolute',
            top: '60px',
            left: '-20px',
            width: '320px',
            height: '180px',
            background: '#F5C400',
            opacity: 0.18,
            mixBlendMode: 'screen',
            clipPath: 'polygon(0% 30%, 100% 0%, 100% 30%, 0% 60%)',
          }}
        />

        {/* Purple fragment */}
        <div
          className="contact-shape"
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '30px',
            width: '200px',
            height: '160px',
            background: '#5B1E9C',
            opacity: 0.25,
            mixBlendMode: 'screen',
            clipPath: 'polygon(20% 0%, 100% 30%, 80% 100%, 0% 70%)',
            transform: 'rotate(-12deg)',
          }}
        />

        {/* Hatching SVG */}
        <svg
          className="contact-shape"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '0px',
            right: '60px',
            width: '260px',
            height: '200px',
            opacity: 0.12,
            mixBlendMode: 'screen',
          }}
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <line
              key={i}
              x1={i * 15 - 50}
              y1={-20}
              x2={i * 15 - 150}
              y2={220}
              stroke="#F2EDE4"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          FOOTER BAR
          ══════════════════════════════════════════ */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          marginTop: 'auto',
        }}
      >
        {/* Divider line */}
        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: 'var(--ink-muted)',
            opacity: 0.2,
            marginBottom: '24px',
          }}
        />

        {/* Footer content */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Left */}
          <span
            className="font-accent"
            style={{
              fontFamily: 'var(--ff-accent)',
              fontWeight: 400,
              fontSize: '11px',
              color: 'var(--ink-muted)',
              opacity: 0.6,
              letterSpacing: '0.04em',
            }}
          >
            © 2025 SAKSHAM
          </span>

          {/* Center */}
          <span
            className="font-accent"
            style={{
              fontFamily: 'var(--ff-accent)',
              fontWeight: 400,
              fontSize: '11px',
              color: 'var(--ink-muted)',
              opacity: 0.6,
              letterSpacing: '0.04em',
              textAlign: 'center',
            }}
          >
            BUILT WITH <HeartReward />, TOO MUCH ✦ AND A LOT OF LATE NIGHTS.
          </span>

          {/* Right — Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-accent"
            style={{
              fontFamily: 'var(--ff-accent)',
              fontWeight: 400,
              fontSize: '11px',
              color: 'var(--ink-muted)',
              opacity: 0.6,
              letterSpacing: '0.04em',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.6';
            }}
          >
            BACK TO TOP ↑
          </button>
        </div>

        {/* Right edge note */}
        <span
          className="font-accent"
          style={{
            position: 'absolute',
            right: '20px',
            bottom: '40px',
            fontSize: '13px',
            color: 'var(--ink-muted)',
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        >
          fig. 07 // end
        </span>
      </div>
    </section>
  );
};

export default Contact;
