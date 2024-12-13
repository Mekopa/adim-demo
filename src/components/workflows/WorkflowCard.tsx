import React from 'react';
import { LucideIcon } from 'lucide-react';

interface WorkflowCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export default function WorkflowCard({ title, description, icon: Icon, onClick }: WorkflowCardProps) {
  return (
    <button onClick={onClick} className="w-full text-left">
      <div className="flex items-start space-x-4 bg-surface p-6 rounded-xl border border-border hover:border-primary transition-all">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text">{title}</h3>
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        </div>
      </div>
    </button>
  );
}