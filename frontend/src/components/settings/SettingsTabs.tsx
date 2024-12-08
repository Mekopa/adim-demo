import React from 'react';
import { Settings, User } from 'lucide-react';

interface SettingsTabsProps {
  activeTab: 'system' | 'account';
  onTabChange: (tab: 'system' | 'account') => void;
}

const tabs = [
  { id: 'system', label: 'System', icon: Settings },
  { id: 'account', label: 'Account', icon: User },
] as const;

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="border-b border-border">
      <nav className="flex px-6" aria-label="Settings tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text hover:border-border'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}