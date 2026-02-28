// src/components/sections/AchievementsSection.jsx

import { achievements } from '../../data/achievements'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import GlassCard from '../ui/GlassCard'
import SectionHeading from '../ui/SectionHeading'

export default function AchievementsSection() {
  const sectionRef = useScrollAnimation()

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="py-24 px-6 bg-[var(--bg-primary)] relative"
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Recognition"
          title="Achievements & Certifications"
          description="Milestones and certifications along the way."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((item, index) => (
            <GlassCard
              key={item.id}
              className="p-6 group"
              data-animate="scale"
              data-delay={index * 0.1}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl bg-white/[0.04] 
                              border border-white/[0.06] flex items-center 
                              justify-center text-2xl flex-shrink-0
                              group-hover:scale-110 transition-transform 
                              duration-300"
                >
                  {item.icon}
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-sm font-semibold text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-xs mt-1">{item.issuer}</p>
                  <span
                    className="inline-block mt-2 text-[10px] px-2 py-0.5 
                               bg-[var(--accent-primary)]/10 
                               text-[var(--accent-primary)] rounded-full 
                               uppercase tracking-wider"
                  >
                    {item.date} · {item.type}
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}