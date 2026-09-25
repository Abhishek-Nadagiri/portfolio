import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, ChevronRight } from 'lucide-react';
import { projects, Project } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const isFeatured = project.featured;

  return (
    <div
      ref={cardRef}
      className={`
        group relative rounded-2xl overflow-hidden
        border border-chrome-200/40 dark:border-chrome-700/20
        bg-white dark:bg-surface-dark-3
        hover:border-chrome-300/60 dark:hover:border-chrome-600/40
        transition-all duration-500
        ${isFeatured ? 'md:col-span-2' : ''}
      `}
    >
      {/* Project number & category */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <span className="text-[11px] font-display font-medium tracking-[0.2em] uppercase text-gold">
          {project.subtitle}
        </span>
        <span className="font-display text-sm text-chrome-300 dark:text-chrome-600 font-medium">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Content */}
      <div className={`px-6 pb-6 ${isFeatured ? 'md:grid md:grid-cols-2 md:gap-8' : ''}`}>
        <div>
          {/* Title */}
          <h3 className="font-display text-2xl md:text-3xl font-bold text-chrome-800 dark:text-chrome-100 mb-4 leading-tight">
            {project.title}
          </h3>

          {/* Problem */}
          <p className="text-sm md:text-base text-chrome-500 dark:text-chrome-400 leading-relaxed mb-4 font-body">
            {project.problem}
          </p>

          {/* Expand button for solution */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 text-xs font-display font-medium tracking-wide text-gold hover:text-gold-bright transition-colors duration-200 mb-4"
          >
            {expanded ? 'Show less' : 'See the solution'}
            <ChevronRight className={`w-3 h-3 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
          </button>

          {/* Expanded solution */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${expanded ? 'max-h-60 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
          >
            <p className="text-sm md:text-base text-chrome-500 dark:text-chrome-400 leading-relaxed font-body">
              {project.solution}
            </p>
            {project.metrics && (
              <div className="mt-3 inline-block px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-display font-medium tracking-wide">
                {project.metrics}
              </div>
            )}
          </div>
        </div>

        <div className={`${isFeatured ? '' : 'mt-4'}`}>
          {/* Features */}
          {isFeatured && (
            <ul className="space-y-2 mb-6">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-chrome-400 dark:text-chrome-400 font-body">
                  <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.slice(0, isFeatured ? undefined : 5).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-[11px] font-display font-medium tracking-wide
                  bg-chrome-50 dark:bg-surface-dark-4 text-chrome-500 dark:text-chrome-400
                  border border-chrome-200/30 dark:border-chrome-700/20"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                border border-chrome-200 dark:border-chrome-700
                text-chrome-600 dark:text-chrome-300
                text-xs font-display font-medium tracking-wide
                hover:border-chrome-400 dark:hover:border-chrome-500
                hover:text-chrome-800 dark:hover:text-chrome-100
                transition-all duration-200"
            >
              <Github className="w-3.5 h-3.5" />
              Source
            </a>
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                  bg-chrome-800 dark:bg-chrome-100 text-white dark:text-chrome-900
                  text-xs font-display font-medium tracking-wide
                  hover:bg-chrome-700 dark:hover:bg-white
                  transition-all duration-200"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hover accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.projects-heading',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.projects-heading',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featured = projects.filter((p) => p.featured);
  const other = projects.filter((p) => !p.featured);

  return (
    <section ref={sectionRef} id="projects" className="relative py-20 md:py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="projects-heading mb-10 sm:mb-14 md:mb-20">
          <span className="inline-block text-[11px] font-display font-medium tracking-[0.3em] uppercase text-gold mb-4">
            Projects
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-chrome-800 dark:text-chrome-100 leading-[1.15]">
            What I've
            <span className="chrome-text"> built.</span>
          </h2>
          <p className="mt-4 text-base text-chrome-400 dark:text-chrome-400 max-w-lg font-body">
            From data analytics platforms to AI-powered web applications — each project explores a different challenge.
          </p>
        </div>

        {/* Featured projects grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {featured.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Other projects */}
        {other.length > 0 && (
          <>
            <div className="flex items-center gap-4 my-10 md:my-14">
              <div className="h-px flex-1 bg-chrome-200/30 dark:bg-chrome-700/20" />
              <span className="text-[11px] font-display font-medium tracking-[0.2em] uppercase text-chrome-400 dark:text-chrome-500">
                More Projects
              </span>
              <div className="h-px flex-1 bg-chrome-200/30 dark:bg-chrome-700/20" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {other.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={featured.length + i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
