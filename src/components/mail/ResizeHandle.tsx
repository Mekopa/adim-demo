import React from 'react';
import { GripVertical } from 'lucide-react';

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
}

export default function ResizeHandle({ onMouseDown }: ResizeHandleProps) {
  return (
    <div
      className="w-2 hover:w-3 group flex items-center justify-center cursor-col-resize border-x border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
      onMouseDown={onMouseDown}
    >
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-primary/50" />
      </div>
    </div>
  );
}