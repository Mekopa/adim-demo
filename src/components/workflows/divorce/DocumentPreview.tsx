import React from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DocumentPreviewProps {
  content: string;
  onClose: () => void;
}

export default function DocumentPreview({ content, onClose }: DocumentPreviewProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose prose-text max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      <div className="border-t border-border p-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}