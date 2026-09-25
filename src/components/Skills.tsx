import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Cpu, Pen } from 'lucide-react';
import { skillCategories, dataSkills } from '../data/skills';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_ICONS: Record<string, typeof Code2> = {
  'software-engineering': Code2,
  'prompt-engineering': Cpu,
  'content-creation': Pen,
};

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.skills-heading',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.skills-heading', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      gsap.fromTo(
        '.skill-category',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.skills-grid', start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      gsap.fromTo(
        '.data-skill-item',
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out',
          scrollTrigger: { trigger: '.data-skills', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="relative py-20 md:py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="skills-heading mb-10 sm:mb-14 md:mb-20">
          <span className="inline-block text-[11px] font-display font-medium tracking-[0.3em] uppercase text-gold mb-4">
            Skills
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-chrome-800 dark:text-chrome-100 leading-[1.15]">
            Three dimensions of
            <span className="chrome-text"> capability.</span>
          </h2>
        </div>

        {/* Three skill categories */}
        <div className="skills-grid grid md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          {skillCategories.map((category) => {
            const Icon = CATEGORY_ICONS[category.id] || Code2;
            return (
              <div
                key={category.id}
                className="skill-category group p-6 md:p-8 rounded-2xl
                  border border-chrome-200/40 dark:border-chrome-700/20
                  bg-white dark:bg-surface-dark-3
                  hover:border-gold/30 dark:hover:border-gold/20
                  transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5
                  bg-gold/10 text-gold group-hover:bg-gold/15 transition-colors duration-300">
                  <Icon className="w-5 h-5" strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-semibold text-chrome-800 dark:text-chrome-100 mb-2">
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-chrome-400 dark:text-chrome-400 mb-6 font-body leading-relaxed">
                  {category.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-[11px] font-display font-medium tracking-wide
                        bg-chrome-50 dark:bg-surface-dark-4
                        text-chrome-500 dark:text-chrome-400
                        border border-chrome-200/30 dark:border-chrome-700/15
                        group-hover:border-chrome-200/60 dark:group-hover:border-chrome-700/30
                        transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Data & Analytics */}
        <div className="data-skills">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-chrome-200/30 dark:bg-chrome-700/20" />
            <span className="text-[11px] font-display font-medium tracking-[0.2em] uppercase text-chrome-400 dark:text-chrome-500">
              Data & Analytics
            </span>
            <div className="h-px flex-1 bg-chrome-200/30 dark:bg-chrome-700/20" />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {dataSkills.map((skill) => (
              <span
                key={skill}
                className="data-skill-item px-4 py-2 rounded-full text-xs font-display font-medium tracking-wide
                  border border-chrome-200/40 dark:border-chrome-700/20
                  text-chrome-500 dark:text-chrome-400
                  hover:border-gold/30 dark:hover:border-gold/20
                  hover:text-gold dark:hover:text-gold
                  transition-all duration-200 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
