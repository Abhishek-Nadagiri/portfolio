import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap } from 'lucide-react';
import { experiences, education } from '../data/experience';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.exp-heading',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.exp-heading', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      gsap.fromTo(
        '.exp-item',
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.exp-timeline', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      gsap.fromTo(
        '.edu-card',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: '.edu-card', start: 'top 90%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="relative py-20 md:py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="exp-heading mb-12 sm:mb-16 md:mb-20">
          <span className="inline-block text-[11px] font-display font-medium tracking-[0.3em] uppercase text-gold mb-3 sm:mb-4">
            Experience
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-chrome-900 dark:text-chrome-100 leading-[1.15]">
            Where I've
            <span className="chrome-text"> worked.</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="exp-timeline relative">
          {/* Vertical timeline line */}
          <div className="absolute left-3.5 md:left-6 top-2 bottom-4 w-px bg-chrome-200/60 dark:bg-chrome-700/30" />

          <div className="space-y-6 sm:space-y-8 md:space-y-12">
            {experiences.map((exp) => (
              <div key={exp.id} className="exp-item relative pl-9 md:pl-16">
                {/* Timeline dot mathematically centered on the vertical line */}
                <div className="absolute left-3.5 md:left-6 -translate-x-1/2 top-5 w-3 h-3 rounded-full border-2 border-gold bg-surface-light dark:bg-surface-dark z-10 shadow-sm shadow-gold/30" />

                {/* Card */}
                <div className="group p-5 sm:p-6 rounded-2xl
                  border border-chrome-200/50 dark:border-chrome-700/30
                  bg-white dark:bg-surface-dark-3
                  hover:border-gold/30 dark:hover:border-gold/20
                  transition-all duration-300 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-2 mb-3">
                    <div>
                      <h3 className="font-display text-base sm:text-lg font-semibold text-chrome-900 dark:text-chrome-100">
                        {exp.role}
                      </h3>
                      <p className="text-xs sm:text-sm font-display text-chrome-500 dark:text-chrome-400 mt-0.5">
                        {exp.organization}
                      </p>
                    </div>
                    <span className="self-start text-[11px] sm:text-xs font-display font-medium tracking-wide text-chrome-500 dark:text-chrome-400 bg-chrome-100/70 dark:bg-surface-dark-4 px-2.5 py-1 rounded-md">
                      {exp.duration}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm md:text-base text-chrome-600 dark:text-chrome-400 leading-relaxed font-body">
                    {exp.description}
                  </p>

                  {/* Type badge */}
                  <div className="mt-4 inline-flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3 text-gold" />
                    <span className="text-[10px] font-display font-medium tracking-[0.15em] uppercase text-gold">
                      {exp.type === 'internship' ? 'Internship' : 'Leadership'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education - kept minimal per CRD */}
        <div className="mt-14 sm:mt-20">
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="h-px flex-1 bg-chrome-200/40 dark:bg-chrome-700/30" />
            <span className="text-[11px] font-display font-medium tracking-[0.2em] uppercase text-chrome-400 dark:text-chrome-500">
              Education
            </span>
            <div className="h-px flex-1 bg-chrome-200/40 dark:bg-chrome-700/30" />
          </div>

          <div className="edu-card flex items-start gap-4 p-5 sm:p-6 rounded-2xl
            border border-chrome-200/50 dark:border-chrome-700/30
            bg-white dark:bg-surface-dark-3 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gold/10 text-gold flex-shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-sm sm:text-base md:text-lg font-semibold text-chrome-900 dark:text-chrome-100">
                {education.degree}
              </h3>
              <p className="text-xs sm:text-sm text-chrome-500 dark:text-chrome-400 mt-1 font-body">
                {education.institution}
              </p>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-3">
                <span className="text-[11px] sm:text-xs font-display font-medium tracking-wide text-chrome-500 dark:text-chrome-400 bg-chrome-100/70 dark:bg-surface-dark-4 px-2.5 py-1 rounded-md">
                  {education.duration}
                </span>
                <span className="text-[11px] sm:text-xs font-display font-semibold tracking-wide text-gold bg-gold/10 px-2.5 py-1 rounded-md">
                  CGPA: {education.cgpa}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
