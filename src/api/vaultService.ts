// src/services/vaultService.ts

import axiosInstance from './axiosInstance';
import { Collection, CollectionGroup, Document } from '../types/vault';

interface UploadDocumentResponse {
  id: number;
  owner: number;
  file: string;
  file_type: string;
  name: string;
  description: string | null;
  uploaded_at: string;
  is_private: boolean;
  collections: number[];
}

export const uploadDocumentToCollection = async (
  file: File,
  collectionId: number,
): Promise<UploadDocumentResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);
  formData.append('collections', collectionId.toString()); // Ensure correct key and format

  try {
    const response = await axiosInstance.post('/documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error uploading document:', error.response?.data || error.message);
    throw error;
  }
};

// 1. Fetch a single collection by ID, returns collection with documents
export const getCollectionById = async (collectionId: number) => {
  return axiosInstance.get<Collection>(`/collections/${collectionId}/`);
};

// 2. Delete a document by ID
export const deleteDocument = async (documentId: number) => {
  return axiosInstance.delete(`/documents/${documentId}/`);
};

// Collections
export const createCollection = async (data: { name: string; description?: string }): Promise<Collection> => {
  const response = await axiosInstance.post('/collections/', data);
  return response.data;
};

export const fetchCollections = async (): Promise<Collection[]> => {
  const response = await axiosInstance.get('/collections/');
  return response.data;
};

export const updateCollection = async (id: string, data: Partial<Collection>): Promise<Collection> => {
  const response = await axiosInstance.patch(`/collections/${id}/`, data);
  return response.data;
};

export const deleteCollection = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/collections/${id}/`);
};

// Documents
export const uploadDocument = async (data: FormData): Promise<Document> => {
  const response = await axiosInstance.post('/documents/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Sharing Collections
export const shareCollection = async (id: string, data: { is_private?: boolean; shared_with_ids?: string[] }): Promise<Collection> => {
  const response = await axiosInstance.patch(`/collections/${id}/`, data);
  return response.data;
};

// Groups
export const createGroup = async (data: { name: string; collection_ids: string[] }): Promise<CollectionGroup> => {
  const response = await axiosInstance.post('/groups/', data);
  return response.data;
};

export const fetchGroups = async (): Promise<CollectionGroup[]> => {
  const response = await axiosInstance.get('/groups/');
  return response.data;
};

export const updateGroup = async (id: string, data: Partial<CollectionGroup>): Promise<CollectionGroup> => {
  const response = await axiosInstance.patch(`/groups/${id}/`, data);
  return response.data;
};
