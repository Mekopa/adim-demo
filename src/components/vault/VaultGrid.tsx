// src/components/vault/VaultGrid.tsx

import React, { useRef } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core';
import { Folder, VaultFile } from '../../types/vault';
import DraggableItem from './DraggableItem';
import DragOverlayComponent from './DragOverlayComponent';

interface VaultGridProps {
  items: (Folder | VaultFile)[];
  selectedItems: Set<string>;
  onSelectionChange: (newSelection: Set<string>) => void;
  onNavigateToFolder: (folderId: string) => void;
  onDelete: (id: string) => void;
  onMove: (itemIds: string[], targetFolderId: string) => void;
  onRename: (id: string, newName: string) => void;
  validateName: (name: string) => string | undefined;
}

export default function VaultGrid({
  items,
  selectedItems,
  onSelectionChange,
  onNavigateToFolder,
  onDelete,
  onMove,
  onRename,
  validateName
}: VaultGridProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = React.useState<string | null>(null);
  const [lastClickedId, setLastClickedId] = React.useState<string | null>(null);
  const [lastClickTime, setLastClickTime] = React.useState<number>(0);

  // Store the index of the last item clicked for shift selections
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

  /**
   * Helper: Update the selection by invoking the parent callback
   */
  const setSelection = (newSet: Set<string>) => {
    onSelectionChange(newSet);
  };

  /**
   * Determine if the item is a folder or a file based on real backend fields.
   * - If 'parent' in item -> treat as Folder
   * - Else if 'folder' in item -> treat as File
   * Adjust this logic if your model fields differ.
   */
  function isFolderItem(item: Folder | VaultFile): boolean {
    return 'parent' in item; // (Because folder objects have parent, file objects do not.)
  }

  /**
   * Handle item clicks for selection and navigation
   */
  const handleItemClick = (
    e: React.MouseEvent,
    item: Folder | VaultFile,
    index: number
  ) => {
    e.preventDefault();

    const now = Date.now();
    const isDoubleClick = item.id === lastClickedId && now - lastClickTime < 400;

    // Double-click logic: If it's a folder, navigate to it
    if (isDoubleClick && isFolderItem(item)) {
      onNavigateToFolder(item.id);
      setSelection(new Set()); // Clear selection after navigating
      setLastClickedId(null);
      return;
    }

    // Update "last click" tracking for next possible double-click
    setLastClickedId(item.id);
    setLastClickTime(now);

    // SHIFT: Range selection
    if (e.shiftKey && lastRangeStartIndex.current >= 0) {
      const start = Math.min(lastRangeStartIndex.current, index);
      const end = Math.max(lastRangeStartIndex.current, index);
      const itemsInRange = items.slice(start, end + 1);
      setSelection(prev => {
        const newSelection = new Set(prev);
        itemsInRange.forEach(rangeItem => newSelection.add(rangeItem.id));
        return newSelection;
      });
    }
    // CTRL/CMD: Toggle selection
    else if (e.ctrlKey || e.metaKey) {
      setSelection(prev => {
        const newSelection = new Set(prev);
        if (newSelection.has(item.id)) {
          newSelection.delete(item.id);
        } else {
          newSelection.add(item.id);
        }
        return newSelection;
      });
      lastRangeStartIndex.current = index;
    }
    // Single click: Select only this item
    else {
      setSelection(new Set([item.id]));
      lastRangeStartIndex.current = index;
    }
  };

  /**
   * Handle drag start event
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // If the dragged item isn't in the current selection, select only that item
    if (!selectedItems.has(active.id as string)) {
      setSelection(new Set([active.id as string]));
    }
  };

  /**
   * Handle drag over event to determine drop targets
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      const overItem = items.find(itm => itm.id === over.id);
      if (overItem && isFolderItem(overItem)) {
        setDragOverFolderId(over.id as string);
      } else {
        setDragOverFolderId(null);
      }
    } else {
      setDragOverFolderId(null);
    }
  };

  /**
   * Handle drag end event to perform move actions
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    if (over) {
      const overItem = items.find(itm => itm.id === over.id);
      if (overItem && isFolderItem(overItem)) {
        // Move all selected items to the over folder
        const itemsToMove = Array.from(selectedItems.size > 0 ? selectedItems : new Set([activeId]));
        const validItemsToMove = itemsToMove.filter(id => id !== over.id);

        if (validItemsToMove.length > 0) {
          onMove(validItemsToMove, over.id as string);
          setSelection(new Set()); // Clear selection after moving
        }
      }
    }
    setActiveId(null);
    setDragOverFolderId(null);
  };

  const activeItem = items.find(itm => itm.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] justify-items-start gap-4">
        {items.map((item, index) => {
          const isFolder = isFolderItem(item);
          const isSelected = selectedItems.has(item.id);

          return (
            <DraggableItem
              key={`${item.id}-${index}`}
              item={item}
              onSelect={(e) => handleItemClick(e, item, index)}
              onDelete={() => onDelete(item.id)}
              isSelected={isSelected}
              isFolder={isFolder}
              isDragging={activeId === item.id}
              isDropTarget={dragOverFolderId === item.id}
            />
          );
        })}
      </div>

      <DragOverlayComponent
        activeItem={activeItem || null}
        selectedCount={selectedItems.size}
      />
    </DndContext>
  );
}
