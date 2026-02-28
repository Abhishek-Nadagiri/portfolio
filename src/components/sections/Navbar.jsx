// src/components/sections/Navbar.jsx

import { useState, useEffect } from 'react'
import { personal } from '../../data/personal'
import Button from '../ui/Button'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Determine active section
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'achievements', 'contact']
      for (const section of sections.reverse()) {
        const el = document.getElementById(section)
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 px-6
          transition-all duration-500
          ${scrolled
            ? 'py-3 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-white/5'
            : 'py-5 bg-transparent'
          }
        `}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <a
            href="#hero"
            className="text-white font-bold text-xl tracking-tight 
                       font-['Space_Grotesk'] hover:text-[var(--accent-primary)] 
                       transition-colors"
          >
            {personal.name.split(' ')[0]}
            <span className="text-[var(--accent-primary)]">.</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`
                  text-sm transition-colors duration-300 relative
                  ${activeSection === link.href.slice(1)
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
                  }
                `}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-px 
                               bg-[var(--accent-primary)]"
                  />
                )}
              </a>
            ))}
            <Button variant="secondary" href={personal.resumeUrl}>
              Resume
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white/70 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`
          fixed inset-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-xl
          flex flex-col items-center justify-center gap-6
          transition-all duration-500 md:hidden
          ${mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }
        `}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className="text-2xl text-white/70 hover:text-white 
                       transition-colors font-['Space_Grotesk']"
          >
            {link.label}
          </a>
        ))}
        <Button variant="accent" href={personal.resumeUrl} className="mt-4">
          Download Resume
        </Button>
      </div>
    </>
  )
}