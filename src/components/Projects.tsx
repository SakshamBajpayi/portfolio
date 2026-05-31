'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { NodeDot } from './GeometricLayer';

/* ═══════════════════════════════════════════════════════════════
   04 / PROJECTS
   Dark section — full-width horizontal strips, no pin.
   "Things I've built (so far)."
   ═══════════════════════════════════════════════════════════════ */

/* ── Scramble Characters ── */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

/* ── Project Data ── */
interface ProjectEntry {
  num: string;
  name: string;
  tags: string;
  accentColor: string;
  descriptionLine1: string;
  descriptionLine2: string;
  learned: string;
  caseStudy: {
    problem: string;
    built: string;
    outcome: string;
  };
}

const projects: ProjectEntry[] = [
  {
    num: '01',
    name: 'PROTEIN STRUCTURE PREDICTOR',
    tags: 'deep learning · bioinformatics',
    accentColor: 'var(--accent-cyan)',
    descriptionLine1: 'amino acid sequence in.',
    descriptionLine2: '3D protein structure out.',
    learned: '(learned: biology is just another dataset)',
    caseStudy: {
      problem: 'Predicting how a protein folds from its amino acid sequence is one of the hardest problems in biology. Most approaches require massive compute or proprietary data. I wanted to see how far I could get from scratch.',
      built: 'Trained a deep learning model on the PDB (Protein Data Bank) dataset. Input: raw amino acid sequences. Output: predicted 3D structural coordinates. Built the full pipeline — data processing, architecture design, training loop, and evaluation.',
      outcome: '64% structural accuracy on the test set. Not AlphaFold. But built in one night, from scratch, in 2024, as a first-year student. The pipeline works end-to-end.',
    },
  },
  {
    num: '02',
    name: 'EXPLAINABLE VQA SYSTEM',
    tags: 'multimodal AI · computer vision',
    accentColor: 'var(--accent-purple)',
    descriptionLine1: 'an AI that answers questions about images',
    descriptionLine2: 'and shows you exactly why',
    learned: '(learned: explainability is harder than accuracy)',
    caseStudy: {
      problem: 'Most vision-language models answer questions about images but give you no insight into what they actually looked at. Black-box outputs are useless when trust matters.',
      built: 'Built a multimodal pipeline using ViLT and BLIP-2 for cross-modal reasoning, then designed a CLIP-based explainability module that computes patch-level similarity for region-level visual grounding. Outputs heatmaps and bounding boxes showing exactly which image regions drove the answer.',
      outcome: 'End-to-end pipeline integrating image encoding, cross-modal reasoning, and interpretable answer generation. The explainability layer validates model predictions in a way that\'s actually useful to a human.',
    },
  },
  {
    num: '03',
    name: 'GPAI — RAG STUDY ASSISTANT',
    tags: 'LLMs · retrieval · RAG',
    accentColor: 'var(--accent-magenta)',
    descriptionLine1: 'a study assistant that actually knows',
    descriptionLine2: 'your syllabus',
    learned: '(learned: garbage in, hallucinations out)',
    caseStudy: {
      problem: 'Generic LLMs hallucinate when answering questions about specific course material. Students need answers grounded in their actual syllabus, not the model\'s best guess.',
      built: 'Built a Retrieval-Augmented Generation pipeline using FAISS for vector search and local LLMs (Mistral-7B, Phi-Mini) for inference. Custom pipelines process academic PDFs into structured chunks for semantic indexing. Syllabus-aligned retrieval dramatically reduces hallucination.',
      outcome: 'A fully local RAG system that answers course-specific questions without sending data to any external API. Reduced hallucination through curated, syllabus-aligned data sources.',
    },
  },
  {
    num: '04',
    name: 'KAIROS — WORKFLOW AUTOMATION',
    tags: 'NLP · full-stack · automation',
    accentColor: 'var(--accent-orange)',
    descriptionLine1: 'tell it what you want in plain English.',
    descriptionLine2: 'it handles the rest.',
    learned: '(learned: intent parsing is a product problem)',
    caseStudy: {
      problem: 'Cross-application automation requires either expensive SaaS tools or complex scripting. Neither is accessible, and neither understands natural language.',
      built: 'Designed a natural-language-driven automation system with NLP pipelines that convert user intent into structured tasks. Integrated Gmail and Google Calendar via Node.js, with MongoDB, Redis, and Socket.io for real-time execution and state management.',
      outcome: 'A working automation platform that takes plain-English instructions and executes cross-application workflows in real time. Full stack from NLP intent parsing to live task execution.',
    },
  },
  {
    num: '05',
    name: 'MAPEER',
    tags: 'hackathon · maps · sustainability',
    accentColor: 'var(--accent-lime)',
    descriptionLine1: 'eco-friendly routing + community.',
    descriptionLine2: 'built in one hackathon.',
    learned: '(learned: ship fast, explain later)',
    caseStudy: {
      problem: 'Finding eco-friendly routes in cities like Bengaluru is genuinely hard. No existing tool combines green routing, carbon tracking, and community features in one place.',
      built: 'Built at Code Fusion Hackathon with a 3-person team. Leaflet.js + OpenStreetMap for mapping, pure vanilla JS for performance. Features: eco-route suggestions with real-time CO₂ savings, Route Buddies for finding similar commuters, gamified eco-points system, and a sustainability hub with carbon footprint tracking.',
      outcome: 'Shipped a working product in one hackathon. Multi-modal routing (walking, cycling, transit, carpooling), community matching, and a full gamification layer — all in plain HTML/CSS/JS. Sometimes the right tool is the simple one.',
    },
  },
];

import { useMagnetic } from '../hooks/useMagnetic';

/* ── Project Strip Component ── */
const ProjectStrip: React.FC<{ project: ProjectEntry }> = ({ project }) => {
  const exploreRef = useRef<HTMLDivElement>(null);
  useMagnetic(exploreRef, 0.4);
  const [isHovered, setHovered] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  return (
    <>
      <motion.div
        className="project-strip"
        initial="rest"
        whileHover="hover"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setExpanded(!isExpanded)}
        style={{
          position: 'relative',
          width: '100%',
          padding: '40px 60px',
          cursor: 'pointer',
        }}
      >
        {/* Top separator line */}
        <motion.div
          variants={{
            rest: { opacity: 0.2 },
            hover: { opacity: 0.5 },
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'var(--ink-muted)',
          }}
        />

        {/* Oversized background number */}
        <motion.span
          variants={{
            rest: { opacity: 0.06 },
            hover: { opacity: 0.18 },
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: -20,
            left: 40,
            fontFamily: 'var(--ff-heading)',
            fontWeight: 700,
            fontSize: 200,
            color: 'var(--ink-light)',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {project.num}
        </motion.span>

        {/* Strip content — shifts up on hover */}
        <motion.div
          variants={{
            rest: { y: 0 },
            hover: { y: -4 },
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          {/* Project name */}
          <h3
            style={{
              fontFamily: 'var(--ff-heading)',
              fontWeight: 700,
              fontSize: 40,
              color: 'var(--ink-light)',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {project.name}
          </h3>

          {/* Tags */}
          <span
            className="font-accent"
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: project.accentColor,
              letterSpacing: '0.04em',
              display: 'block',
              marginTop: 6,
            }}
          >
            {project.tags}
          </span>

          {/* Description */}
          <p
            className="font-accent"
            style={{
              fontWeight: 700,
              fontSize: '17px',
              color: 'var(--ink-light)',
              opacity: 0.8,
              margin: 0,
              marginTop: 6,
              lineHeight: 1.4,
            }}
          >
            {project.descriptionLine1}
            {project.descriptionLine2 && (
              <>
                <br />
                {project.descriptionLine2}
              </>
            )}
          </p>

          {/* Learned note — only visible on hover */}
          <p 
            className="project-learned font-accent"
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#F5C400',
              opacity: isHovered ? 0.85 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
              marginTop: '4px',
              pointerEvents: 'none',
              position: 'absolute'
            }}
          >
            {project.learned}
          </p>

          <motion.p
            className="font-accent"
            variants={{
              rest: { opacity: 0, y: 4 },
              hover: { opacity: 0.55, y: 0 },
            }}
            transition={{ duration: 0.2, delay: 0.1 }}
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--ink-muted)',
              marginTop: '6px',
              pointerEvents: 'none',
            }}
          >
            ↓ click to expand
          </motion.p>

          {/* EXPLORE → hover reveal */}
          <div style={{ marginTop: 24, display: 'inline-block' }}>
            <div ref={exploreRef} style={{ display: 'inline-block', padding: '10px 0' }} data-hover>
              <motion.span
                className="font-accent"
                variants={{
                  rest: { opacity: 0, x: -12 },
                  hover: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--ink-light)',
                  letterSpacing: '0.06em',
                  pointerEvents: 'none',
                }}
              >
                {isExpanded ? 'EXPLORE ▲' : 'EXPLORE →'}
              </motion.span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={{
            rest: { scaleY: 0, transformOrigin: 'top center' },
            hover: { scaleY: 1, transformOrigin: 'top center' },
          }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: project.accentColor,
            pointerEvents: 'none',
          }}
        />
      </motion.div>

      {/* Case Study Expand (All projects) */}
      {(
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="project-casestudy"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                overflow: 'hidden',
                background: '#1C1A18',
                borderTop: '1px solid rgba(107, 101, 96, 0.3)',
                padding: '0',
              }}
            >
              <div style={{ padding: '24px 0 24px 160px', maxWidth: '80%' }}>
                {/* Problem */}
                <p style={{ 
                  fontFamily: 'var(--ff-accent)', fontSize: '13px', fontWeight: 700,
                  color: '#F5C400', letterSpacing: '0.08em', marginBottom: '6px'
                }}>
                  THE PROBLEM
                </p>
                <p style={{
                  fontFamily: 'var(--ff-accent)', fontSize: '26px', fontWeight: 700,
                  color: '#F2EDE4', opacity: 0.85, marginBottom: '20px', lineHeight: 1.5
                }}>
                  {project.caseStudy.problem}
                </p>
                
                {/* What you built */}
                <p style={{ 
                  fontFamily: 'var(--ff-accent)', fontSize: '13px', fontWeight: 700,
                  color: '#00BFC8', letterSpacing: '0.08em', marginBottom: '6px'
                }}>
                  WHAT I BUILT
                </p>
                <p style={{
                  fontFamily: 'var(--ff-accent)', fontSize: '26px', fontWeight: 700,
                  color: '#F2EDE4', opacity: 0.85, marginBottom: '20px', lineHeight: 1.5
                }}>
                  {project.caseStudy.built}
                </p>
                
                {/* Outcome */}
                <p style={{ 
                  fontFamily: 'var(--ff-accent)', fontSize: '13px', fontWeight: 700,
                  color: '#E8155A', letterSpacing: '0.08em', marginBottom: '6px'
                }}>
                  OUTCOME
                </p>
                <p style={{
                  fontFamily: 'var(--ff-accent)', fontSize: '26px', fontWeight: 700,
                  color: '#F2EDE4', opacity: 0.85, lineHeight: 1.5
                }}>
                  {project.caseStudy.outcome}
                </p>
                
                {/* Close hint */}
                <p style={{
                  fontFamily: 'var(--ff-accent)', fontSize: '14px', fontWeight: 700,
                  color: '#6B6560', marginTop: '20px', cursor: 'pointer'
                }} onClick={() => setExpanded(false)}>
                  (click to close)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════ */
const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerTextRef = useRef<HTMLHeadingElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrambleDone, setScrambleDone] = useState(false);

  const setStripRef = useCallback((el: HTMLDivElement | null, i: number) => {
    stripRefs.current[i] = el;
  }, []);

  /* ── Text Scramble Effect ── */
  const runScramble = useCallback(() => {
    const el = headerTextRef.current;
    if (!el || scrambleDone) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setScrambleDone(true);
      return;
    }

    const finalText = 'THINGS\nI\'VE BUILT.';
    const chars = finalText.split('');
    const totalFrames = 18;
    let frame = 0;

    const update = () => {
      const progress = frame / totalFrames;
      const output = chars
        .map((char, i) => {
          if (char === '\n') return '\n';
          if (char === ' ') return ' ';
          const charProgress = (progress - i * 0.02);
          if (charProgress >= 1) return char;
          if (charProgress <= 0) return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          return Math.random() > charProgress
            ? SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
            : char;
        })
        .join('');

      // Split at newline and render with <br>
      const lines = output.split('\n');
      el.innerHTML = lines.map(l => l).join('<br />');
      frame++;

      if (frame <= totalFrames) {
        requestAnimationFrame(update);
      } else {
        el.innerHTML = 'THINGS<br />I\'VE BUILT.';
        setScrambleDone(true);
      }
    };

    // Start with scrambled text
    el.innerHTML = chars
      .map(c => {
        if (c === '\n') return '<br />';
        if (c === ' ') return ' ';
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join('');

    requestAnimationFrame(update);
  }, [scrambleDone]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* ── 1. Header scramble trigger ── */
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: () => runScramble(),
      });

      /* ── 2. Per-strip independent scroll animations ── */
      stripRefs.current.forEach((strip) => {
        if (!strip) return;
        gsap.fromTo(
          strip,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: strip,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      /* ── Background shapes removed, CSS animation handles drifting ── */
    }, section);

    return () => ctx.revert();
  }, [runScramble]);

  return (
    <section
      ref={sectionRef}
      data-section="4"
      data-dark
      className="section-dark"
      style={{
        minHeight: 'auto',
        position: 'relative',
        overflow: 'hidden',
        padding: '120px 0',
      }}
    >
      {/* ══════════════════════════════════════════
          AMBIENT COLOUR ZONE — Scattered Explosion
          ══════════════════════════════════════════ */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {/* Shape A: Large cyan shard */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', background: '#00BFC8', opacity: 0.18, mixBlendMode: 'screen', clipPath: 'polygon(85% 0%, 100% 0%, 100% 45%, 72% 60%)' }} />
        {/* Thin magenta velocity streak */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#E8155A', opacity: 0.25, mixBlendMode: 'screen', clipPath: 'polygon(70% 10%, 85% 8%, 80% 18%, 65% 20%)' }} />
        {/* Shape B: Cyan rectangle fragment */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#00BFC8', opacity: 0.14, mixBlendMode: 'screen', clipPath: 'polygon(0% 55%, 18% 48%, 22% 100%, 0% 100%)' }} />
        {/* Shape C: Yellow velocity streak */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#F5C400', opacity: 0.20, mixBlendMode: 'screen', clipPath: 'polygon(60% 30%, 100% 22%, 100% 28%, 62% 38%)' }} />
        {/* Shape D: Purple shard */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#5B1E9C', opacity: 0.15, mixBlendMode: 'screen', clipPath: 'polygon(40% 85%, 65% 78%, 70% 100%, 38% 100%)' }} />
      </div>

      {/* ── Section label top-right ── */}
      <span
        className="font-accent"
        style={{
          position: 'absolute',
          top: 'clamp(1.5rem, 3vw, 2.5rem)',
          right: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 700,
          fontSize: 14,
          color: 'var(--ink-muted)',
          letterSpacing: '0.06em',
          zIndex: 10,
        }}
      >
        04 / PROJECTS
      </span>

      {/* ── Scattered NodeDots ── */}
      <NodeDot
        size={5}
        color="var(--accent-cyan)"
        x={0}
        y={0}
        style={{
          position: 'absolute',
          top: '18%',
          right: '22%',
          zIndex: 1,
          opacity: 0.4,
          mixBlendMode: 'screen',
        }}
      />
      <NodeDot
        size={4}
        color="var(--accent-magenta)"
        x={0}
        y={0}
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '8%',
          zIndex: 1,
          opacity: 0.35,
          mixBlendMode: 'screen',
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 4vw, 3rem)',
        }}
      >
        {/* ── Section Header ── */}
        <div style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)', padding: '0 60px', position: 'relative' }}>
          {/* Section label */}
          <span className="font-accent" style={{ position: 'absolute', top: '-30px', left: '60px', fontSize: '16px', fontWeight: 700, color: '#F2EDE4', opacity: 0.8, letterSpacing: '0.06em' }}>
            // chapter 04
          </span>
          <h2
            ref={headerTextRef}
            style={{
              fontFamily: 'var(--ff-heading)',
              fontWeight: 700,
              fontSize: 'var(--fs-h1)',
              color: 'var(--ink-light)',
              textTransform: 'uppercase',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            THINGS
            <br />
            I'VE BUILT.
          </h2>

          {/* (so far) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 6 }}>
            <span
              className="font-accent"
              style={{
                fontWeight: 700,
                fontSize: '20px',
                color: '#F2EDE4',
                opacity: 0.9,
                display: 'block',
              }}
            >
              (so far)
            </span>
            <span className="font-accent" style={{ fontSize: '20px', color: '#F2EDE4', opacity: 0.9, fontWeight: 700 }}>
              (never really done)
            </span>
          </div>

          {/* Sub-description */}
          <p
            className="font-accent"
            style={{
              fontWeight: 700,
              fontSize: '17px',
              color: '#F2EDE4',
              opacity: 0.7,
              margin: 0,
              marginTop: 12,
              lineHeight: 1.5,
              maxWidth: 560,
            }}
          >
            projects, systems and experiments that turned from 'what if' to 'holy shit, it works'. more in the lab soon.
          </p>
        </div>

        {/* ── Project Strips ── */}
        <div>
          {projects.map((project, i) => (
            <div
              key={project.num}
              ref={(el) => setStripRef(el, i)}
              style={{ opacity: 0 }}
            >
              <ProjectStrip project={project} />
            </div>
          ))}
          {/* Bottom separator for last strip */}
          <div
            style={{
              height: 1,
              backgroundColor: 'var(--ink-muted)',
              opacity: 0.2,
            }}
          />
          {/* Bottom-right hidden note */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingRight: '20px' }}>
            <span className="font-accent" style={{ fontSize: '17px', color: '#F2EDE4', opacity: 0.50, fontWeight: 700 }}>
              shipped. broke. fixed. shipped.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
