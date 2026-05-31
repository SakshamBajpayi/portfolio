import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
  start: 'top 80%',
})

export { gsap, ScrollTrigger }

export function applyParallax(element: Element | null, speed: number) {
  if (!element) return;
  gsap.to(element, {
    y: () => (ScrollTrigger.positionInViewport(element, "center") - 0.5) * speed * -100,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true
    }
  });
}
