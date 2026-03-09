export interface Snippet {
  id: string;
  title: string;
  description: string;
  content: string;
  categories: string[];
  isFavorite: boolean;
  // Ownership & audit
  userId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: string;
  lastLoginAt: string;
}

export const CATEGORIES = ['AI', 'Prompt', 'Sitecore', 'Codelab', 'Cloud', 'Frontend', 'Backend'];

export const MOCK_DATA: Omit<Snippet, 'id' | 'userId' | 'createdBy' | 'updatedBy'>[] = [
  {
    title: 'Sitecore Edge Search Query',
    description: 'GraphQL query for Sitecore Edge — searches items by name and returns URL.',
    content: 'query {\n  search(where: { name: "demo" }) {\n    results {\n      name\n      url\n    }\n  }\n}',
    categories: ['Sitecore', 'Backend'],
    isFavorite: true,
    createdAt: new Date('2026-03-01').toISOString(),
    updatedAt: new Date('2026-03-01').toISOString(),
  },
  {
    title: 'AI Prompt - Explainer',
    description: 'Use this prompt to get a clear, junior-friendly explanation of any code concept.',
    content: 'Act as a senior developer. Explain the following code concept in simple terms for a junior audience:',
    categories: ['AI', 'Prompt'],
    isFavorite: false,
    createdAt: new Date('2026-03-05').toISOString(),
    updatedAt: new Date('2026-03-08').toISOString(),
  },
  {
    title: 'Codelab Setup Script',
    description: 'Clone and install the codelab starter repo — run this at the beginning of the session.',
    content: 'git clone https://github.com/codelab/starter.git\ncd starter\nnpm install',
    categories: ['Codelab'],
    isFavorite: false,
    createdAt: new Date('2026-03-09').toISOString(),
    updatedAt: new Date('2026-03-09').toISOString(),
  },
];
