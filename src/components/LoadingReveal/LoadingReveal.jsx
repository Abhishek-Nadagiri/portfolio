// src/components/LoadingReveal/LoadingReveal.jsx

import { useState, useEffect, useRef } from 'react'

// ═══════════════════════════════════════════════════════════
// AJ LOADING REVEAL OVERLAY
// Full-screen overlay with "AJ" letters that acts as a mask
// Animation: pulse → glow → cutout reveal → slide away
// ═══════════════════════════════════════════════════════════

function LoadingReveal({ onComplete, duration = 4000 }) {
  const [phase, setPhase] = useState('loading')
  // Phases: 'loading' → 'cutout' → 'split' → 'done'
  const [progress, setProgress] = useState(0)
  const overlayRef = useRef(null)
  const startTimeRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    // Prevent scroll during animation
    document.body.style.overflow = 'hidden'

    const timeline = {
      loading: 1800,   // AJ pulses and glows
      cutout: 1200,    // Letters become transparent cutouts
      split: 800,      // Overlay splits and slides away
    }

    // Phase 1: Loading animation with progress
    startTimeRef.current = Date.now()
    const animateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current
      const p = Math.min(elapsed / timeline.loading, 1)
      setProgress(p)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(animateProgress)
      }
    }
    rafRef.current = requestAnimationFrame(animateProgress)

    // Phase transitions
    const t1 = setTimeout(() => setPhase('cutout'), timeline.loading)
    const t2 = setTimeout(() => setPhase('split'), timeline.loading + timeline.cutout)
    const t3 = setTimeout(() => {
      setPhase('done')
      document.body.style.overflow = ''
      onComplete?.()
    }, timeline.loading + timeline.cutout + timeline.split)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.body.style.overflow = ''
    }
  }, [onComplete])

  if (phase === 'done') return null

  const isCutout = phase === 'cutout' || phase === 'split'
  const isSplit = phase === 'split'

  // Eased progress for smooth loading bar
  const easedProgress = 1 - Math.pow(1 - progress, 3)

  return (
    <>
      {/* Inject keyframes */}
      <style>{`
        @keyframes ajPulse {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(108,99,255,0.3), 0 0 60px rgba(108,99,255,0.1);
            transform: scale(1);
          }
          50% { 
            text-shadow: 0 0 40px rgba(108,99,255,0.6), 0 0 100px rgba(108,99,255,0.3), 0 0 150px rgba(108,99,255,0.1);
            transform: scale(1.02);
          }
        }
        @keyframes ajGlow {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes loadingShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes letterFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes particleDrift {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
        @keyframes ringExpand {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
        @keyframes cutoutReveal {
          0% { 
            -webkit-text-fill-color: white;
            -webkit-background-clip: unset;
            background-clip: unset;
          }
          100% { 
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
          }
        }
        @keyframes splitLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes splitRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes overlayFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Main overlay container */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: isSplit ? 'none' : 'all',
          animation: isSplit ? 'overlayFade 0.8s ease-out forwards' : 'none',
        }}
      >
        {/* Left half */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: '#06060B',
          zIndex: 1,
          animation: isSplit ? 'splitLeft 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards' : 'none',
        }} />

        {/* Right half */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: '#06060B',
          zIndex: 1,
          animation: isSplit ? 'splitRight 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards' : 'none',
        }} />

        {/* Ambient background glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          opacity: phase === 'loading' ? 1 : 0,
          transition: 'opacity 0.6s ease',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* Expanding rings during loading */}
        {phase === 'loading' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 2,
            pointerEvents: 'none',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: '1px solid rgba(108,99,255,0.15)',
                animation: `ringExpand 3s ease-out infinite`,
                animationDelay: `${i * 1}s`,
              }} />
            ))}
          </div>
        )}

        {/* Floating particles during loading */}
        {phase === 'loading' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}>
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * 360
              const dx = Math.cos(angle * Math.PI / 180) * (80 + Math.random() * 60)
              const dy = Math.sin(angle * Math.PI / 180) * (80 + Math.random() * 60)
              return (
                <div key={i} style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 3,
                  height: 3,
                  borderRadius: '50%',
                  background: i % 3 === 0 ? '#6C63FF' : 'rgba(255,255,255,0.3)',
                  '--dx': `${dx}px`,
                  '--dy': `${dy}px`,
                  animation: `particleDrift ${2 + Math.random() * 2}s ease-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }} />
              )
            })}
          </div>
        )}

        {/* Center content — AJ Letters */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          animation: isSplit ? 'overlayFade 0.4s ease-out forwards' : 'none',
        }}>
          {/* The AJ text */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Glow behind letters */}
            <div style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(108,99,255,0.2), transparent)',
              filter: 'blur(40px)',
              opacity: phase === 'loading' ? (0.3 + easedProgress * 0.7) : 0,
              transition: 'opacity 0.8s ease',
              pointerEvents: 'none',
            }} />

            {/* A letter */}
            <span style={{
              fontSize: 'clamp(5rem, 15vw, 12rem)',
              fontWeight: 200,
              fontFamily: '"Noto Serif Display", serif',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              position: 'relative',
              color: isCutout ? 'transparent' : 'white',
              // When cutout: use background-clip to make text transparent
              // revealing what's behind the overlay
              ...(isCutout ? {
                background: 'transparent',
                WebkitTextStroke: '1px rgba(108,99,255,0.3)',
              } : {}),
              animation: phase === 'loading'
                ? 'ajPulse 2s ease-in-out infinite, letterFloat 3s ease-in-out infinite'
                : 'none',
              animationDelay: '0s, 0s',
              transition: 'color 0.8s ease, -webkit-text-stroke 0.8s ease',
              textShadow: phase === 'loading'
                ? `0 0 30px rgba(108,99,255,${0.2 + easedProgress * 0.4})`
                : 'none',
            }}>
              A
            </span>

            {/* J letter */}
            <span style={{
              fontSize: 'clamp(5rem, 15vw, 12rem)',
              fontWeight: 200,
              fontFamily: '"Noto Serif Display", serif',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              position: 'relative',
              color: isCutout ? 'transparent' : 'white',
              ...(isCutout ? {
                background: 'transparent',
                WebkitTextStroke: '1px rgba(108,99,255,0.3)',
              } : {}),
              animation: phase === 'loading'
                ? 'ajPulse 2s ease-in-out infinite, letterFloat 3s ease-in-out infinite'
                : 'none',
              animationDelay: '0.15s, 0.5s',
              transition: 'color 0.8s ease, -webkit-text-stroke 0.8s ease',
              textShadow: phase === 'loading'
                ? `0 0 30px rgba(108,99,255,${0.2 + easedProgress * 0.4})`
                : 'none',
            }}>
              J
            </span>

            {/* Dot between letters during loading */}
            <div style={{
              position: 'absolute',
              bottom: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#6C63FF',
              boxShadow: '0 0 12px rgba(108,99,255,0.6)',
              opacity: phase === 'loading' ? 1 : 0,
              transition: 'opacity 0.4s ease',
              animation: phase === 'loading' ? 'ajGlow 1.5s ease-in-out infinite' : 'none',
            }} />
          </div>

          {/* Loading bar */}
          <div style={{
            width: 'clamp(120px, 20vw, 200px)',
            height: 2,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 1,
            overflow: 'hidden',
            opacity: phase === 'loading' ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}>
            {/* Progress fill */}
            <div style={{
              height: '100%',
              width: `${easedProgress * 100}%`,
              background: 'linear-gradient(90deg, #6C63FF, #8B83FF)',
              borderRadius: 1,
              position: 'relative',
              transition: 'width 0.1s linear',
            }}>
              {/* Shimmer effect on the bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'loadingShimmer 1.5s ease-in-out infinite',
              }} />
            </div>
          </div>

          {/* Loading text */}
          <p style={{
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: 'Space Grotesk, sans-serif',
            opacity: phase === 'loading' ? 1 : 0,
            transition: 'opacity 0.4s ease',
            margin: 0,
          }}>
            {progress < 0.3 ? 'Initializing' : progress < 0.7 ? 'Loading assets' : 'Almost ready'}
          </p>
        </div>

        {/* Corner decorations */}
        {phase === 'loading' && (
          <>
            {/* Top-left */}
            <div style={{
              position: 'absolute',
              top: 32,
              left: 32,
              zIndex: 5,
              opacity: 0.3,
            }}>
              <div style={{
                width: 24,
                height: 1,
                background: 'rgba(108,99,255,0.4)',
                marginBottom: 4,
              }} />
              <div style={{
                width: 1,
                height: 24,
                background: 'rgba(108,99,255,0.4)',
              }} />
            </div>

            {/* Bottom-right */}
            <div style={{
              position: 'absolute',
              bottom: 32,
              right: 32,
              zIndex: 5,
              opacity: 0.3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}>
              <div style={{
                width: 1,
                height: 24,
                background: 'rgba(108,99,255,0.4)',
                marginBottom: 4,
              }} />
              <div style={{
                width: 24,
                height: 1,
                background: 'rgba(108,99,255,0.4)',
              }} />
            </div>

            {/* Version / Year label */}
            <div style={{
              position: 'absolute',
              bottom: 32,
              left: 32,
              zIndex: 5,
            }}>
              <p style={{
                fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.15)',
                letterSpacing: '0.15em',
                fontFamily: 'JetBrains Mono, monospace',
                margin: 0,
              }}>
                © {new Date().getFullYear()}
              </p>
            </div>

            {/* Portfolio label */}
            <div style={{
              position: 'absolute',
              bottom: 32,
              right: 64,
              zIndex: 5,
            }}>
              <p style={{
                fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.15)',
                letterSpacing: '0.15em',
                fontFamily: 'JetBrains Mono, monospace',
                margin: 0,
                textTransform: 'uppercase',
              }}>
                Portfolio
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default LoadingReveal