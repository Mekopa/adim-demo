import React from 'react';
import { Users, User } from 'lucide-react';

interface ViewToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex h-[42px] bg-input border border-l-0 border-input-border rounded-r-lg">
      <button
        className={`flex items-center gap-2 px-4 transition-colors ${
          !value ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text'
        }`}
        onClick={() => onChange(false)}
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">Yours</span>
      </button>
      
      <div className="w-px bg-input-border" />
      
      <button
        className={`flex items-center gap-2 px-4 transition-colors ${
          value ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text'
        }`}
        onClick={() => onChange(true)}
      >
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">Shared</span>
      </button>
    </div>
  );
}