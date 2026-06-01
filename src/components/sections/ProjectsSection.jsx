// src/components/sections/ProjectsSection.jsx

import { useState, useRef, useEffect } from 'react'
import { projects } from '../../data/projects'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import SectionHeading from '../ui/SectionHeading'

export default function ProjectsSection() {
  const sectionRef = useScrollAnimation()
  const [showAll, setShowAll] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const containerRef = useRef(null)

  const displayedProjects = showAll ? projects : projects.filter((p) => p.featured)

  // Get unique categories
  const categories = ['all', ...new Set(projects.map(p => p.category))]

  // Filter projects by category
  const filteredProjects = activeFilter === 'all' 
    ? displayedProjects 
    : displayedProjects.filter(p => p.category === activeFilter)

  // Mouse-follow gradient effect
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  useEffect(() => {
    const handleMove = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
    const el = containerRef.current
    if (el) {
      el.addEventListener('mousemove', handleMove)
      return () => el.removeEventListener('mousemove', handleMove)
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes fadeInScale {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .project-card {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.05) 0%,
            transparent 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        .project-card:hover::before {
          opacity: 1;
        }

        .project-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 
            0 20px 40px -12px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.06);
        }

        .project-image-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
        }

        @media (min-width: 768px) {
          .project-image-wrapper {
            height: 240px;
          }
        }

        .project-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .project-image-placeholder::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.03),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        .project-gradient-orb {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          filter: blur(50px);
          opacity: 0.3;
          transition: all 0.8s ease;
        }

        @media (min-width: 768px) {
          .project-gradient-orb {
            width: 200px;
            height: 200px;
            filter: blur(60px);
          }
        }

        .project-card:hover .project-gradient-orb {
          opacity: 0.5;
          transform: scale(1.2);
        }

        .tech-tag {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tech-tag:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .filter-btn {
          position: relative;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .filter-btn::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 80%;
          height: 2px;
          background: var(--accent-primary);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .filter-btn.active::before {
          transform: translateX(-50%) scaleX(1);
        }

        .project-link-btn {
          position: relative;
          overflow: hidden;
        }

        .project-link-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .project-link-btn:hover::after {
          transform: translateX(100%);
        }

        .category-badge {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        @media (max-width: 767px) {
          .project-card:hover {
            transform: translateY(-4px);
          }
        }
      `}</style>

      <section
        id="projects"
        ref={sectionRef}
        className="min-h-screen pt-32 pb-20 md:pt-24 md:pb-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)] relative overflow-hidden"
      >
        {/* Ambient background effects */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(
              ellipse 1000px 800px at ${mousePos.x}% ${mousePos.y}%, 
              rgba(139, 92, 246, 0.08), 
              transparent 70%
            )`,
            transition: 'background 1s ease',
          }}
        />

        {/* Decorative grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        <div className="max-w-7xl mx-auto relative" ref={containerRef}>
          <SectionHeading
            eyebrow="Portfolio"
            title="Featured Projects"
            description="Innovative solutions built with modern technologies to solve real-world problems."
          />

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2" data-animate="up">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`filter-btn px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium
                           transition-all duration-400 capitalize
                           ${activeFilter === category 
                             ? 'active bg-white/10 text-white border-white/20' 
                             : 'bg-white/[0.03] text-white/50 border-white/[0.06] hover:bg-white/[0.06] hover:text-white/70'
                           }
                           border backdrop-blur-sm`}
                style={{
                  animation: `slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Project Stats */}
          <div className="flex items-center justify-between mb-8 sm:mb-10 px-2" data-animate="up">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                <span className="text-xs sm:text-sm font-mono text-white/40">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
                </span>
              </div>
              {activeFilter !== 'all' && (
                <span className="text-[10px] sm:text-xs text-white/30">
                  in {activeFilter}
                </span>
              )}
            </div>
            <div className="hidden sm:block h-px flex-1 mx-6 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>

          {/* Projects Grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 mb-12 sm:mb-16"
            data-animate="up"
          >
            {filteredProjects.map((project, index) => {
              const isHovered = hoveredIndex === index

              return (
                <div
                  key={project.id}
                  className="project-card group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    animation: `fadeInScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`,
                  }}
                >
                  {/* Project Image/Visual */}
                  <div className="project-image-wrapper">
                    <div className="project-image-placeholder">
                      {/* Animated gradient orb */}
                      <div 
                        className="project-gradient-orb"
                        style={{ 
                          background: `linear-gradient(135deg, ${project.color}, transparent)`,
                          top: '-20%',
                          left: '-10%',
                        }}
                      />
                      <div 
                        className="project-gradient-orb"
                        style={{ 
                          background: `linear-gradient(225deg, ${project.color}, transparent)`,
                          bottom: '-20%',
                          right: '-10%',
                        }}
                      />
                      
                      {/* Project icon/pattern */}
                      <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                        <div 
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center
                                     transition-all duration-500 group-hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${project.color}20, ${project.color}05)`,
                            border: `1px solid ${project.color}30`,
                          }}
                        >
                          <span className="text-2xl sm:text-3xl">
                            {project.category === 'Machine Learning' && '🤖'}
                            {project.category === 'Social Impact' && '🌱'}
                            {project.category === 'AgriTech' && '🌾'}
                            {project.category === 'Business Tools' && '📊'}
                          </span>
                        </div>
                        
                        {/* Category badge */}
                        <div 
                          className="category-badge px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium"
                          style={{
                            background: `${project.color}15`,
                            border: `1px solid ${project.color}30`,
                            color: `${project.color}`,
                          }}
                        >
                          {project.category}
                        </div>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>

                  {/* Project Content */}
                  <div className="p-4 sm:p-6 relative">
                    {/* Header */}
                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2">
                        <h3 className="text-base sm:text-xl font-semibold text-white/90 font-['Space_Grotesk'] 
                                       group-hover:text-white transition-colors duration-300 leading-tight">
                          {project.title}
                        </h3>
                        <span className="text-[10px] sm:text-xs font-mono text-white/30 shrink-0 mt-0.5 sm:mt-1">
                          {project.year}
                        </span>
                      </div>

                      {project.metrics && (
                        <div 
                          className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs"
                          style={{
                            background: `${project.color}08`,
                            border: `1px solid ${project.color}20`,
                            color: `${project.color}dd`,
                          }}
                        >
                          <div 
                            className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full"
                            style={{ background: project.color }}
                          />
                          {project.metrics}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-white/50 leading-relaxed mb-4 sm:mb-6 line-clamp-3
                                  group-hover:text-white/65 transition-colors duration-300">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.tech.slice(0, 4).map((tech, techIndex) => (
                          <span
                            key={tech}
                            className="tech-tag text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg
                                       bg-white/[0.04] border border-white/[0.08]
                                       text-white/60 font-medium"
                            style={{
                              transitionDelay: `${techIndex * 50}ms`
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech.length > 4 && (
                          <span className="text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 text-white/30">
                            +{project.tech.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn flex-1 flex items-center justify-center gap-1.5 sm:gap-2
                                     px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm
                                     bg-white/[0.06] border border-white/[0.12]
                                     text-white/80 hover:text-white
                                     hover:bg-white/[0.1] hover:border-white/[0.2]
                                     transition-all duration-300"
                        >
                          <span className="hidden sm:inline">Live Demo</span>
                          <span className="sm:hidden">Demo</span>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn flex items-center justify-center gap-1.5 sm:gap-2
                                     px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm
                                     bg-white/[0.03] border border-white/[0.08]
                                     text-white/60 hover:text-white/80
                                     hover:bg-white/[0.06] hover:border-white/[0.12]
                                     transition-all duration-300"
                          title="View Source Code"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          <span className="hidden sm:inline">Code</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div 
                    className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-0 
                               group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, ${project.color}15, transparent 70%)`,
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* Show All Button */}
          {!showAll && projects.length > displayedProjects.length && (
            <div className="text-center mt-12 sm:mt-16" data-animate="up">
              <button
                onClick={() => setShowAll(true)}
                className="group inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl
                           bg-white/[0.04] border border-white/[0.1]
                           hover:bg-white/[0.08] hover:border-white/[0.15]
                           transition-all duration-500 relative overflow-hidden"
              >
                {/* Background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <span className="relative text-sm sm:text-base text-white/70 group-hover:text-white/90 font-medium 
                                transition-colors duration-300">
                  View All Projects
                </span>
                <span className="relative px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/[0.08] text-white/50 text-xs sm:text-sm font-mono
                                group-hover:bg-white/[0.12] group-hover:text-white/70 transition-all duration-300">
                  {projects.length}
                </span>
                <svg className="relative w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white/60 
                               group-hover:translate-y-0.5 transition-all duration-300"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16 sm:py-20" data-animate="up">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full 
                             bg-white/[0.03] border border-white/[0.06] mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-white/40 text-xs sm:text-sm">No projects found in this category</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}