// src/components/PillNav/PillNav.jsx

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './PillNav.css'

const PillNav = ({
  items,
  activeSection,
  ease = 'power3.easeOut',
  initialLoadAnimation = true,
  onNavClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const circleRefs = useRef([])
  const tlRefs = useRef([])
  const activeTweenRefs = useRef([])
  const navItemsRef = useRef(null)
  const logoRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const menuItemsRef = useRef([])
  const backdropRef = useRef(null)
  const logoTextRef = useRef(null)

  const currentActive = activeSection ? `#${activeSection}` : '#hero'

  // ─── Scroll detection ───
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ─── Pill hover animation setup ───
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return

        const pill = circle.parentElement
        const rect = pill.getBoundingClientRect()
        const { width: w, height: h } = rect
        const R = ((w * w) / 4 + h * h) / (2 * h)
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` })

        const label = pill.querySelector('.pill-label')
        const hoverLabel = pill.querySelector('.pill-label-hover')

        if (label) gsap.set(label, { y: 0 })
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 })

        tlRefs.current[index]?.kill()
        const tl = gsap.timeline({ paused: true })
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0)
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0)
        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 })
          tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0)
        }
        tlRefs.current[index] = tl
      })
    }

    layout()
    window.addEventListener('resize', layout)
    if (document.fonts?.ready) document.fonts.ready.then(layout).catch(() => {})

    // Initial load animation
    if (initialLoadAnimation) {
      const logo = logoRef.current
      const navItems = navItemsRef.current

      if (logo) {
        gsap.set(logo, { scale: 0, rotation: -180 })
        gsap.to(logo, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 0.2 })
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden', opacity: 0 })
        gsap.to(navItems, { width: 'auto', opacity: 1, duration: 0.8, ease, delay: 0.5 })
      }
    }

    return () => window.removeEventListener('resize', layout)
  }, [items, ease, initialLoadAnimation])

  // ─── Hover handlers ───
  const handleEnter = (i) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' })
  }

  const handleLeave = (i) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' })
  }

  // ─── Logo hover ───
  const handleLogoEnter = () => {
    const el = logoTextRef.current
    if (!el) return
    gsap.to(el, { rotation: 360, duration: 0.6, ease: 'power2.out' })
  }

  const handleLogoLeave = () => {
    const el = logoTextRef.current
    if (!el) return
    gsap.to(el, { rotation: 0, duration: 0.4, ease: 'power2.out' })
  }

  // ─── Smooth scroll ───
  const handleNavClick = (e, href) => {
    e.preventDefault()
    if (isMobileMenuOpen) toggleMobileMenu()

    const targetId = href.replace('#', '')
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    onNavClick?.(href)
  }

  // ─── Mobile menu toggle with cinematic animation ───
  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen
    setIsMobileMenuOpen(newState)

    const menu = mobileMenuRef.current
    const backdrop = backdropRef.current
    const menuItems = menuItemsRef.current

    if (newState) {
      // ── OPENING ──
      document.body.style.overflow = 'hidden'

      // Backdrop fade in
      if (backdrop) {
        gsap.set(backdrop, { visibility: 'visible', opacity: 0 })
        gsap.to(backdrop, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      }

      // Menu panel slide in
      if (menu) {
        gsap.set(menu, { visibility: 'visible', opacity: 0, y: -20, scale: 0.95 })
        gsap.to(menu, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5, ease: 'back.out(1.4)', delay: 0.1,
        })
      }

      // Stagger menu items
      menuItems.forEach((item, i) => {
        if (!item) return
        gsap.set(item, { opacity: 0, x: -30, rotation: -5 })
        gsap.to(item, {
          opacity: 1, x: 0, rotation: 0,
          duration: 0.5, ease: 'power3.out',
          delay: 0.2 + i * 0.08,
        })
      })
    } else {
      // ── CLOSING ──
      document.body.style.overflow = ''

      // Reverse stagger menu items
      menuItems.forEach((item, i) => {
        if (!item) return
        gsap.to(item, {
          opacity: 0, x: 30,
          duration: 0.3, ease: 'power2.in',
          delay: i * 0.03,
        })
      })

      // Menu panel slide out
      if (menu) {
        gsap.to(menu, {
          opacity: 0, y: -10, scale: 0.98,
          duration: 0.3, ease: 'power2.in', delay: 0.15,
          onComplete: () => gsap.set(menu, { visibility: 'hidden' }),
        })
      }

      // Backdrop fade out
      if (backdrop) {
        gsap.to(backdrop, {
          opacity: 0, duration: 0.3, ease: 'power2.in', delay: 0.1,
          onComplete: () => gsap.set(backdrop, { visibility: 'hidden' }),
        })
      }
    }
  }

  return (
    <>
      {/* ═══════════════════════════════════════════
          MAIN NAVIGATION BAR
          ═══════════════════════════════════════════ */}
      <div className={`pillnav-container ${scrolled ? 'scrolled' : ''}`}>
        <nav className="pillnav" aria-label="Primary navigation">

          {/* ── AM Logo Button ── */}
          <a
            href="#hero"
            className="pillnav-logo"
            ref={logoRef}
            onClick={(e) => handleNavClick(e, '#hero')}
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
            aria-label="Go to top"
          >
            <span className="pillnav-logo-text" ref={logoTextRef}>
              AJ
            </span>
            <div className="pillnav-logo-ring" />
            <div className="pillnav-logo-ring ring-2" />
          </a>

          {/* ── Spacer / Gap ── */}
          <div className="pillnav-gap" />

          {/* ── Desktop Nav Items ── */}
          <div className="pillnav-items" ref={navItemsRef}>
            <ul className="pillnav-list" role="menubar">
              {items.map((item, i) => (
                <li key={item.href} role="none">
                  <a
                    role="menuitem"
                    href={item.href}
                    className={`pillnav-pill ${currentActive === item.href ? 'is-active' : ''}`}
                    onClick={(e) => handleNavClick(e, item.href)}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    <span
                      className="pill-hover-circle"
                      aria-hidden="true"
                      ref={(el) => { circleRefs.current[i] = el }}
                    />
                    <span className="pill-label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Mobile AM Button (hamburger) ── */}
          <button
            className={`pillnav-mobile-trigger ${isMobileMenuOpen ? 'is-open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="mobile-trigger-text">
              {isMobileMenuOpen ? '✕' : 'AJ'}
            </span>
            <div className="mobile-trigger-ring" />

            {/* Animated dots around the button */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`mobile-trigger-dot ${isMobileMenuOpen ? 'is-open' : ''}`}
                style={{
                  '--dot-angle': `${i * 60}deg`,
                  '--dot-delay': `${i * 0.05}s`,
                }}
              />
            ))}
          </button>

        </nav>
      </div>

      {/* ═══════════════════════════════════════════
          MOBILE MENU — FULLSCREEN EXPERIENCE
          ═══════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        className="mobile-backdrop"
        ref={backdropRef}
        onClick={toggleMobileMenu}
      />

      {/* Menu Panel */}
      <div className="mobile-menu" ref={mobileMenuRef}>
        {/* Decorative background elements */}
        <div className="mobile-menu-bg-glow glow-1" />
        <div className="mobile-menu-bg-glow glow-2" />
        <div className="mobile-menu-bg-glow glow-3" />

        {/* Menu Content */}
        <div className="mobile-menu-content">

          {/* Menu Header */}
          <div
            className="mobile-menu-header"
            ref={(el) => { menuItemsRef.current[0] = el }}
          >
            <div className="mobile-menu-logo">AJ</div>
            <p className="mobile-menu-subtitle">Navigation</p>
          </div>

          {/* Menu Links */}
          <ul className="mobile-menu-list">
            {items.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`mobile-menu-link ${currentActive === item.href ? 'is-active' : ''}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                  ref={(el) => { menuItemsRef.current[i + 1] = el }}
                >
                  {/* Link number */}
                  <span className="mobile-link-number">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Link text */}
                  <span className="mobile-link-text">
                    {item.label}
                  </span>

                  {/* Arrow */}
                  <span className="mobile-link-arrow">→</span>

                  {/* Active indicator */}
                  {currentActive === item.href && (
                    <span className="mobile-link-active-dot" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Menu Footer */}
          <div
            className="mobile-menu-footer"
            ref={(el) => { menuItemsRef.current[items.length + 1] = el }}
          >
            <div className="mobile-menu-social">
              {['GitHub', 'LinkedIn', 'Twitter'].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="mobile-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {name}
                </a>
              ))}
            </div>
            <a href="#" className="mobile-resume-btn">
              Download Resume
            </a>
          </div>

        </div>
      </div>
    </>
  )
}

export default PillNav