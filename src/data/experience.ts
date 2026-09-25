export interface Experience {
  id: string;
  role: string;
  organization: string;
  duration: string;
  startDate: string;
  endDate: string;
  description: string;
  type: 'internship' | 'leadership';
}

export const experiences: Experience[] = [
  {
    id: 'zetheta',
    role: 'Data Analytics Intern',
    organization: 'Zetheta Algorithms Private Limited',
    duration: 'Jun 2026 – Jul 2026',
    startDate: '2026-06',
    endDate: '2026-07',
    description: 'Developed an end-to-end silver price forecasting system using 25+ years of historical commodity market data, leveraging machine learning and time-series models.',
    type: 'internship',
  },
  {
    id: 'google',
    role: 'Google Student Ambassador',
    organization: 'Google Gemini (On Campus)',
    duration: 'Aug 2025 – Nov 2025',
    startDate: '2025-08',
    endDate: '2025-11',
    description: 'Spearheaded campus-wide brand awareness campaigns for Google Gemini, driving measurable growth in product adoption and student engagement across peer networks.',
    type: 'leadership',
  },
];

export const education = {
  degree: 'B.Tech in Computer Science (Business Systems)',
  institution: 'Sree Dattha Institute of Engineering and Science',
  duration: '2023 – present',
  cgpa: '8.88 / 10.0',
};
