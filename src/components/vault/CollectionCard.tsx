import React, { useState } from 'react';
import { Folder, MoreVertical, Eye, EyeOff, Trash2, User, Share2, FolderMinus } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { Collection } from '../../types/vault';
import ShareCollectionModal from './ShareCollectionModal';

interface CollectionCardProps {
  collection: Collection;
  isOwner: boolean;
  onSelect: () => void;
  onRemoveFromGroup?: () => void;
}

export default function CollectionCard({ 
  collection, 
  isOwner,
  onSelect,
  onRemoveFromGroup 
}: CollectionCardProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async (data: any) => {
    setIsLoading(true);
    try {
      // Implement share logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      collection.isPrivate = data.shareType === 'private';
      setShowShareModal(false);
    } catch (error) {
      console.error('Failed to share collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this collection?')) {
      // Handle delete
    }
  };

  const handleRemoveFromGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Remove this collection from the group?')) {
      onRemoveFromGroup?.();
    }
  };

  return (
    <>
      <div 
        onClick={onSelect}
        className="bg-surface p-6 rounded-xl border border-border hover:border-primary transition-colors group cursor-pointer"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Folder className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">
                {collection.name}
              </h3>
              <p className="text-sm text-text-secondary mt-1">{collection.description}</p>
            </div>
          </div>

          {isOwner && (
            <Menu as="div" className="relative">
              <Menu.Button 
                onClick={(e) => e.stopPropagation()}
                className="p-2 hover:bg-background rounded-lg"
              >
                <MoreVertical className="w-5 h-5 text-text-secondary" />
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-1 w-48 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-10">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowShareModal(true);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                        active ? 'bg-background' : ''
                      }`}
                    >
                      <Share2 className="text-text-secondary w-4 h-4" />
                      <span className='text-text-secondary'>Share Collection</span>
                    </button>
                  )}
                </Menu.Item>
                
                {collection.group && onRemoveFromGroup && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleRemoveFromGroup}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${
                          active ? 'bg-background' : ''
                        }`}
                      >
                        <FolderMinus className="w-4 h-4 text-red-400" />
                        <span className='text-red-400'>Remove from Group</span>
                      </button>
                    )}
                  </Menu.Item>
                )}

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleDelete}
                      className={`w-full px-4 py-2 text-left text-sm text-error flex items-center gap-2 ${
                        active ? 'bg-error/10' : ''
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Collection</span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          )}
        </div>

        {!isOwner && (
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
            <User className="w-4 h-4" />
            <span>Owned by {collection.owner.name}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <span>{collection.documentCount} documents</span>
            {isOwner && (
              <span className="flex items-center gap-1">
                • {collection.isPrivate ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Private</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Shared</span>
                  </>
                )}
              </span>
            )}
          </div>
          <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <ShareCollectionModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        collection={collection}
        onShare={handleShare}
        isLoading={isLoading}
      />
    </>
  );
}