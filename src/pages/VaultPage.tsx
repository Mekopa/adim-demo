import React, { useState, useCallback } from 'react';
import { useVaultStructure } from '../hooks/useVaultStructure';
import VaultGrid from '../components/vault/VaultGrid';
import TopNavigation from '../components/vault/TopNavigation';
import BottomNavigation from '../components/vault/BottomNavigation';
import ActionBar from '../components/vault/ActionBar';
import CreateFolderModal from '../components/vault/CreateFolderModal';
import UploadFilesModal from '../components/vault/UploadFilesModal';
import { Folder, VaultFile } from '../types/vault';
import { getUniqueFileName, getUniqueFolderName, isNameTaken } from '../utils/nameUtils';

export default function VaultPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    currentPath,
    folders,
    getCurrentFolder,
    getChildFolders,
    getFolderFiles,
    navigateToFolder,
    createFolder,
    uploadFiles,
    deleteFile,
    moveItems,
    renameItem
  } = useVaultStructure();

  const currentFolder = getCurrentFolder();
  const childFolders = getChildFolders(currentFolder?.id || null);
  const folderFiles = getFolderFiles(currentFolder?.id || null);
  const items = [...childFolders, ...folderFiles];

  const handleCreateFolder = async () => {
    setIsLoading(true);
    try {
      const name = getUniqueFolderName(childFolders);
      await createFolder({ name });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFiles = async (files: File[]) => {
    setIsLoading(true);
    try {
      const processedFiles = Array.from(files).map(file => {
        const uniqueName = getUniqueFileName(file.name, folderFiles);
        const renamedFile = new File([file], uniqueName, { type: file.type });
        return renamedFile;
      });
      await uploadFiles(processedFiles);
      setShowUploadModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const validateItemName = useCallback((name: string) => {
    if (!name.trim()) return 'Name cannot be empty';
    if (isNameTaken(name, items)) return 'Name already exists';
    return undefined;
  }, [items]);

  const handleItemSelect = (item: Folder | VaultFile) => {
    if ('documentCount' in item) {
      navigateToFolder(item.id);
    }
  };

  const handleBack = () => {
    navigateToFolder(currentFolder?.parentId || null);
  };

  const handleDelete = (id: string) => {
    deleteFile(id);
  };

  const handleMove = (itemIds: string[], targetFolderId: string) => {
    moveItems(itemIds, currentFolder?.id || null, targetFolderId);
  };

  const handleRename = async (itemId: string, newName: string) => {
    await renameItem(itemId, newName);
  };

  return (
    <div className="flex pl-3 flex-col h-full">
      <div className="flex-none">
        <ActionBar 
          onUpload={() => setShowUploadModal(true)}
          onCreateFolder={handleCreateFolder}
        />
        <TopNavigation 
          currentFolder={currentFolder}
          onBack={handleBack}
          onUpload={() => setShowUploadModal(true)}
          onCreateFolder={handleCreateFolder}
        />
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className='p-3'>
          <VaultGrid
            items={items}
            onSelect={handleItemSelect}
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

      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFolder}
        isLoading={isLoading}
      />

      <UploadFilesModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadFiles}
        isLoading={isLoading}
      />
    </div>
  );
}