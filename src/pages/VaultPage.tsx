import React, { useState } from 'react';
import { useVaultStructure } from '../hooks/useVaultStructure';
import VaultGrid from '../components/vault/VaultGrid';
import TopNavigation from '../components/vault/TopNavigation';
import BottomNavigation from '../components/vault/BottomNavigation';
import ActionBar from '../components/vault/ActionBar';
import CreateFolderModal from '../components/vault/CreateFolderModal';
import UploadFilesModal from '../components/vault/UploadFilesModal';
import { Folder, VaultFile } from '../types/vault';

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
    moveItems
  } = useVaultStructure();

  const currentFolder = getCurrentFolder();
  const childFolders = getChildFolders(currentFolder?.id || null);
  const folderFiles = getFolderFiles(currentFolder?.id || null);

  // Combine folders and files for the grid
  const items = [...childFolders, ...folderFiles];

  const handleCreateFolder = async (data: { name: string; description?: string }) => {
    setIsLoading(true);
    try {
      await createFolder(data);
      setShowCreateModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFiles = async (files: File[]) => {
    setIsLoading(true);
    try {
      await uploadFiles(files);
      setShowUploadModal(false);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="flex pl-3 flex-col h-full">
      <div className="flex-none">
        <TopNavigation 
          currentFolder={currentFolder}
          onBack={handleBack}
          onUpload={() => setShowUploadModal(true)}
          onCreateFolder={() => setShowCreateModal(true)}
        />
        <ActionBar 
          onUpload={() => setShowUploadModal(true)}
          onCreateFolder={() => setShowCreateModal(true)}
        />
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className='p-3'>
          <VaultGrid
            items={items}
            onSelect={handleItemSelect}
            onDelete={handleDelete}
            onMove={handleMove}
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