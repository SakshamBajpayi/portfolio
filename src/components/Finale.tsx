'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';


const Finale: React.FC = () => {
  const finaleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: finaleRef.current,
          start: "top top",
          end: "+=300%",   // 3x viewport height of scroll space
          pin: true,        // pin the section
          scrub: 1.5,       // smooth scrub
          anticipatePin: 1,
        }
      });

      // Phase 1 (progress 0 → 0.4): radial circle expands
      tl.to(".finale-circle", {
        clipPath: "circle(150% at 50% 50%)",
        duration: 0.4,
        ease: "none"
      }, 0);

      // Phase 2 (progress 0.4 → 0.65): headline words appear
      tl.fromTo(".finale-word",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.2, ease: "power3.out" },
        0.4  // starts at 40% through the timeline
      );

      // Phase 3 (progress 0.65 → 0.85): subtext fades in
      tl.fromTo(".finale-subtext",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.15 },
        0.65
      );

      // Phase 4 (progress 0.85 → 1.0): wait a bit to let subtext read
      tl.to(".finale-circle", {
        duration: 0.15
      }, 0.85);

    }, finaleRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={finaleRef} className="finale-section section-dark" style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Cream content visible BEFORE circle expands */}
      <div className="finale-pre-content section-cream" style={{ position: 'absolute', inset: 0, background: 'var(--bg-cream)', zIndex: 0 }}>
      </div>

      {/* The dark circle layer */}
      <div className="finale-circle" style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--bg-dark)',
        clipPath: 'circle(0% at 50% 50%)',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'var(--section-pad)'
      }}>
        
        {/* Geometric colour cluster — reveals with the circle */}
        <div className="finale-geometry" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {/* Yellow drift shard */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', background: '#F5C400', opacity: 0.2, mixBlendMode: 'screen', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', animation: 'drift-slow 20s ease-in-out infinite alternate' }} />
            {/* Cyan drift shard */}
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '450px', height: '450px', background: '#00BFC8', opacity: 0.15, mixBlendMode: 'screen', clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)', animation: 'drift-slow 18s ease-in-out infinite alternate-reverse' }} />
          </div>
        </div>

        {/* Everything inside the dark reveal — text, geometry, contact */}
        <div className="finale-content" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          
          <span className="font-accent" style={{ fontSize: '16px', fontWeight: 700, color: '#6B6560', opacity: 0.8, marginBottom: '8px', display: 'block' }}>
            // chapter 07<br/>// the end (not really)
          </span>

          {/* Headline */}
          <h2 className="font-heading" style={{ fontSize: 'var(--fs-hero)', fontWeight: 900, color: 'var(--ink-light)', lineHeight: 1.1, margin: 0, textTransform: 'uppercase' }}>
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}><span className="finale-word" style={{ display: 'inline-block', transform: 'translateY(100%)' }}>THE</span></span>{' '}
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}><span className="finale-word" style={{ display: 'inline-block', transform: 'translateY(100%)' }}>BEST</span></span>{' '}
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}><span className="finale-word" style={{ display: 'inline-block', transform: 'translateY(100%)' }}>IS</span></span>{' '}
            <br />
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}><span className="finale-word" style={{ display: 'inline-block', transform: 'translateY(100%)' }}>YET</span></span>{' '}
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}><span className="finale-word" style={{ display: 'inline-block', transform: 'translateY(100%)' }}>TO</span></span>{' '}
            <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}><span className="finale-word finale-word--yellow" style={{ display: 'inline-block', transform: 'translateY(100%)', color: 'var(--accent-yellow)' }}>BUILD.</span></span>
          </h2>
          
          {/* Subtext */}
          <div className="finale-subtext font-accent" style={{ marginTop: '2rem', fontSize: '18px', color: 'var(--ink-muted)', opacity: 0, transform: 'translateY(20px)' }}>
            <p>more ideas. more experiments. more impact.</p>
            <p className="amatic-note" style={{ fontSize: '18px', fontWeight: 700, color: '#F2EDE4', opacity: 0.8, fontStyle: 'italic', marginTop: '4px' }}>(estimated completion: never)</p>
          </div>
        </div>

        {/* Right edge pinned note */}
        <span
          className="font-accent"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%) rotate(90deg)',
            transformOrigin: 'center center',
            fontSize: '17px',
            fontWeight: 700,
            color: '#F2EDE4',
            opacity: 0.75,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          just building things.
        </span>
      </div>
    </section>
  );
};

export default Finale;
