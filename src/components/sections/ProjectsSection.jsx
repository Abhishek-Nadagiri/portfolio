// src/components/sections/ProjectsSection.jsx

import { useState } from 'react'
import { projects } from '../../data/projects'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import GlassCard from '../ui/GlassCard'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'

export default function ProjectsSection() {
  const sectionRef = useScrollAnimation()
  const [showAll, setShowAll] = useState(false)

  const displayedProjects = showAll ? projects : projects.filter((p) => p.featured)

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="min-h-screen py-24 px-6 bg-[var(--bg-primary)] relative"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Portfolio"
          title="Selected Work"
          description="Projects I've built that solve real problems and push creative boundaries."
        />

        <div className="grid md:grid-cols-2 gap-6">
          {displayedProjects.map((project, index) => (
            <GlassCard
              key={project.id}
              className="group overflow-hidden"
              data-animate="up"
              data-delay={index * 0.1}
            >
              {/* Project Preview */}
              <div
                className="h-48 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${project.color}15, ${project.color}05)`,
                }}
              >
                {/* Decorative gradient orb */}
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full 
                              opacity-20 blur-3xl group-hover:opacity-40 
                              transition-opacity duration-700"
                  style={{ background: project.color }}
                />

                {/* Year Badge */}
                <div
                  className="absolute top-4 right-4 px-3 py-1 bg-black/30 
                              backdrop-blur-sm rounded-full text-xs text-white/60"
                >
                  {project.year}
                </div>

                {/* Metrics Badge */}
                {project.metrics && (
                  <div
                    className="absolute bottom-4 left-4 px-3 py-1 
                                backdrop-blur-sm rounded-full text-xs 
                                text-white/80 border border-white/10"
                    style={{
                      background: `${project.color}20`,
                    }}
                  >
                    {project.metrics}
                  </div>
                )}

                {/* Project Number */}
                <div
                  className="absolute top-4 left-4 text-6xl font-bold 
                              text-white/[0.03] font-['Space_Grotesk']"
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3
                  className="text-xl font-bold text-white mb-2 
                             font-['Space_Grotesk'] group-hover:text-[var(--accent-primary)] 
                             transition-colors duration-300"
                >
                  {project.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex gap-2 flex-wrap mb-5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1 bg-white/[0.04] 
                                 rounded-full text-white/50 
                                 border border-white/[0.06]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm 
                                 text-[var(--accent-primary)] 
                                 hover:text-[var(--accent-secondary)] 
                                 transition-colors"
                    >
                      <span>Live Demo</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm 
                                 text-white/40 hover:text-white/70 
                                 transition-colors"
                    >
                      <span>Source Code</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Show All Button */}
        {!showAll && projects.length > 3 && (
          <div className="text-center mt-12" data-animate="up">
            <Button variant="secondary" onClick={() => setShowAll(true)}>
              View All Projects ({projects.length})
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}