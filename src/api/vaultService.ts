// src/services/vaultService.ts

import axiosInstance from './axiosInstance';

// Types
import { Collection, CollectionGroup, Document } from '../types/vault';

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
