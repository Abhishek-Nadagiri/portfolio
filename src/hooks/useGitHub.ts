import { useEffect, useState, useCallback, useRef } from 'react';

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  html_url: string;
  homepage: string | null;
  updated_at: string;
}

export interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
  profileUrl: string;
  avatarUrl: string;
}

export interface GitHubData {
  stats: GitHubStats;
  repos: GitHubRepo[];
  languages: Record<string, number>;
  loading: boolean;
  isRefreshing: boolean;
  error: boolean;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

// Fallback data in case GitHub API rate limits or network issues
const fallbackStats: GitHubStats = {
  publicRepos: 13,
  followers: 3,
  following: 3,
  profileUrl: 'https://github.com/Abhishek-Nadagiri',
  avatarUrl: 'https://avatars.githubusercontent.com/u/185952411?v=4',
};

const fallbackRepos: GitHubRepo[] = [
  {
    name: 'ayucare',
    description: 'Healthcare web application with modern clinical workflows',
    language: 'TypeScript',
    stars: 0,
    forks: 0,
    html_url: 'https://github.com/Abhishek-Nadagiri/ayucare',
    homepage: 'https://medora-rosy.vercel.app',
    updated_at: '2026-09-21T15:21:41Z',
  },
  {
    name: 'tech-layoffs-predictor',
    description: 'Workforce analytics platform analyzing 12,000+ layoff records with Random Forest and XGBoost',
    language: 'Python',
    stars: 1,
    forks: 0,
    html_url: 'https://github.com/Abhishek-Nadagiri/tech-layoffs-predictor',
    homepage: null,
    updated_at: '2026-09-08T11:22:19Z',
  },
  {
    name: 'rebite',
    description: 'AI-Powered Food Waste Reduction Platform with expiration tracking and recipes',
    language: 'TypeScript',
    stars: 1,
    forks: 0,
    html_url: 'https://github.com/Abhishek-Nadagiri/rebite',
    homepage: 'https://rebite.vercel.app',
    updated_at: '2026-08-27T04:44:25Z',
  },
  {
    name: 'Inventa',
    description: 'Modern full-stack web application with responsive UI',
    language: 'TypeScript',
    stars: 1,
    forks: 0,
    html_url: 'https://github.com/Abhishek-Nadagiri/Inventa',
    homepage: 'https://inventa-black.vercel.app',
    updated_at: '2026-08-27T04:44:24Z',
  },
  {
    name: 'farmerfield',
    description: 'Agricultural technology platform empowering farmers with market and crop data',
    language: 'TypeScript',
    stars: 0,
    forks: 0,
    html_url: 'https://github.com/Abhishek-Nadagiri/farmerfield',
    homepage: 'https://farmerfield.vercel.app',
    updated_at: '2026-08-27T04:44:18Z',
  },
  {
    name: 'Netflix_analysis',
    description: 'Comprehensive Netflix content dataset analysis with Python, Pandas, and Power BI',
    language: 'Jupyter Notebook',
    stars: 0,
    forks: 0,
    html_url: 'https://github.com/Abhishek-Nadagiri/Netflix_analysis',
    homepage: null,
    updated_at: '2026-06-07T15:13:11Z',
  },
];

export function useGitHub(username: string): GitHubData {
  const [stats, setStats] = useState<GitHubStats>(fallbackStats);
  const [repos, setRepos] = useState<GitHubRepo[]>(fallbackRepos);
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isMountedRef = useRef(true);

  const calculateLanguages = (repoList: GitHubRepo[]) => {
    const langCount: Record<string, number> = {};
    repoList.forEach((r: GitHubRepo) => {
      if (r.language) {
        langCount[r.language] = (langCount[r.language] || 0) + 1;
      }
    });
    return langCount;
  };

  const fetchData = useCallback(async (showLoadingSpinner = false) => {
    if (!username) return;
    if (showLoadingSpinner) setIsRefreshing(true);

    try {
      // Add timestamp param and cache: 'no-store' to guarantee fresh data on new repos/commits
      const timestamp = Date.now();
      const headers = {
        Accept: 'application/vnd.github.v3+json',
      };

      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}?_t=${timestamp}`, {
          headers,
          cache: 'no-store',
        }),
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100&_t=${timestamp}`, {
          headers,
          cache: 'no-store',
        }),
      ]);

      if (!userRes.ok || !reposRes.ok) {
        throw new Error(`GitHub API responded with status ${userRes.status}/${reposRes.status}`);
      }

      const userData = await userRes.json();
      const reposData = await reposRes.json();

      if (!isMountedRef.current) return;

      setStats({
        publicRepos: userData.public_repos ?? fallbackStats.publicRepos,
        followers: userData.followers ?? fallbackStats.followers,
        following: userData.following ?? fallbackStats.following,
        profileUrl: userData.html_url || `https://github.com/${username}`,
        avatarUrl: userData.avatar_url || fallbackStats.avatarUrl,
      });

      const mappedRepos: GitHubRepo[] = (reposData as any[])
        .filter((r) => r.name.toLowerCase() !== username.toLowerCase()) // exclude profile README repo
        .map((r) => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count ?? 0,
          forks: r.forks_count ?? 0,
          html_url: r.html_url,
          homepage: r.homepage && r.homepage.trim().length > 0 ? r.homepage : null,
          updated_at: r.updated_at,
        }))
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      if (mappedRepos.length > 0) {
        setRepos(mappedRepos);
        setLanguages(calculateLanguages(mappedRepos));
      }

      setLastUpdated(new Date());
      setError(false);
    } catch (err) {
      console.warn('GitHub fetch error (using fallback/cached data):', err);
      if (isMountedRef.current) {
        setError(true);
        // Fallback languages calculation
        setLanguages(calculateLanguages(fallbackRepos));
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [username]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;
    fetchData(false);

    // Auto-update polling every 45 seconds to detect newly created or updated repos
    const intervalId = setInterval(() => {
      fetchData(false);
    }, 45000);

    // Auto-update when user switches back to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData(false);
      }
    };

    const handleWindowFocus = () => {
      fetchData(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return { stats, repos, languages, loading, isRefreshing, error, lastUpdated, refresh };
}
