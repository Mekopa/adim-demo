import React, { useEffect, useState } from 'react';
import { ChevronLeft, Upload } from 'lucide-react';
import { Document } from '../../types/vault';
import DocumentGrid from './DocumentGrid';
import UploadDocumentModal from './UploadDocumentModal';
import { extractFileMetadata } from '../../utils/fileUtils';
import { User } from '../../types/auth';
import { getCollectionById, deleteDocument } from '../../api/vaultService';
//import type { Collection, Document } from '../../api/vaultService';

interface Collection {
  id: number;
  name: string;
  description: string;
  documents?: Document[];
}

interface CollectionViewProps {
  collection: Collection;
  onBack: () => void;
  currentUser: User;
}

export default function CollectionView({ collection, onBack, currentUser }: CollectionViewProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [localCollection, setLocalCollection] = useState<Collection | null>(null); // Added state

    // Fetch collection and its documents
    const fetchCollectionData = async (id: number) => {
      try {
        const { data } = await getCollectionById(id);
        setLocalCollection(data);
        setDocuments(data.documents || []);
      } catch (error) {
        console.error('Failed to fetch collection data:', error);
      }
    };

    // Called after uploading or deleting a document
  const onRefreshDocuments = () => {
    if (collection.id) {
      fetchCollectionData(collection.id);
    }
  };

    // Delete a document by ID, then refresh the collection’s documents
  const handleDeleteDocument = async (docId: number) => {
    try {
      await deleteDocument(docId);
      onRefreshDocuments();
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const handleUpload = async (files: File[]) => {
    setIsLoading(true);
    try {
      // Process files and extract metadata
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          const metadata = await extractFileMetadata(file);
          return {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            createdAt: metadata.createdAt || new Date(),
            modifiedAt: metadata.modifiedAt || new Date(),
            status: 'processing' as const,
            metadata: {
              ...metadata,
              originalName: file.name,
            }
          };
        })
      );

      setDocuments(prev => [...prev, ...processedFiles]);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // On the first render or whenever collectionId changes, fetch the data
  useEffect(() => {
    if (collection.id) {
      fetchCollectionData(collection.id);
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection.id])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-background rounded-lg transition-colors text-text-secondary hover:text-text"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
            <h2 className="text-xl font-semibold text-text">{localCollection?.name || collection.name}</h2>
            <p className="text-sm text-text-secondary">{localCollection?.description || collection.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Documents</span>
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="mt-6">
        <DocumentGrid
          documents={documents}
          onDelete={handleDeleteDocument}
        />
      </div>

      {/* Upload Modal */}
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        collection={collection}
        isLoading={isLoading}
        currentUser={currentUser} // Pass the current user here
      />
    </div>
  );
}