import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, BadgeCheck } from 'lucide-react';
import { certifications, achievements } from '../data/achievements';

gsap.registerPlugin(ScrollTrigger);

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ach-heading',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.ach-heading', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      gsap.fromTo(
        '.ach-item',
        { y: 25, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '.ach-list', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="achievements" className="relative py-20 md:py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="ach-heading mb-10 sm:mb-14 md:mb-16">
          <span className="inline-block text-[11px] font-display font-medium tracking-[0.3em] uppercase text-gold mb-4">
            Recognition
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-chrome-800 dark:text-chrome-100 leading-[1.15]">
            Achievements &
            <span className="chrome-text"> Certifications.</span>
          </h2>
        </div>

        <div className="ach-list grid md:grid-cols-2 gap-4 md:gap-5">
          {/* Certifications */}
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="ach-item group flex items-start gap-4 p-4 md:p-5 rounded-xl
                border border-chrome-200/40 dark:border-chrome-700/20
                bg-white dark:bg-surface-dark-3
                hover:border-gold/20 dark:hover:border-gold/15
                transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gold/10 text-gold flex-shrink-0 mt-0.5">
                <BadgeCheck className="w-4 h-4" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-chrome-800 dark:text-chrome-100 leading-snug">
                  {cert.name}
                </h3>
                <p className="text-xs text-chrome-400 dark:text-chrome-500 mt-1 font-display">
                  {cert.organization}
                </p>
              </div>
            </div>
          ))}

          {/* Achievements */}
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="ach-item group flex items-start gap-4 p-4 md:p-5 rounded-xl
                border border-gold/20 dark:border-gold/10
                bg-gold/[0.03] dark:bg-gold/[0.02]
                hover:border-gold/30 dark:hover:border-gold/20
                transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gold/15 text-gold flex-shrink-0 mt-0.5">
                <Award className="w-4 h-4" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-chrome-800 dark:text-chrome-100 leading-snug">
                  {ach.name}
                </h3>
                <p className="text-xs text-gold/70 mt-1 font-display font-medium">
                  Achievement
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
