// src/components/vault/EntityTypeFilters.tsx
import React from 'react';
import { Filter } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface EntityTypeFiltersProps {
  filterOptions: FilterOption[];
  filters: string[];
  toggleFilter: (filterId: string) => void;
}

export const EntityTypeFilters: React.FC<EntityTypeFiltersProps> = ({
  filterOptions,
  filters,
  toggleFilter,
}) => {
  return (
    <div className="border-b border-gray-700/50 p-3 bg-gray-800/50">
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Filter by type:</span>
        {filterOptions.map(filter => (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-colors ${
              filters.includes(filter.id)
                ? 'bg-primary text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {filter.icon}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
