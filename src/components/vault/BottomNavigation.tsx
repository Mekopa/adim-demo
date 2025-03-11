import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Folder } from '../../types/vault';

interface BottomNavigationProps {
  currentPath: Folder[];
  onNavigate: (folderId: string | null) => void;
}

export default function BottomNavigation({ currentPath, onNavigate }: BottomNavigationProps) {
  return (
    <div className="flex-shrink-0 flex items-center h-20 px-4 text-text ">
      <nav className="flex items-center space-x-1 text-sm overflow-x-auto scrollbar-hide w-full">
        <button
          onClick={() => onNavigate(null)}
          className="flex items-center px-2 py-1 rounded hover:bg-[#2c2c2e] transition-colors flex-shrink-0"
        >
          <Home className="w-4 h-4" />
        </button>

        {currentPath.map((folder) => (
          <React.Fragment key={folder.id}>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => onNavigate(folder.id)}
              className="px-2 text-base py-1 rounded hover:bg-[#2c2c2e] transition-colors truncate max-w-[200px] flex-shrink-0"
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}