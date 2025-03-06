import React from 'react';
import { Search, File, Folder, X, FolderOpen } from 'lucide-react';
import { UploadedFile } from '../../types';

interface SelectedFilesProps {
  files: UploadedFile[];
  isSearching?: boolean;
  onRemoveFile: (fileId: string) => void;
  onBack: () => void;
  onReopen: () => void;
  onDeselectAll: () => void;
  selectedOption: 'search' | 'select' | 'upload' | null;
}

export default function SelectedFiles({ 
  files, 
  isSearching, 
  onRemoveFile, 
  onBack,
  onReopen,
  onDeselectAll,
  selectedOption
}: SelectedFilesProps) {
  if (!files.length && !isSearching) return null;

  const showFolderIcon = selectedOption === 'select';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isSearching ? (
              <>
                <Search className="w-5 h-5 text-primary" />
                <span className="text-text">Searching vault...</span>
              </>
            ) : (
              <>
                <File className="w-5 h-5 text-primary" />
                <span className="text-text">{files.length} item(s) selected</span>
              </>
            )}
          </div>
          {files.length > 0 && (
            <button
              onClick={onDeselectAll}
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              Deselect All
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showFolderIcon && (
            <button
              onClick={onReopen}
              className="p-1 hover:bg-background rounded-lg text-text-secondary hover:text-primary transition-colors"
              title="Select more files"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onBack}
            className="p-1 hover:bg-background rounded-lg"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {files.map(file => (
            <div key={file.id} className="flex items-center gap-2 p-2 bg-background rounded-lg">
              {file.type === 'folder' ? (
                <Folder className="w-4 h-4 text-blue-500" />
              ) : (
                <File className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm text-text truncate flex-1">{file.name}</span>
              <button
                onClick={() => onRemoveFile(file.id)}
                className="p-1 hover:bg-surface rounded-lg"
              >
                <X className="w-3 h-3 text-text-secondary" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}