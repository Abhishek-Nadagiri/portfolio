export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    description: 'Building full-stack applications from data platforms to web experiences.',
    skills: [
      'C',
      'Python',
      'TypeScript',
      'SQL',
      'HTML & CSS',
      'React',
      'Next.js',
      'Tailwind CSS',
      'Supabase',
      'MySQL',
      'Streamlit',
      'Git & GitHub',
      'Vercel',
      'Jupyter Notebook',
    ],
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Experimenting with AI to push creative and technical boundaries.',
    skills: [
      'Prompt Design',
      'Prompt Optimization',
      'Structured Prompting',
      'AI-Assisted Development',
      'AI Workflows',
      'Prompt Experimentation',
    ],
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    description: 'Sharing experiments, insights, and ideas through technical content.',
    skills: [
      'Technical Writing',
      'LinkedIn Content',
      'Developer Community',
      'Visual Storytelling',
      'Content Strategy',
    ],
  },
];

export const dataSkills: string[] = [
  'Pandas',
  'NumPy',
  'Scikit-learn',
  'Matplotlib',
  'Power BI',
  'Data Visualization',
  'Machine Learning',
  'Time-Series Analysis',
];
