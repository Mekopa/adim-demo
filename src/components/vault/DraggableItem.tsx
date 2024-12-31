import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { FileIcon } from './FileIcon';
import { MoreVertical, Download, Trash2, Folder } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { formatFileSize } from '../../utils/fileUtils';
import { VaultFile, Folder as FolderType } from '../../types/vault';

interface DraggableItemProps {
  item: VaultFile | FolderType;
  onSelect: (e: React.MouseEvent) => void;
  onDelete: () => void;
  isSelected: boolean;
  isFolder: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
}

export default function DraggableItem({
  item,
  onSelect,
  onDelete,
  isSelected,
  isFolder,
  isDragging = false,
  isDropTarget = false
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef: setDraggableRef } = useDraggable({
    id: item.id,
    data: {
      type: isFolder ? 'folder' : 'file',
      item
    }
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: item.id,
    disabled: !isFolder
  });

  // Combine refs for folders (both draggable and droppable)
  const setRef = (element: HTMLElement | null) => {
    setDraggableRef(element);
    if (isFolder) {
      setDroppableRef(element);
    }
  };

  return (
    <div
      ref={setRef}
      {...attributes}
      {...listeners}
      onClick={onSelect}
      className={`
        group relative flex flex-col items-center p-4 rounded-lg transition-all duration-200 cursor-pointer w-[200px]
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isSelected ? 'ring-2 ring-blue-500 bg-[#2c2c2e]' : ' hover:bg-[#2c2c2e]'}
        ${(isOver || isDropTarget) && isFolder ? 'ring-2 ring-blue-500 bg-[#3c3c3e]' : ''}
      `}
    >
      {/* Menu Button */}
      <Menu as="div" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Menu.Button className="p-1 rounded-lg hover:bg-[#3c3c3e] text-gray-400 hover:text-white">
          <MoreVertical className="w-4 h-4" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-1 w-48 bg-[#2c2c2e] rounded-lg shadow-lg border border-[#3c3c3e] overflow-hidden z-10">
          {'url' in item && (
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = item.url!;
                    link.download = item.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                    active ? 'bg-[#3c3c3e]' : ''
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
            </Menu.Item>
          )}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className={`w-full px-4 py-2 text-left text-sm text-red-400 flex items-center gap-2 ${
                  active ? 'bg-red-500/10' : ''
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {/* Icon */}
      <div className="p-14 mb-3 rounded-lg bg-[#2c2c2e] transition-colors">
        {isFolder ? (
          <Folder className="w-8 h-8 text-blue-400" />
        ) : (
          <FileIcon 
            type={'type' in item ? item.type : ''} 
            className="w-8 h-8 text-red-400" 
          />
        )}
      </div>

      {/* Name */}
      <div className="w-full text-center">
        <h4 className="font-medium text-white truncate mb-1">{item.name}</h4>
        {isFolder ? (
          <p className="text-sm text-gray-400">
            {(item as FolderType).documentCount} items
          </p>
        ) : (
          <p className="text-sm text-gray-400">
            {formatFileSize((item as VaultFile).size)}
          </p>
        )}
      </div>
    </div>
  );
}