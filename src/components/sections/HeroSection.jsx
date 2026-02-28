// src/components/sections/HeroSection.jsx

import { useEffect, useState } from 'react'
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient'
import { personal } from '../../data/personal'
import { useParallax } from '../../hooks/useParallax'
import Button from '../ui/Button'

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { scrollY } = useParallax()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* ── Layer 0: Shader Gradient Background ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.4}px)`,
        }}
      >
        <ShaderGradientCanvas
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '120%',
            pointerEvents: 'none',
          }}
        >
          <ShaderGradient
            animate="on"
            axesHelper="off"
            brightness={1.2}
            cAzimuthAngle={180}
            cDistance={2.81}
            cPolarAngle={90}
            cameraZoom={1}
            color1="#636379"
            color2="#555355"
            color3="#000000"
            destination="onCanvas"
            embedMode="off"
            envPreset="city"
            format="gif"
            fov={45}
            frameRate={10}
            gizmoHelper="hide"
            grain="off"
            lightType="3d"
            pixelDensity={1}
            positionX={-1.4}
            positionY={0}
            positionZ={0}
            range="enabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={0}
            rotationY={10}
            rotationZ={50}
            shader="defaults"
            type="plane"
            uAmplitude={1}
            uDensity={1.3}
            uFrequency={5.5}
            uSpeed={0.2}
            uStrength={4}
            uTime={0}
            wireframe={false}
          />
        </ShaderGradientCanvas>
      </div>

      {/* ── Layer 1: Dark Overlay ── */}
      <div className="absolute inset-0 z-[1] bg-black/25" />

      {/* ── Layer 2: Bottom Fade ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] h-40"
        style={{
          background: 'linear-gradient(to bottom, transparent, #0A0A0F)',
        }}
      />

      {/* ── Layer 3: Floating Particles (CSS) ── */}
      <div className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* ── Layer 10: Hero Content ── */}
      <div
        className={`
          relative z-10 flex flex-col items-center justify-center 
          h-full text-center px-6
          transition-all duration-1000 ease-out
          ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
        style={{
          opacity: Math.max(0, 1 - scrollY / 600),
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      >
        {/* Status Badge */}
        <div
          className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] 
                      backdrop-blur-sm border border-white/[0.08] rounded-full 
                      mb-8"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/50 text-xs tracking-wide">
            Available for work
          </span>
        </div>

        {/* Main Heading */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
                      font-bold text-white tracking-tight mb-6 
                      leading-[1.05] font-['Space_Grotesk']"
        >
          {personal.name}
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl md:text-2xl text-white/40 
                      max-w-xl mb-12 font-light leading-relaxed"
        >
          {personal.role}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" href="#projects">
            <span>View My Work</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
            </svg>
          </Button>
          <Button variant="secondary" href="#contact">
            Get In Touch
          </Button>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 
                    flex flex-col items-center gap-2 animate-bounce"
        style={{
          opacity: Math.max(0, 1 - scrollY / 200),
        }}
      >
        <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase">
          Scroll Down
        </span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}