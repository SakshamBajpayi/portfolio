import { useEffect, useState, useCallback } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(1)

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0
    setProgress(scrollProgress)

    // Detect current section by finding which data-section element is most visible
    const sections = document.querySelectorAll('[data-section]')
    let bestSection = 1
    let bestVisibility = -1

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const visibleTop = Math.max(0, rect.top)
      const visibleBottom = Math.min(viewportHeight, rect.bottom)
      const visibleHeight = Math.max(0, visibleBottom - visibleTop)

      if (visibleHeight > bestVisibility) {
        bestVisibility = visibleHeight
        bestSection = parseInt(section.getAttribute('data-section') || '1', 10)
      }
    })

    setCurrentSection(bestSection)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return { progress, currentSection }
}
