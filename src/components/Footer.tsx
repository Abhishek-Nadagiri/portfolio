import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-content',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.footer-content', start: 'top 90%', toggleActions: 'play none none none' },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="relative pt-16 pb-28 md:py-20 px-4 sm:px-6 border-t border-chrome-200/40 dark:border-chrome-700/20"
    >
      <div className="footer-content max-w-4xl mx-auto text-center">
        {/* Closing statement */}
        <p className="font-display text-base sm:text-lg lg:text-xl font-medium italic text-chrome-900 dark:text-chrome-100 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          “I am no bird; and no net ensnares me: I am a free human being with an independent will.”
        </p>

        <p className="text-xs sm:text-sm text-chrome-500 dark:text-chrome-400 mb-8 font-body">
          Designed & built by {profile.name}
        </p>

        {/* Social links */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl flex items-center justify-center
              text-chrome-500 dark:text-chrome-400
              hover:text-gold hover:bg-gold/10
              transition-all duration-200"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" strokeWidth={1.8} />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl flex items-center justify-center
              text-chrome-500 dark:text-chrome-400
              hover:text-gold hover:bg-gold/10
              transition-all duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" strokeWidth={1.8} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="w-10 h-10 rounded-xl flex items-center justify-center
              text-chrome-500 dark:text-chrome-400
              hover:text-gold hover:bg-gold/10
              transition-all duration-200"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" strokeWidth={1.8} />
          </a>
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="group inline-flex items-center gap-2 text-xs font-display font-medium tracking-wide
            text-chrome-500 dark:text-chrome-400
            hover:text-gold transition-colors duration-200"
          aria-label="Back to top"
        >
          <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          Back to top
        </button>

        {/* Copyright */}
        <p className="mt-8 text-[11px] text-chrome-400 dark:text-chrome-500 font-display">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
