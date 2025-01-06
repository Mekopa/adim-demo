import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Type, AlignLeft, List, Calendar, ToggleLeft, Upload } from 'lucide-react';

const fields = [
  { id: 'text', icon: Type, label: 'Text Input' },
  { id: 'textarea', icon: AlignLeft, label: 'Text Area' },
  { id: 'select', icon: List, label: 'Dropdown' },
  { id: 'date', icon: Calendar, label: 'Date Picker' },
  { id: 'toggle', icon: ToggleLeft, label: 'Toggle' },
  { id: 'file', icon: Upload, label: 'File Upload' },
];

export default function FieldPalette() {
  return (
    <div className="w-64 p-4">
      <h2 className="text-sm font-medium text-text mb-4">Form Fields</h2>
      
      <div className="space-y-2">
        {fields.map((field) => (
          <DraggableField key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
}

function DraggableField({ field }: { field: typeof fields[0] }) {
  const Icon = field.icon;
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: field.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center gap-3 p-3  bg-surface border border-border rounded-lg cursor-move hover:border-primary hover:shadow-sm transition-all"
    >
      <Icon className="w-5 h-5 text-text" />
      <span className="text-sm text-text">{field.label}</span>
    </div>
  );
}