import React from 'react';
import { Collection, CollectionGroup } from '../../types/vault';
import { User } from '../../types/auth';
import CollectionCard from './CollectionCard';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollectionGroupSectionProps {
  group: CollectionGroup;
  collections: Collection[];
  currentUser: User;
  onSelect: (collection: Collection) => void;
}

export default function CollectionGroupSection({
  group,
  collections,
  currentUser,
  onSelect
}: CollectionGroupSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              isOwner={collection.owner.id === currentUser.id}
              onSelect={() => onSelect(collection)}
            />
          ))}
        </div>
      )}
    </div>
  );
}