// src/components/sections/ExperienceSection.jsx

import { experiences } from '../../data/experience'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import SectionHeading from '../ui/SectionHeading'

export default function ExperienceSection() {
  const sectionRef = useScrollAnimation()

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="min-h-screen py-24 px-6 bg-[var(--bg-primary)] relative"
    >
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Career"
          title="Experience"
          description="My professional journey and the teams I've been part of."
        />

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px 
                        bg-gradient-to-b from-transparent 
                        via-[var(--accent-primary)]/20 to-transparent 
                        md:-translate-x-px"
          />

          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`
                relative flex flex-col md:flex-row gap-8 mb-16 last:mb-0
                ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
              `}
              data-animate={index % 2 === 0 ? 'left' : 'right'}
              data-delay={index * 0.15}
            >
              {/* Timeline Dot */}
              <div
                className="absolute left-0 md:left-1/2 top-0 w-3 h-3 
                            rounded-full bg-[var(--accent-primary)] 
                            -translate-x-[5px] md:-translate-x-1.5
                            shadow-[0_0_10px_var(--glow)]"
              />

              {/* Content */}
              <div
                className={`
                  md:w-1/2 pl-8 md:pl-0
                  ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}
                `}
              >
                <div
                  className="backdrop-blur-xl bg-white/[0.03] 
                              border border-white/[0.06] rounded-2xl p-6
                              hover:bg-white/[0.05] transition-all duration-500"
                >
                  {/* Duration */}
                  <span
                    className="text-[var(--accent-primary)] text-xs 
                               tracking-wider uppercase font-mono"
                  >
                    {exp.duration}
                  </span>

                  {/* Role & Company */}
                  <h3 className="text-xl font-bold text-white mt-2 font-['Space_Grotesk']">
                    {exp.role}
                  </h3>
                  <p className="text-white/40 text-sm mt-1">{exp.company}</p>

                  {/* Description */}
                  <p className="text-[var(--text-secondary)] text-sm mt-3 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Highlights */}
                  <ul className="mt-4 space-y-1.5">
                    {exp.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-white/50"
                      >
                        <span className="text-[var(--accent-primary)] mt-1 text-xs">▸</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech Tags */}
                  <div className="flex gap-2 flex-wrap mt-4">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2.5 py-0.5 
                                   bg-[var(--accent-primary)]/10 
                                   text-[var(--accent-primary)]/80 
                                   rounded-full border 
                                   border-[var(--accent-primary)]/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Empty space for layout */}
              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}