import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown, Github } from 'lucide-react';
import { profile } from '../data/profile';

interface HeroProps {
  isLoaded: boolean;
}

export default function Hero({ isLoaded }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const identitiesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only trigger entrance animation once loading animation has finished
    if (!isLoaded) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (nameRef.current) gsap.set(nameRef.current.querySelectorAll('.hero-char'), { opacity: 1, y: 0 });
      if (taglineRef.current) gsap.set(taglineRef.current, { opacity: 1, y: 0 });
      if (identitiesRef.current) gsap.set(identitiesRef.current.querySelectorAll('.identity-item'), { opacity: 1, y: 0 });
      if (ctaRef.current) gsap.set(ctaRef.current.children, { opacity: 1, y: 0 });
      if (arrowRef.current) gsap.set(arrowRef.current, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Name character reveal
      const chars = nameRef.current?.querySelectorAll('.hero-char');
      if (chars && chars.length > 0) {
        tl.fromTo(
          chars,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.03,
            ease: 'power3.out',
          }
        );
      }

      // Tagline
      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        );
      }

      // Identities
      const identityItems = identitiesRef.current?.querySelectorAll('.identity-item');
      if (identityItems && identityItems.length > 0) {
        tl.fromTo(
          identityItems,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
          '-=0.25'
        );
      }

      // CTA Buttons
      if (ctaRef.current?.children) {
        tl.fromTo(
          ctaRef.current.children,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
          '-=0.2'
        );
      }

      // Scroll Arrow
      if (arrowRef.current) {
        tl.fromTo(
          arrowRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          '-=0.1'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // Group characters by word so each word is wrapped in an unbreakable inline block
  const renderName = (text: string) => {
    const words = text.split(' ');
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block whitespace-nowrap">
        {word.split('').map((char, charIndex) => (
          <span
            key={charIndex}
            className="hero-char inline-block transition-transform duration-200 hover:-translate-y-1 hover:text-gold"
          >
            {char}
          </span>
        ))}
        {wordIndex < words.length - 1 && (
          <span className="inline-block">&nbsp;</span>
        )}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 pt-24 pb-28 md:py-0 overflow-hidden"
    >
      {/* Subtle background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] md:w-[600px] h-[320px] sm:h-[500px] md:h-[600px] rounded-full bg-gold/[0.04] dark:bg-gold/[0.03] blur-[100px] sm:blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-light dark:from-surface-dark to-transparent" />
      </div>

      <div className="relative text-center max-w-5xl mx-auto w-full">
        {/* Name: solid high-contrast text color that is 100% visible on reload across all browsers */}
        <h1
          ref={nameRef}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-[1.1] sm:leading-[1] mb-6 md:mb-8 text-chrome-950 dark:text-white px-2"
        >
          {renderName(profile.name)}
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-chrome-600 dark:text-chrome-300 max-w-xl mx-auto mb-8 md:mb-10 font-body leading-relaxed px-4"
        >
          {profile.tagline}
        </p>

        {/* Three identities */}
        <div
          ref={identitiesRef}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-8 sm:mb-12 px-4"
        >
          {profile.identities.map((identity, i) => (
            <span key={identity} className="identity-item flex items-center gap-2.5 sm:gap-4">
              {i > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
              )}
              <span className="text-[11px] sm:text-xs md:text-sm font-display font-medium tracking-[0.18em] sm:tracking-[0.2em] uppercase text-chrome-600 dark:text-chrome-400">
                {identity}
              </span>
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div 
          ref={ctaRef} 
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto px-4"
        >
          <a
            href="#projects"
            className="w-full sm:w-auto justify-center group inline-flex items-center gap-2 px-7 py-3 rounded-full
              bg-chrome-900 dark:bg-chrome-100 text-white dark:text-chrome-900
              font-display text-sm font-medium tracking-wide
              hover:bg-chrome-800 dark:hover:bg-white
              transition-all duration-300
              shadow-md hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/10"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            View Work
            <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>

          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto justify-center group inline-flex items-center gap-2 px-7 py-3 rounded-full
              border border-chrome-200 dark:border-chrome-700
              text-chrome-700 dark:text-chrome-300
              font-display text-sm font-medium tracking-wide
              hover:border-chrome-400 dark:hover:border-chrome-500
              hover:text-chrome-900 dark:hover:text-white
              transition-all duration-300"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={arrowRef}
        className="hidden sm:block absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 animate-float">
          <span className="text-[10px] font-display tracking-[0.3em] uppercase text-chrome-400 dark:text-chrome-500">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-chrome-300 dark:border-chrome-600 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-chrome-400 dark:bg-chrome-500 animate-pulse-slow" />
          </div>
        </div>
      </div>
    </section>
  );
}
