// src/hooks/useDocumentItems.ts
import { useState, useEffect, useMemo } from 'react';
import { Folder, VaultFile } from '../types/vault';

export interface DocumentItem {
  id: string;
  name: string;
  selected: boolean;
  type: 'file' | 'folder';
  fileType?: string;
  children?: DocumentItem[];
  parentId?: string | null;
}

interface UseDocumentItemsParams {
  folders: Folder[];
  files: VaultFile[];
  selectedDocumentIds: Set<string>;
  currentPath?: string[];
}

/**
 * Hook to transform folders and files into a hierarchical DocumentItem structure
 * for use in the DocumentFilterPanel
 */
export function useDocumentItems({
  folders,
  files,
  selectedDocumentIds,
  currentPath = []
}: UseDocumentItemsParams) {
  // Build a hierarchical tree of document items
  const documentItems = useMemo(() => {
    // Create a map of folders by id
    const folderMap = new Map<string, DocumentItem>();
    
    // First pass: Create folder items
    folders.forEach(folder => {
      folderMap.set(folder.id, {
        id: folder.id,
        name: folder.name,
        selected: selectedDocumentIds.has(folder.id),
        type: 'folder',
        children: [],
        parentId: folder.parentId
      });
    });
    
    // Second pass: Connect folders to their parents
    folders.forEach(folder => {
      if (folder.parentId && folderMap.has(folder.parentId)) {
        const parent = folderMap.get(folder.parentId);
        if (parent && parent.children) {
          parent.children.push(folderMap.get(folder.id)!);
        }
      }
    });
    
    // Third pass: Add files to their parent folders
    const rootItems: DocumentItem[] = [];
    
    files.forEach(file => {
      const fileItem: DocumentItem = {
        id: file.id,
        name: file.name,
        selected: selectedDocumentIds.has(file.id),
        type: 'file',
        fileType: getFileType(file.name),
        parentId: file.folderId
      };
      
      if (file.folderId && folderMap.has(file.folderId)) {
        const parent = folderMap.get(file.folderId);
        if (parent && parent.children) {
          parent.children.push(fileItem);
        }
      } else {
        rootItems.push(fileItem);
      }
    });
    
    // Add root folders
    folders.forEach(folder => {
      if (!folder.parentId || !folderMap.has(folder.parentId)) {
        rootItems.push(folderMap.get(folder.id)!);
      }
    });
    
    // Sort items alphabetically with folders first
    const sortItems = (items: DocumentItem[]): DocumentItem[] => {
      return items.sort((a, b) => {
        // Folders come first
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        // Then sort alphabetically by name
        return a.name.localeCompare(b.name);
      }).map(item => {
        // Sort children recursively
        if (item.children) {
          return { ...item, children: sortItems(item.children) };
        }
        return item;
      });
    };
    
    return sortItems(rootItems);
  }, [folders, files, selectedDocumentIds]);

  return { documentItems };
}

/**
 * Helper function to determine file type from filename
 */
function getFileType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  if (['pdf'].includes(extension)) {
    return 'pdf';
  } else if (['xlsx', 'xls', 'csv'].includes(extension)) {
    return 'spreadsheet';
  } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
    return 'image';
  } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
    return 'document';
  } else if (['js', 'ts', 'py', 'java', 'html', 'css', 'json'].includes(extension)) {
    return 'code';
  } else {
    return 'unknown';
  }
}