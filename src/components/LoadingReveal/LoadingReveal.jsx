// src/components/LoadingReveal/LoadingReveal.jsx

import { useState, useEffect, useRef } from 'react'

function LoadingReveal({ onComplete }) {
  const [phase, setPhase] = useState('initial')
  const [progress, setProgress] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  const startTimeRef = useRef(null)
  const rafRef = useRef(null)
  const canvasRef = useRef(null)
  const particlesRef = useRef([])

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth * 2
      canvas.height = window.innerHeight * 2
      ctx.scale(2, 2)
    }
    resize()
    window.addEventListener('resize', resize)

    let particles = particlesRef.current
    let animId

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2)
      particles = particles.filter(p => p.life > 0)
      particlesRef.current = particles

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= p.friction
        p.vy *= p.friction
        p.life -= p.decay
        p.rotation += p.rotSpeed
        p.scale *= p.shrink

        const alpha = Math.pow(Math.max(0, p.life), 2)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = alpha * p.opacity

        if (p.shape === 'glyph') {
          ctx.font = `${p.weight} ${p.size * p.scale}px "Cormorant", serif`
          ctx.fillStyle = p.color
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowBlur = p.glow * alpha
          ctx.shadowColor = p.color
          ctx.fillText(p.char, 0, 0)
        } else if (p.shape === 'shard') {
          ctx.fillStyle = p.color
          ctx.shadowBlur = p.glow * alpha
          ctx.shadowColor = p.color
          ctx.beginPath()
          ctx.moveTo(0, -p.size * p.scale)
          ctx.lineTo(p.size * p.scale * 0.4, p.size * p.scale * 0.6)
          ctx.lineTo(-p.size * p.scale * 0.3, p.size * p.scale * 0.4)
          ctx.closePath()
          ctx.fill()
        } else if (p.shape === 'dot') {
          ctx.fillStyle = p.color
          ctx.shadowBlur = p.glow * alpha
          ctx.shadowColor = p.color
          ctx.beginPath()
          ctx.arc(0, 0, p.size * p.scale, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'ring') {
          ctx.strokeStyle = p.color
          ctx.lineWidth = 0.5 * p.scale
          ctx.shadowBlur = p.glow * alpha
          ctx.shadowColor = p.color
          ctx.beginPath()
          ctx.arc(0, 0, p.size * p.scale, 0, Math.PI * 2)
          ctx.stroke()
        } else if (p.shape === 'streak') {
          ctx.strokeStyle = p.color
          ctx.lineWidth = p.size * p.scale * 0.15
          ctx.lineCap = 'round'
          ctx.shadowBlur = p.glow * alpha
          ctx.shadowColor = p.color
          const len = p.size * p.scale * 2
          ctx.beginPath()
          ctx.moveTo(-len / 2, 0)
          ctx.lineTo(len / 2, 0)
          ctx.stroke()
        }

        ctx.restore()
      })

      ctx.globalAlpha = 0.03
      ctx.strokeStyle = '#381932'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < Math.min(particles.length, i + 10); j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx.globalAlpha = 0.02 * (1 - dist / 80) * Math.min(particles[i].life, particles[j].life)
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Spawn particles on reveal
  useEffect(() => {
    if (phase === 'reveal') {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const chars = 'AJAJajAJमेराहौसला'.split('')
      const shapes = ['glyph', 'shard', 'dot', 'ring', 'streak']

      for (let i = 0; i < 200; i++) {
        const angle = (Math.PI * 2 * i) / 200 + (Math.random() - 0.5) * 0.8
        const speed = 0.8 + Math.random() * 8
        const shape = shapes[Math.floor(Math.random() * shapes.length)]
        const isGlyph = shape === 'glyph'

        particlesRef.current.push({
          x: cx + (Math.random() - 0.5) * 140,
          y: cy + (Math.random() - 0.5) * 100,
          vx: Math.cos(angle) * speed * (0.3 + Math.random()),
          vy: Math.sin(angle) * speed * (0.3 + Math.random()) - 2,
          gravity: 0.012 + Math.random() * 0.035,
          friction: 0.985 + Math.random() * 0.01,
          size: isGlyph ? 6 + Math.random() * 24 : 1 + Math.random() * 5,
          scale: 1,
          shrink: 0.992 + Math.random() * 0.005,
          life: 0.4 + Math.random() * 0.4,
          decay: 0.006 + Math.random() * 0.01,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.15,
          opacity: 0.15 + Math.random() * 0.6,
          color: `rgba(56, 25, 50, ${0.15 + Math.random() * 0.5})`,
          glow: 5 + Math.random() * 20,
          shape,
          char: chars[Math.floor(Math.random() * chars.length)],
          weight: Math.random() > 0.5 ? '300' : '600',
        })
      }

      setTimeout(() => {
        for (let i = 0; i < 50; i++) {
          const angle = (Math.PI * 2 * i) / 50 + Math.random()
          const speed = 1.5 + Math.random() * 4
          particlesRef.current.push({
            x: cx + (Math.random() - 0.5) * 60,
            y: cy + (Math.random() - 0.5) * 40,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            gravity: 0.015 + Math.random() * 0.03,
            friction: 0.988,
            size: 2 + Math.random() * 8,
            scale: 1,
            shrink: 0.994,
            life: 0.4 + Math.random() * 0.3,
            decay: 0.008 + Math.random() * 0.008,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.08,
            opacity: 0.1 + Math.random() * 0.3,
            color: `rgba(56, 25, 50, ${0.1 + Math.random() * 0.3})`,
            glow: 10 + Math.random() * 25,
            shape: Math.random() > 0.5 ? 'ring' : 'dot',
            char: '',
            weight: '300',
          })
        }
      }, 80)
    }
  }, [phase])

  // Mouse tracking
  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  // Phase timeline — total under 3 seconds
  // 100ms init + 1200ms loading + 700ms reveal + 800ms exit = 2800ms
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const initDelay = setTimeout(() => setPhase('loading'), 100)
    const timeline = { loading: 1200, reveal: 700, exit: 800 }

    startTimeRef.current = Date.now()

    const animateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current
      const p = Math.min(elapsed / (timeline.loading + 100), 1)
      setProgress(p)
      if (p < 1) rafRef.current = requestAnimationFrame(animateProgress)
    }

    rafRef.current = requestAnimationFrame(animateProgress)

    const t1 = setTimeout(() => setPhase('reveal'), 100 + timeline.loading)
    const t2 = setTimeout(() => setPhase('exit'), 100 + timeline.loading + timeline.reveal)
    const t3 = setTimeout(() => {
      setPhase('done')
      document.body.style.overflow = originalOverflow || 'auto'
      onComplete?.()
    }, 100 + timeline.loading + timeline.reveal + timeline.exit)

    return () => {
      clearTimeout(initDelay)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.body.style.overflow = originalOverflow || 'auto'
    }
  }, [onComplete])

  if (phase === 'done') return null

  const isRevealing = phase === 'reveal' || phase === 'exit'
  const isExiting = phase === 'exit'
  const isLoading = phase === 'loading'

  const eased = 1 - Math.pow(1 - progress, 5)
  const parallaxX = (mousePos.x - 0.5) * 12
  const parallaxY = (mousePos.y - 0.5) * 8

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

        @keyframes grainShift {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -3%); }
          20% { transform: translate(3%, 1%); }
          30% { transform: translate(-1%, 3%); }
          40% { transform: translate(2%, -2%); }
          50% { transform: translate(-3%, 1%); }
          60% { transform: translate(1%, -3%); }
          70% { transform: translate(-2%, 2%); }
          80% { transform: translate(3%, -1%); }
          90% { transform: translate(-1%, -2%); }
        }

        @keyframes letterRise {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.92);
            filter: blur(10px);
          }
          50% {
            opacity: 0.7;
            filter: blur(2px);
          }
          80% {
            transform: translateY(-5px) scale(1.01);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes letterRiseJ {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.92);
            filter: blur(10px);
          }
          50% {
            opacity: 0.7;
            filter: blur(2px);
          }
          80% {
            transform: translateY(-5px) scale(1.01);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes implode {
          0% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
          25% {
            transform: scale(1.08);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.85);
            filter: blur(2px);
          }
          100% {
            opacity: 0;
            transform: scale(0);
            filter: blur(16px);
          }
        }

        @keyframes radialDissolve {
          0% {
            clip-path: circle(150% at 50% 50%);
            opacity: 1;
            filter: blur(0px);
          }
          50% {
            opacity: 0.8;
            filter: blur(1px);
          }
          100% {
            clip-path: circle(0% at 50% 50%);
            opacity: 0;
            filter: blur(6px);
          }
        }

        @keyframes curtainLeft {
          0% {
            transform: translateX(0) scaleX(1);
            opacity: 1;
          }
          100% {
            transform: translateX(-105%) scaleX(0.8);
            opacity: 0;
          }
        }

        @keyframes curtainRight {
          0% {
            transform: translateX(0) scaleX(1);
            opacity: 1;
          }
          100% {
            transform: translateX(105%) scaleX(0.8);
            opacity: 0;
          }
        }

        @keyframes scanLine {
          0% { top: -2px; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        @keyframes lineExpand {
          0% { width: 0; opacity: 0; }
          40% { opacity: 1; }
          100% { width: 100%; opacity: 1; }
        }

        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(12px); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        @keyframes cornerDraw {
          0% { stroke-dashoffset: 100; opacity: 0; }
          40% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.15; }
        }

        @keyframes hindiInitial {
          0% {
            opacity: 0;
            filter: blur(6px);
          }
          100% {
            opacity: 0.4;
            filter: blur(0);
          }
        }

        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 4px rgba(56,25,50,0.1); }
          50% { box-shadow: 0 0 12px rgba(56,25,50,0.2); }
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }

        @keyframes exitVignette {
          0% {
            box-shadow: inset 0 0 0px 0px rgba(56,25,50,0);
          }
          40% {
            box-shadow: inset 0 0 100px 50px rgba(56,25,50,0.06);
          }
          100% {
            box-shadow: inset 0 0 0px 0px rgba(56,25,50,0);
          }
        }
      `}</style>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 100000,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 99999,
          pointerEvents: isExiting ? 'none' : 'auto',
        }}
      >
        {/* Background panels — curtain split exit */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50.5%',
            height: '100%',
            background: '#FFF3E6',
            zIndex: 1,
            transformOrigin: 'left center',
            animation: isExiting
              ? 'curtainLeft 0.8s cubic-bezier(0.7, 0, 0.2, 1) forwards'
              : 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50.5%',
            height: '100%',
            background: '#FFF3E6',
            zIndex: 1,
            transformOrigin: 'right center',
            animation: isExiting
              ? 'curtainRight 0.8s cubic-bezier(0.7, 0, 0.2, 1) 0.04s forwards'
              : 'none',
          }}
        />

        {/* Exit vignette flash */}
        {isExiting && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              pointerEvents: 'none',
              animation: 'exitVignette 0.8s ease forwards',
            }}
          />
        )}

        {/* Film grain */}
        <div
          style={{
            position: 'absolute',
            inset: '-50%',
            zIndex: 3,
            opacity: 0.018,
            pointerEvents: 'none',
            mixBlendMode: 'multiply',
            animation: 'grainShift 0.5s steps(1) infinite',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Scan line */}
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, rgba(56,25,50,0.06) 20%, rgba(56,25,50,0.1) 50%, rgba(56,25,50,0.06) 80%, transparent 100%)',
              zIndex: 4,
              animation: 'scanLine 1.2s ease-in-out infinite',
            }}
          />
        )}

        {/* CENTER CONTENT */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isLoading
              ? `translate(${parallaxX}px, ${parallaxY}px)`
              : 'none',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
            animation: isExiting
              ? 'radialDissolve 0.7s cubic-bezier(0.6, 0, 0.2, 1) forwards'
              : 'none',
          }}
        >
          {/* Hindi tagline — visible from the start */}
          <div
            style={{
              marginBottom: 'clamp(18px, 3vw, 32px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: isRevealing && !isExiting ? 0 : undefined,
              transition: isRevealing ? 'opacity 0.2s ease' : 'none',
            }}
          >
            <span
              style={{
                fontFamily: '"Cormorant", Georgia, serif',
                fontWeight: 400,
                fontSize: 'clamp(0.7rem, 1.4vw, 0.95rem)',
                color: '#381932',
                letterSpacing: '0.08em',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                opacity: phase === 'initial' ? 0 : undefined,
                animation: phase !== 'initial'
                  ? 'hindiInitial 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                  : 'none',
              }}
            >
              मेरा हौसला मेरी जीवन रेखा से गहरा है
            </span>
          </div>

          {/* Main letter group */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              position: 'relative',
              perspective: '1000px',
              animation: isLoading
                ? 'gentleFloat 2.5s ease-in-out infinite 0.8s'
                : 'none',
            }}
          >
            {/* A */}
            <span
              style={{
                fontSize: 'clamp(7rem, 22vw, 18rem)',
                fontFamily: '"Cormorant", Georgia, serif',
                fontWeight: 300,
                lineHeight: 0.8,
                display: 'inline-block',
                color: '#381932',
                letterSpacing: '-0.03em',
                transformOrigin: 'center center',
                opacity: phase === 'initial' ? 0 : undefined,
                animation: isLoading
                  ? 'letterRise 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                  : isRevealing && !isExiting
                    ? 'implode 0.5s cubic-bezier(0.4, 0, 0, 1) forwards'
                    : 'none',
              }}
            >
              A
            </span>

            {/* J */}
            <span
              style={{
                fontSize: 'clamp(7rem, 22vw, 18rem)',
                fontFamily: '"Cormorant", Georgia, serif',
                fontWeight: 300,
                lineHeight: 0.8,
                display: 'inline-block',
                color: '#381932',
                letterSpacing: '-0.03em',
                transformOrigin: 'center center',
                marginLeft: 'clamp(-8px, -1vw, -3px)',
                opacity: phase === 'initial' ? 0 : undefined,
                animation: isLoading
                  ? 'letterRiseJ 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both'
                  : isRevealing && !isExiting
                    ? 'implode 0.5s cubic-bezier(0.4, 0, 0, 1) 0.05s forwards'
                    : 'none',
              }}
            >
              J
            </span>
          </div>

          {/* Horizontal rule */}
          <div
            style={{
              width: 'clamp(50px, 10vw, 100px)',
              height: 0,
              borderTop: '1px solid rgba(56,25,50,0.12)',
              marginTop: 'clamp(16px, 3vw, 28px)',
              opacity: isRevealing || phase === 'initial' ? 0 : 1,
              transition: 'opacity 0.2s ease',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '100%',
                height: 1,
                animation: isLoading
                  ? 'lineExpand 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both'
                  : 'none',
              }}
            />
          </div>

          {/* Progress bar */}
          <div
            style={{
              marginTop: 'clamp(18px, 3vw, 32px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              opacity: isLoading ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <div
              style={{
                width: 'clamp(60px, 10vw, 120px)',
                height: 1,
                background: 'rgba(56,25,50,0.05)',
                borderRadius: 1,
                overflow: 'hidden',
                animation: isLoading
                  ? 'fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both'
                  : 'none',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${eased * 100}%`,
                  background: '#381932',
                  borderRadius: 1,
                  transition: 'width 0.1s ease-out',
                  animation: isLoading
                    ? 'progressGlow 1s ease-in-out infinite 0.8s'
                    : 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Corner brackets */}
        {isLoading && (
          <>
            <svg width="24" height="24" style={{ position: 'absolute', top: 'clamp(20px, 4vw, 40px)', left: 'clamp(20px, 4vw, 40px)', zIndex: 5 }}>
              <path d="M 0 24 L 0 0 L 24 0" fill="none" stroke="#381932" strokeWidth="1" strokeDasharray="100"
                style={{ animation: 'cornerDraw 0.5s ease 0.3s both, breathe 2s ease-in-out infinite 0.8s' }} />
            </svg>
            <svg width="24" height="24" style={{ position: 'absolute', top: 'clamp(20px, 4vw, 40px)', right: 'clamp(20px, 4vw, 40px)', zIndex: 5 }}>
              <path d="M 0 0 L 24 0 L 24 24" fill="none" stroke="#381932" strokeWidth="1" strokeDasharray="100"
                style={{ animation: 'cornerDraw 0.5s ease 0.4s both, breathe 2s ease-in-out infinite 0.9s' }} />
            </svg>
            <svg width="24" height="24" style={{ position: 'absolute', bottom: 'clamp(20px, 4vw, 40px)', left: 'clamp(20px, 4vw, 40px)', zIndex: 5 }}>
              <path d="M 0 0 L 0 24 L 24 24" fill="none" stroke="#381932" strokeWidth="1" strokeDasharray="100"
                style={{ animation: 'cornerDraw 0.5s ease 0.5s both, breathe 2s ease-in-out infinite 1s' }} />
            </svg>
            <svg width="24" height="24" style={{ position: 'absolute', bottom: 'clamp(20px, 4vw, 40px)', right: 'clamp(20px, 4vw, 40px)', zIndex: 5 }}>
              <path d="M 24 0 L 24 24 L 0 24" fill="none" stroke="#381932" strokeWidth="1" strokeDasharray="100"
                style={{ animation: 'cornerDraw 0.5s ease 0.6s both, breathe 2s ease-in-out infinite 1.1s' }} />
            </svg>
          </>
        )}

        {/* Year */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            bottom: 'clamp(20px, 4vw, 40px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
            animation: 'fadeSlideUp 0.4s ease 0.5s both',
          }}>
            <span style={{
              fontFamily: '"Cormorant", Georgia, serif',
              fontWeight: 300,
              fontSize: '0.5rem',
              color: '#381932',
              opacity: 0.15,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}>
              {new Date().getFullYear()}
            </span>
          </div>
        )}
      </div>
    </>
  )
}

export default LoadingReveal