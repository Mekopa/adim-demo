import React, { useState } from 'react';
import { X } from 'lucide-react';
import SystemSettings from './SystemSettings';
import AccountSettings from './AccountSettings';
import SettingsTabs from './SettingsTabs';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabId = 'system' | 'account';

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>('system');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface text-text max-w-2xl w-full rounded-xl shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-20rem)] max-h-[600px]">
          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'system' ? (
              <SystemSettings />
            ) : (
              <AccountSettings
                isSaving={isSaving}
                onSave={async (data) => {
                  setIsSaving(true);
                  // Simulate API call
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  setIsSaving(false);
                  onClose();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}