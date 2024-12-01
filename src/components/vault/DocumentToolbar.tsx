import React from 'react';
import { Grid, List, Search, ArrowUp, ArrowDown, Trash2, FolderUp } from 'lucide-react';

interface DocumentToolbarProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: 'name' | 'date' | 'size' | 'type') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkMove: (targetSubCollectionId: string | null) => void;
  isSubCollection?: boolean;
}

export default function DocumentToolbar({
  viewMode,
  onViewModeChange,
  sortField,
  sortDirection,
  onSort,
  searchQuery,
  onSearchChange,
  selectedCount,
  onBulkDelete,
  onBulkMove,
  isSubCollection,
}: DocumentToolbarProps) {
  const SortIcon = sortDirection === 'asc' ? ArrowUp : ArrowDown;

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search documents..."
            className="pl-10 pr-4 py-2 w-64 bg-input border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-text-secondary" />
        </div>

        <div className="flex items-center gap-2 border-l border-border pl-4">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-background'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-background'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">
              {selectedCount} selected
            </span>
            {isSubCollection && (
              <button
                onClick={() => onBulkMove(null)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg hover:bg-background"
              >
                <FolderUp className="w-4 h-4" />
                <span>Move to Parent</span>
              </button>
            )}
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-error rounded-lg hover:bg-error/10"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 border-l border-border pl-4">
          {['name', 'date', 'size', 'type'].map((field) => (
            <button
              key={field}
              onClick={() => onSort(field as 'name' | 'date' | 'size' | 'type')}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg ${
                sortField === field
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-background'
              }`}
            >
              <span className="capitalize">{field}</span>
              {sortField === field && <SortIcon className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}