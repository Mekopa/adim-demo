// src/components/vault/GraphSearchBar.tsx
import React, { KeyboardEvent } from 'react';
import { Search } from 'lucide-react';

interface GraphSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
}

export const GraphSearchBar: React.FC<GraphSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => {
  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center p-2 gap-2 border-b border-gray-700/50">
      <Search className="w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search for entities..."
        className="bg-transparent border-none outline-none text-sm text-gray-300 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={onKeyPress}
      />
      <button 
        className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};
