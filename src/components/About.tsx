import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        '.about-heading',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-heading', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      // Paragraphs
      gsap.fromTo(
        '.about-paragraph',
        { y: 25, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-content', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      // Stats
      gsap.fromTo(
        '.about-stat',
        { y: 20, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-stats', start: 'top 90%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-20 md:py-32 lg:py-40 px-4 sm:px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section label */}
        <div className="about-heading mb-10 sm:mb-14 md:mb-16">
          <span className="inline-block text-[11px] font-display font-medium tracking-[0.3em] uppercase text-gold mb-3 sm:mb-4">
            About
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-chrome-900 dark:text-chrome-100 leading-[1.15]">
            The story behind the
            <br className="hidden sm:inline" />
            <span className="chrome-text"> code, experiments, and content.</span>
          </h2>
        </div>

        {/* Bio */}
        <div className="about-content grid md:grid-cols-[1fr_1px_1fr] gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 md:mb-20">
          <div className="space-y-4 sm:space-y-5">
            {profile.bio.slice(0, 2).map((paragraph, i) => (
              <p
                key={i}
                className="about-paragraph text-sm sm:text-base md:text-lg leading-relaxed text-chrome-600 dark:text-chrome-300 font-body"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-chrome-200/50 dark:bg-chrome-700/30" />

          <div className="space-y-4 sm:space-y-5">
            {profile.bio.slice(2).map((paragraph, i) => (
              <p
                key={i}
                className="about-paragraph text-sm sm:text-base md:text-lg leading-relaxed text-chrome-600 dark:text-chrome-300 font-body"
              >
                {paragraph}
              </p>
            ))}

            <p className="about-paragraph text-sm sm:text-base md:text-lg leading-relaxed text-chrome-600 dark:text-chrome-300 font-body">
              Currently a Computer Science student at Sree Dattha Institute of Engineering and Science, turning every project into an opportunity to learn something beyond the syllabus.
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="about-stats grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 md:gap-8">
          {[
            { label: 'Focus Areas', value: '3', detail: 'Identities' },
            { label: 'Projects Built', value: '10+', detail: 'End-to-end' },
            { label: 'Current CGPA', value: '8.88', detail: '/ 10.0' },
            { label: 'GitHub Repos', value: '13', detail: 'Public' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="about-stat group p-4 sm:p-5 rounded-2xl border border-chrome-200/50 dark:border-chrome-700/30
                bg-white dark:bg-surface-dark-3
                hover:border-gold/30 dark:hover:border-gold/20
                transition-colors duration-300 shadow-sm"
            >
              <div className="font-display text-2xl sm:text-3xl font-bold text-chrome-900 dark:text-chrome-100 mb-1">
                {stat.value}
              </div>
              <div className="text-[11px] sm:text-xs font-display font-medium tracking-wide text-chrome-500 dark:text-chrome-400 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
