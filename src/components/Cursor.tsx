'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const move = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: "none"
      });
    };
    
    const grow = () => gsap.to(cursorRef.current, { scale: 2.5, duration: 0.2 });
    const shrink = () => gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    
    window.addEventListener('mousemove', move);
    document.querySelectorAll('a, button, [data-cursor-grow], [data-hover], [data-curiosity]')
      .forEach(el => {
        el.addEventListener('mouseenter', grow);
        el.addEventListener('mouseleave', shrink);
      });
    
    return () => window.removeEventListener('mousemove', move);
  }, []);
  
  return <div ref={cursorRef} className="custom-cursor" />;
};

export default Cursor;
