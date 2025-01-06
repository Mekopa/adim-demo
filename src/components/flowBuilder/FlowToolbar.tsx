import React from 'react';
import { FileText, Cog, FileOutput } from 'lucide-react';

interface FlowToolbarProps {
  onAddNode: (type: string) => void;
}

export default function FlowToolbar({ onAddNode }: FlowToolbarProps) {
  return (
    <div className="h-16 pt-2 flex items-center px-4">
      <div className="flex gap-2">
        <button
          onClick={() => onAddNode('process')}
          className="flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-surface rounded-lg transition-colors"
        >
          <Cog className="w-4 h-4" />
          Add Process
        </button>
        <button
          onClick={() => onAddNode('output')}
          className="flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-surface rounded-lg transition-colors"
        >
          <FileOutput className="w-4 h-4" />
          Add Output
        </button>
      </div>
    </div>
  );
}