import React from 'react';
import { X } from 'lucide-react';
import DivorceWorkflow from './DivorceWorkflow';

interface DivorceWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DivorceWorkflowModal({ isOpen, onClose }: DivorceWorkflowModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl w-[95vw] h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text">Divorce Document Drafter</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <DivorceWorkflow onComplete={onClose} />
        </div>
      </div>
    </div>
  );
}