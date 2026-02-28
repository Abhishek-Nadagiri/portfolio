// src/components/sections/AboutSection.jsx

import { personal } from '../../data/personal'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import GlassCard from '../ui/GlassCard'
import SectionHeading from '../ui/SectionHeading'

export default function AboutSection() {
  const sectionRef = useScrollAnimation()

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen flex items-center py-24 px-6 
                 bg-[var(--bg-primary)] relative"
    >
      {/* Background Accent */}
      <div
        className="absolute top-1/2 left-0 w-96 h-96 -translate-y-1/2 
                    rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--accent-primary), transparent)',
        }}
      />

      <div className="max-w-5xl mx-auto w-full">
        <SectionHeading
          eyebrow="About Me"
          title="Building the Future of the Web"
          description="I craft digital experiences that are fast, accessible, and memorable."
        />

        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Left — Photo */}
          <div className="md:col-span-2 flex justify-center" data-animate="left">
            <div className="relative">
              <div
                className="w-56 h-56 md:w-64 md:h-64 rounded-2xl 
                            bg-white/[0.03] border border-white/[0.06] 
                            overflow-hidden"
              >
                {/* Replace with actual photo */}
                <div
                  className="w-full h-full flex items-center justify-center 
                              text-white/10 text-6xl"
                >
                  👨‍💻
                </div>
              </div>
              {/* Decorative border */}
              <div
                className="absolute -inset-3 rounded-2xl border 
                            border-[var(--accent-primary)]/20 -z-10"
              />
              <div
                className="absolute -inset-6 rounded-2xl border 
                            border-[var(--accent-primary)]/10 -z-10"
              />
            </div>
          </div>

          {/* Right — Content */}
          <div className="md:col-span-3">
            <p
              data-animate="right"
              className="text-[var(--text-secondary)] leading-relaxed text-lg mb-8"
            >
              {personal.bio}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {personal.stats.map((stat, index) => (
                <GlassCard
                  key={stat.label}
                  className="p-4 text-center"
                  data-animate="up"
                  data-delay={index * 0.1}
                >
                  <div
                    className="text-2xl font-bold text-white 
                                font-['Space_Grotesk']"
                  >
                    {stat.number}
                  </div>
                  <div className="text-white/30 text-xs mt-1 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}