import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Folder, VaultFile } from '../types/vault';
import { useAuth } from '../contexts/AuthContext';

export function useVaultStructure() {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [folders, setFolders] = useLocalStorage<Folder[]>('vault_folders', []);
  const [files, setFiles] = useLocalStorage<Record<string, VaultFile[]>>('vault_files', {});

  const getCurrentFolder = () => {
    if (currentPath.length === 0) return null;
    return folders.find(f => f.id === currentPath[currentPath.length - 1]) || null;
  };

  const getChildFolders = (parentId: string | null) => {
    return folders.filter(f => f.parentId === parentId);
  };

  const getFolderFiles = (folderId: string | null) => {
    return folderId ? files[folderId] || [] : files.unassigned || [];
  };

  const getSiblingFolders = (folder: Folder) => {
    return folders.filter(f => f.parentId === folder.parentId);
  };

  const navigateToFolder = (folderId: string | null) => {
    if (!folderId) {
      setCurrentPath([]);
      return;
    }

    const newPath: string[] = [];
    let currentFolder: Folder | undefined = folders.find(f => f.id === folderId);
    
    while (currentFolder) {
      newPath.unshift(currentFolder.id);
      currentFolder = folders.find(f => f.id === currentFolder?.parentId);
    }

    setCurrentPath(newPath);
  };

  const createFolder = async (data: { name: string; description?: string }) => {
    const currentFolder = getCurrentFolder();
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description || '',
      parentId: currentFolder?.id || null,
      createdAt: new Date(),
      documentCount: 0,
      owner: user!,
      isPrivate: true
    };

    setFolders(prev => [...prev, newFolder]);
    setFiles(prev => ({ ...prev, [newFolder.id]: [] }));
  };

  const uploadFiles = async (uploadedFiles: File[]) => {
    const currentFolder = getCurrentFolder();
    const folderId = currentFolder?.id || 'unassigned';

    const processedFiles: VaultFile[] = await Promise.all(
      uploadedFiles.map(async file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2),
        name: file.name,
        type: file.type,
        size: file.size,
        folderId,
        createdAt: new Date(),
        modifiedAt: new Date(),
        status: 'ready',
        url: URL.createObjectURL(file)
      }))
    );

    setFiles(prev => ({
      ...prev,
      [folderId]: [...(prev[folderId] || []), ...processedFiles]
    }));

    if (currentFolder) {
      setFolders(prev =>
        prev.map(folder =>
          folder.id === currentFolder.id
            ? { ...folder, documentCount: folder.documentCount + processedFiles.length }
            : folder
        )
      );
    }
  };

  const deleteFile = async (fileId: string) => {
    const currentFolder = getCurrentFolder();
    const folderId = currentFolder?.id || 'unassigned';

    setFiles(prev => ({
      ...prev,
      [folderId]: prev[folderId].filter(file => file.id !== fileId)
    }));

    if (currentFolder) {
      setFolders(prev =>
        prev.map(folder =>
          folder.id === currentFolder.id
            ? { ...folder, documentCount: Math.max(0, folder.documentCount - 1) }
            : folder
        )
      );
    }
  };

  const moveItems = async (itemIds: string[], sourceFolderId: string | null, targetFolderId: string) => {
    // Update folder hierarchy
    setFolders(prev => {
      const newFolders = [...prev];
      
      itemIds.forEach(itemId => {
        const folderIndex = newFolders.findIndex(f => f.id === itemId);
        if (folderIndex !== -1) {
          // Update folder's parent
          newFolders[folderIndex] = {
            ...newFolders[folderIndex],
            parentId: targetFolderId
          };
        }
      });

      return newFolders;
    });

    // Move files
    setFiles(prev => {
      const newFiles = { ...prev };
      const sourceKey = sourceFolderId || 'unassigned';
      const sourceFiles = prev[sourceKey] || [];
      
      // Find files to move
      const filesToMove = sourceFiles.filter(file => itemIds.includes(file.id));
      
      // Remove files from source
      newFiles[sourceKey] = sourceFiles.filter(file => !itemIds.includes(file.id));
      
      // Add files to target
      newFiles[targetFolderId] = [
        ...(newFiles[targetFolderId] || []),
        ...filesToMove.map(file => ({ ...file, folderId: targetFolderId }))
      ];

      return newFiles;
    });

    // Update document counts
    setFolders(prev =>
      prev.map(folder => {
        if (folder.id === sourceFolderId) {
          return { ...folder, documentCount: Math.max(0, folder.documentCount - itemIds.length) };
        }
        if (folder.id === targetFolderId) {
          return { ...folder, documentCount: folder.documentCount + itemIds.length };
        }
        return folder;
      })
    );
  };

  return {
    currentPath,
    folders,
    getCurrentFolder,
    getChildFolders,
    getFolderFiles,
    navigateToFolder,
    createFolder,
    uploadFiles,
    deleteFile,
    getSiblingFolders,
    moveItems
  };
}