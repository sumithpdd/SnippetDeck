export interface Snippet {
  id: string;
  title: string;
  content: string;
  categories: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES = ['AI', 'Prompt', 'Sitecore', 'Codelab', 'Cloud', 'Frontend', 'Backend'];

export const MOCK_DATA: Snippet[] = [
  {
    id: '1',
    title: 'Sitecore Edge Search Query',
    content: 'query {\n  search(where: { name: "demo" }) {\n    results {\n      name\n      url\n    }\n  }\n}',
    categories: ['Sitecore', 'Backend'],
    isFavorite: true,
    createdAt: new Date('2026-03-01').toISOString(),
    updatedAt: new Date('2026-03-01').toISOString()
  },
  {
    id: '2',
    title: 'AI Prompt - Explainer',
    content: 'Act as a senior developer. Explain the following code concept in simple terms for a junior audience:',
    categories: ['AI', 'Prompt'],
    isFavorite: false,
    createdAt: new Date('2026-03-05').toISOString(),
    updatedAt: new Date('2026-03-08').toISOString()
  },
  {
    id: '3',
    title: 'Codelab Setup Script',
    content: 'git clone https://github.com/codelab/starter.git\ncd starter\nnpm install',
    categories: ['Codelab'],
    isFavorite: false,
    createdAt: new Date('2026-03-09').toISOString(),
    updatedAt: new Date('2026-03-09').toISOString()
  }
];
