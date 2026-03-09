'use client';

import { CATEGORIES } from '../types';

interface Props {
  selected: string[];
  onToggle: (cat: string) => void;
}

export function CategoryFilter({ selected, onToggle }: Props) {
  return (
    <div className="categories-filter">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={`tag-btn ${selected.includes(cat) ? 'active' : ''}`}
          onClick={() => onToggle(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
