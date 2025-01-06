// VaultPage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useVaultStructure } from '../hooks/useVaultStructure';
import VaultGrid from '../components/vault/VaultGrid';
import TopNavigation from '../components/vault/TopNavigation';
import BottomNavigation from '../components/vault/BottomNavigation';
import ActionBar from '../components/vault/ActionBar';
import { Folder, VaultFile } from '../types/vault';
import { getUniqueFileName, getUniqueFolderName, isNameTaken } from '../utils/nameUtils';

export default function VaultPage() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Centralized Selection State
   * Using a Set to efficiently manage selected item IDs.
   */
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const {
    currentPath,
    folders,
    getCurrentFolder,
    getChildFolders,
    getFolderFiles,
    navigateToFolder,
    createFolderInCurrent,
    uploadFilesToCurrent,
    deleteFileById,
    moveItems,
    renameItem
  } = useVaultStructure();

  const currentFolder = getCurrentFolder();
  const childFolders = getChildFolders(currentFolder?.id || null);
  const folderFiles = getFolderFiles(currentFolder?.id || null);
  const items = [...childFolders, ...folderFiles];

  /**
   * Handler to create a new folder
   */
  const handleCreateFolder = async () => {
    setIsLoading(true);
    console.log('Create Folder button pressed');
    try {
      const name = getUniqueFolderName(childFolders);
      await createFolderInCurrent(name);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handler to upload files
   */
  const handleUploadFilesDirectly = async (files: File[]) => {
    setIsLoading(true);
    try {
      const processedFiles = Array.from(files).map(file => {
        const uniqueName = getUniqueFileName(file.name, folderFiles);
        const renamedFile = new File([file], uniqueName, { type: file.type });
        return renamedFile;
      });
      await uploadFilesToCurrent(processedFiles);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Validate item names to prevent duplicates and empty names
   */
  const validateItemName = useCallback(
    (name: string) => {
      if (!name.trim()) return 'Name cannot be empty';
      if (isNameTaken(name, items)) return 'Name already exists';
      return undefined;
    },
    [items]
  );

  /**
   * Handler to update the selection based on user interaction in VaultGrid
   */
  const handleSelectionChange = useCallback((newSelection: Set<string>) => {
    setSelectedItems(newSelection);
  }, []);

  /**
   * Handler to navigate to a folder on double-click
   */
  const handleNavigateToFolder = useCallback((folderId: string) => {
    navigateToFolder(folderId);
    // Optionally, clear selection after navigation
    setSelectedItems(new Set());
  }, [navigateToFolder]);

  /**
   * Handler to delete an item
   */
  const handleDelete = useCallback((id: string) => {
    deleteFileById(id);
    // After deletion, remove the item from selection if it was selected
    setSelectedItems(prev => {
      const newSelection = new Set(prev);
      newSelection.delete(id);
      return newSelection;
    });
  }, [deleteFileById]);

  /**
   * Handler to move items to a target folder
   */
  const handleMove = useCallback((itemIds: string[], targetFolderId: string) => {
    moveItems(itemIds, currentFolder?.id || null, targetFolderId);
    // Optionally, clear selection after moving
    setSelectedItems(new Set());
  }, [moveItems, currentFolder?.id]);

  /**
   * Handler to rename an item
   */
  const handleRename = useCallback(async (itemId: string, newName: string) => {
    await renameItem(itemId, newName);
  }, [renameItem]);

  /**
   * Optional: Effect to log selection changes for debugging
   */
  useEffect(() => {
    console.log('Selected Items:', Array.from(selectedItems));
  }, [selectedItems]);

  return (
    <div className="flex pl-3 flex-col h-full">
      <div className="flex-none">
        {/* ActionBar receives the entire items array and the current selection */}
        <ActionBar
          onUpload={handleUploadFilesDirectly}
          onCreateFolder={handleCreateFolder}
          items={items}
          selectedItems={selectedItems}
          onDownload={() => console.log('Download clicked')}
          onDelete={() => {
            // Example: Delete the first selected item
            const idToDelete = Array.from(selectedItems)[0];
            if (idToDelete) handleDelete(idToDelete);
          }}
          onShare={() => console.log('Share clicked')}
          onMail={() => console.log('Mail clicked')}
          onMore={() => console.log('More Options clicked')}
        />

        <TopNavigation
          currentFolder={currentFolder}
          onBack={() => navigateToFolder(currentFolder?.parentId || null)}
          onUpload={() => setShowUploadModal(true)}
          onCreateFolder={handleCreateFolder}
        />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-3">
          {/* VaultGrid receives the entire items array and the current selection */}
          <VaultGrid
            items={items}
            selectedItems={selectedItems}
            onSelectionChange={handleSelectionChange}
            onNavigateToFolder={handleNavigateToFolder}
            onDelete={handleDelete}
            onMove={handleMove}
            onRename={handleRename}
            validateName={validateItemName}
          />
        </div>
      </div>

      <div className="flex-none">
        {currentFolder && (
          <BottomNavigation
            currentPath={currentPath.map(id => folders.find(f => f.id === id)!).filter(Boolean)}
            onNavigate={navigateToFolder}
          />
        )}
      </div>

    </div>
  );
}
