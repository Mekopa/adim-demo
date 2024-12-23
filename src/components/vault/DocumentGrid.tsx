import React, { useState } from 'react';
import { Document } from '../../types/vault';
import DocumentCard from './DocumentCard';
import DocumentListItem from './DocumentListItem';
import DocumentToolbar from './DocumentToolbar';

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'date' | 'size' | 'type';
type SortDirection = 'asc' | 'desc';

interface DocumentGridProps {
  documents: Document[];
  onDelete: (id: string) => Promise<void>;
}

export default function DocumentGrid({ documents, onDelete }: DocumentGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredDocuments = documents
    .filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'name':
          return direction * a.name.localeCompare(b.name);
        case 'date':
          return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case 'size':
          return direction * (a.size - b.size);
        case 'type':
          return direction * a.file_type.localeCompare(b.file_type);
        default:
          return 0;
      }
    });

  const toggleDocumentSelection = (id: string) => {
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedDocuments(newSelection);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedDocuments.size} selected documents?`)) {
      for (const id of selectedDocuments) {
        await onDelete(id);
      }
      setSelectedDocuments(new Set());
    }
  };

  return (
    <div className="space-y-4">
      <DocumentToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={toggleSort}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCount={selectedDocuments.size}
        onBulkDelete={handleBulkDelete}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedAndFilteredDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isSelected={selectedDocuments.has(doc.id)}
              onSelect={() => toggleDocumentSelection(doc.id)}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedAndFilteredDocuments.map(doc => (
            <DocumentListItem
              key={doc.id}
              document={doc}
              isSelected={selectedDocuments.has(doc.id)}
              onSelect={() => toggleDocumentSelection(doc.id)}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {sortedAndFilteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary">No documents found</p>
        </div>
      )}
    </div>
  );
}