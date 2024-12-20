export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface Document {
    id: string;
    name: string;
    type: string;
    size: number;
    createdAt: Date;
    modifiedAt?: Date;
    status: 'processing' | 'ready' | 'error';
    errorMessage?: string;
    metadata?: Record<string, any>;
  }
  
  export interface SubCollection {
    id: string;
    name: string;
    documentCount: number;
    createdAt: Date;
    owner: User;
  }
  
  export interface Collection {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    documentCount: number;
    owner: User;
    isPrivate: boolean;
    sharedWith?: User[];
    group?: string;
  }
  
  export interface CollectionGroup {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    owner: User;
  }
  
  export interface CreateCollectionInput {
    name: string;
    description?: string;
    group?: string;
  }
  
  export interface CreateGroupInput {
    name: string;
    description?: string;
  }