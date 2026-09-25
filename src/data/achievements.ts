export interface Certification {
  id: string;
  name: string;
  organization: string;
  type: 'certification' | 'achievement';
}

export const certifications: Certification[] = [
  {
    id: 'accenture',
    name: 'Data Analytics and Visualization Virtual Experience',
    organization: 'Accenture (Forage)',
    type: 'certification',
  },
  {
    id: 'intel-ai',
    name: 'Intel AI Aware Certification',
    organization: 'Intel',
    type: 'certification',
  },
  {
    id: 'tcs',
    name: 'Career Edge — Young Professional',
    organization: 'TCS',
    type: 'certification',
  },
  {
    id: 'brainovision',
    name: 'International Student Workshop on Python',
    organization: 'Brainovision',
    type: 'certification',
  },
];

export const achievements: Certification[] = [
  {
    id: 'paytm',
    name: 'Received internship offer from Paytm for User Growth Intern role',
    organization: 'Paytm',
    type: 'achievement',
  },
  {
    id: 'spell-bee',
    name: 'Achieved First Grade at WIZ National Spell Bee (School Level, 2018)',
    organization: 'WIZ National',
    type: 'achievement',
  },
];
