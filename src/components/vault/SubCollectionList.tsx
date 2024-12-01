import React from 'react';
import { FolderPlus, Folder } from 'lucide-react';
import { SubCollection } from '../../types/vault';

interface SubCollectionListProps {
  subCollections: SubCollection[];
  selectedSubCollection: SubCollection | null;
  onCreateSubCollection: () => void;
  onSelectSubCollection: (subCollection: SubCollection | null) => void;
}

export default function SubCollectionList({
  subCollections,
  selectedSubCollection,
  onCreateSubCollection,
  onSelectSubCollection,
}: SubCollectionListProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-text">Sub-collections</h3>
        <button
          onClick={onCreateSubCollection}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text hover:bg-background rounded-lg transition-colors"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Sub-collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subCollections.map((subCollection) => (
          <button
            key={subCollection.id}
            onClick={() => onSelectSubCollection(subCollection)}
            className={`flex items-center gap-3 p-4 bg-surface border rounded-lg transition-colors text-left group ${
              selectedSubCollection?.id === subCollection.id
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary'
            }`}
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Folder className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-text group-hover:text-primary transition-colors">
                {subCollection.name}
              </h4>
              <p className="text-sm text-text-secondary">
                {subCollection.documentCount} documents
              </p>
            </div>
          </button>
        ))}

        {subCollections.length === 0 && (
          <button
            onClick={onCreateSubCollection}
            className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-text-secondary"
          >
            <FolderPlus className="w-8 h-8" />
            <span>Create your first sub-collection</span>
          </button>
        )}
      </div>
    </div>
  );
}