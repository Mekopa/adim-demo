import React from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { Collection, CollectionGroup } from '../../types/vault';
import { User } from '../../types/auth';
import CollectionCard from './CollectionCard';
import DroppableGroupSection from './DroppableGroupSection';
import DraggableCollectionCard from './DraggableCollectionCard';

interface CollectionListProps {
  collections: Collection[];
  groups: CollectionGroup[];
  currentUser: User;
  onSelect: (collection: Collection) => void;
  showSearch: boolean;
  onMoveToGroup: (collectionId: string, group: string | null) => void;
  onDeleteSuccess: (deletedCollectionId: number) => void; // Added this prop
}

export default function CollectionList({ 
  collections, 
  groups, 
  currentUser, 
  onSelect,
  showSearch,
  onMoveToGroup,
}: CollectionListProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const activeCollection = collections.find(c => c.id === activeId);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  // Group collections by their group
  const groupedCollections = collections.reduce((acc, collection) => {
    if (collection.group) { // collection.group is a number representing the group's id
      const key = String(collection.group);
      const existing = acc.get(key) || [];
      acc.set(key, [...existing, collection]);
    }
    return acc;
  }, new Map<string, Collection[]>());

  // Get ungrouped collections
  const ungroupedCollections = collections.filter(c => c.group === null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
  
    if (over && active.data.current?.type === 'collection') {
      const collectionId = Number(active.id);  // convert to number if collection.id is a number
      const targetGroupId = over.id === 'ungrouped' ? null : Number(over.id);
  
      const collection = collections.find(c => c.id === collectionId);
      if (collection && collection.group !== targetGroupId) {
        // Now call onMoveToGroup with correct data
        onMoveToGroup(String(collectionId), targetGroupId ? String(targetGroupId) : null);
      }
    }
  
    setActiveId(null);
  };

  if (!showSearch && collections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No collections found</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => setActiveId(active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8">
        {/* Grouped Collections */}
        {groups.map(group => {
          const groupCollections = groupedCollections.get(String(group.id)) || [];
          if (showSearch && groupCollections.length === 0) return null;
          
          return (
            <DroppableGroupSection
              key={group.id}
              group={group}
              collections={groupCollections}
              currentUser={currentUser}
              onSelect={onSelect}
              onRemoveFromGroup={(collectionId) => onMoveToGroup(collectionId, null)}
            />
          );
        })}

        {/* Ungrouped Collections */}
        {(!showSearch || ungroupedCollections.length > 0) && (
          <div className="space-y-4">
            {groups.length > 0 && ungroupedCollections.length > 0 && (
              <hr className="border-border" />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ungroupedCollections.map((collection) => (
                <DraggableCollectionCard
                  key={collection.id}
                  collection={collection}
                  isOwner={collection.owner.id === currentUser.id}
                  onSelect={() => onSelect(collection)}
                />
              ))}
            </div>
          </div>
        )}

        <DragOverlay>
          {activeId && activeCollection && (
            <CollectionCard
              collection={activeCollection}
              isOwner={activeCollection.owner.id === currentUser.id}
              onSelect={() => {}}
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}