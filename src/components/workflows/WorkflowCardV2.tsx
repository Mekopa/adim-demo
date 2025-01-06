import React from 'react';
import { FileText, Calendar } from 'lucide-react';
import { FormState } from '../../types/formBuilder';

interface WorkflowCardProps {
  workflow: FormState;
  onClick: () => void;
}

export default function WorkflowCard({ workflow, onClick }: WorkflowCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left"
    >
      <div className="flex items-start space-x-4 bg-surface p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="p-3 bg-blue-600/20 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text">{workflow.name}</h3>
          <div className="flex items-center gap-2 mt-2 text-sm text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Last updated {new Date(workflow.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </button>
  );
}