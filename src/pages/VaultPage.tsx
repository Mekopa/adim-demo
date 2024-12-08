import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Collection, CollectionGroup } from '../types/vault';
import CollectionList from '../components/vault/CollectionList';
import CollectionView from '../components/vault/CollectionView';
import SearchBar from '../components/vault/SearchBar';
import ViewToggle from '../components/vault/ViewToggle';
import CreateCollectionModal from '../components/vault/CreateCollectionModal';
import CreateGroupModal from '../components/vault/CreateGroupModal';

export default function VaultPage() {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShared, setShowShared] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [groups, setGroups] = useState<CollectionGroup[]>([]);

  // Mock current user
  const currentUser = {
    id: '1',
    email: 'user@example.com',
    name: 'Current User'
  };

  const handleCreateCollection = async (data: { name: string; description?: string }) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description || '',
        createdAt: new Date(),
        documentCount: 0,
        owner: currentUser,
        isPrivate: true
      };

      setCollections(prev => [...prev, newCollection]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async (data: { name: string; collectionIds: string[] }) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newGroup: CollectionGroup = {
        id: Date.now().toString(),
        name: data.name,
        createdAt: new Date(),
        owner: currentUser
      };

      setGroups(prev => [...prev, newGroup]);
      
      // Update collections with new groupId
      setCollections(prev => prev.map(collection => 
        data.collectionIds.includes(collection.id)
          ? { ...collection, groupId: newGroup.id }
          : collection
      ));
      
      setShowCreateGroupModal(false);
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveToGroup = (collectionId: string, groupId: string | null) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId
        ? { ...collection, groupId }
        : collection
    ));
  };

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesView = showShared 
      ? collection.owner.id !== currentUser.id 
      : collection.owner.id === currentUser.id;
    return matchesSearch && matchesView;
  });

  if (selectedCollection) {
    return (
      <CollectionView
        collection={selectedCollection}
        onBack={() => setSelectedCollection(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <ViewToggle value={showShared} onChange={setShowShared} />
        </div>
        {!showShared && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="px-4 py-2 text-text-secondary hover:text-text hover:bg-background rounded-lg transition-colors"
            >
              New Group
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Collection</span>
            </button>
          </div>
        )}
      </div>

      <CollectionList
        collections={filteredCollections}
        groups={groups}
        currentUser={currentUser}
        onSelect={setSelectedCollection}
        showSearch={searchQuery.length > 0}
        onMoveToGroup={handleMoveToGroup}
      />

      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCollection}
        isLoading={isLoading}
      />

      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onSubmit={handleCreateGroup}
        isLoading={isLoading}
        collections={collections}
      />
    </div>
  );
}