'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';

const journeyEntries = [
  {
    year: '2021',
    headline: 'CURIOSITY STARTED IT ALL',
    annotation: '(and hasn\'t stopped yet)',
    nodeColor: 'var(--ink-muted)',
    isPulsing: false,
  },
  {
    year: '2021 – 22',
    headline: 'BETA TESTING AT SCALE',
    annotation: '(first time software felt real)',
    nodeColor: '#F26419',
    isPulsing: false,
  },
  {
    year: '2023',
    headline: 'INTRODUCED TO AI AND LLMS',
    annotation: '(down the rabbit hole)',
    nodeColor: 'var(--accent-purple)',
    isPulsing: false,
  },
  {
    year: '2024',
    headline: 'JOINED PES UNIVERSITY',
    annotation: '(started b.tech in comp sci)',
    nodeColor: 'var(--accent-cyan)',
    isPulsing: false,
  },
  {
    year: '2024',
    headline: 'MADE MAPEER',
    annotation: '(one day. one product. done.)',
    nodeColor: 'var(--accent-lime)',
    isPulsing: false,
  },
  {
    year: '2025',
    headline: 'TAUGHT A MODEL TO PREDICT PROTEIN STRUCTURE',
    annotation: '(64% accuracy. not bad for one night.)',
    nodeColor: 'var(--accent-magenta)',
    isPulsing: false,
  },
  {
    year: '2025',
    headline: 'FINISHED FIRST YEAR OF UNI',
    annotation: '(survived and kept building)',
    nodeColor: 'var(--ink-muted)',
    isPulsing: false,
  },
  {
    year: '2025',
    headline: 'SHIPPED REAL CODE',
    annotation: '(pesu-auth — people actually used it)',
    nodeColor: 'var(--accent-orange)',
    isPulsing: false,
  },
  {
    year: '2026',
    headline: 'BUILT AN AI THAT EXPLAINS ITSELF',
    annotation: '(vqa — models that show their work)',
    nodeColor: 'var(--accent-purple)',
    isPulsing: false,
  },
  {
    year: '2026',
    headline: 'RESEARCH INTERN',
    annotation: '(photonics + quantum + cs)',
    nodeColor: 'var(--accent-cyan)',
    isPulsing: false,
  },
  {
    year: '2026+',
    headline: 'WHAT\'S NEXT?',
    annotation: '→ always.',
    nodeColor: 'var(--accent-yellow)',
    isPulsing: true,
  },
];

const Journey: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Spine animation
      gsap.fromTo('.journey-spine-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.journey-entries-container',
            start: 'top 50%',
            end: 'bottom 80%',
            scrub: true,
          }
        }
      );
      // Yellow sliding dot
      gsap.fromTo('.journey-sliding-dot',
        { top: '0%' },
        {
          top: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: '.journey-entries-container',
            start: 'top 50%',
            end: 'bottom 80%',
            scrub: true,
          }
        }
      );

      gsap.utils.toArray('.journey-entry').forEach((entry: any, i) => {
        gsap.fromTo(entry,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
        
        // Node dot pulse on enter
        gsap.fromTo(`.journey-node-${i}`,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.4,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: entry,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="5"
      className="section-cream"
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '80px', // Eliminates gap before Contact
        backgroundColor: 'var(--bg-cream)',
      }}
    >
      {/* Background shape: large irregular wash in magenta */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '600px',
          height: '800px',
          background: '#F26419',
          opacity: 0.06,
          mixBlendMode: 'multiply',
          clipPath: 'polygon(10% 0, 100% 20%, 90% 100%, 0 80%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--section-pad)', display: 'flex', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        
        {/* LEFT COLUMN - Sticky Title */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px', position: 'sticky', top: '80px', height: 'fit-content', paddingTop: '80px', zIndex: 2 }}>
          <span 
            className="font-accent" 
            style={{ fontSize: '16px', fontWeight: 700, color: '#6B6560', opacity: 0.8, marginBottom: '8px', display: 'block' }}
          >
            // chapter 06
          </span>
          <h2
            className="font-heading"
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: 'var(--ink)',
              lineHeight: 1,
              margin: 0
            }}
          >
            THE JOURNEY
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span
              className="font-accent"
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#F5C400',
              }}
            >
              (so far)
            </span>
            <span className="font-accent" style={{ fontSize: '18px', fontWeight: 700, fontStyle: 'italic', color: '#6B6560', opacity: 0.85 }}>
              (a mostly non-linear timeline)
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN - Timeline Entries */}
        <div style={{ flex: '1 1 500px', marginLeft: 'auto', paddingTop: '160px', position: 'relative' }}>
          
          {/* Timeline Vertical Spine */}
          <div style={{ position: 'absolute', top: '180px', bottom: '0', left: '25px', width: '2px', zIndex: 0, backgroundColor: 'var(--ink-muted)', opacity: 0.2 }} />
          <div className="journey-spine-fill" style={{ position: 'absolute', top: '180px', bottom: '0', left: '25px', width: '2px', zIndex: 1, transformOrigin: 'top center', background: 'linear-gradient(to bottom, var(--ink-muted), #F26419, #00BFC8, #5B1E9C, #F5C400)' }} />
          <div className="journey-sliding-dot" style={{ position: 'absolute', top: '180px', left: '22px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F5C400', zIndex: 2, transform: 'translateY(-50%)' }} />

          {/* Entries */}
          <div className="journey-entries-container" style={{ display: 'flex', flexDirection: 'column', gap: '80px', position: 'relative', zIndex: 3 }}>
            {journeyEntries.map((entry, i) => (
              <div key={entry.headline} className={`journey-entry journey-entry-${i}`} style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                
                {/* Custom Note: (it started here) / (still going) */}
                {i === 0 && (
                  <span className="font-accent hidden md:block" style={{ position: 'absolute', left: '-120px', top: '2px', fontSize: '22px', fontWeight: 700, color: '#6B6560', opacity: 0.8, pointerEvents: 'none' }}>
                    (it started here)
                  </span>
                )}
                {i === journeyEntries.length - 1 && (
                  <span className="font-accent hidden md:block" style={{ position: 'absolute', left: '-100px', top: '2px', fontSize: '22px', fontWeight: 700, color: '#F5C400', pointerEvents: 'none' }}>
                    (still going)
                  </span>
                )}
                
                {/* Node Dot */}
                <div style={{ width: '42px', display: 'flex', justifyContent: 'center', flexShrink: 0, marginTop: '8px' }}>
                  <div className={`journey-node-${i}`} style={{ position: 'relative', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: entry.nodeColor, animation: entry.isPulsing ? 'pulse-live 2s ease-in-out infinite' : 'none' }}>
                    {/* Ring */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: '24px', height: '24px', transform: 'translate(-50%, -50%)', borderRadius: '50%', border: `1px solid ${entry.nodeColor}`, opacity: 0.25 }} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '16px', paddingLeft: '16px', flex: 1 }}>
                  <span className="font-accent" style={{ fontSize: '16px', fontWeight: 700, color: entry.nodeColor, minWidth: '45px' }}>
                    {entry.year}
                  </span>
                  
                  <span className="font-heading" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', flex: '1 1 200px' }}>
                    {entry.headline}
                  </span>
                  
                  <span className="font-accent" style={{ fontSize: '22px', fontWeight: 700, fontStyle: 'italic', color: '#6B6560', opacity: 0.8, flex: '1 1 150px' }}>
                    {entry.annotation}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Note */}
          <div style={{ marginTop: '120px', textAlign: 'center' }}>
            <span className="font-accent" style={{ fontSize: '18px', fontWeight: 700, fontStyle: 'italic', color: '#6B6560', opacity: 0.85 }}>
              every mistake was load-bearing
            </span>
          </div>
          
          {/* To be continued note */}
          <div style={{ position: 'absolute', bottom: '-40px', left: '10px' }}>
            <span className="font-accent" style={{ fontSize: '17px', fontWeight: 700, color: '#6B6560', opacity: 0.8 }}>
              to be continued ↓
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Journey;
