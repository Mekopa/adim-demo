import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Copy, Check } from 'lucide-react';

interface DocumentPreviewProps {
  content: string;
  onClose: () => void;
}

export default function DocumentPreview({ content, onClose }: DocumentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Generated Document</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isEditing ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {copied ? (
                <><Check className="w-4 h-4" /> <span>Copied!</span></>
              ) : (
                <><Copy className="w-4 h-4" /> <span>Copy</span></>
              )}
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {isEditing ? (
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full h-full min-h-[500px] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <div className="prose max-w-none">
              <ReactMarkdown>{editableContent}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}