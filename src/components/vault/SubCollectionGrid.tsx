import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Folder } from 'lucide-react';
import { SubCollection } from '../../types/vault';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';

interface SubCollectionGridProps {
  subCollections: SubCollection[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  searchThreshold?: number;
}

export default function SubCollectionGrid({
  subCollections,
  selectedId,
  onSelect,
  searchThreshold = 5
}: SubCollectionGridProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollLeft, scrollRight } = useHorizontalScroll(scrollContainerRef);

  useEffect(() => {
    setShowSearch(subCollections.length > searchThreshold);
  }, [subCollections.length, searchThreshold]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  }, [subCollections]);

  const filteredSubCollections = subCollections.filter(sc =>
    sc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sub-collections..."
            className="w-full pl-10 pr-4 py-2 bg-input border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-text-secondary" />
        </div>
      )}

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-surface border border-border rounded-full shadow-lg hover:bg-background"
          >
            <ChevronLeft className="w-5 h-5 text-text-secondary" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide grid grid-flow-col auto-cols-max gap-4 py-2 px-1"
          style={{ scrollBehavior: 'smooth' }}
        >
          <button
            onClick={() => onSelect(null)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors whitespace-nowrap ${
              selectedId === null
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50 text-text-secondary hover:text-text'
            }`}
          >
            <Folder className="w-5 h-5" />
            <span>All Files</span>
          </button>

          {filteredSubCollections.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onSelect(sc.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors whitespace-nowrap ${
                selectedId === sc.id
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50 text-text-secondary hover:text-text'
              }`}
            >
              <Folder className="w-5 h-5" />
              <span>{sc.name}</span>
              <span className="text-sm text-text-secondary">
                ({sc.documentCount})
              </span>
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-surface border border-border rounded-full shadow-lg hover:bg-background"
          >
            <ChevronRight className="w-5 h-5 text-text-secondary" />
          </button>
        )}
      </div>
    </div>
  );
}