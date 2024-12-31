import React from 'react';
import { DragOverlay as DndDragOverlay } from '@dnd-kit/core';
import { FileIcon } from './FileIcon';
import { Folder } from 'lucide-react';
import { VaultFile, Folder as FolderType } from '../../types/vault';

interface DragOverlayProps {
  activeItem: (VaultFile | FolderType) | null;
  selectedCount: number;
}

export default function DragOverlay({ activeItem, selectedCount }: DragOverlayProps) {
  if (!activeItem) return null;

  const isFolder = 'documentCount' in activeItem;

  return (
    <DndDragOverlay>
      <div className="fixed pointer-events-none bg-[#2c2c2e] rounded-lg p-4 shadow-lg backdrop-blur-sm border border-[#3c3c3e]">
        <div className="flex items-center gap-3">
          {isFolder ? (
            <Folder className="w-6 h-6 text-blue-400" />
          ) : (
            <FileIcon 
              type={'type' in activeItem ? activeItem.type : ''} 
              className="w-6 h-6 text-red-400" 
            />
          )}
          <div>
            <h4 className="font-medium text-white">
              {activeItem.name}
            </h4>
            {selectedCount > 1 && (
              <p className="text-sm text-gray-400">
                +{selectedCount - 1} more items
              </p>
            )}
          </div>
        </div>
      </div>
    </DndDragOverlay>
  );
}