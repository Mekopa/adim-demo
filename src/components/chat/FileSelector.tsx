import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, File, Folder, Check, X, MoveRight } from 'lucide-react';
import { UploadedFile } from '../../types';
import { useVaultStructure } from '../../hooks/useVaultStructure';
import { Folder as FolderType, VaultFile } from '../../types/vault';

interface FileSelectorProps {
  onSelect: (files: UploadedFile[]) => void;
  onBack: () => void;
  initialSelectedFiles?: UploadedFile[];
  selectedFileIds?: Set<string>;
}

export default function FileSelector({ 
  onSelect, 
  onBack, 
  initialSelectedFiles = [], 
  selectedFileIds: externalSelectedIds
}: FileSelectorProps) {
  // Use the vault structure hook
  const {
    folders,
    files,
    currentPath,
    getCurrentFolder,
    getChildFolders,
    getFolderFiles,
    navigateToFolder,
  } = useVaultStructure();

  const [selectedItems, setSelectedItems] = useState<Set<string>>(() => 
    externalSelectedIds || new Set(initialSelectedFiles.map(file => file.id))
  );
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const lastClickTime = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    if (externalSelectedIds) {
      setSelectedItems(externalSelectedIds);
    }
  }, [externalSelectedIds]);

  // Reset draggedItem when drag ends or window loses focus
  useEffect(() => {
    const handleDragEnd = () => setDraggedItem(null);
    const handleBlur = () => setDraggedItem(null);

    window.addEventListener('dragend', handleDragEnd);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('dragend', handleDragEnd);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Get current folder content
  const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1] : null;
  const currentFolderItems = [
    ...getChildFolders(currentFolderId).map(folder => ({
      id: folder.id,
      name: folder.name,
      type: 'folder' as const,
      isFolder: true,
      folderObj: folder
    })),
    ...getFolderFiles(currentFolderId).map(file => ({
      id: file.id,
      name: file.name,
      type: 'file' as const,
      size: file.size || 0,
      isFolder: false,
      fileObj: file
    }))
  ];

  // Check if folder has selected children
  const hasSelectedChildren = (folderId: string): boolean => {
    // This is more complex now with a flat structure
    // We need to find all files and subfolders that belong to this folder and check if any are selected
    
    // Get all direct child files
    const directFiles = files.filter(file => file.folder === folderId);
    if (directFiles.some(file => selectedItems.has(file.id))) {
      return true;
    }
    
    // Get all direct child folders
    const directFolders = folders.filter(folder => folder.parent === folderId);
    
    // Check each subfolder recursively
    return directFolders.some(folder => 
      selectedItems.has(folder.id) || hasSelectedChildren(folder.id)
    );
  };

  // Get all selected items
  const getSelectedItemsData = () => {
    const selectedFolders = folders.filter(folder => selectedItems.has(folder.id))
      .map(folder => ({
        id: folder.id,
        name: folder.name,
        type: 'folder' as const
      }));
      
    const selectedFiles = files.filter(file => selectedItems.has(file.id))
      .map(file => ({
        id: file.id,
        name: file.name,
        type: 'file' as const,
        size: file.size || 0
      }));
      
    return [...selectedFolders, ...selectedFiles];
  };

  const handleItemClick = (item: { id: string, type: 'file' | 'folder' }) => {
    if (item.type === 'folder') {
      const now = Date.now();
      const lastClick = lastClickTime.current[item.id] || 0;
      const isDoubleClick = now - lastClick < 500;
      lastClickTime.current[item.id] = now;

      if (isDoubleClick && !selectedItems.has(item.id)) {
        // Navigate to folder using the hook method
        navigateToFolder(item.id);
      }
    } else {
      setSelectedItems(prev => {
        const newSelection = new Set(prev);
        if (newSelection.has(item.id)) {
          newSelection.delete(item.id);
        } else {
          newSelection.add(item.id);
        }
        return newSelection;
      });
    }
  };

  const handleDragStart = (item: { id: string, type: 'file' | 'folder' }, event: React.DragEvent) => {
    if (item.type === 'folder' && hasSelectedChildren(item.id)) {
      event.preventDefault();
      return;
    }
    
    setDraggedItem(item.id);
    event.dataTransfer.setData('text/plain', item.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const itemId = event.dataTransfer.getData('text/plain');
    
    // Find if this is a folder or file
    const folder = folders.find(f => f.id === itemId);
    const file = files.find(f => f.id === itemId);
    
    if ((folder || file) && !selectedItems.has(itemId)) {
      if (folder && hasSelectedChildren(folder.id)) {
        return;
      }
      
      setSelectedItems(prev => new Set([...prev, itemId]));
    }
    setDraggedItem(null);
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(prev => {
      const newSelection = new Set(prev);
      newSelection.delete(itemId);
      return newSelection;
    });
  };

  const handleNavigateBack = () => {
    if (currentPath.length > 0) {
      // Navigate to parent folder
      const currentFolder = getCurrentFolder();
      navigateToFolder(currentFolder?.parent || null);
    } else {
      onBack();
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const selectedItemsData = getSelectedItemsData();
  const currentFolder = getCurrentFolder();

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Header */}
      <div className="flex items-center rounded-xl gap-3 p-6 border-b border-border">
        <div className="flex items-center gap-3 flex-1">
          {currentPath.length > 0 && (
            <button
              onClick={handleNavigateBack}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-text-secondary" />
            </button>
          )}
          <h3 className="text-xl font-semibold text-text">
            {currentFolder ? currentFolder.name : 'Select Files'}
          </h3>
        </div>
        <button
          onClick={onBack}
          className="p-2 hover:bg-background rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Files/Folders Grid */}
        <div className="flex-1 overflow-y-auto p-6 min-w-[600px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentFolderItems.map((item) => {
              const hasSelectedItems = item.type === 'folder' && hasSelectedChildren(item.id);
              const isDraggable = !hasSelectedItems;
              
              return (
                <div
                  key={item.id}
                  draggable={isDraggable}
                  onDragStart={(e) => handleDragStart(item, e)}
                  onClick={() => handleItemClick(item)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 relative group cursor-pointer ${
                    selectedItems.has(item.id)
                      ? 'bg-primary/10'
                      : 'hover:bg-background'
                  } ${draggedItem === item.id ? 'opacity-50' : ''}`}
                >
                  <div className={`p-4 rounded-xl mb-3 ${
                    item.type === 'folder' ? 'bg-blue-500/10' : 'bg-gray-500/10'
                  }`}>
                    {item.type === 'folder' ? (
                      <Folder className="w-8 h-8 text-blue-500" />
                    ) : (
                      <File className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-text truncate w-full text-center">
                    {item.name}
                  </span>
                  {item.type === 'folder' ? (
                    <span className="text-xs text-text-secondary mt-1">
                      {getChildFolders(item.id).length + getFolderFiles(item.id).length} items
                    </span>
                  ) : item.size && (
                    <span className="text-xs text-text-secondary mt-1">
                      {formatSize(item.size)}
                    </span>
                  )}
                  {selectedItems.has(item.id) && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  {hasSelectedItems && (
                    <div className="absolute top-2 right-2 bg-text-secondary text-text rounded-full px-2 py-0.5 text-xs">
                      Has selections
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Items Drop Area */}
        <div className="w-80 flex flex-col rounded-xl bg-surface">
          <div className="items-center justify-between">
            {selectedItems.size > 0 && (
            <div className="flex pt-4 px-4 items-center justify-between">
                <h4 className="flex text-sm font-medium text-text-secondary">
                Items ({selectedItemsData.length})
                </h4>
                <button
                  onClick={() => setSelectedItems(new Set())}
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Deselect All
                </button>
            </div>
            )}
          </div>
          <div
            className={`flex-1 overflow-y-auto p-4 transition-colors ${
              isDraggingOver ? 'bg-primary/5' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedItemsData.length === 0 ? (
              <div className={`h-full flex flex-col items-center justify-center text-text-secondary text-sm border-2 border-dashed rounded-lg ${
                isDraggingOver ? 'border-primary bg-primary/5' : 'border-border'
              }`}>
                <MoveRight className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-center px-4">
                  {isDraggingOver ? 'Drop to select' : 'Drag items here to select'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedItemsData.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-background rounded-lg group"
                  >
                    {item.type === 'folder' ? (
                      <Folder className="w-4 h-4 text-blue-500" />
                    ) : (
                      <File className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="flex-1 truncate text-text text-sm">{item.name}</span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 hover:bg-surface rounded transition-opacity"
                    >
                      <X className="w-4 h-4 text-text-secondary" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedItems.size > 0 && (
            <button
              onClick={() => {
                const selectedFiles = selectedItemsData.map(item => ({
                  id: item.id,
                  name: item.name,
                  size: 'size' in item ? item.size : 0,
                  type: item.type === 'folder' ? 'folder' : (
                    item.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'
                  )
                }));
                onSelect(selectedFiles);
              }}
              className="m-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Select {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}