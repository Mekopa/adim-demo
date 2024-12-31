import React, { useState, useRef } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { Folder, VaultFile } from '../../types/vault';
import DraggableItem from './DraggableItem';
import DragOverlay from './DragOverlay';

interface VaultGridProps {
  items: (Folder | VaultFile)[];
  onSelect: (item: Folder | VaultFile) => void;
  onDelete: (id: string) => void;
  onMove: (itemIds: string[], targetFolderId: string) => void;
}

export default function VaultGrid({ items, onSelect, onDelete, onMove }: VaultGridProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const lastRangeStartIndex = useRef<number>(-1);

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

  const handleItemClick = (e: React.MouseEvent, item: Folder | VaultFile, index: number) => {
    e.preventDefault();
    const now = Date.now();
    const isDoubleClick = item.id === lastClickedId && now - lastClickTime < 500;

    // Handle double-click for folders
    if (isDoubleClick && 'documentCount' in item) {
      onSelect(item);
      setSelectedItems(new Set());
      return;
    }

    // Update click tracking
    setLastClickedId(item.id);
    setLastClickTime(now);

    // Handle selection
    if (e.shiftKey && lastRangeStartIndex.current >= 0) {
      // Range selection
      const start = Math.min(lastRangeStartIndex.current, index);
      const end = Math.max(lastRangeStartIndex.current, index);
      const itemsInRange = items.slice(start, end + 1);
      
      setSelectedItems(prev => {
        const newSelection = new Set(prev);
        itemsInRange.forEach(rangeItem => newSelection.add(rangeItem.id));
        return newSelection;
      });
    } else if (e.ctrlKey || e.metaKey) {
      // Toggle selection
      setSelectedItems(prev => {
        const newSelection = new Set(prev);
        if (newSelection.has(item.id)) {
          newSelection.delete(item.id);
        } else {
          newSelection.add(item.id);
        }
        return newSelection;
      });
      lastRangeStartIndex.current = index;
    } else {
      // Single selection
      setSelectedItems(new Set([item.id]));
      lastRangeStartIndex.current = index;
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    if (!selectedItems.has(active.id as string)) {
      setSelectedItems(new Set([active.id as string]));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      const overItem = items.find(item => item.id === over.id);
      if (overItem && 'documentCount' in overItem) {
        setDragOverFolderId(over.id as string);
      } else {
        setDragOverFolderId(null);
      }
    } else {
      setDragOverFolderId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    
    if (over) {
      const overItem = items.find(item => item.id === over.id);
      if (overItem && 'documentCount' in overItem) {
        const itemsToMove = Array.from(selectedItems.size > 0 ? selectedItems : new Set([activeId]));
        const validItemsToMove = itemsToMove.filter(id => id !== over.id);
        
        if (validItemsToMove.length > 0) {
          onMove(validItemsToMove, over.id);
          setSelectedItems(new Set());
        }
      }
    }
    
    setActiveId(null);
    setDragOverFolderId(null);
  };

  const activeItem = items.find(item => item.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] justify-items-start">
        {items.map((item, index) => {
          const isFolder = 'documentCount' in item;
          return (
            <DraggableItem
              key={item.id}
              item={item}
              onSelect={(e) => handleItemClick(e, item, index)}
              onDelete={() => onDelete(item.id)}
              isSelected={selectedItems.has(item.id)}
              isFolder={isFolder}
              isDragging={activeId === item.id}
              isDropTarget={dragOverFolderId === item.id}
            />
          );
        })}
      </div>

      <DragOverlay
        activeItem={activeItem || null}
        selectedCount={selectedItems.size}
      />
    </DndContext>
  );
}