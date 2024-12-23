// src/components/vault/UploadDocumentModal.tsx
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload } from 'lucide-react';
import { Collection, User } from '../../types/vault';
import { uploadDocumentToCollection } from '../../api/vaultService';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
  isLoading: boolean;
  onRefreshDocuments: () => void; // Callback to refetch or update local docs
  currentUser: User; // Current user prop
}

export default function UploadDocumentModal({
  isOpen,
  onClose,
  collection,
  isLoading,
  onRefreshDocuments,
}: UploadDocumentModalProps) {
  const onDrop = async (acceptedFiles: File[]) => {
    try {
      for (const file of acceptedFiles) {
        const uploadedDoc = await uploadDocumentToCollection(file, Number(collection.id));
        console.log('Uploaded Document ID:', uploadedDoc); // Verify 'id' exists
      }
      // Once all uploads are done, refresh doc list
      const onRefreshDocuments = () => {
        if (collection) {
          fetchCollectionData(collection);
        }
      };
    } catch (error: any) {
      console.error('Failed to upload documents:', error.response?.data || error.message);
      alert(`Failed to upload documents: ${error.response?.data?.detail || error.message}`);
    }
  }; 

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10485760, // 10MB
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text">Upload Documents</h2>
            <p className="text-sm text-text-secondary mt-1">
              to {collection.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 text-text-secondary mx-auto mb-4" />
            <p className="text-text">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
            </p>
            <p className="text-sm text-text-secondary mt-2">
              Supported formats: PDF, TXT, DOC, DOCX (Max 10MB)
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-text-secondary hover:bg-background rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}