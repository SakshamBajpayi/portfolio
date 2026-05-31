import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import {
  Shard,
  ConstructionLine,
  NodeDot,
  RecurringTriangle,
} from './GeometricLayer';

/* ═══════════════════════════════════════════════════════════════
   02 / THE SYSTEM
   Cream-to-dark diagonal transition with curiosity manifesto.
   ═══════════════════════════════════════════════════════════════ */

/* ── Hand-drawn arrow SVG ── */
const HandArrow = () => (
  <svg
    width="38"
    height="16"
    viewBox="0 0 38 16"
    fill="none"
    aria-hidden="true"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 6 }}
  >
    <path
      d="M2 9c6-1 12-1.5 18-1.2 4 .2 8 .8 12 1.8"
      stroke="var(--ink)"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M29 5.5c1.5 1.8 3 3.2 5.5 4.5-2.8.4-4.5 1.5-6 3"
      stroke="var(--ink)"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const TheSystem = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const codePanelRef = useRef<HTMLDivElement>(null);
  const leftBlockRef = useRef<HTMLDivElement>(null);
  const rightListRef = useRef<HTMLDivElement>(null);
  const obsessedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      /* ── 1. Diagonal clip-path animation ── */
      if (darkOverlayRef.current) {
        gsap.fromTo(
          darkOverlayRef.current,
          {
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          },
          {
            clipPath: 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)',
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              end: 'top 20%',
              scrub: 0.6,
            },
          }
        );
      }

      /* ── 2. Left block — word-by-word fade up ── */
      if (leftBlockRef.current) {
        const words1 = leftBlockRef.current.querySelectorAll('.system-headline-dark .word-animate');
        const words2 = leftBlockRef.current.querySelectorAll('.system-headline-light .word-animate');
        [words1, words2].forEach((words) => {
          if (words.length === 0) return;
          gsap.fromTo(
            words,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.06,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: leftBlockRef.current,
                start: 'top 75%',
                end: 'top 35%',
                scrub: 0.5,
              },
            }
          );
        });

        /* sub-text fade in */
        const subs = leftBlockRef.current.querySelectorAll('.sub-fade');
        gsap.fromTo(
          subs,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: leftBlockRef.current,
              start: 'top 60%',
              end: 'top 25%',
              scrub: 0.5,
            },
          }
        );
      }

      /* ── 3. Code panel slide in ── */
      if (codePanelRef.current) {
        gsap.fromTo(
          codePanelRef.current,
          { x: 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: codePanelRef.current,
              start: 'top 80%',
              end: 'top 40%',
              scrub: 0.5,
            },
          }
        );
      }

      /* ── 4. Obsessed list ── */
      if (obsessedRef.current) {
        gsap.fromTo(
          obsessedRef.current,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: obsessedRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      /* ── 5. Right list — stagger from translateY ── */
      if (rightListRef.current) {
        const items = rightListRef.current.querySelectorAll('.right-word');
        gsap.fromTo(
          items,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.09,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rightListRef.current,
              start: 'top 75%',
              end: 'top 35%',
              scrub: 0.5,
            },
          }
        );
      }

      /* ── 6. Colour zone reveal ── */
      gsap.fromTo('.the-system-colour-zone',
        { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  /* ── Helper to wrap text into word spans ── */
  const wordSpans = (text: string, className = 'word-animate') =>
    text.split(' ').map((word, i) => (
      <span
        key={i}
        className={className}
        style={{ display: 'inline-block', marginRight: '0.3em' }}
      >
        {word}
      </span>
    ));

  /* ── Right-list data ── */
  const rightWords = [
    { text: 'overthinking', ml: 0 },
    { text: 'design', ml: 8 },
    { text: 'systems', ml: 4 },
    { text: 'robots', ml: 12 },
    { text: 'interactions', ml: 2 },
    { text: '& more', ml: 6 },
  ];

  return (
    <section
      ref={sectionRef}
      data-section="2"
      className="section-cream"
      style={{
        minHeight: '120vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Dark diagonal overlay ── */}
      <div
        ref={darkOverlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--bg-dark)',
          clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          zIndex: 1,
        }}
      />

      {/* ── Section label ── */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(1.5rem, 3vw, 2.5rem)',
          right: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontFamily: 'var(--ff-heading)',
          fontWeight: 700,
          fontSize: 11,
          color: 'var(--ink-muted)',
          letterSpacing: '0.08em',
          zIndex: 5,
        }}
      >
        02 / THE SYSTEM
      </div>

      {/* ── Left margin note ── */}
      <span
        className="font-accent"
        style={{
          position: 'absolute',
          left: '20px',
          bottom: '200px',
          fontFamily: 'var(--ff-accent)',
          fontSize: '17px',
          fontWeight: 700,
          color: '#6B6560',
          opacity: 0.75,
          transform: 'rotate(-90deg)',
          transformOrigin: 'left center',
          zIndex: 5,
        }}
      >
        not just a portfolio
      </span>

      {/* ── Content grid ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 'clamp(2rem, 4vw, 4rem)',
          maxWidth: 1280,
          margin: '0 auto',
          padding: `var(--section-pad) clamp(1.5rem, 4vw, 3rem)`,
          minHeight: '120vh',
          alignContent: 'center',
        }}
      >
        {/* ════════════════════ LEFT BLOCK ════════════════════ */}
        <div ref={leftBlockRef} style={{ paddingTop: '4rem' }}>
          <div className="system-headline" style={{ position: 'relative' }}>
            {/* Layer 1: Black text */}
            <h2
              className="system-headline-dark"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                fontFamily: 'var(--ff-heading)',
                fontWeight: 700,
                fontSize: 'var(--fs-h2)',
                lineHeight: 1.15,
                color: 'var(--ink)',
                margin: 0,
                clipPath: 'polygon(0 0, 100% 0, 100% 72%, 0 85%)',
              }}
            >
              {wordSpans('NOT JUST IDEAS.')}
              <br />
              {wordSpans('A ')}{' '}
              <span
                className="word-animate"
                style={{
                  display: 'inline-block',
                  color: 'var(--accent-purple)',
                }}
              >
                SYSTEM
              </span>
              <br />
              <span style={{ color: '#0D6B6E' }}>
                {wordSpans('OF CURIOSITY.')}
              </span>
            </h2>

            {/* Layer 2: Dark teal text */}
            <h2
              className="system-headline-light"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                fontFamily: 'var(--ff-heading)',
                fontWeight: 700,
                fontSize: 'var(--fs-h2)',
                lineHeight: 1.15,
                color: '#0D6B6E',
                margin: 0,
                clipPath: 'polygon(0 85%, 100% 72%, 100% 100%, 0 100%)',
              }}
              aria-hidden="true"
            >
              {wordSpans('NOT JUST IDEAS.')}
              <br />
              {wordSpans('A ')}{' '}
              <span
                className="word-animate"
                style={{
                  display: 'inline-block',
                  color: '#00BFC8',
                }}
              >
                SYSTEM
              </span>
              <br />
              {wordSpans('OF CURIOSITY.')}
            </h2>

            {/* Invisible spacer */}
            <h2
              style={{
                visibility: 'hidden',
                position: 'relative',
                fontFamily: 'var(--ff-heading)',
                fontWeight: 700,
                fontSize: 'var(--fs-h2)',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {wordSpans('NOT JUST IDEAS.')}
              <br />
              {wordSpans('A ')}{' '}
              <span
                style={{
                  display: 'inline-block',
                }}
              >
                SYSTEM
              </span>
              <br />
              {wordSpans('OF CURIOSITY.')}
            </h2>
          </div>

          {/* Sub-copy */}
          <p
            className="sub-fade"
            style={{
              fontFamily: 'var(--ff-accent)',
              fontWeight: 400,
              fontSize: 16,
              color: 'var(--ink-muted)',
              lineHeight: 1.6,
              marginTop: '1.5rem',
            }}
          >
            ideas, experiments, notes,
            <br />
            screenshots, and everything
            <br />
            in-between.
          </p>

          {/* Welcome-in CTA */}
          <p
            className="sub-fade"
            style={{
              fontFamily: 'var(--ff-accent)',
              fontWeight: 700,
              fontSize: '20px',
              fontStyle: 'italic',
              color: '#0D0C0B',
              opacity: 1,
              marginTop: '1.25rem',
            }}
          >
            (welcome in.)
            <HandArrow />
          </p>
        </div>

        {/* ════════════════════ CENTER BLOCK ════════════════════ */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Dark code panel */}
          <div
            ref={codePanelRef}
            style={{
              background: 'var(--bg-dark)',
              border: '1px solid var(--ink-muted)',
              borderRadius: 4,
              padding: 'clamp(1.5rem, 2.5vw, 2.5rem)',
              transform: 'rotate(-1deg)',
              boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.4)',
              width: '100%',
              maxWidth: 340,
            }}
          >
            <pre
              style={{
                fontFamily: 'var(--ff-heading)',
                fontWeight: 700,
                fontSize: 18,
                color: 'var(--ink-light)',
                lineHeight: 1.7,
                margin: 0,
                whiteSpace: 'pre',
              }}
            >
              <span style={{ color: 'var(--ink-muted)' }}>{'while'}</span>
              {' (curious) {\n'}
              {'  '}
              <span style={{ color: 'var(--accent-cyan)' }}>build</span>
              {'();\n'}
              {'  '}
              <span style={{ color: 'var(--accent-magenta)' }}>break_things</span>
              {'();\n'}
              {'  learn();\n'}
              {'  repeat();\n'}
              {'}'}
            </pre>
            <span className="font-accent" style={{ display: 'block', marginTop: '12px', fontSize: '18px', fontWeight: 700, color: '#6B6560', opacity: 0.8 }}>
              // this runs in my head constantly
            </span>
          </div>

          {/* Obsessed list */}
          <div
            ref={obsessedRef}
            style={{
              marginTop: '2rem',
              maxWidth: 340,
              width: '100%',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--ff-accent)',
                fontWeight: 400,
                fontSize: 13,
                color: 'var(--ink-muted)',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              obsessed with
              <br />
              1. understanding how things work
              <br />
              2. building things that don't exist
              <br />
              3. shipping weird ideas
            </p>
          </div>
        </div>

        {/* ════════════════════ RIGHT BLOCK ════════════════════ */}
        <div
          ref={rightListRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '0.6rem',
            paddingTop: '4rem',
          }}
        >
          {rightWords.map(({ text, ml }, i) => (
            <span
              key={i}
              className="right-word"
              style={{
                fontFamily: 'var(--ff-accent)',
                fontWeight: 700,
                fontSize: '18px',
                color: '#F2EDE4',
                opacity: 0.85,
                marginLeft: ml,
                display: 'block',
              }}
            >
              {text}
              {text === '& more' && (
                <span className="font-accent" style={{ marginLeft: '12px', fontSize: '17px', fontWeight: 700, fontStyle: 'italic', color: '#F2EDE4', opacity: 0.75, textTransform: 'none' }}>
                  (always more)
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════ GEOMETRIC DECORATIONS ════════════════════ */}

      {/* Shard — cream area, blend multiply */}
      <Shard
        points="0,20 30,0 50,60 10,50"
        size={65}
        color="var(--geo-black)"
        opacity={0.08}
        rotation={-18}
        className="blend-multiply"
        style={{
          position: 'absolute',
          top: '12%',
          left: '8%',
          zIndex: 2,
        }}
      />

      {/* Shard — dark area, blend screen */}
      <Shard
        points="20,0 50,20 40,55 0,30"
        size={55}
        color="var(--geo-white)"
        opacity={0.06}
        rotation={42}
        className="blend-screen"
        style={{
          position: 'absolute',
          bottom: '14%',
          right: '12%',
          zIndex: 2,
        }}
      />

      {/* Construction line — mapping across cream */}
      <ConstructionLine
        x1={0} y1={0} x2={180} y2={0}
        color="var(--ink-muted)"
        className="blend-multiply"
        style={{
          opacity: 0.2,
          transform: 'rotate(-6deg)',
          position: 'absolute',
          top: '28%',
          left: '2%',
          zIndex: 2,
        }}
      />

      {/* Construction line — diagonal crossing */}
      <ConstructionLine
        x1={0} y1={0} x2={140} y2={0}
        color="var(--ink-light)"
        className="blend-screen"
        style={{
          opacity: 0.15,
          transform: 'rotate(32deg)',
          position: 'absolute',
          bottom: '22%',
          right: '6%',
          zIndex: 2,
        }}
      />

      {/* Construction line — center vertical feel */}
      <ConstructionLine
        x1={0} y1={0} x2={100} y2={0}
        color="var(--ink-muted)"
        className="blend-multiply"
        style={{
          opacity: 0.12,
          transform: 'rotate(88deg)',
          position: 'absolute',
          top: '18%',
          left: '48%',
          zIndex: 2,
        }}
      />

      {/* Node dot accent */}
      <NodeDot
        size={5}
        color="var(--accent-magenta)"
        style={{
          opacity: 0.5,
          animation: 'pulse-dot 2s infinite',
          position: 'absolute',
          top: '35%',
          left: '15%',
          zIndex: 2,
        }}
      />

      {/* Small recurring triangle */}
      <RecurringTriangle
        size={18}
        color="var(--geo-black)"
        rotation={15}
        filled={false}
        className="blend-multiply"
        style={{
          opacity: 0.1,
          position: 'absolute',
          top: '22%',
          right: '25%',
          zIndex: 2,
        }}
      />

      {/* ════════════════════ AMBIENT COLOUR BLOBS ════════════════════ */}

      <div 
        className="the-system-colour-zone"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: '50%',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'absolute', right: '-10%', top: '10%', width: '400px', height: '300px', background: '#0D6B6E', opacity: 0.85, transform: 'rotate(-15deg)', mixBlendMode: 'multiply' }} />
        <div style={{ position: 'absolute', right: '5%', top: '15%', width: '280px', height: '200px', background: '#F5C400', opacity: 0.9, transform: 'rotate(20deg)', mixBlendMode: 'multiply' }} />
        <div style={{ position: 'absolute', right: '15%', top: '8%', width: '160px', height: '120px', background: '#5B1E9C', opacity: 1, transform: 'rotate(-8deg)', mixBlendMode: 'multiply' }} />
        
        <svg style={{ position: 'absolute', right: '-10%', top: '10%', width: '400px', height: '300px', transform: 'rotate(-15deg)', overflow: 'visible' }}>
           <defs>
              <clipPath id="magenta-clip">
                <rect width="400" height="300" />
              </clipPath>
           </defs>
           <g clipPath="url(#magenta-clip)">
              <line x1="0" y1="50" x2="350" y2="250" stroke="#0D0C0B" strokeWidth="1" opacity="0.7" />
              <line x1="10" y1="50" x2="360" y2="250" stroke="#0D0C0B" strokeWidth="1" opacity="0.7" />
              <line x1="20" y1="50" x2="370" y2="250" stroke="#0D0C0B" strokeWidth="1" opacity="0.7" />
              <line x1="30" y1="50" x2="380" y2="250" stroke="#0D0C0B" strokeWidth="1" opacity="0.7" />
           </g>
        </svg>

        <ConstructionLine x1={100} y1={250} x2={-150} y2={250} color="var(--ink-muted)" style={{ position: 'absolute', left: 0 }} />
        <ConstructionLine x1={150} y1={200} x2={-50} y2={200} color="var(--ink-muted)" style={{ position: 'absolute', left: 0 }} />
      </div>

    </section>
  );
};

export default TheSystem;
