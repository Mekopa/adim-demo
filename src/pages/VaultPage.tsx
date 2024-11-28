import React from 'react';
import { Briefcase, Plus, Upload, FolderTree } from 'lucide-react';
import ActionCard from '../components/ActionCard';

export default function VaultPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <ActionCard
          title="Document Vault"
          description="Securely store and manage all your legal documents"
          icon={Briefcase}
          actions={[
            {
              label: 'Add Document',
              icon: Plus,
              onClick: () => console.log('Add document clicked'),
            },
            {
              label: 'Upload Batch',
              icon: Upload,
              onClick: () => console.log('Upload batch clicked'),
            },
            {
              label: 'Organize Folders',
              icon: FolderTree,
              onClick: () => console.log('Organize folders clicked'),
            },
          ]}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Document vault functionality coming soon...</p>
      </div>
    </div>
  );
}