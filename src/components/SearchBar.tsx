'use client';

import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="search-bar">
      <Search className="search-icon" size={18} />
      <input
        type="text"
        placeholder="Search snippets..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
