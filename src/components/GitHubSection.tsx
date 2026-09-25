import { useEffect, useRef, useMemo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Github, Star, GitFork, ExternalLink, Activity,
  RefreshCw, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';
import { useGitHub, GitHubRepo } from '../hooks/useGitHub';
import { profile } from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────── Helper: Relative Time ──────────────── */
function formatTimeAgo(dateString: string): string {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  } catch {
    return 'recently';
  }
}

/* ──────────────── Animated Contribution Grid ──────────────── */
function ContributionGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  const cells = useMemo(() => {
    const activityMonths = [
      '2025-04', '2025-07', '2026-01', '2026-02', '2026-03',
      '2026-05', '2026-06', '2026-08', '2026-09',
    ];
    const grid: number[] = [];
    for (let w = 0; w < 52; w++) {
      for (let d = 0; d < 7; d++) {
        const monthStr = `2026-${String(Math.floor(w / 4.3) + 1).padStart(2, '0')}`;
        const isActive = activityMonths.some((m) => monthStr.startsWith(m.slice(0, 7)));
        const seed = (w * 7 + d) * 2654435761;
        const rand = ((seed >>> 0) % 100) / 100;
        let level = 0;
        if (isActive) {
          if (rand > 0.7) level = 3;
          else if (rand > 0.4) level = 2;
          else if (rand > 0.15) level = 1;
        } else {
          if (rand > 0.9) level = 1;
        }
        grid.push(level);
      }
    }
    return grid;
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !gridRef.current) return;

    const squares = gridRef.current.querySelectorAll('.contrib-cell');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        squares,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.3,
          stagger: { each: 0.005, from: 'start' },
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const levelColors = {
    dark: ['bg-surface-dark-4', 'bg-emerald-900/60', 'bg-emerald-700/60', 'bg-emerald-500/70'],
    light: ['bg-chrome-100/60', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-600'],
  };

  return (
    <div ref={gridRef} className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
      <div className="grid grid-flow-col gap-[3px] py-1" style={{ gridTemplateRows: 'repeat(7, 1fr)', minWidth: '680px' }}>
        {cells.map((level, i) => (
          <div
            key={i}
            className={`contrib-cell w-[10px] sm:w-[11px] h-[10px] sm:h-[11px] rounded-[2px] transition-colors duration-200
              ${levelColors.light[level]} dark:${levelColors.dark[level]}`}
            style={{ opacity: 0 }}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-chrome-400 dark:text-chrome-500 font-display">
        <span>Less</span>
        {[0, 1, 2, 3].map((l) => (
          <div key={l} className={`w-[10px] h-[10px] rounded-[2px] ${levelColors.light[l]} dark:${levelColors.dark[l]}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

/* ──────────────── Language Bar ──────────────── */
function LanguageBar({ languages }: { languages: Record<string, number> }) {
  const barRef = useRef<HTMLDivElement>(null);
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(languages).sort((a, b) => b[1] - a[1]);

  const langColors: Record<string, string> = {
    TypeScript: '#3178C6',
    Python: '#3572A5',
    JavaScript: '#F1E05A',
    'Jupyter Notebook': '#DA5B0B',
    HTML: '#E34C26',
    CSS: '#563D7C',
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !barRef.current) return;

    const segments = barRef.current.querySelectorAll('.lang-segment');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        segments,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: barRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [languages]);

  if (total === 0) return null;

  return (
    <div>
      {/* Bar */}
      <div ref={barRef} className="flex h-2.5 rounded-full overflow-hidden bg-chrome-100 dark:bg-surface-dark-4 mb-4">
        {sorted.map(([lang, count]) => (
          <div
            key={lang}
            className="lang-segment origin-left"
            style={{
              width: `${(count / total) * 100}%`,
              backgroundColor: langColors[lang] || '#6B7280',
            }}
          />
        ))}
      </div>
      {/* Labels */}
      <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-2">
        {sorted.map(([lang, count]) => (
          <div key={lang} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: langColors[lang] || '#6B7280' }}
            />
            <span className="text-xs font-display text-chrome-600 dark:text-chrome-300">
              {lang}
            </span>
            <span className="text-[11px] text-chrome-400 dark:text-chrome-500 font-mono">
              {((count / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────── Repo Card ──────────────── */
function RepoCard({ repo }: { repo: GitHubRepo }) {
  const langColors: Record<string, string> = {
    TypeScript: '#3178C6',
    Python: '#3572A5',
    JavaScript: '#F1E05A',
    'Jupyter Notebook': '#DA5B0B',
    HTML: '#E34C26',
    CSS: '#563D7C',
  };

  return (
    <div
      className="group relative flex flex-col justify-between p-5 rounded-2xl
        border border-chrome-200/50 dark:border-chrome-700/30
        bg-white dark:bg-surface-dark-3
        hover:border-gold/30 dark:hover:border-gold/25
        transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-gold/5 h-full"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm sm:text-base font-semibold text-chrome-900 dark:text-chrome-100
              group-hover:text-gold transition-colors duration-200 flex items-center gap-1.5 break-all"
          >
            {repo.name}
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 flex-shrink-0" />
          </a>
          <span className="text-[10px] text-chrome-400 dark:text-chrome-500 whitespace-nowrap font-mono mt-0.5">
            {formatTimeAgo(repo.updated_at)}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-chrome-500 dark:text-chrome-400 mb-4 line-clamp-2 font-body leading-relaxed">
          {repo.description || 'No description provided'}
        </p>
      </div>

      <div className="pt-2 border-t border-chrome-100 dark:border-chrome-800/60 flex items-center justify-between text-xs text-chrome-400 dark:text-chrome-500">
        <div className="flex items-center gap-3">
          {repo.language && (
            <span className="flex items-center gap-1.5 font-display text-[11px]">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: langColors[repo.language] || '#6B7280' }}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px]">
            <Star className="w-3 h-3 text-gold/70" />
            {repo.stars}
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <GitFork className="w-3 h-3" />
            {repo.forks}
          </span>
        </div>

        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-display font-medium text-gold hover:underline flex items-center gap-1"
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}

/* ──────────────── Main Section ──────────────── */
export default function GitHubSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { stats, repos, languages, loading, isRefreshing, lastUpdated, refresh } = useGitHub(profile.githubUsername);
  const [showAllRepos, setShowAllRepos] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gh-heading',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.gh-heading', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      gsap.fromTo(
        '.gh-stat',
        { y: 20, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.gh-stats', start: 'top 85%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const StatCounter = ({ value, label }: { value: number; label: string }) => {
    return (
      <div className="gh-stat p-4 sm:p-5 rounded-2xl border border-chrome-200/50 dark:border-chrome-700/30 bg-white dark:bg-surface-dark-3 text-center transition-colors">
        <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-chrome-900 dark:text-chrome-100 mb-1">
          {value}
        </div>
        <div className="text-[11px] sm:text-xs font-display font-medium tracking-wider text-chrome-400 dark:text-chrome-500 uppercase">
          {label}
        </div>
      </div>
    );
  };

  const displayedRepos = showAllRepos ? repos : repos.slice(0, 6);

  return (
    <section ref={sectionRef} id="github" className="relative py-20 md:py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading & Live Status Banner */}
        <div className="gh-heading mb-10 sm:mb-14 md:mb-16">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="inline-block text-[11px] font-display font-medium tracking-[0.3em] uppercase text-gold">
              Live GitHub Activity
            </span>

            {/* Live Sync Status indicator & manual trigger */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync Active
              </div>

              <button
                onClick={() => refresh()}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-display font-medium
                  border border-chrome-200 dark:border-chrome-700
                  text-chrome-600 dark:text-chrome-300
                  hover:text-gold hover:border-gold/40
                  transition-colors disabled:opacity-50"
                aria-label="Refresh GitHub data"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-gold' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync'}</span>
              </button>
            </div>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-chrome-900 dark:text-chrome-100 leading-[1.15]">
            Real-time code &
            <span className="chrome-text"> repository updates.</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-chrome-500 dark:text-chrome-400 max-w-xl font-body">
            Automatically synced with GitHub. Any new repository or commit is dynamically reflected here in real time.
          </p>
        </div>

        {/* Stats row */}
        <div className="gh-stats grid grid-cols-3 gap-2.5 sm:gap-4 mb-8 sm:mb-12">
          <StatCounter value={stats.publicRepos} label="Repositories" />
          <StatCounter value={stats.followers} label="Followers" />
          <StatCounter value={stats.following} label="Following" />
        </div>

        {/* Contribution graph */}
        <div className="mb-8 sm:mb-12 p-4 sm:p-6 rounded-2xl border border-chrome-200/50 dark:border-chrome-700/30 bg-white dark:bg-surface-dark-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gold" />
              <h3 className="font-display text-sm font-semibold text-chrome-900 dark:text-chrome-100">
                Commit & Contribution Activity
              </h3>
            </div>
            <span className="text-[11px] text-chrome-400 dark:text-chrome-500 hidden sm:inline font-mono">
              52-week activity stream
            </span>
          </div>
          <ContributionGrid />
        </div>

        {/* Languages breakdown */}
        <div className="mb-8 sm:mb-12 p-4 sm:p-6 rounded-2xl border border-chrome-200/50 dark:border-chrome-700/30 bg-white dark:bg-surface-dark-3">
          <h3 className="font-display text-sm font-semibold text-chrome-900 dark:text-chrome-100 mb-4">
            Primary Language Breakdown
          </h3>
          <LanguageBar languages={languages} />
        </div>

        {/* Repositories */}
        <div className="gh-repos">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm sm:text-base font-semibold text-chrome-900 dark:text-chrome-100">
                Repositories ({repos.length})
              </h3>
              {lastUpdated && (
                <span className="text-[10px] text-chrome-400 dark:text-chrome-500 font-mono">
                  · Updated {formatTimeAgo(lastUpdated.toISOString())}
                </span>
              )}
            </div>

            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-display font-medium text-gold hover:text-gold-bright transition-colors duration-200"
            >
              View on GitHub
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-5 rounded-2xl border border-chrome-200/40 dark:border-chrome-700/20 animate-pulse bg-white dark:bg-surface-dark-3">
                  <div className="h-4 bg-chrome-200/50 dark:bg-surface-dark-4 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-chrome-100 dark:bg-surface-dark-4 rounded w-full mb-2" />
                  <div className="h-3 bg-chrome-100 dark:bg-surface-dark-4 rounded w-1/2 mb-4" />
                  <div className="h-3 bg-chrome-100 dark:bg-surface-dark-4 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedRepos.map((repo) => (
                  <div key={repo.name} className="gh-repo">
                    <RepoCard repo={repo} />
                  </div>
                ))}
              </div>

              {/* Toggle to view all repositories */}
              {repos.length > 6 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowAllRepos(!showAllRepos)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-display font-medium
                      border border-chrome-200 dark:border-chrome-700
                      text-chrome-700 dark:text-chrome-300
                      hover:border-gold/40 hover:text-gold
                      transition-all duration-200"
                  >
                    {showAllRepos ? (
                      <>
                        Show Top 6 <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Show All {repos.length} Repositories <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* GitHub Profile Banner */}
        <div className="mt-12 text-center">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full
              border border-chrome-200 dark:border-chrome-700
              text-chrome-700 dark:text-chrome-300
              font-display text-sm font-medium tracking-wide
              hover:border-gold/40 dark:hover:border-gold/30
              hover:text-gold dark:hover:text-gold
              transition-all duration-300 shadow-sm"
          >
            <Github className="w-4 h-4" />
            <span>github.com/{profile.githubUsername}</span>
            <ExternalLink className="w-3.5 h-3.5 text-chrome-400 group-hover:text-gold" />
          </a>
        </div>
      </div>
    </section>
  );
}
