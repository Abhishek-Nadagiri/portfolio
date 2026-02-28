// src/App.jsx

import { useState, useEffect, useRef, useMemo } from 'react'
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient'
import PillNav from './components/PillNav/PillNav'

// ═══════════════════════════════════════════════════════════
// SCROLL ANIMATION SYSTEM
// ═══════════════════════════════════════════════════════════

function useScrollReveal({
  threshold = 0.15,
  delay = 0,
  direction = 'up',
  distance = 60,
  duration = 800,
  once = false,
} = {}) {
  const ref = useRef(null)
  const [visibility, setVisibility] = useState({ isVisible: false, progress: 0 })
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height
      const entryStart = windowHeight
      const entryEnd = windowHeight * (1 - threshold)
      const exitStart = elementHeight * threshold
      const exitEnd = 0

      let progress = 0
      if (elementTop >= entryStart) {
        progress = 0
      } else if (elementTop >= entryEnd) {
        progress = 1 - (elementTop - entryEnd) / (entryStart - entryEnd)
      } else if (elementTop >= exitStart) {
        progress = 1
      } else if (elementTop >= exitEnd - elementHeight) {
        if (!once || !hasAnimated.current) {
          progress = Math.max(0, (elementTop - (exitEnd - elementHeight)) / (exitStart - (exitEnd - elementHeight)))
        } else {
          progress = 1
        }
      } else {
        progress = once && hasAnimated.current ? 1 : 0
      }

      progress = Math.max(0, Math.min(1, progress))
      if (progress > 0.5) hasAnimated.current = true
      setVisibility({ isVisible: progress > 0.1, progress })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [threshold, once])

  const style = useMemo(() => {
    const eased = easeOutCubic(visibility.progress)
    let transform = ''
    switch (direction) {
      case 'up': transform = `translateY(${(1 - eased) * distance}px)`; break
      case 'down': transform = `translateY(${-(1 - eased) * distance}px)`; break
      case 'left': transform = `translateX(${(1 - eased) * distance}px)`; break
      case 'right': transform = `translateX(${-(1 - eased) * distance}px)`; break
      case 'scale': transform = `scale(${0.8 + eased * 0.2})`; break
      default: transform = `translateY(${(1 - eased) * distance}px)`
    }
    return {
      opacity: eased,
      transform,
      transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
      transitionDelay: `${delay}ms`,
      willChange: 'opacity, transform',
    }
  }, [visibility.progress, direction, distance, duration, delay])

  return { ref, style, isVisible: visibility.isVisible, progress: visibility.progress }
}

function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 60,
  duration = 800,
  threshold = 0.15,
  once = false,
  style: extraStyle = {},
}) {
  const { ref, style } = useScrollReveal({ direction, delay, distance, duration, threshold, once })
  return <div ref={ref} style={{ ...style, ...extraStyle }}>{children}</div>
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3) }

// ═══════════════════════════════════════════════════════════
// RESPONSIVE HOOK
// ═══════════════════════════════════════════════════════════

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}

// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════

const personal = {
  name: "Abhishek Nadagiri",
  role: "Developer & Creative Engineer",
  email: "abhisheknadagiri300@gmail.com",
  location: "Hyderabad",
  bio: "I'm a passionate Developer exploring AI-powered applications, immersive web experiences, and scalable 3D Immersive components.",
  resumeUrl: "#",
  social: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "mailto:alex@example.com",
  },
  stats: [
    { number: "4+", label: "Domains" },
    { number: "5+", label: "Projects" },
    { number: "10+", label: "Tools" },
    { number: "4+", label: "Learning" },
  ],
}

const projects = [
  { id: 1, title: "Inventa", description: "Real-time monitoring dashboard for distributed systems.", tech: ["React", "Tailwind CSS", "MySQL", "Vite"], liveUrl: "#", repoUrl: "#", metrics: "Document Protection", year: 2026, color: "#6C63FF" },
  { id: 2, title: "3D E-Commerce Experience", description: "Shopping platform with interactive 3D product visualization.", tech: ["Next.js", "Three.js", "Stripe", "AWS"], liveUrl: "#", repoUrl: "#", metrics: "50K+ transactions", year: 2024, color: "#00D4FF" },
  { id: 3, title: "AI Content Engine", description: "AI-powered content management with smart categorization.", tech: ["Python", "React", "OpenAI", "Redis"], liveUrl: "#", repoUrl: "#", metrics: "1M+ articles", year: 2023, color: "#FF6B6B" },
  { id: 4, title: "Real-Time Fitness Tracker", description: "Cross-platform mobile app for workout tracking.", tech: ["React Native", "Firebase", "D3.js"], liveUrl: "#", repoUrl: "#", metrics: "25K+ downloads", year: 2023, color: "#4ADE80" },
]

const skillCategories = [
  {
    title: "Data & Analytics",
    icon: "📊",
    color: "#6C63FF",
    gradient: "linear-gradient(135deg, #6C63FF, #4F46E5)",
    skills: [
      { name: "Data Visualization", icon: "📈" },
      { name: "Dashboards", icon: "🖥️" },
      { name: "SQL", icon: "🗄️" },
      { name: "Python", icon: "🐍" },
      { name: "Performance Metrics", icon: "⚡" },
    ],
  },
  {
    title: "Design & Experience",
    icon: "🎨",
    color: "#00D4FF",
    gradient: "linear-gradient(135deg, #00D4FF, #0EA5E9)",
    skills: [
      { name: "UI/UX Design", icon: "✨" },
      { name: "Figma", icon: "🎯" },
      { name: "Design Systems", icon: "🧩" },
      { name: "Interaction Design", icon: "👆" },
      { name: "Accessibility", icon: "♿" },
    ],
  },
  {
    title: "Product & Strategy",
    icon: "🚀",
    color: "#FF6B6B",
    gradient: "linear-gradient(135deg, #FF6B6B, #EF4444)",
    skills: [
      { name: "Product Roadmapping", icon: "🗺️" },
      { name: "MVP Planning", icon: "🎯" },
      { name: "User Research", icon: "🔍" },
      { name: "Feature Prioritization", icon: "📋" },
    ],
  },
  {
    title: "Development Tools",
    icon: "🛠️",
    color: "#4ADE80",
    gradient: "linear-gradient(135deg, #4ADE80, #22C55E)",
    skills: [
      { name: "VS Code", icon: "💻" },
      { name: "Git", icon: "🔀" },
      { name: "GitHub", icon: "🐙" },
      { name: "Framer", icon: "🖼️" },
      { name: "Canva", icon: "🎨" },
    ],
  },
]

const experiences = [
  { id: 1, role: "Project Lead", company: "Inventa", duration: "Dec 2025 — Mar 2026", description: "Led a 4-member team to build a centralised Protection system", highlights: ["Designed system architecture and database structure", "Deployed applications using modern frameworks", "Presented final solution to faculty panel"], tech: ["Team Leadership", "Database Design", "System Design"] },
  { id: 2, role: "Google Student Ambassador", company: "Google Gemini", duration: "Aug 2025 — Dec 2025", description: "Leading technology awareness initiatives and fostering developer communities on campus", highlights: ["Supported peers in building real-world projects", "Acted as campus liaison for developer initiatives", "Collaborated with student leaders to host coding events"], tech: ["Technical Mentorship", "Public Speaking", "AI Tools"] },
  { id: 3, role: "UI Designer", company: "Individual Contribution", duration: "2024 — present", description: "Designing intuitive and visually engaging user interfaces for web and digital platforms.", highlights: ["Created responsive UI layouts", "Designed 10 plus Prototypes", "Focused on usability, accessibility, and visual consistency"], tech: ["UI/UX Design", "Prototyping", "Interaction Design"] },
]

const achievements = [
  { id: 1, title: "GSA-25 Participant", issuer: "Google", date: "2025", icon: "🏆", type: "cert" },
  { id: 2, title: "WIZ National Spell Bee", issuer: "WIZ", date: "2016", icon: "☁️", type: "cert" },
  { id: 3, title: "Accounting Fundamentals", issuer: "Tata Consultancy Services", date: "2024", icon: "🥇", type: "cert" },
  { id: 4, title: "National Financial Literacy Quiz Participant", issuer: "SEBI", date: "2026", icon: "⭐", type: "oss" },
  { id: 5, title: "Intel AI-Aware", issuer: "Intel", date: "2024", icon: "📜", type: "Badge" },
  { id: 6, title: "Discovery School Super League", issuer: "Byjus", date: "2020", icon: "🏅", type: "award" },
]

// ═══════════════════════════════════════════════════════════
// ANIMATED NAME COMPONENT — Letter-by-letter scatter effect
// ═══════════════════════════════════════════════════════════

function AnimatedName({ name, scrollY, isLoaded, isMobile }) {
  const letters = useMemo(() => {
    const chars = name.split('')
    const totalLetters = chars.length
    const midpoint = totalLetters / 2

    return chars.map((char, index) => {
      // Determine if letter is on left or right side
      const isLeftSide = index < midpoint
      const distanceFromCenter = Math.abs(index - midpoint) / midpoint // 0 to 1

      // Letters further from center move more and disappear first
      const staggerFactor = distanceFromCenter
      // Outer letters start disappearing sooner (lower scroll threshold)
      const scrollStart = 50 + (1 - staggerFactor) * 150 // 50-200px
      const scrollEnd = scrollStart + 200 // spread over 200px of scroll

      return {
        char,
        index,
        isLeftSide,
        isSpace: char === ' ',
        staggerFactor,
        scrollStart,
        scrollEnd,
        // Distance to travel when fully disappeared
        maxDistance: (80 + staggerFactor * 200) * (isMobile ? 0.6 : 1),
        // Slight vertical scatter
        verticalOffset: (Math.random() - 0.5) * 30,
      }
    })
  }, [name, isMobile])

  return (
    <h1 style={{
      fontSize: isMobile ? 'clamp(2rem, 10vw, 3rem)' : 'clamp(2.5rem, 8vw, 6rem)',
      fontWeight: 200,
      color: 'white',
      letterSpacing: '0.02em',
      lineHeight: 1.1,
      marginBottom: isMobile ? 16 : 24,
      fontFamily: '"Noto Serif Display", serif',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
      transition: isLoaded ? 'none' : 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
      wordBreak: 'break-word',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      overflow: 'visible',
    }}>
      {letters.map((letter, i) => {
        if (letter.isSpace) {
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: isMobile ? '0.3em' : '0.35em',
              }}
            >
              &nbsp;
            </span>
          )
        }

        // Calculate animation progress for this letter based on scroll
        let letterProgress = 0
        if (scrollY > letter.scrollStart) {
          letterProgress = Math.min(1, (scrollY - letter.scrollStart) / (letter.scrollEnd - letter.scrollStart))
        }

        // Easing
        const eased = easeOutCubic(letterProgress)

        // Direction: left letters go left (-X), right letters go right (+X)
        const directionX = letter.isLeftSide ? -1 : 1
        const translateX = eased * letter.maxDistance * directionX
        const translateY = eased * letter.verticalOffset
        const opacity = 1 - eased
        const blur = eased * 8
        const rotate = eased * directionX * (5 + letter.staggerFactor * 15)
        const scale = 1 - eased * 0.3

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
              opacity: Math.max(0, opacity),
              filter: `blur(${blur}px)`,
              transition: 'none', // Direct scroll-driven, no transition delay
              willChange: 'transform, opacity, filter',
              fontFamily: '"Noto Serif Display", serif',
              fontWeight: 200,
            }}
          >
            {letter.char}
          </span>
        )
      })}
    </h1>
  )
}

// ═══════════════════════════════════════════════════════════
// MAIN APP — No ScrollProgressBar
// ═══════════════════════════════════════════════════════════

function App() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'achievements', 'contact']
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section)
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', overflowX: 'hidden' }}>

      <PillNav
        items={[
          { label: 'Home', href: '#hero' },
          { label: 'About', href: '#about' },
          { label: 'Skills', href: '#skills' },
          { label: 'Projects', href: '#projects' },
          { label: 'Experience', href: '#experience' },
          { label: 'Contact', href: '#contact' },
        ]}
        activeSection={activeSection}
        ease="power2.easeOut"
        initialLoadAnimation
      />

      <HeroSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <SkillsSection />
      <SectionDivider />
      <ProjectsSection />
      <SectionDivider />
      <ExperienceSection />
      <SectionDivider />
      <AchievementsSection />
      <SectionDivider />
      <ContactSection />
      <Footer />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// HERO SECTION — Mobile Fixed with Animated Name
// ═══════════════════════════════════════════════════════════

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 600)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', handleScroll) }
  }, [])

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
      }}
    >
      {/* Shader Gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        transform: isMobile ? 'none' : `translateY(${scrollY * 0.3}px)`,
      }}>
        <ShaderGradientCanvas
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: isMobile ? '100%' : '120%',
            pointerEvents: 'none',
          }}
        >
          <ShaderGradient
            animate="on" brightness={1.2} cAzimuthAngle={180} cDistance={2.81} cPolarAngle={90}
            cameraZoom={1} color1="#636379" color2="#555355" color3="#000000" envPreset="city" grain="off"
            lightType="3d" pixelDensity={1} positionX={-1.4} positionY={0} positionZ={0} range="enabled"
            rangeEnd={40} rangeStart={0} reflection={0.1} rotationX={0} rotationY={10} rotationZ={50}
            type="plane" uAmplitude={1} uDensity={1.3} uFrequency={5.5} uSpeed={0.2} uStrength={4}
            uTime={0} wireframe={false}
          />
        </ShaderGradientCanvas>
      </div>

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(0,0,0,0.3)' }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: isMobile ? '120px' : '160px',
        zIndex: 2,
        background: 'linear-gradient(to bottom, transparent, #0A0A0F)',
      }} />

      {/* Particles — fewer on mobile */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(isMobile ? 8 : 15)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', width: 2, height: 2, background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            animation: `pulse ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', textAlign: 'center',
        padding: isMobile ? '0 20px' : '0 24px',
      }}>

        {/* Status Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: isMobile ? '6px 12px' : '8px 16px',
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9999,
          marginBottom: isMobile ? 20 : 32,
          opacity: isLoaded ? Math.max(0, 1 - scrollY / 300) : 0,
          transform: isLoaded ? `translateY(${scrollY * 0.1}px)` : 'translateY(20px)',
          transition: isLoaded ? 'opacity 0.1s ease-out' : 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
        }}>
          <div style={{
            width: 8, height: 8, background: '#4ADE80',
            borderRadius: '50%', animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: isMobile ? 10 : 12,
            letterSpacing: '0.05em',
          }}>
            Available for Dev
          </span>
        </div>

        {/* Animated Name */}
        <AnimatedName
          name={personal.name}
          scrollY={scrollY}
          isLoaded={isLoaded}
          isMobile={isMobile}
        />

        {/* Role */}
        <p style={{
          fontSize: isMobile ? 'clamp(0.9rem, 4vw, 1.1rem)' : 'clamp(1rem, 2.5vw, 1.5rem)',
          color: 'rgba(255,255,255,0.4)',
          maxWidth: isMobile ? '90%' : 500,
          marginBottom: isMobile ? 32 : 48,
          fontWeight: 300, lineHeight: 1.6,
          opacity: isLoaded ? Math.max(0, 1 - scrollY / 400) : 0,
          transform: isLoaded ? `translateY(${scrollY * 0.08}px)` : 'translateY(30px)',
          transition: isLoaded ? 'opacity 0.1s ease-out' : 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
        }}>
          {personal.role}
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 12 : 16,
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? '280px' : 'none',
          opacity: isLoaded ? Math.max(0, 1 - scrollY / 350) : 0,
          transform: isLoaded ? `translateY(${scrollY * 0.05}px)` : 'translateY(30px)',
          transition: isLoaded ? 'opacity 0.1s ease-out' : 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
        }}>
          <a href="#projects" style={{
            padding: isMobile ? '12px 24px' : '14px 32px',
            background: 'white', color: 'black', borderRadius: 12,
            textDecoration: 'none', fontWeight: 600,
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            transition: 'transform 0.3s, box-shadow 0.3s',
            textAlign: 'center',
          }}>
            View My Work ↓
          </a>
          <a href="#contact" style={{
            padding: isMobile ? '12px 24px' : '14px 32px',
            background: 'transparent', color: 'white',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12,
            textDecoration: 'none', fontWeight: 600,
            fontSize: isMobile ? '0.8rem' : '0.875rem',
            backdropFilter: 'blur(10px)', transition: 'all 0.3s',
            textAlign: 'center',
          }}>
            Get In Touch
          </a>
        </div>
      </div>

      {/* Scroll Indicator — hide on mobile */}
      {!isMobile && (
        <div style={{
          position: 'absolute', bottom: 32, left: '50%',
          transform: 'translateX(-50%)', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          opacity: Math.max(0, 1 - scrollY / 200),
          animation: 'bounce 2s ease-in-out infinite',
        }}>
          <span style={{
            color: 'rgba(255,255,255,0.2)', fontSize: 10,
            letterSpacing: '0.3em', textTransform: 'uppercase',
          }}>Scroll</span>
          <div style={{
            width: 20, height: 32,
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 10, display: 'flex', justifyContent: 'center', paddingTop: 6,
          }}>
            <div style={{
              width: 3, height: 8,
              background: 'rgba(255,255,255,0.4)',
              borderRadius: 2,
              animation: 'scrollDot 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      )}
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// ABOUT SECTION — Mobile Fixed
// ═══════════════════════════════════════════════════════════

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)
  const numericValue = parseInt(target) || 0

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const startTime = Date.now()
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / 2000, 1)
          setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * numericValue))
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [numericValue])

  return (
    <div ref={ref} style={{
      fontSize: '1.5rem', fontWeight: 700, color: 'white',
      fontFamily: 'Space Grotesk, sans-serif',
    }}>
      {count}{target.replace(/[0-9]/g, '')}
    </div>
  )
}

function AboutSection() {
  const isMobile = useIsMobile()

  return (
    <section id="about" style={{
      minHeight: isMobile ? 'auto' : '100vh',
      display: 'flex', alignItems: 'center',
      padding: isMobile ? '64px 20px' : '96px 24px',
      background: '#0A0A0F',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <ScrollReveal direction="down" distance={30} duration={900}>
          <SectionHeader eyebrow="About Me" title="Building the Future of the Web" />
        </ScrollReveal>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 32 : 48,
          alignItems: 'center',
        }}>
          {/* Photo */}
          <ScrollReveal direction={isMobile ? 'up' : 'left'} distance={isMobile ? 40 : 80} duration={1000} delay={200}>
            <div style={{
              width: isMobile ? 180 : 240,
              height: isMobile ? 180 : 240,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: isMobile ? '3rem' : '4rem',
              position: 'relative', flexShrink: 0,
              margin: isMobile ? '0 auto' : '0',
            }}>
              👨‍💻
              <div style={{
                position: 'absolute', inset: -12, borderRadius: 20,
                border: '1px solid rgba(108,99,255,0.15)', zIndex: -1,
              }} />
            </div>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal direction={isMobile ? 'up' : 'right'} distance={isMobile ? 40 : 80} duration={1000} delay={isMobile ? 100 : 400}>
            <div style={{ width: '100%' }}>
              <p style={{
                color: '#A0A0B8', lineHeight: 1.8,
                fontSize: isMobile ? '0.95rem' : '1.1rem',
                marginBottom: isMobile ? 24 : 32,
                textAlign: isMobile ? 'center' : 'left',
              }}>
                {personal.bio}
              </p>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: isMobile ? 10 : 12,
              }}>
                {personal.stats.map((stat, index) => (
                  <ScrollReveal key={stat.label} direction="up" delay={isMobile ? index * 80 : 600 + index * 150} distance={20} duration={700}>
                    <div style={{
                      padding: isMobile ? 12 : 16,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12, textAlign: 'center',
                      transition: 'all 0.3s',
                    }}>
                      <AnimatedCounter target={stat.number} />
                      <div style={{
                        fontSize: isMobile ? '0.6rem' : '0.65rem',
                        color: 'rgba(255,255,255,0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em', marginTop: 4,
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// SKILLS SECTION — Chip Design with Hover Effects
// ═══════════════════════════════════════════════════════════

function SkillsSection() {
  const isMobile = useIsMobile()
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)

  return (
    <section id="skills" style={{
      minHeight: isMobile ? 'auto' : '100vh',
      padding: isMobile ? '64px 20px' : '96px 24px',
      background: '#0A0A0F',
      position: 'relative',
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '300px' : '600px',
        height: isMobile ? '300px' : '600px',
        borderRadius: '50%',
        background: hoveredCategory
          ? `radial-gradient(circle, ${skillCategories.find(c => c.title === hoveredCategory)?.color}08, transparent)`
          : 'radial-gradient(circle, rgba(108,99,255,0.03), transparent)',
        transition: 'background 0.8s ease',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <ScrollReveal direction="down" distance={30}>
          <SectionHeader eyebrow="Expertise" title="What I Bring to the Table" />
        </ScrollReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? 16 : 24,
        }}>
          {skillCategories.map((category, catIndex) => (
            <ScrollReveal
              key={category.title}
              direction="up"
              delay={catIndex * 120}
              distance={40}
              duration={900}
            >
              <div
                style={{
                  position: 'relative',
                  borderRadius: isMobile ? 14 : 20,
                  overflow: 'hidden',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default',
                  background: hoveredCategory === category.title
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(255,255,255,0.02)',
                  border: hoveredCategory === category.title
                    ? `1px solid ${category.color}30`
                    : '1px solid rgba(255,255,255,0.06)',
                  transform: hoveredCategory === category.title
                    ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredCategory === category.title
                    ? `0 20px 60px ${category.color}10`
                    : 'none',
                }}
                onMouseEnter={() => !isMobile && setHoveredCategory(category.title)}
                onMouseLeave={() => !isMobile && setHoveredCategory(null)}
              >
                <div style={{
                  height: '3px',
                  background: category.gradient,
                  opacity: hoveredCategory === category.title ? 1 : 0.4,
                  transition: 'opacity 0.5s ease',
                }} />

                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: category.color,
                  opacity: hoveredCategory === category.title ? 0.08 : 0.03,
                  filter: 'blur(35px)',
                  transition: 'opacity 0.5s ease',
                  pointerEvents: 'none',
                }} />

                <div style={{ padding: isMobile ? '18px' : '24px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: isMobile ? 16 : 20,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: isMobile ? 36 : 42,
                        height: isMobile ? 36 : 42,
                        borderRadius: 10,
                        background: `${category.color}15`,
                        border: `1px solid ${category.color}25`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '1.1rem' : '1.3rem',
                        transition: 'all 0.3s',
                        boxShadow: hoveredCategory === category.title
                          ? `0 0 15px ${category.color}20` : 'none',
                      }}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: isMobile ? '0.9rem' : '1.05rem',
                          fontWeight: 700,
                          color: 'white',
                          fontFamily: 'Space Grotesk, sans-serif',
                        }}>
                          {category.title}
                        </h3>
                        <p style={{
                          fontSize: '0.6rem',
                          color: category.color,
                          opacity: 0.6,
                          marginTop: 1,
                        }}>
                          {category.skills.length} skills
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 3 }}>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} style={{
                          width: 4, height: 4,
                          borderRadius: '50%',
                          background: category.color,
                          opacity: hoveredCategory === category.title ? 0.6 : 0.2,
                          transition: 'opacity 0.3s',
                          transitionDelay: `${i * 0.1}s`,
                        }} />
                      ))}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: isMobile ? 8 : 10,
                  }}>
                    {category.skills.map((skill, skillIndex) => {
                      const skillKey = `${category.title}-${skill.name}`
                      const isChipHovered = hoveredSkill === skillKey

                      return (
                        <div
                          key={skill.name}
                          onMouseEnter={() => !isMobile && setHoveredSkill(skillKey)}
                          onMouseLeave={() => !isMobile && setHoveredSkill(null)}
                          style={{
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: isMobile ? 5 : 7,
                            padding: isMobile ? '7px 12px' : '9px 16px',
                            borderRadius: 50,
                            cursor: 'default',
                            overflow: 'hidden',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            transitionDelay: `${skillIndex * 0.02}s`,
                            background: isChipHovered
                              ? `${category.color}18`
                              : 'rgba(255,255,255,0.03)',
                            border: isChipHovered
                              ? `1px solid ${category.color}40`
                              : '1px solid rgba(255,255,255,0.08)',
                            transform: isChipHovered
                              ? 'translateY(-3px) scale(1.05)'
                              : 'translateY(0) scale(1)',
                            boxShadow: isChipHovered
                              ? `0 8px 25px ${category.color}15`
                              : 'none',
                          }}
                        >
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: isChipHovered ? category.gradient : 'transparent',
                            opacity: isChipHovered ? 0.08 : 0,
                            transition: 'opacity 0.4s ease',
                            borderRadius: 50,
                          }} />

                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: isChipHovered ? '120%' : '-100%',
                            width: '60%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                            transition: 'left 0.6s ease',
                            pointerEvents: 'none',
                          }} />

                          <span style={{
                            fontSize: isMobile ? '0.8rem' : '0.9rem',
                            position: 'relative',
                            zIndex: 1,
                            transition: 'transform 0.3s ease',
                            transform: isChipHovered
                              ? 'scale(1.2) rotate(-10deg)'
                              : 'scale(1) rotate(0)',
                            display: 'inline-block',
                          }}>
                            {skill.icon}
                          </span>

                          <span style={{
                            fontSize: isMobile ? '0.72rem' : '0.8rem',
                            fontWeight: isChipHovered ? 600 : 500,
                            color: isChipHovered ? 'white' : 'rgba(255,255,255,0.55)',
                            position: 'relative',
                            zIndex: 1,
                            transition: 'all 0.3s ease',
                            letterSpacing: '0.01em',
                            whiteSpace: 'nowrap',
                          }}>
                            {skill.name}
                          </span>

                          {isChipHovered && (
                            <div style={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              background: category.color,
                              boxShadow: `0 0 8px ${category.color}`,
                              position: 'relative',
                              zIndex: 1,
                              animation: 'chipPulse 1.5s ease-in-out infinite',
                              flexShrink: 0,
                            }} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={500} distance={15}>
          <p style={{
            textAlign: 'center',
            marginTop: isMobile ? 28 : 44,
            color: 'rgba(255,255,255,0.12)',
            fontSize: isMobile ? '0.65rem' : '0.72rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            Always learning · Always evolving
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// PROJECTS SECTION — Mobile Fixed
// ═══════════════════════════════════════════════════════════

function ProjectsSection() {
  const isMobile = useIsMobile()

  return (
    <section id="projects" style={{
      minHeight: isMobile ? 'auto' : '100vh',
      padding: isMobile ? '64px 20px' : '96px 24px',
      background: '#0A0A0F',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <ScrollReveal direction="down" distance={30}>
          <SectionHeader eyebrow="Portfolio" title="Selected Work" />
        </ScrollReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? 16 : 24,
        }}>
          {projects.map((p, i) => (
            <ScrollReveal key={p.id} direction="up" delay={i * 100} distance={40} duration={900}>
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, overflow: 'hidden',
                transition: 'all 0.5s', cursor: 'pointer',
              }}>
                <div style={{
                  height: isMobile ? 140 : 180,
                  position: 'relative',
                  background: `linear-gradient(135deg, ${p.color}15, ${p.color}05)`,
                }}>
                  <div style={{
                    position: 'absolute', top: -20, right: -20,
                    width: 80, height: 80, borderRadius: '50%',
                    background: p.color, opacity: 0.15, filter: 'blur(25px)',
                  }} />
                  <span style={{
                    position: 'absolute', top: 12, right: 12,
                    padding: '3px 10px', background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(10px)', borderRadius: 9999,
                    fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)',
                  }}>{p.year}</span>
                  {p.metrics && (
                    <span style={{
                      position: 'absolute', bottom: 12, left: 12,
                      padding: '3px 10px', background: `${p.color}20`,
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 9999, fontSize: '0.7rem',
                      color: 'rgba(255,255,255,0.8)',
                    }}>{p.metrics}</span>
                  )}
                </div>

                <div style={{ padding: isMobile ? 16 : 24 }}>
                  <h3 style={{
                    fontSize: isMobile ? '1.05rem' : '1.25rem',
                    fontWeight: 700, color: 'white',
                    marginBottom: 8, fontFamily: 'Space Grotesk',
                  }}>{p.title}</h3>
                  <p style={{
                    color: '#A0A0B8',
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                    lineHeight: 1.6, marginBottom: 12,
                  }}>{p.description}</p>
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: 6,
                    marginBottom: 16,
                  }}>
                    {p.tech.map((t) => (
                      <span key={t} style={{
                        fontSize: '0.65rem', padding: '3px 10px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 9999, color: 'rgba(255,255,255,0.5)',
                      }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <a href={p.liveUrl} style={{
                      color: '#6C63FF', fontSize: '0.8rem',
                      textDecoration: 'none',
                    }}>Live Demo →</a>
                    <a href={p.repoUrl} style={{
                      color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem',
                      textDecoration: 'none',
                    }}>Source Code →</a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// EXPERIENCE SECTION — Mobile Fixed
// ═══════════════════════════════════════════════════════════

function ExperienceSection() {
  const isMobile = useIsMobile()

  return (
    <section id="experience" style={{
      minHeight: isMobile ? 'auto' : '100vh',
      padding: isMobile ? '64px 20px' : '96px 24px',
      background: '#0A0A0F',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <ScrollReveal direction="down" distance={30}>
          <SectionHeader eyebrow="Career" title="Experience" />
        </ScrollReveal>

        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 1,
            background: 'linear-gradient(to bottom, transparent, rgba(108,99,255,0.2), transparent)',
          }} />

          {experiences.map((exp, index) => (
            <ScrollReveal key={exp.id} direction="up" delay={index * 150} distance={40} duration={1000}>
              <div style={{
                position: 'relative',
                paddingLeft: isMobile ? 24 : 32,
                marginBottom: isMobile ? 32 : 48,
              }}>
                <div style={{
                  position: 'absolute', left: -5, top: 4,
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#6C63FF',
                  boxShadow: '0 0 10px rgba(108,99,255,0.3)',
                }} />

                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: isMobile ? 12 : 16,
                  padding: isMobile ? 16 : 24,
                }}>
                  <span style={{
                    color: '#6C63FF', fontSize: '0.7rem',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    fontFamily: 'JetBrains Mono',
                  }}>{exp.duration}</span>
                  <h3 style={{
                    fontSize: isMobile ? '1.05rem' : '1.25rem',
                    fontWeight: 700, color: 'white', marginTop: 8,
                    fontFamily: 'Space Grotesk',
                  }}>{exp.role}</h3>
                  <p style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.8rem', marginTop: 4,
                  }}>{exp.company}</p>
                  <p style={{
                    color: '#A0A0B8',
                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                    marginTop: 12, lineHeight: 1.6,
                  }}>{exp.description}</p>
                  <ul style={{ marginTop: 12, listStyle: 'none', padding: 0 }}>
                    {exp.highlights.map((h, i) => (
                      <li key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 8,
                        fontSize: isMobile ? '0.78rem' : '0.85rem',
                        color: 'rgba(255,255,255,0.5)', marginBottom: 5,
                      }}>
                        <span style={{ color: '#6C63FF', marginTop: 2, flexShrink: 0 }}>▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                    {exp.tech.map((t) => (
                      <span key={t} style={{
                        fontSize: '0.6rem', padding: '3px 8px',
                        background: 'rgba(108,99,255,0.1)',
                        border: '1px solid rgba(108,99,255,0.2)',
                        borderRadius: 9999, color: 'rgba(108,99,255,0.8)',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// ACHIEVEMENTS SECTION — Mobile Fixed
// ═══════════════════════════════════════════════════════════

function AchievementsSection() {
  const isMobile = useIsMobile()

  return (
    <section id="achievements" style={{
      padding: isMobile ? '64px 20px' : '96px 24px',
      background: '#0A0A0F',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <ScrollReveal direction="down" distance={30}>
          <SectionHeader eyebrow="Recognition" title="Achievements" />
        </ScrollReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 12 : 16,
        }}>
          {achievements.map((item, index) => (
            <ScrollReveal key={item.id} direction="scale" delay={index * 80} distance={30} duration={700}>
              <div style={{
                padding: isMobile ? 16 : 24,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: isMobile ? 12 : 16,
                display: 'flex', alignItems: 'flex-start', gap: 14,
              }}>
                <div style={{
                  width: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: isMobile ? '1.2rem' : '1.5rem',
                  flexShrink: 0,
                }}>{item.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    fontWeight: 600, color: 'white',
                  }}>{item.title}</h3>
                  <p style={{
                    fontSize: isMobile ? '0.7rem' : '0.8rem',
                    color: 'rgba(255,255,255,0.4)', marginTop: 3,
                  }}>{item.issuer}</p>
                  <span style={{
                    display: 'inline-block', marginTop: 6,
                    fontSize: '0.6rem', padding: '2px 7px',
                    background: 'rgba(108,99,255,0.1)', color: '#6C63FF',
                    borderRadius: 9999, textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>{item.date} · {item.type}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// CONTACT SECTION — Mobile Fixed
// ═══════════════════════════════════════════════════════════

function ContactSection() {
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSubmitting(false); setIsSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setIsSubmitted(false), 5000)
  }
  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const inputStyle = {
    width: '100%', padding: isMobile ? '12px 16px' : '14px 20px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
    color: 'white', fontSize: isMobile ? '0.85rem' : '0.95rem',
    outline: 'none', transition: 'border-color 0.3s',
    fontFamily: 'Inter, sans-serif',
  }

  return (
    <section id="contact" style={{
      minHeight: isMobile ? 'auto' : '100vh',
      display: 'flex', alignItems: 'center',
      padding: isMobile ? '64px 20px' : '96px 24px',
      background: '#0A0A0F',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <ScrollReveal direction="down" distance={30}>
          <SectionHeader eyebrow="Contact" title="Let's Build Something Together" />
        </ScrollReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 32 : 48,
        }}>
          <ScrollReveal direction={isMobile ? 'up' : 'left'} distance={isMobile ? 30 : 60} duration={1000}>
            <div>
              {isSubmitted ? (
                <div style={{
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.2)',
                  borderRadius: 16, padding: isMobile ? 24 : 32, textAlign: 'center',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>✅</div>
                  <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700 }}>Message Sent!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8, fontSize: '0.85rem' }}>I'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Name', name: 'name', type: 'text', placeholder: 'Enter your Name' },
                    { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your mail' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label style={{
                        display: 'block', color: 'rgba(255,255,255,0.4)',
                        fontSize: '0.65rem', textTransform: 'uppercase',
                        letterSpacing: '0.1em', marginBottom: 6,
                      }}>{field.label}</label>
                      <input
                        type={field.type} name={field.name}
                        value={formData[field.name]} onChange={handleChange}
                        required placeholder={field.placeholder}
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = 'rgba(108,99,255,0.5)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{
                      display: 'block', color: 'rgba(255,255,255,0.4)',
                      fontSize: '0.65rem', textTransform: 'uppercase',
                      letterSpacing: '0.1em', marginBottom: 6,
                    }}>Message</label>
                    <textarea
                      name="message" value={formData.message} onChange={handleChange}
                      required rows={isMobile ? 4 : 5}
                      placeholder="Tell me about your project..."
                      style={{ ...inputStyle, resize: 'none' }}
                      onFocus={(e) => e.target.style.borderColor = 'rgba(108,99,255,0.5)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} style={{
                    width: '100%', padding: isMobile ? 12 : 14,
                    background: '#6C63FF', color: 'white', border: 'none',
                    borderRadius: 12, fontWeight: 600,
                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                    cursor: isSubmitting ? 'wait' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: 'all 0.3s',
                  }}>
                    {isSubmitting ? '⏳ Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal direction={isMobile ? 'up' : 'right'} distance={isMobile ? 30 : 60} duration={1000} delay={isMobile ? 100 : 300}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
              <InfoCard icon="📧" label="Email" value={personal.email} isMobile={isMobile} />
              <InfoCard icon="📍" label="Location" value={personal.location} isMobile={isMobile} />

              <div style={{ marginTop: 12 }}>
                <p style={{
                  color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
                }}>Find me online</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['GitHub', 'LinkedIn', 'Twitter'].map((name) => (
                    <a key={name} href="#" style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                      fontSize: '0.7rem', transition: 'all 0.3s',
                    }}>{name[0]}</a>
                  ))}
                </div>
              </div>

              <a href={personal.resumeUrl} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: isMobile ? 12 : 14,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 12, color: 'white', textDecoration: 'none',
                fontWeight: 600, fontSize: isMobile ? '0.8rem' : '0.9rem',
                marginTop: 8,
              }}>
                📄 Download Resume
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

function InfoCard({ icon, label, value, isMobile }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: isMobile ? 14 : 20,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: 'rgba(108,99,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <p style={{
          color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem',
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>{label}</p>
        <p style={{
          color: 'white', fontSize: isMobile ? '0.8rem' : '0.9rem',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{value}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// FOOTER — Mobile Fixed
// ═══════════════════════════════════════════════════════════

function Footer() {
  const isMobile = useIsMobile()

  return (
    <ScrollReveal direction="up" distance={20} duration={600}>
      <footer style={{
        padding: isMobile ? '24px 20px' : '32px 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: '#0A0A0F',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: isMobile ? 12 : 16,
          textAlign: isMobile ? 'center' : 'left',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: isMobile ? '0.75rem' : '0.85rem' }}>
            © {new Date().getFullYear()} {personal.name}
          </p>
          <div style={{ display: 'flex', gap: isMobile ? 16 : 24 }}>
            {['GitHub', 'LinkedIn', 'Twitter'].map((name) => (
              <a key={name} href="#" style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: isMobile ? '0.75rem' : '0.85rem',
                textDecoration: 'none',
              }}>{name}</a>
            ))}
          </div>
        </div>
      </footer>
    </ScrollReveal>
  )
}

// ═══════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════

function SectionHeader({ eyebrow, title }) {
  const isMobile = useIsMobile()

  return (
    <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 64 }}>
      {eyebrow && (
        <p style={{
          color: '#6C63FF',
          fontSize: isMobile ? '0.7rem' : '0.8rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase', marginBottom: 10, fontWeight: 500,
        }}>{eyebrow}</p>
      )}
      <h2 style={{
        fontSize: isMobile ? 'clamp(1.5rem, 6vw, 2rem)' : 'clamp(1.8rem, 4vw, 3rem)',
        fontWeight: 700, color: 'white',
        fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.2,
        padding: isMobile ? '0 10px' : '0',
      }}>{title}</h2>
    </div>
  )
}

function SectionDivider() {
  return (
    <ScrollReveal direction="scale" distance={0} duration={600}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
        <div style={{
          width: 1, height: 48, opacity: 0.2,
          background: 'linear-gradient(to bottom, transparent, #6C63FF, transparent)',
        }} />
      </div>
    </ScrollReveal>
  )
}

// ═══════════════════════════════════════════════════════════
// GLOBAL CSS
// ═══════════════════════════════════════════════════════════

const globalStyle = document.createElement('style')
globalStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@200&display=swap');

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-10px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  @keyframes scrollDot {
    0% { transform: translateY(0); opacity: 1; }
    50% { transform: translateY(8px); opacity: 0.3; }
    100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes chipPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.4); }
  }
  html {
    scroll-behavior: smooth;
  }
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    -webkit-text-size-adjust: 100%;
  }
  input, textarea, button {
    font-family: inherit;
  }
  a {
    -webkit-tap-highlight-color: transparent;
  }
`
document.head.appendChild(globalStyle)

// Also add the font link to head for more reliable loading
const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@200&display=swap'
fontLink.rel = 'stylesheet'
document.head.appendChild(fontLink)

export default App