// src/hooks/useVaultActions.ts

import { Folder, VaultFile } from '../types/vault'; // Adjust the path as necessary
import axiosInstance from '../api/axiosInstance'; // Ensure correct path
import { useAuth } from '../contexts/AuthContext';
import { useState, useCallback } from 'react';

export function useVaultActions() {
  const { logout } = useAuth(); // Access logout to handle unauthorized errors

  /**
   * Helper for making authenticated requests using axiosInstance
   */
  const request = useCallback(async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    config?: any
  ): Promise<T> => {
    try {
      const response = await axiosInstance.request<T>({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // Unauthorized, possibly logout
        logout();
      }
      throw error;
    }
  }, [logout]);

  // ----------------------------------------------------------------------------
  // FOLDER ACTIONS
  // ----------------------------------------------------------------------------

  // 1. List all folders for the authenticated user
  const listFolders = useCallback(async (): Promise<Folder[]> => {
    return await request<Folder[]>('GET', '/cloud/folders/');
  }, [request]);

  // 2. Create a new folder
  const createFolder = useCallback(async (data: { name: string; parentId?: string | null }): Promise<Folder> => {
    console.log('createFolder function called with data:', data);
    return await request<Folder>('POST', '/cloud/folders/', {
      name: data.name,
      parent: data.parentId ?? null,
    });
  }, [request]);

  // 3. Rename a folder
  const renameFolder = useCallback(async (folderId: string, newName: string): Promise<void> => {
    await request<void>('POST', `/cloud/folders/${folderId}/rename/`, { name: newName });
  }, [request]);

  // 4. Move a folder
  const moveFolder = useCallback(async (folderId: string, targetParentId: string | null): Promise<void> => {
    await request<void>('POST', `/cloud/folders/${folderId}/move/`, { target_parent_id: targetParentId ?? null });
  }, [request]);

  // 5. Delete a folder
  const deleteFolder = useCallback(async (folderId: string): Promise<void> => {
    await request<void>('DELETE', `/cloud/folders/${folderId}/`);
  }, [request]);

  // ----------------------------------------------------------------------------
  // FILE ACTIONS
  // ----------------------------------------------------------------------------

  // 1. List all files for the authenticated user
  const listFiles = useCallback(async (): Promise<VaultFile[]> => {
    return await request<VaultFile[]>('GET', '/cloud/files/');
  }, [request]);

  const uploadFiles = useCallback(async (files: File[], parentId?: string | null): Promise<VaultFile[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    if (parentId) {
      formData.append('folder', parentId);
    }

    return await request<VaultFile[]>('POST', '/cloud/files/bulk_upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, [request]);

  // 3. Rename a file
  const renameFile = useCallback(async (fileId: string, newName: string): Promise<void> => {
    await request<void>('POST', `/cloud/files/${fileId}/rename/`, { name: newName });
  }, [request]);

  // 4. Move a file
  const moveFile = useCallback(async (fileId: string, targetFolderId: string | null): Promise<void> => {
    await request<void>('POST', `/cloud/files/${fileId}/move/`, { target_folder_id: targetFolderId ?? null });
  }, [request]);

  // 5. Delete a file
  const deleteFile = useCallback(async (fileId: string): Promise<void> => {
    await request<void>('DELETE', `/cloud/files/${fileId}/`);
  }, [request]);

  // ----------------------------------------------------------------------------
  // EXPORT
  // ----------------------------------------------------------------------------
  return {
    // Folder actions
    listFolders,
    createFolder,
    renameFolder,
    moveFolder,
    deleteFolder,

    // File actions
    listFiles,
    uploadFiles,
    renameFile,
    moveFile,
    deleteFile,
  };
}
