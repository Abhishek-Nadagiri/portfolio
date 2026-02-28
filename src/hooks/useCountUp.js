// src/hooks/useCountUp.js

import { useState, useEffect, useRef } from 'react'

export function useCountUp(target, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!startOnView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animateCount()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  function animateCount() {
    const startTime = Date.now()
    const numericTarget = parseInt(target)

    function update() {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * numericTarget))

      if (progress < 1) requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  }

  return { count, ref }
}