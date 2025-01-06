// Add parentId to track folder hierarchy
export interface Folder {
  id: string;
  unique_id: string;
  name: string;
  description: string;
  parentId: string | null;
  createdAt: Date;
  documentCount: number;
  owner: User;
  isPrivate: boolean;
  sharedWith?: User[];
}

export interface VaultFile {
  id: string;
  unique_id: string;
  name: string;
  file_type: string;
  type: string;
  size: number;
  folderId: string | null;
  createdAt: Date;
  modifiedAt?: Date;
  status: 'processing' | 'ready' | 'error';
  errorMessage?: string;
  url?: string;
  metadata?: Record<string, any>;
}