import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Collection, CollectionGroup } from '../../types/vault';
import { User } from '../../types/auth';
import { ChevronDown, ChevronRight } from 'lucide-react';
import DraggableCollectionCard from './DraggableCollectionCard';

interface DroppableGroupSectionProps {
  group: CollectionGroup;
  collections: Collection[];
  currentUser: User;
  onSelect: (collection: Collection) => void;
  onRemoveFromGroup: (collectionId: string) => void;
}

export default function DroppableGroupSection({
  group,
  collections,
  currentUser,
  onSelect,
  onRemoveFromGroup
}: DroppableGroupSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const { setNodeRef, isOver } = useDroppable({
    id: group.id,
    data: {
      type: 'group',
      group
    }
  });

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-lg font-medium text-text hover:text-primary transition-colors group"
      >
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-text-secondary group-hover:text-primary" />
        ) : (
          <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary" />
        )}
        {group.name}
        <span className="text-sm text-text-secondary">({collections.length})</span>
      </button>

      {isExpanded && (
        <div
          ref={setNodeRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-lg transition-colors ${
            isOver ? 'bg-primary/5 ring-2 ring-primary/20' : ''
          }`}
        >
          {collections.map((collection) => (
            <DraggableCollectionCard
              key={collection.id}
              collection={collection}
              isOwner={collection.owner.id === currentUser.id}
              onSelect={() => onSelect(collection)}
              onRemoveFromGroup={() => onRemoveFromGroup(collection.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}