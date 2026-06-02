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

  return (
    <>
      <style>{`
        /* Core Animations */
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmerMove {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        /* Project Card Styles */
        .modern-project-card {
          position: relative;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.01) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          display: flex;
          flex-direction: column;
        }

        .modern-project-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at top right,
            rgba(255, 255, 255, 0.08),
            transparent 60%
          );
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
        }

        .modern-project-card::after {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.1),
            transparent 50%,
            rgba(255, 255, 255, 0.05)
          );
          border-radius: 24px;
          opacity: 0;
          transition: opacity 0.6s ease;
          z-index: -1;
          pointer-events: none;
        }

        .modern-project-card:hover::before,
        .modern-project-card:hover::after {
          opacity: 1;
        }

        .modern-project-card:hover {
          transform: translateY(-16px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 40px 80px -20px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 2px 0 rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 640px) {
          .modern-project-card:hover {
            transform: translateY(-8px) scale(1.01);
          }
        }

        /* Image Wrapper */
        .project-visual-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        @media (min-width: 640px) {
          .project-visual-wrapper {
            height: 240px;
          }
        }

        @media (min-width: 768px) {
          .project-visual-wrapper {
            height: 280px;
          }
        }

        .project-visual {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .modern-project-card:hover .project-visual {
          transform: scale(1.08);
          filter: brightness(1.15) saturate(1.1);
        }

        /* Gradient Overlays */
        .visual-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 0, 0, 0.2) 40%,
            rgba(10, 10, 15, 0.9) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .visual-color-tint {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
          z-index: 0;
        }

        .modern-project-card:hover .visual-color-tint {
          opacity: 0.2;
        }

        /* Shimmer Effect */
        .shimmer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .shimmer-overlay::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          transition: transform 0s;
        }

        .modern-project-card:hover .shimmer-overlay::after {
          animation: shimmerMove 1.5s ease-in-out;
        }

        /* Glass Badge Styles */
        .glass-badge {
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .glass-badge:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        /* Filter Button Styles */
        .filter-button {
          position: relative;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          overflow: hidden;
        }

        .filter-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.15),
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .filter-button.active::before,
        .filter-button:hover::before {
          opacity: 1;
        }

        /* Action Button Styles */
        .action-button {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .action-button::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }

        .action-button:hover::before {
          opacity: 1;
        }

        /* Content Spacing */
        .card-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          padding: 1.25rem;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .card-content {
            padding: 1.75rem;
            gap: 1.25rem;
          }
        }

        @media (min-width: 768px) {
          .card-content {
            padding: 2rem;
            gap: 1.5rem;
          }
        }

        /* Tech Tag Styles */
        .tech-tag {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .tech-tag:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
        }

        /* Noise Texture */
        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        /* Responsive Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          .projects-grid {
            gap: 2rem;
          }
        }

        @media (min-width: 768px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .projects-grid {
            gap: 3rem;
          }
        }

        /* Desktop Left Margin */
        .projects-container {
          margin-left: auto;
          margin-right: auto;
        }

        @media (min-width: 1024px) {
          .projects-container {
            padding-left: 4rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1280px) {
          .projects-container {
            padding-left: 6rem;
            padding-right: 3rem;
          }
        }

        @media (min-width: 1536px) {
          .projects-container {
            padding-left: 8rem;
            padding-right: 4rem;
          }
        }
      `}</style>

      <section
        id="projects"
        ref={sectionRef}
        className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden"
        style={{
          paddingTop: 'clamp(120px, 18vh, 180px)',
          paddingBottom: 'clamp(60px, 10vh, 120px)',
        }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating Gradient Orbs */}
          <div 
            className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full opacity-[0.08] blur-3xl"
            style={{
              background: 'radial-gradient(circle, var(--accent-primary), transparent 70%)',
              animation: 'floatSlow 25s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] rounded-full opacity-[0.06] blur-3xl"
            style={{
              background: 'radial-gradient(circle, var(--accent-secondary, var(--accent-primary)), transparent 70%)',
              animation: 'floatSlow 30s ease-in-out infinite reverse',
            }}
          />

          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
              `,
              backgroundSize: '64px 64px',
            }}
          />

          {/* Noise Texture */}
          <div className="noise-overlay" />
        </div>

        {/* Main Container */}
        <div 
          className="projects-container relative max-w-7xl mx-auto px-4 sm:px-6" 
          ref={containerRef}
        >
          {/* Section Header */}
<div 
  className="mb-12 sm:mb-16 md:mb-20 text-center"
  style={{ animation: 'fadeSlideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.1s both' }}
>
  <p className="text-xs sm:text-sm font-mono text-[var(--accent-primary)] 
                uppercase tracking-[0.2em] mb-4">
    Portfolio
  </p>

  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white 
                 mb-8 sm:mb-10 md:mb-12 font-['Space_Grotesk']">
    Featured Work
  </h2>

  {/* Description with left margin and side padding */}
  <div className="flex justify-center">
    <p className="text-base sm:text-lg text-white/50 leading-relaxed
                  max-w-3xl px-8 sm:px-16 md:px-24
                  lg:ml-16 xl:ml-20 2xl:ml-24">
      Innovative projects that solve real-world problems through creative technology.
    </p>
  </div>
</div>
          {/* Filter Pills */}
          <div 
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-12"
            style={{ animation: 'fadeSlideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s both' }}
          >
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`filter-button px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold capitalize
                           border transition-all duration-400
                           ${activeFilter === category 
                             ? 'active bg-white/12 text-white border-white/25 shadow-lg shadow-white/10' 
                             : 'bg-white/[0.04] text-white/60 border-white/10 hover:bg-white/[0.08] hover:text-white/80 hover:border-white/15'
                           }`}
                style={{
                  animation: `fadeSlideIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${0.3 + index * 0.08}s both`
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Project Counter */}
          <div 
            className="flex items-center justify-center mb-12 sm:mb-16"
            style={{ animation: 'fadeSlideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.4s both' }}
          >
            <div className="inline-flex items-center gap-3 sm:gap-4 px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
              <div className="relative flex items-center gap-2 sm:gap-2.5">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[var(--accent-primary)]" />
                <div 
                  className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[var(--accent-primary)]"
                  style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
                />
              </div>
              <span className="text-xs sm:text-sm font-mono font-medium text-white/70">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
              </span>
              {activeFilter !== 'all' && (
                <>
                  <div className="w-px h-4 sm:h-5 bg-white/15" />
                  <span className="text-[10px] sm:text-xs font-medium text-white/50 capitalize px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg bg-white/[0.06]">
                    {activeFilter}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="modern-project-card group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  animation: `fadeSlideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${0.5 + index * 0.1}s both`
                }}
              >
                {/* Project Visual */}
                <div className="project-visual-wrapper">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="project-visual"
                      loading="lazy"
                    />
                  ) : (
                    <div 
                      className="project-visual flex items-center justify-center"
                      style={{
                        background: `linear-gradient(145deg, ${project.color}40 0%, ${project.color}15 100%)`,
                      }}
                    >
                      <div className="text-5xl sm:text-6xl md:text-7xl opacity-25 select-none">
                        {project.category === 'Machine Learning' && '🤖'}
                        {project.category === 'Social Impact' && '🌱'}
                        {project.category === 'AgriTech' && '🌾'}
                        {project.category === 'Business Tools' && '📊'}
                      </div>
                    </div>
                  )}

                  {/* Overlays */}
                  <div className="visual-gradient-overlay" />
                  <div 
                    className="visual-color-tint"
                    style={{
                      background: `linear-gradient(145deg, ${project.color}60, ${project.color}20)`
                    }}
                  />
                  <div className="shimmer-overlay" />

                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10">
                    <div 
                      className="glass-badge px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300"
                      style={{
                        color: project.color,
                        boxShadow: `0 8px 24px ${project.color}25`,
                      }}
                    >
                      {project.category}
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10">
                    <div className="glass-badge px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold text-white/70 transition-all duration-300">
                      {project.year}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="card-content">
                  {/* Title & Metrics */}
                  <div className="space-y-2 sm:space-y-3">
                    <h3 
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-['Space_Grotesk'] leading-tight
                                 transition-colors duration-500"
                    >
                      {project.title}
                    </h3>

                    {project.metrics && (
                      <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-badge transition-all duration-300">
                        <div 
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                          style={{ background: project.color }}
                        />
                        <span className="text-[10px] sm:text-xs font-semibold text-white/80">
                          {project.metrics}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-white/50 leading-relaxed line-clamp-3 
                                group-hover:text-white/70 transition-colors duration-500">
                    {project.description}
                  </p>

                  {/* Spacer */}
                  <div className="flex-grow" />

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
                    {project.tech.slice(0, 4).map((tech, techIndex) => (
                      <span
                        key={tech}
                        className="tech-tag text-[10px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium
                                   bg-white/[0.06] border border-white/10 text-white/70"
                        style={{
                          animationDelay: `${techIndex * 0.05}s`
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="tech-tag text-[10px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium
                                     bg-white/[0.04] border border-white/[0.08] text-white/50">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button flex-1 flex items-center justify-center gap-2 sm:gap-2.5 
                                   px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm text-white
                                   backdrop-blur-xl border transition-all duration-400
                                   hover:scale-105 active:scale-95"
                        style={{
                          background: `linear-gradient(135deg, ${project.color}35, ${project.color}20)`,
                          borderColor: `${project.color}50`,
                        }}
                      >
                        <span>Live Demo</span>
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
                                d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <div 
                          className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 transition-opacity duration-400"
                          style={{
                            background: `linear-gradient(135deg, ${project.color}55, ${project.color}30)`
                          }}
                        />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button flex items-center justify-center p-2.5 sm:p-3.5
                                   rounded-xl sm:rounded-2xl font-bold text-white/80 hover:text-white
                                   backdrop-blur-xl border border-white/10 hover:border-white/20
                                   bg-white/[0.04] hover:bg-white/[0.08]
                                   transition-all duration-400 hover:scale-105 active:scale-95"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Corner Glow */}
                <div 
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl 
                             opacity-0 group-hover:opacity-25 transition-all duration-700 pointer-events-none"
                  style={{ background: project.color }}
                />
              </div>
            ))}
          </div>

          {/* Show All Button */}
          {!showAll && projects.length > displayedProjects.length && (
            <div 
              className="flex justify-center mt-12 sm:mt-16 md:mt-20"
              style={{ animation: 'fadeSlideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.8s both' }}
            >
              <button
                onClick={() => setShowAll(true)}
                className="group relative px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-white
                           backdrop-blur-xl border border-white/15 hover:border-white/25
                           bg-white/[0.05] hover:bg-white/[0.08]
                           transition-all duration-500 hover:scale-105 active:scale-95
                           overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                     style={{ animation: 'shimmerMove 2s ease-in-out infinite' }} />
                
                <span className="relative flex items-center gap-3 sm:gap-4">
                  <span>View All Projects</span>
                  <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-white/15 text-xs sm:text-sm font-mono font-bold">
                    {projects.length}
                  </span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-1 transition-transform duration-300" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div 
              className="flex flex-col items-center justify-center py-20 sm:py-28 md:py-32"
              style={{ animation: 'fadeSlideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.6s both' }}
            >
              <div className="relative mb-6 sm:mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white/[0.04] border border-white/10 
                               flex items-center justify-center backdrop-blur-xl">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent 
                               rounded-full animate-pulse" />
              </div>
              <p className="text-white/50 text-sm sm:text-base mb-4 sm:mb-6">No projects found in this category</p>
              <button
                onClick={() => setActiveFilter('all')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl 
                           bg-white/[0.06] hover:bg-white/[0.12] 
                           text-white/70 hover:text-white text-xs sm:text-sm font-semibold
                           border border-white/10 hover:border-white/20
                           transition-all duration-400 hover:scale-105"
              >
                View All Projects
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}