import React from 'react';
import * as Icons from 'lucide-react';
import { DocumentTemplate } from '../types';

interface DocumentCardProps {
  template: DocumentTemplate;
  onClick: () => void;
}

export default function DocumentCard({ template, onClick }: DocumentCardProps) {
  const Icon = Icons[template.icon as keyof typeof Icons];

  return (
    <button
      onClick={onClick}
      className="bg-background p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 text-left w-full"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{template.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{template.description}</p>
        </div>
      </div>
    </button>
  );
}