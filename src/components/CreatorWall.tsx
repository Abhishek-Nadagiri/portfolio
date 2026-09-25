import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, ExternalLink, Linkedin, ThumbsUp, TrendingUp } from 'lucide-react';
import { linkedinPosts } from '../data/linkedin';

gsap.registerPlugin(ScrollTrigger);

export default function CreatorWall() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cw-heading',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.cw-heading', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      gsap.fromTo(
        '.cw-card',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: '.cw-grid', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="creator" className="relative py-20 md:py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="cw-heading mb-12 sm:mb-16 md:mb-20">
          <span className="inline-block text-[11px] font-display font-medium tracking-[0.3em] uppercase text-gold mb-3 sm:mb-4">
            Creator
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-chrome-900 dark:text-chrome-100 leading-[1.15]">
            Content that
            <span className="chrome-text"> resonates.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-chrome-500 dark:text-chrome-400 max-w-lg font-body">
            Top-performing LinkedIn posts sharing real tech experiments, prompting insights, and engineering lessons with live engagement.
          </p>
        </div>

        {/* Creator wall cards */}
        <div className="cw-grid grid md:grid-cols-2 gap-6 md:gap-8">
          {linkedinPosts.map((post, i) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cw-card group relative flex flex-col justify-between rounded-2xl overflow-hidden
                border border-chrome-200/50 dark:border-chrome-700/30
                bg-white dark:bg-surface-dark-3
                hover:border-gold/30 dark:hover:border-gold/25
                transition-all duration-300
                hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-gold/5"
            >
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-[#0077B5] via-[#0A66C2] to-[#004182]" />

              <div className="p-5 sm:p-7 md:p-8">
                {/* Post number + LinkedIn badge */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    <span className="text-[11px] font-display font-medium tracking-[0.15em] uppercase text-[#0A66C2]">
                      Featured Post
                    </span>
                  </div>
                  <span className="font-display text-sm text-chrome-400 dark:text-chrome-600 font-medium">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-chrome-900 dark:text-chrome-100 mb-3 sm:mb-4 leading-snug
                  group-hover:text-gold transition-colors duration-200">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-chrome-600 dark:text-chrome-400 leading-relaxed mb-5 font-body">
                  {post.excerpt}
                </p>

                {/* Topic tag */}
                <div className="inline-block px-3 py-1 rounded-md text-[11px] font-display font-medium tracking-wide
                  bg-chrome-100/70 dark:bg-surface-dark-4 text-chrome-600 dark:text-chrome-300
                  border border-chrome-200/50 dark:border-chrome-700/20 mb-4">
                  {post.topic}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-display text-chrome-400 dark:text-chrome-500"
                    >
                      #{tag.replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>

                {/* Engagement Breakdown: Reactions, Comments, Contributions */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-chrome-50 dark:bg-surface-dark-4/60 border border-chrome-200/40 dark:border-chrome-700/20">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-1 text-gold text-xs font-semibold">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.engagement.reactions}</span>
                    </div>
                    <span className="text-[10px] text-chrome-400 dark:text-chrome-500 font-display mt-0.5">
                      Reactions
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center border-x border-chrome-200/40 dark:border-chrome-700/30 px-1">
                    <div className="flex items-center gap-1 text-blue-500 text-xs font-semibold">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.engagement.comments}</span>
                    </div>
                    <span className="text-[10px] text-chrome-400 dark:text-chrome-500 font-display mt-0.5">
                      Comments
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{post.engagement.contributions.split(' ')[0]}</span>
                    </div>
                    <span className="text-[10px] text-chrome-400 dark:text-chrome-500 font-display mt-0.5">
                      Impressions
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer link to original LinkedIn post */}
              <div className="px-5 sm:px-7 md:px-8 py-3.5 sm:py-4 border-t border-chrome-100 dark:border-chrome-800/60
                flex items-center justify-between bg-chrome-50/50 dark:bg-surface-dark-4/20">
                <span className="text-xs text-chrome-400 dark:text-chrome-500 font-display">
                  Community Discussion
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-display font-medium text-gold
                  opacity-90 group-hover:opacity-100 transition-opacity duration-200">
                  Read on LinkedIn
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
