import React from 'react';
import { FileText, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Document } from '../../types/vault';

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => Promise<void>;
}

export default function DocumentList({ documents, onDelete }: DocumentListProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await onDelete(id);
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-error" />;
      default:
        return <FileText className="w-4 h-4 text-text-secondary" />;
    }
  };

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border group hover:border-primary transition-colors"
        >
          <div className="flex items-center space-x-4">
            {getStatusIcon(doc.status)}
            <div>
              <h4 className="text-text font-medium">{doc.name}</h4>
              <p className="text-sm text-text-secondary">
                {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.createdAt).toLocaleDateString()}
              </p>
              {doc.status === 'error' && (
                <p className="text-sm text-error mt-1">{doc.errorMessage}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => handleDelete(doc.id)}
            className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
}