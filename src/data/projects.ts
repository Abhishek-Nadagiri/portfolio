export interface Project {
  id: string;
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  techStack: string[];
  features: string[];
  github: string;
  liveDemo: string;
  metrics?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 'ayucare',
    title: 'Ayucare',
    subtitle: 'Healthcare Clinical & Workflow Platform',
    problem: 'Healthcare providers and patients struggle with fragmented appointment scheduling, paper records, and cumbersome clinic management.',
    solution: 'Engineered a modern healthcare web application streamlining clinical workflows, digital patient records, and real-time medical scheduling.',
    techStack: ['TypeScript', 'React', 'Tailwind CSS', 'Vercel'],
    features: [
      'Digital patient records & clinical management',
      'Real-time appointment booking workflows',
      'Intuitive clinical dashboard with analytics',
      'Full production deployment on Vercel',
    ],
    github: 'https://github.com/Abhishek-Nadagiri/ayucare',
    liveDemo: 'https://ayucare-three.vercel.app',
    metrics: 'Active Healthcare Web App',
    featured: true,
  },
  {
    id: 'rebite',
    title: 'ReBite',
    subtitle: 'AI-Powered Food Waste Reduction',
    problem: 'Surplus food from restaurants and events often goes to waste due to lack of real-time coordination between donors and recipients.',
    solution: 'Developed an AI-powered platform that streamlines surplus food redistribution, improving coordination between donors and recipients to reduce food waste.',
    techStack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'AI Integration', 'Vercel'],
    features: [
      'AI-powered food matching algorithm',
      'Real-time donor-recipient coordination',
      'Full-stack TypeScript architecture',
      'Deployed on Vercel with Supabase backend',
    ],
    github: 'https://github.com/Abhishek-Nadagiri/rebite',
    liveDemo: 'https://rebite.vercel.app',
    metrics: 'AI Redistribution Engine',
    featured: true,
  },
  {
    id: 'inventa',
    title: 'Inventa',
    subtitle: 'Modern Full-Stack Web Application',
    problem: 'Businesses need fast, responsive web applications with seamless inventory and workflow tracking.',
    solution: 'A TypeScript-powered application built with modern component architectures, fast state transitions, and responsive multi-device design.',
    techStack: ['TypeScript', 'React', 'Tailwind CSS', 'Vercel'],
    features: [
      'Modular TypeScript component architecture',
      'Real-time state and responsive layout',
      'Optimized asset loading & client caching',
      'Deployed to production on Vercel',
    ],
    github: 'https://github.com/Abhishek-Nadagiri/Inventa',
    liveDemo: 'https://inventa-black.vercel.app',
    metrics: 'Production Web App',
    featured: true,
  },
  {
    id: 'tech-layoffs',
    title: 'Tech Layoffs Predictor',
    subtitle: 'Workforce Analytics & ML Platform',
    problem: 'Understanding workforce trends across tech companies requires processing massive layoff datasets to uncover patterns traditional analysis overlooks.',
    solution: 'Built an end-to-end analytics platform processing 12,000+ real-world layoff records to identify industry, company, and region-specific trends using machine learning.',
    techStack: ['Python', 'Streamlit', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter Notebook'],
    features: [
      'Analyzed 12,000+ real-world layoff records',
      'Industry and region-specific trend forecasting',
      'Machine learning classification & regression models',
      'Interactive Streamlit data analytics dashboard',
    ],
    github: 'https://github.com/Abhishek-Nadagiri/tech-layoffs-predictor',
    liveDemo: 'https://tech-layoffs-predictor.streamlit.app',
    metrics: '12,000+ records analyzed',
    featured: true,
  },
];
