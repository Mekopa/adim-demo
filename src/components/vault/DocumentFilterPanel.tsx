// src/components/vault/DocumentFilterPanel.tsx
import React from 'react';

interface DocumentOption {
  id: string;
  name: string;
  selected: boolean;
}

interface DocumentFilterPanelProps {
  documentFilterOptions: DocumentOption[];
  documentFilterSize: number;
  clearDocumentFilter: () => void;
  toggleDocumentFilter: (docId: string) => void;
}

export const DocumentFilterPanel: React.FC<DocumentFilterPanelProps> = ({
  documentFilterOptions,
  documentFilterSize,
  clearDocumentFilter,
  toggleDocumentFilter,
}) => {
  if (documentFilterOptions.length === 0) return null;
  
  return (
    <div className="border-t border-gray-700/50 p-3 bg-gray-800/50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-300">Filter by Document</h3>
        {documentFilterSize > 0 && (
          <button
            onClick={clearDocumentFilter}
            className="text-xs text-gray-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>
      <div className="max-h-32 overflow-y-auto">
        {documentFilterOptions.map(doc => (
          <div key={doc.id} className="flex items-center mb-1">
            <input
              type="checkbox"
              id={`doc-${doc.id}`}
              checked={doc.selected}
              onChange={() => toggleDocumentFilter(doc.id)}
              className="mr-2"
            />
            <label 
              htmlFor={`doc-${doc.id}`}
              className="text-sm text-gray-300 truncate"
              title={doc.name}
            >
              {doc.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
