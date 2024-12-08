import { SubCollection, Document } from '../types/vault';

interface FileMetadata {
  createdAt?: Date;
  modifiedAt?: Date;
  author?: string;
  title?: string;
}

export async function extractFileMetadata(file: File): Promise<FileMetadata> {
  const metadata: FileMetadata = {};

  try {
    // Get last modified date from the file object
    metadata.modifiedAt = new Date(file.lastModified);

    // If the file is a PDF, try to extract more metadata
    if (file.type === 'application/pdf') {
      // In a real implementation, you would use a PDF parsing library
      // For now, we'll just use the file's last modified date
      metadata.createdAt = new Date(file.lastModified);
    }

    // For images, try to extract EXIF data
    if (file.type.startsWith('image/')) {
      // In a real implementation, you would use an EXIF parsing library
      metadata.createdAt = new Date(file.lastModified);
    }

    // If we couldn't get a created date, use the last modified date
    if (!metadata.createdAt) {
      metadata.createdAt = new Date(file.lastModified);
    }

    return metadata;
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return {
      createdAt: new Date(),
      modifiedAt: new Date()
    };
  }
}

export function organizeFilesByName(files: File[]): Map<string, File[]> {
  const organized = new Map<string, File[]>();
  const noSubCollection: File[] = [];

  files.forEach(file => {
    const nameParts = file.name.split('_');
    if (nameParts.length > 1) {
      const subCollectionName = nameParts[0];
      const existing = organized.get(subCollectionName) || [];
      organized.set(subCollectionName, [...existing, file]);
    } else {
      noSubCollection.push(file);
    }
  });

  if (noSubCollection.length > 0) {
    organized.set('Uncategorized', noSubCollection);
  }

  return organized;
}

export function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return 'image';
  if (type.includes('pdf')) return 'pdf';
  if (type.includes('word')) return 'word';
  if (type.includes('excel')) return 'excel';
  return 'file';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}