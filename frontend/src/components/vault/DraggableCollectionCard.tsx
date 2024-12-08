import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Collection } from '../../types/vault';
import CollectionCard from './CollectionCard';

interface DraggableCollectionCardProps {
  collection: Collection;
  isOwner: boolean;
  onSelect: () => void;
  onRemoveFromGroup?: () => void;
}

export default function DraggableCollectionCard({
  collection,
  isOwner,
  onSelect,
  onRemoveFromGroup
}: DraggableCollectionCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: collection.id,
    data: {
      type: 'collection',
      collection
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : undefined
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      {!collection.groupId && (
        <div 
          {...attributes} 
          {...listeners}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 cursor-grab opacity-0 group-hover:opacity-100 hover:bg-background rounded-lg transition-opacity"
        >
          <GripVertical className="w-5 h-5 text-text-secondary" />
        </div>
      )}
      
      <div className={!collection.groupId ? 'pl-10' : undefined}>
        <CollectionCard
          collection={collection}
          isOwner={isOwner}
          onSelect={onSelect}
          onRemoveFromGroup={onRemoveFromGroup}
        />
      </div>
    </div>
  );
}