// src/hooks/useVaultStructure.ts

import { useEffect, useState } from 'react';
import { Folder, VaultFile } from '../types/vault';
import { useVaultActions } from './useVaultActions';

/**
 * This hook orchestrates folder/file data from the backend and organizes them
 * into a structure that VaultPage.tsx / VaultGrid.tsx can consume.
 */

export function useVaultStructure() {
  // States for storing everything fetched from the backend
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<VaultFile[]>([]);

  // Track the "current path" as an array of folder IDs leading to the nested folder
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // Pull in all the backend actions from useVaultActions
  const {
    listFolders,
    listFiles,
    createFolder,
    uploadFiles,
    renameFolder,
    renameFile,
    moveFolder,
    moveFile,
    deleteFolder,
    deleteFile,
  } = useVaultActions();

  // On first mount, fetch folders and files from the backend
  useEffect(() => {
    let isMounted = true; // To prevent state updates if the component is unmounted

    async function fetchData() {
      try {
        const [fetchedFolders, fetchedFiles] = await Promise.all([listFolders(), listFiles()]);

        if (isMounted) {
          setFolders(fetchedFolders);
          setFiles(fetchedFiles);
        }
      } catch (err) {
        console.error('Error fetching folders/files:', err);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [listFolders, listFiles]); // Ensure these functions are stable (useCallback if necessary)

  // -----------------------------------------
  // HELPER FUNCTIONS FOR NAVIGATION/LOOKUPS
  // -----------------------------------------

  /**
   * Returns the current folder object (or null if at root).
   */
  function getCurrentFolder(): Folder | null {
    if (currentPath.length === 0) return null;
    // last item in currentPath is the "deepest" folder ID
    const folderId = currentPath[currentPath.length - 1];
    return folders.find(f => f.id === folderId) || null;
  }

  /**
   * Returns subfolders of a given parent folder (or root if parentId = null).
   */
  function getChildFolders(parentId: string | null): Folder[] {
    return folders.filter(f => {
      // If the folder's parent is null, it means it's in root
      return (f.parent === parentId) || (parentId === null && f.parent == null);
    });
  }

  /**
   * Returns files that belong to a specific folder (or root if folderId = null).
   */
  function getFolderFiles(folderId: string | null): VaultFile[] {
    return files.filter(file => {
      return (file.folder === folderId) || (folderId === null && file.folder == null);
    });
  }

  /**
   * Navigates to a folder, building the path from root to that folder.
   * If folderId = null, navigates to root.
   */
  function navigateToFolder(folderId: string | null) {
    if (!folderId) {
      setCurrentPath([]);
      return;
    }
    // Build the path by walking up the parent references
    const pathIds: string[] = [];
    let current = folders.find(f => f.id === folderId);
    while (current) {
      pathIds.unshift(current.id);
      if (current.parent) {
        current = folders.find(f => f.id === current.parent);
      } else {
        current = undefined;
      }
    }
    setCurrentPath(pathIds);
  }

  // -----------------------------------------
  // ACTIONS (STUB OR FULL)
  // -----------------------------------------

  /**
   * Create a folder in the current folder (or root if none).
   * For now, we only do the backend call, then refresh the folder list.
   */
  async function createFolderInCurrent(name: string) {
    const parentFolder = getCurrentFolder();
    const parentId = parentFolder?.id ?? null;

    try {
      const newFolder = await createFolder({ name, parentId });
      // Update local state
      setFolders(prev => [...prev, newFolder]);
    } catch (err) {
      console.error('Error creating folder:', err);
    }
  }

  /**
   * Upload multiple files to the current folder (or root).
   * For now, we only do the backend call, then refresh the file list.
   */
  async function uploadFilesToCurrent(selectedFiles: File[]) {
    const parentFolder = getCurrentFolder();
    const folderId = parentFolder?.id ?? null;
    try {
      const newFiles = await uploadFiles(selectedFiles, folderId);
      if (newFiles && newFiles.length > 0) {
        setFiles(prev => [...prev, ...newFiles]);
      }
    } catch (err) {
      console.error('Error uploading files:', err);
    }
  }

  /**
   * Delete a file from the current list.
   */
  async function deleteFileById(fileId: string) {
    try {
      await deleteFile(fileId);
      // remove from local
      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }

  /**
   * Move items (folders/files) from one folder to another (stub).
   * For now, let’s keep it minimal or do the real call if you have it.
   */
  async function moveItems(itemIds: string[], sourceFolderId: string | null, targetFolderId: string | null) {
    // This might involve calling `moveFolder` or `moveFile` per item
    // or using a bulk move endpoint if you have one. For now, we skip logic
    console.log('moveItems called with: ', itemIds, sourceFolderId, targetFolderId);
    // TODO: implement real logic
  }

  // -----------------------------------------
  // RETURN HOOK API
  // -----------------------------------------
  return {
    // States
    folders,
    files,
    currentPath,

    // Lookups
    getCurrentFolder,
    getChildFolders,
    getFolderFiles,

    // Navigation
    navigateToFolder,

    // Actions (some are stubs or partial)
    createFolderInCurrent,
    uploadFilesToCurrent,
    deleteFileById,
    moveItems,

    // Potential placeholders for rename or share
    // e.g. renameFolderInCurrent, etc.
  };
}