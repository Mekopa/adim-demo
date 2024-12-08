import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search collections..."
        className="w-[250px] pl-10 pr-4 py-2 bg-input text-text placeholder-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent rounded-l-lg border border-r-0 border-input-border focus:z-10"
      />
      <Search className="absolute left-3 top-2.5 w-5 h-5 text-text-secondary pointer-events-none" />
    </div>
  );
}