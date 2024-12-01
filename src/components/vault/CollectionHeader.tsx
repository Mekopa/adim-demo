import React from 'react';
import { ChevronLeft, Upload, FolderPlus } from 'lucide-react';
import { Collection } from '../../types/vault';

interface CollectionHeaderProps {
  collection: Collection;
  onBack: () => void;
  onUpload: () => void;
  onCreateSubCollection: () => void;
}

export default function CollectionHeader({ 
  collection, 
  onBack, 
  onUpload,
  onCreateSubCollection 
}: CollectionHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-background rounded-lg transition-colors text-text-secondary hover:text-text"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-text">{collection.name}</h2>
          <p className="text-sm text-text-secondary">{collection.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onCreateSubCollection}
          className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-text hover:bg-background rounded-lg transition-colors"
        >
          <FolderPlus className="w-5 h-5" />
          <span>New Sub-collection</span>
        </button>
        <button
          onClick={onUpload}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Documents</span>
        </button>
      </div>
    </div>
  );
}