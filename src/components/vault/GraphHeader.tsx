// src/components/vault/GraphHeader.tsx
import React from 'react';
import { X, Hash } from 'lucide-react';
import { Folder, VaultFile } from '../../types/vault';

interface GraphHeaderProps {
  onClose: () => void;
  currentPath: string[];
  folders: Folder[];
  files: VaultFile[];
  selectedDocumentId?: string;
}

export const GraphHeader: React.FC<GraphHeaderProps> = ({
  onClose,
  currentPath,
  folders,
  files,
  selectedDocumentId,
}) => {
  let contextInfo = null;

  if (selectedDocumentId) {
    const selectedFile = files.find(f => f.id === selectedDocumentId);
    contextInfo = (
      <p className="text-sm text-gray-400">
        Document: {selectedFile?.name || 'Unknown document'}
      </p>
    );
  } else if (currentPath.length > 0) {
    const breadcrumbs = currentPath.map(id => {
      const folder = folders.find(f => f.id === id);
      return folder ? folder.name : id;
    });
    contextInfo = (
      <p className="text-sm text-gray-400">
        Folder: {breadcrumbs.join(' / ')}
      </p>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-900/50">
      <div className="flex items-center gap-2">
        <Hash className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-text">Document Content Graph</h2>
          {contextInfo}
        </div>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
        <X className="w-5 h-5 text-gray-400 hover:text-white" />
      </button>
    </div>
  );
};
