import { useEffect, useRef } from 'react'
import { gsap } from './lib/gsap'
import { useLenis } from './hooks/useLenis'
import { useScrollProgress } from './hooks/useScrollProgress'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import TheSystem from './components/TheSystem'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Obsessions from './components/Obsessions'
import Journey from './components/Journey'
import Finale from './components/Finale'
import Contact from './components/Contact'
import BackgroundWords from './components/BackgroundWords'

function CameraFlash({ currentSection }: { currentSection: number }) {
  const flashRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (currentSection > 1 && flashRef.current) {
      flashRef.current.style.opacity = '0.4'
      flashRef.current.style.height = '40px'
      
      const timeout = setTimeout(() => {
        if (flashRef.current) {
          flashRef.current.style.opacity = '0'
          flashRef.current.style.height = '0px'
        }
      }, 150)
      
      return () => clearTimeout(timeout)
    }
  }, [currentSection])

  return (
    <div
      ref={flashRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '0px',
        background: '#E8155A',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'opacity 0.1s ease-out, height 0.1s ease-out',
      }}
    />
  )
}

function App() {
  useLenis()
  const { progress, currentSection } = useScrollProgress()

  useEffect(() => {
    // Global geo-shape rotation
    const ctx = gsap.context(() => {
      gsap.to('.geo-shape', {
        rotation: '+=3',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Global SVG Filters */}
      <svg className="svg-defs-global" aria-hidden="true">
        <defs>
          <filter id="roughen">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <BackgroundWords />
      <CameraFlash currentSection={currentSection} />
      <Cursor />
      <Nav currentSection={currentSection} scrollProgress={progress} />

      <main>
        <Hero />
        <TheSystem />
        <Experience />
        <Projects />
        <Obsessions />
        <Journey />
        <div 
          className="journey-to-contact-bridge" 
          style={{
            width: '100%',
            height: '60px',
            background: '#E8155A',
            opacity: 0.7,
            clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
            marginTop: '-1px',
            position: 'relative',
            zIndex: 10
          }} 
        />
        <Finale />
        <Contact />
      </main>
    </>
  )
}

export default App
