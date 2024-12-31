import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Collection, VaultFile } from '../types/vault';
import { useAuth } from '../contexts/AuthContext';
import { extractFileMetadata } from '../utils/fileUtils';

export function useVaultActions() {
  const { user } = useAuth();
  const [folders, setFolders] = useLocalStorage<Collection[]>('vault_folders', []);
  const [files, setFiles] = useLocalStorage<Record<string, VaultFile[]>>('vault_files', {});
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateFolder = async (data: { name: string; description?: string }) => {
    setIsLoading(true);
    try {
      const newFolder: Collection = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description || '',
        createdAt: new Date(),
        documentCount: 0,
        owner: user!,
        isPrivate: true
      };

      setFolders(prev => [...prev, newFolder]);
      setFiles(prev => ({ ...prev, [newFolder.id]: [] }));
      return newFolder;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFiles = async (uploadedFiles: File[], folderId?: string) => {
    setIsLoading(true);
    try {
      const processedFiles = await Promise.all(
        uploadedFiles.map(async (file) => {
          const metadata = await extractFileMetadata(file);
          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2),
            name: file.name,
            type: file.type,
            size: file.size,
            createdAt: new Date(),
            modifiedAt: new Date(),
            status: 'ready' as const,
            url: URL.createObjectURL(file),
            metadata
          };
        })
      );

      if (folderId) {
        // Add files to specific folder
        setFiles(prev => ({
          ...prev,
          [folderId]: [...(prev[folderId] || []), ...processedFiles]
        }));
        
        // Update folder document count
        setFolders(prev => 
          prev.map(folder => 
            folder.id === folderId
              ? { ...folder, documentCount: (folder.documentCount || 0) + processedFiles.length }
              : folder
          )
        );
      } else {
        // Store files without a folder
        setFiles(prev => ({
          ...prev,
          unassigned: [...(prev.unassigned || []), ...processedFiles]
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, folderId: string) => {
    setFiles(prev => ({
      ...prev,
      [folderId]: prev[folderId].filter(file => file.id !== fileId)
    }));

    // Update folder document count
    setFolders(prev =>
      prev.map(folder =>
        folder.id === folderId
          ? { ...folder, documentCount: Math.max(0, folder.documentCount - 1) }
          : folder
      )
    );
  };

  const handleMoveToFolder = async (
    fileId: string,
    sourceFolderId: string | null,
    targetFolderId: string | null
  ) => {
    setFiles(prev => {
      const sourceFiles = sourceFolderId ? prev[sourceFolderId] : prev.unassigned || [];
      const targetFiles = targetFolderId ? prev[targetFolderId] : prev.unassigned || [];
      const fileToMove = sourceFiles.find(f => f.id === fileId);

      if (!fileToMove) return prev;

      const newState = { ...prev };
      
      // Remove from source
      if (sourceFolderId) {
        newState[sourceFolderId] = sourceFiles.filter(f => f.id !== fileId);
      } else {
        newState.unassigned = sourceFiles.filter(f => f.id !== fileId);
      }

      // Add to target
      if (targetFolderId) {
        newState[targetFolderId] = [...targetFiles, fileToMove];
      } else {
        newState.unassigned = [...targetFiles, fileToMove];
      }

      return newState;
    });

    // Update folder document counts
    setFolders(prev =>
      prev.map(folder => {
        if (folder.id === sourceFolderId) {
          return { ...folder, documentCount: Math.max(0, folder.documentCount - 1) };
        }
        if (folder.id === targetFolderId) {
          return { ...folder, documentCount: folder.documentCount + 1 };
        }
        return folder;
      })
    );
  };

  const getFilesForFolder = (folderId: string) => {
    return files[folderId] || [];
  };

  return {
    folders,
    files,
    isLoading,
    handleCreateFolder,
    handleUploadFiles,
    handleDeleteFile,
    handleMoveToFolder,
    getFilesForFolder
  };
}