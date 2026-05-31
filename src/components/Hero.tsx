import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import HeroCluster from './GeometricLayer';

const HEADLINE_WORDS = ['IDEAS', "DON'T", 'STAY', 'IMAGINARY', 'FOR', 'LONG', 'AROUND', 'HERE.'];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const asideRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const loadSequence = () => {
        const tl = gsap.timeline({ delay: 0.1 });
        
        // Phase 1: Construction lines draw
        tl.fromTo('.hero-construction-line', 
          { strokeDashoffset: 1 },
          { 
            strokeDashoffset: 0,
            duration: 0.35,
            stagger: 0.04,
            ease: 'none'
          }
        );
        
        // Phase 2: Shapes explode in
        tl.fromTo('.hero-cluster > *',
          { 
            scale: 0,
            transformOrigin: 'center center',
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.06,
            ease: 'back.out(1.4)'
          },
          '+=0.1'
        );
        
        // Phase 3: Headline words
        tl.fromTo('.hero-word-inner',
          { y: '105%' },
          {
            y: '0%',
            duration: 0.5,
            stagger: 0.10,
            ease: 'power3.out'
          },
          '+=0.1'
        );
        
        // Phase 4: Aside notes fade in
        tl.fromTo('.hero-aside',
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          '-=0.1'
        );
        
        tl.fromTo('.hero-scroll-label',
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
      };

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        loadSequence();
      } else {
        gsap.set(['.hero-cluster > *', '.hero-word-inner', '.hero-aside', '.hero-scroll-label'], 
          { opacity: 1, y: 0, scale: 1, strokeDashoffset: 0 }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="1"
      className="section-cream relative h-screen w-full overflow-hidden"
      style={{ background: 'var(--bg-cream)' }}
    >
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-center px-6 md:px-12 lg:px-20">
        {/* ─── Left column: headline ─── */}
        <div className="relative w-full md:w-[60%]">
          <h1
            className="font-heading uppercase leading-[0.95] tracking-tight"
            style={{
              fontSize: 'var(--fs-hero)',
              fontWeight: 700,
              color: 'var(--ink)',
            }}
          >
            {HEADLINE_WORDS.map((word) => (
              <span
                key={word}
                className="hero-word"
                style={{ overflow: 'hidden', display: 'inline-block' }}
              >
                <span
                  className="hero-word-inner"
                  style={{
                    display: 'inline-block',
                    ...(word === 'HERE.' ? { color: 'var(--accent-purple)' } : {})
                  }}
                >
                  {word}
                </span>
              </span>
            )).reduce((prev, curr) => [prev, ' ', curr] as any)}
          </h1>

          {/* Murmured footnote */}
          <span
            ref={asideRef}
            className="hero-aside font-accent mt-3 block text-right italic md:pr-8 lg:pr-12"
            style={{
              fontSize: '22px',
              color: '#6B6560',
              fontWeight: 700,
              opacity: 0, /* GSAP handles this */
            }}
          >
            (usually at 3am)
          </span>

          <div
            className="hero-aside currently-building-block"
            style={{
              display: 'flex',
              flexDirection: 'column',   /* stack instead of row */
              gap: '6px',
              marginTop: '48px',
              opacity: 0,  /* GSAP handles — do not remove */
              maxWidth: '520px',
            }}
          >
            {/* Top label row — small, muted */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#7CB800',
                  flexShrink: 0,
                  animation: 'pulse-live 2s ease-in-out infinite',
                }}
              />
              <span
                className="font-accent"
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--ink-muted)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                currently building
              </span>
            </div>

            {/* Main content — large, lime, unmissable */}
            <p
              className="font-accent"
              style={{
                fontSize: '32px',        /* big enough to demand attention */
                fontWeight: 700,
                color: '#7CB800',        /* full lime — matches the dot */
                lineHeight: 1.25,
                margin: 0,
                paddingLeft: '18px',     /* aligns with text above (dot width + gap) */
              }}
            >
              custom CUDA kernels
              <br />
              + a robot arm with vision
            </p>
          </div>
        </div>

        {/* ─── Right column: geometric cluster ─── */}
        <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[45%] md:block">
          <HeroCluster />
        </div>
      </div>
    </section>
  );
};

export default Hero;
