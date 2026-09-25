export interface LinkedInPost {
  id: string;
  title: string;
  excerpt: string;
  topic: string;
  engagement: {
    reactions: number;
    comments: number;
    contributions: string;
    label: string;
  };
  url: string;
  tags: string[];
}

export const linkedinPosts: LinkedInPost[] = [
  {
    id: 'api-keys',
    title: 'API Keys Exposed: A Dev\'s Worst Nightmare',
    excerpt: 'One wrong push… and suddenly your API keys are trending more than your project. Security is not a feature, it\'s a fundamental responsibility.',
    topic: 'Developer Security & Best Practices',
    engagement: {
      reactions: 142,
      comments: 33,
      contributions: '4.8k+ Impressions / Reach',
      label: '142 Reactions · 33 Comments · 4.8k Impressions',
    },
    url: 'https://lnkd.in/p/duu6B9KE',
    tags: ['Programming', 'GitHub', 'Cybersecurity', 'Developer Life'],
  },
  {
    id: 'ai-daily-life',
    title: 'AI Seamlessly Integrated into Daily Life',
    excerpt: 'AI isn\'t even "the future" anymore — it\'s just casually existing everywhere around us. The internet is slowly turning into a place where you can\'t tell what was human or AI.',
    topic: 'AI & Internet Culture',
    engagement: {
      reactions: 88,
      comments: 15,
      contributions: '2.6k+ Impressions / Reach',
      label: '88 Reactions · 15 Comments · 2.6k Impressions',
    },
    url: 'https://lnkd.in/p/d4YdxbMw',
    tags: ['AI', 'Technology', 'Internet Culture', 'Future Tech'],
  },
];
