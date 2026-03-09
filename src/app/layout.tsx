import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SnippetDeck Pro',
  description: 'Smart technical snippets for effortless demos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
