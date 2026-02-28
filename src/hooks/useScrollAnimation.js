// src/hooks/useScrollAnimation.js

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollAnimation() {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Find all animatable children
    const children = element.querySelectorAll('[data-animate]')

    children.forEach((child, index) => {
      const direction = child.dataset.animate || 'up'
      const delay = child.dataset.delay || index * 0.1

      let fromVars = { opacity: 0, y: 60 }

      if (direction === 'left') fromVars = { opacity: 0, x: -60 }
      if (direction === 'right') fromVars = { opacity: 0, x: 60 }
      if (direction === 'up') fromVars = { opacity: 0, y: 60 }
      if (direction === 'down') fromVars = { opacity: 0, y: -60 }
      if (direction === 'scale') fromVars = { opacity: 0, scale: 0.8 }
      if (direction === 'fade') fromVars = { opacity: 0 }

      gsap.fromTo(
        child,
        fromVars,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: child,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return ref
}