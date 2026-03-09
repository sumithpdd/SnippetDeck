'use client';

import { useState, useMemo } from 'react';
import { type Snippet } from '../types';

export function useFilters(snippets: Snippet[]) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredSnippets = useMemo(() => {
    const q = search.toLowerCase();
    return snippets
      .filter(s => {
        const matchesSearch =
          s.title.toLowerCase().includes(q) ||
          s.content.toLowerCase().includes(q);
        const matchesCategories =
          selectedCategories.length === 0 ||
          selectedCategories.every(cat => s.categories.includes(cat));
        return matchesSearch && matchesCategories;
      })
      .sort(
        (a, b) =>
          Number(b.isFavorite) - Number(a.isFavorite) ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [snippets, search, selectedCategories]);

  return { search, setSearch, selectedCategories, toggleCategory, filteredSnippets };
}
