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
      reactions: 776,
      comments: 33,
      contributions: '55k+ Impressions',
      label: '776 Reactions · 33 Comments · 55k+ Impressions',
    },
    url: 'https://lnkd.in/p/duu6B9KE',
    tags: ['Programming', 'GitHub', 'Cybersecurity', 'Developer Life'],
  },
  {
    id: 'ai-daily-life',
    title: 'AI Seamlessly Integrated into Daily Life',
    excerpt: 'AI isn\'t even "the future" anymore — it\'s just casually existing everywhere around us. The internet is slowly turning into a place where you can\'t tell whether something was human or AI.',
    topic: 'AI & Internet Culture',
    engagement: {
      reactions: 303,
      comments: 15,
      contributions: '22k+ Impressions',
      label: '303 Reactions · 15 Comments · 22k+ Impressions',
    },
    url: 'https://lnkd.in/p/d4YdxbMw',
    tags: ['AI', 'Technology', 'Internet Culture', 'Future Tech'],
  },
];
