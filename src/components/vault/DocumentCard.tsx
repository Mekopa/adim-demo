import React from 'react';
import { FileText, Image, File, MoreVertical, Trash2, FolderUp } from 'lucide-react';
import { Document } from '../../types/vault';
import { Menu } from '@headlessui/react';

interface DocumentCardProps {
  document: Document;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: string) => Promise<void>;
  onMove: (documentId: string, targetSubCollectionId: string | null) => Promise<void>;
}

export default function DocumentCard({
  document,
  isSelected,
  onSelect,
  onDelete,
  onMove,
}: DocumentCardProps) {
  const getIcon = () => {
    if (!document.file_type) {
      return File;
    }
    if (document.file_type.startsWith('application/pdf')) {
      return FileText;
    }
    if (document.file_type.startsWith('image/')) {
      return Image;
    }
    return File;
  };

  const Icon = getIcon();
  const formattedSize = (document.size / 1024).toFixed(1) + ' KB';
  const formattedDate = new Date(document.createdAt).toLocaleDateString();

  return (
    <div
      className={`group relative p-4 bg-surface border rounded-lg transition-all ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border hover:border-primary'
      }`}
    >
      <div className="absolute top-2 right-2 z-10">
        <Menu as="div" className="relative">
          <Menu.Button className="p-1 rounded-lg hover:bg-background">
            <MoreVertical className="w-4 h-4 text-text-secondary" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-1 w-48 bg-surface border border-border rounded-lg shadow-lg overflow-hidden">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onMove(document.id, null)}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    active ? 'bg-background' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderUp className="w-4 h-4" />
                    <span>Move to Parent Collection</span>
                  </div>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => onDelete(document.id)}
                  className={`w-full px-4 py-2 text-left text-sm text-error ${
                    active ? 'bg-error/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </div>
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      <div
        className="flex flex-col items-center text-center cursor-pointer"
        onClick={onSelect}
      >
        <div className="p-4 bg-primary/10 rounded-lg mb-3">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <h4 className="font-medium text-text mb-1 truncate w-full">
          {document.name}
        </h4>
        <p className="text-sm text-text-secondary">
          {formattedSize} • {formattedDate}
        </p>
      </div>
    </div>
  );
}