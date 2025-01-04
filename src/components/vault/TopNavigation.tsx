import React from 'react';
import { ChevronLeft, Plus, Upload } from 'lucide-react';
import { Folder } from '../../types/vault';

interface TopNavigationProps {
  currentFolder: Folder | null;
  onBack: () => void;
  onUpload: () => void;
  onCreateFolder: () => void;
}

export default function TopNavigation({ 
  currentFolder, 
  onBack, 
  onUpload,
  onCreateFolder 
}: TopNavigationProps) {
  return (
    <div className="flex items-center justify-between h-10 px-4 text-text">
      <div className="flex items-center">
        {currentFolder && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded hover:bg-[#2c2c2e] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="ml-2 text-2xl font-medium truncate">
          {currentFolder ? currentFolder.name : 'My Files'}
        </h1>
      </div>

      <div className="flex items-center gap-3">


      </div>
    </div>
  );
}