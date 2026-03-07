// src/components/sections/ProjectsSection.jsx

import { useState, useRef, useEffect } from 'react'
import { projects } from '../../data/projects'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import SectionHeading from '../ui/SectionHeading'

export default function ProjectsSection() {
  const sectionRef = useScrollAnimation()
  const [showAll, setShowAll] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const containerRef = useRef(null)

  const displayedProjects = showAll ? projects : projects.filter((p) => p.featured)

  // Mouse-follow gradient effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
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
        @keyframes projectLineReveal {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @keyframes projectFadeIn {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
            filter: blur(4px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
            filter: blur(0);
          }
        }

        @keyframes techPillReveal {
          from { 
            opacity: 0; 
            transform: translateX(-8px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        @keyframes expandPanel {
          from {
            max-height: 0;
            opacity: 0;
          }
          to {
            max-height: 400px;
            opacity: 1;
          }
        }

        @keyframes collapsePanel {
          from {
            max-height: 400px;
            opacity: 1;
          }
          to {
            max-height: 0;
            opacity: 0;
          }
        }

        .project-row {
          position: relative;
        }

        .project-row::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg, 
            transparent 0%, 
            rgba(255,255,255,0.06) 15%, 
            rgba(255,255,255,0.06) 85%, 
            transparent 100%
          );
        }

        .project-row:first-child::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg, 
            transparent 0%, 
            rgba(255,255,255,0.06) 15%, 
            rgba(255,255,255,0.06) 85%, 
            transparent 100%
          );
        }

        .project-number {
          font-variant-numeric: tabular-nums;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-row:hover .project-number {
          color: var(--accent-primary);
          transform: translateX(4px);
        }

        .project-title-text {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          background-size: 0% 1px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          background-image: linear-gradient(
            to right,
            var(--accent-primary),
            var(--accent-secondary, var(--accent-primary))
          );
        }

        .project-row:hover .project-title-text {
          background-size: 100% 1px;
          letter-spacing: 0.01em;
        }

        .project-arrow {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          transform: translateX(-12px);
        }

        .project-row:hover .project-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .project-year {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .project-row:hover .project-year {
          opacity: 0.8;
          letter-spacing: 0.15em;
        }

        .project-color-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          transform: scaleY(0);
          transform-origin: center;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 1px;
        }

        .project-row:hover .project-color-bar {
          transform: scaleY(1);
        }

        .expanded-panel {
          overflow: hidden;
          animation: expandPanel 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .show-all-btn {
          position: relative;
          overflow: hidden;
        }

        .show-all-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.03) 0%,
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .show-all-btn:hover::before {
          opacity: 1;
        }
      `}</style>

      <section
        id="projects"
        ref={sectionRef}
        className="min-h-screen py-24 px-6 bg-[var(--bg-primary)] relative"
      >
        {/* Ambient background glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: `radial-gradient(
              ellipse 800px 600px at ${mousePos.x}% ${mousePos.y}%, 
              rgba(var(--accent-primary-rgb, 139, 92, 246), 0.03), 
              transparent
            )`,
            transition: 'background 0.8s ease',
          }}
        />

        <div className="max-w-5xl mx-auto relative" ref={containerRef}>
          <SectionHeading
            eyebrow="Portfolio"
            title="Selected Work"
            description="Projects I've built that solve real problems and push creative boundaries."
          />

          {/* Project counter */}
          <div
            className="flex items-center justify-between mb-8"
            data-animate="up"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/20 tracking-widest uppercase">
                Showing
              </span>
              <span className="text-sm font-mono text-white/50">
                {displayedProjects.length}
              </span>
              <span className="text-xs text-white/20">/</span>
              <span className="text-sm font-mono text-white/30">
                {projects.length}
              </span>
            </div>
            <div className="h-px flex-1 mx-6 bg-gradient-to-r from-white/[0.06] to-transparent" />
          </div>

          {/* Project List — Expandable Rows */}
          <div className="relative" data-animate="up">
            {displayedProjects.map((project, index) => {
              const isActive = activeProject === project.id
              const isHovered = hoveredIndex === index

              return (
                <div
                  key={project.id}
                  className="project-row relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    animation: `projectFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s both`,
                  }}
                >
                  {/* Color accent bar */}
                  <div
                    className="project-color-bar"
                    style={{ background: project.color }}
                  />

                  {/* Main Row — Clickable */}
                  <button
                    onClick={() =>
                      setActiveProject(isActive ? null : project.id)
                    }
                    className="w-full text-left py-6 px-4 flex items-center gap-6 
                               cursor-pointer group transition-all duration-300
                               hover:bg-white/[0.01]"
                    style={{
                      paddingLeft: isHovered ? '16px' : '12px',
                      transition: 'padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Number */}
                    <span
                      className="project-number text-xs font-mono text-white/15 
                                 w-8 shrink-0 select-none"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Title + Metrics */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3
                          className="project-title-text text-lg md:text-xl 
                                     font-medium text-white/90 
                                     font-['Space_Grotesk'] truncate"
                        >
                          {project.title}
                        </h3>

                        {project.metrics && (
                          <span
                            className="hidden sm:inline-flex text-[10px] px-2.5 py-0.5 
                                       rounded-full border shrink-0
                                       transition-all duration-500"
                            style={{
                              borderColor: `${project.color}30`,
                              color: `${project.color}cc`,
                              background: `${project.color}08`,
                              transform: isHovered
                                ? 'translateX(0) scale(1)'
                                : 'translateX(-4px) scale(0.95)',
                              opacity: isHovered ? 1 : 0.5,
                            }}
                          >
                            {project.metrics}
                          </span>
                        )}
                      </div>

                      {/* Description — visible only on larger screens */}
                      <p
                        className="hidden md:block text-xs text-white/25 mt-1 
                                   max-w-lg truncate transition-all duration-500"
                        style={{
                          opacity: isHovered ? 0.6 : 0.3,
                          transform: isHovered
                            ? 'translateX(0)'
                            : 'translateX(-2px)',
                        }}
                      >
                        {project.description}
                      </p>
                    </div>

                    {/* Tech pills — desktop only */}
                    <div className="hidden lg:flex items-center gap-1.5 shrink-0">
                      {project.tech.slice(0, 3).map((t, ti) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-full 
                                     bg-white/[0.03] text-white/30 
                                     border border-white/[0.04]
                                     transition-all duration-500"
                          style={{
                            transitionDelay: `${ti * 40}ms`,
                            opacity: isHovered ? 0.8 : 0.4,
                            transform: isHovered
                              ? 'translateX(0)'
                              : `translateX(${ti * 2}px)`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span
                          className="text-[10px] text-white/15 transition-opacity duration-300"
                          style={{ opacity: isHovered ? 0.5 : 0.2 }}
                        >
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Year */}
                    <span
                      className="project-year text-xs font-mono text-white/20 
                                 shrink-0 w-12 text-right tracking-wider"
                    >
                      {project.year}
                    </span>

                    {/* Expand indicator */}
                    <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white/20 transition-all duration-500"
                        style={{
                          transform: isActive
                            ? 'rotate(180deg)'
                            : isHovered
                              ? 'rotate(0deg) translateY(-1px)'
                              : 'rotate(0deg)',
                          opacity: isActive ? 0.6 : isHovered ? 0.4 : 0.15,
                          color: isActive ? project.color : undefined,
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded Detail Panel */}
                  {isActive && (
                    <div className="expanded-panel">
                      <div
                        className="px-4 pb-8 pt-2"
                        style={{ paddingLeft: '52px' }}
                      >
                        {/* Expanded content grid */}
                        <div className="grid md:grid-cols-3 gap-8">
                          {/* Description */}
                          <div className="md:col-span-2">
                            <p className="text-sm text-white/50 leading-relaxed mb-6">
                              {project.description}
                            </p>

                            {/* Full tech stack */}
                            <div className="mb-6">
                              <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 mb-3 block">
                                Stack
                              </span>
                              <div className="flex gap-2 flex-wrap">
                                {project.tech.map((t, ti) => (
                                  <span
                                    key={t}
                                    className="text-xs px-3 py-1.5 rounded-full 
                                               bg-white/[0.03] text-white/50 
                                               border border-white/[0.06]
                                               hover:bg-white/[0.06] hover:text-white/70
                                               transition-all duration-300 cursor-default"
                                    style={{
                                      animation: `techPillReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${ti * 0.05}s both`,
                                    }}
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Links + Color preview */}
                          <div className="flex flex-col gap-4">
                            {/* Color accent preview */}
                            <div
                              className="h-24 rounded-lg relative overflow-hidden"
                              style={{
                                background: `linear-gradient(135deg, ${project.color}15, ${project.color}05)`,
                              }}
                            >
                              <div
                                className="absolute -top-8 -right-8 w-32 h-32 
                                           rounded-full opacity-20 blur-2xl"
                                style={{ background: project.color }}
                              />
                              <div
                                className="absolute bottom-3 left-3 text-xs 
                                           font-mono text-white/30"
                              >
                                {project.year}
                              </div>
                            </div>

                            {/* Action links */}
                            <div className="flex flex-col gap-2">
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between px-4 py-3 
                                             rounded-lg bg-white/[0.03] border border-white/[0.06]
                                             hover:bg-white/[0.06] hover:border-white/[0.1]
                                             transition-all duration-300 group/link"
                                >
                                  <span
                                    className="text-sm text-white/60 
                                               group-hover/link:text-white/90 
                                               transition-colors"
                                  >
                                    Live Demo
                                  </span>
                                  <svg
                                    className="w-4 h-4 text-white/30 
                                               group-hover/link:text-[var(--accent-primary)] 
                                               group-hover/link:translate-x-0.5 
                                               group-hover/link:-translate-y-0.5
                                               transition-all duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M7 17L17 7M17 7H7M17 7v10"
                                    />
                                  </svg>
                                </a>
                              )}
                              {project.repoUrl && (
                                <a
                                  href={project.repoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between px-4 py-3 
                                             rounded-lg bg-white/[0.02] border border-white/[0.04]
                                             hover:bg-white/[0.05] hover:border-white/[0.08]
                                             transition-all duration-300 group/link"
                                >
                                  <span
                                    className="text-sm text-white/40 
                                               group-hover/link:text-white/70 
                                               transition-colors"
                                  >
                                    Source Code
                                  </span>
                                  <svg
                                    className="w-4 h-4 text-white/20 
                                               group-hover/link:text-white/50
                                               transition-all duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={1.5}
                                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                    />
                                  </svg>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Show All Button */}
          {!showAll && projects.length > displayedProjects.length && (
            <div className="text-center mt-16" data-animate="up">
              <button
                onClick={() => setShowAll(true)}
                className="show-all-btn inline-flex items-center gap-3 
                           px-8 py-3.5 rounded-full 
                           bg-white/[0.03] border border-white/[0.08]
                           text-sm text-white/50 
                           hover:text-white/80 hover:border-white/[0.15]
                           hover:bg-white/[0.05]
                           transition-all duration-500 cursor-pointer
                           group"
              >
                <span className="font-['Space_Grotesk'] tracking-wide">
                  View All Projects
                </span>
                <span
                  className="text-xs font-mono px-2 py-0.5 rounded-full 
                             bg-white/[0.05] text-white/30 
                             group-hover:text-white/60
                             transition-colors duration-300"
                >
                  {projects.length}
                </span>
                <svg
                  className="w-4 h-4 text-white/30 group-hover:text-white/60 
                             group-hover:translate-y-0.5 
                             transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}