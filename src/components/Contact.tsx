import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react';
import { profile } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

interface ContactLink {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: typeof Mail;
  description: string;
}

const contactLinks: ContactLink[] = [
  {
    id: 'email',
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
    description: 'Direct inquiry / opportunities',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: profile.shortName,
    href: profile.links.linkedin,
    icon: Linkedin,
    description: 'Professional updates & networking',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: `@${profile.githubUsername}`,
    href: profile.links.github,
    icon: Github,
    description: 'Code repositories & open-source projects',
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-heading',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-heading', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      gsap.fromTo(
        '.contact-link',
        { y: 25, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-links', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative py-20 md:py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* Heading */}
        <div className="contact-heading mb-12 sm:mb-16">
          <span className="inline-block text-[11px] font-display font-medium tracking-[0.3em] uppercase text-gold mb-3 sm:mb-4">
            Contact
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-chrome-900 dark:text-chrome-100 leading-[1.15]">
            Let's
            <span className="chrome-text"> connect.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-chrome-500 dark:text-chrome-400 max-w-md mx-auto font-body px-2">
            Whether it's about a project, a full-time role, or conversations on AI & engineering — feel free to reach out.
          </p>
        </div>

        {/* Contact links */}
        <div className="contact-links space-y-3.5 sm:space-y-4 max-w-lg mx-auto">
          {contactLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.id}
                href={link.href}
                target={link.id !== 'email' ? '_blank' : undefined}
                rel={link.id !== 'email' ? 'noopener noreferrer' : undefined}
                className="contact-link group flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl
                  border border-chrome-200/50 dark:border-chrome-700/30
                  bg-white dark:bg-surface-dark-3
                  hover:border-gold/30 dark:hover:border-gold/25
                  transition-all duration-300 text-left shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center
                  bg-chrome-100/70 dark:bg-surface-dark-4
                  text-chrome-600 dark:text-chrome-300
                  group-hover:bg-gold/15 group-hover:text-gold
                  transition-all duration-300 flex-shrink-0">
                  <Icon className="w-5 h-5" strokeWidth={1.8} />
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-sm font-display font-semibold text-chrome-900 dark:text-chrome-100 group-hover:text-gold transition-colors duration-200">
                    {link.label}
                  </div>
                  <div className="text-xs text-chrome-500 dark:text-chrome-400 truncate mt-0.5">
                    {link.description}
                  </div>
                </div>

                <ArrowUpRight className="w-4 h-4 text-chrome-400 group-hover:text-gold transition-all duration-300 flex-shrink-0" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
