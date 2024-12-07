import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Action {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actions: Action[];
}

export default function ActionCard({ title, description, icon: Icon, actions }: ActionCardProps) {
  return (
    <div className="bg-surface rounded-xl shadow-sm p-6">
      <div className="flex items-start space-x-4 mb-6">
        <div className="p-3 bg-surface rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {actions.map((action, index) => {
          const ActionIcon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ActionIcon className="w-4 h-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}