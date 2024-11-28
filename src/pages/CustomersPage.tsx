import React from 'react';
import { Users, UserPlus, Upload, UserCog } from 'lucide-react';
import ActionCard from '../components/ActionCard';

export default function CustomersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <ActionCard
          title="Customers"
          description="Manage your client relationships and access controls"
          icon={Users}
          actions={[
            {
              label: 'Add Customer',
              icon: UserPlus,
              onClick: () => console.log('Add customer clicked'),
            },
            {
              label: 'Import Customers',
              icon: Upload,
              onClick: () => console.log('Import customers clicked'),
            },
            {
              label: 'Manage Roles',
              icon: UserCog,
              onClick: () => console.log('Manage roles clicked'),
            },
          ]}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Customer management functionality coming soon...</p>
      </div>
    </div>
  );
}