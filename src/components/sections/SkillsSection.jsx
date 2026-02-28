// src/components/sections/SkillsSection.jsx

import { skillCategories } from '../../data/skills'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import GlassCard from '../ui/GlassCard'
import SectionHeading from '../ui/SectionHeading'
import SkillBar from '../ui/SkillBar'

export default function SkillsSection() {
  const sectionRef = useScrollAnimation()

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="min-h-screen py-24 px-6 bg-[var(--bg-primary)] relative"
    >
      {/* Background Accent */}
      <div
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full 
                    opacity-[0.03] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--accent-secondary), transparent)',
        }}
      />

      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Expertise"
          title="Technical Arsenal"
          description="Technologies and tools I use to bring ideas to life."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {skillCategories.map((category, catIndex) => (
            <GlassCard
              key={category.title}
              className="p-6"
              data-animate="up"
              data-delay={catIndex * 0.15}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-lg font-semibold text-white font-['Space_Grotesk']">
                  {category.title}
                </h3>
              </div>

              {/* Skill Bars */}
              <div>
                {category.skills.map((skill) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                  />
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}