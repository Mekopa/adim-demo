import React from 'react';
import { Settings2 } from 'lucide-react';

export default function FormSettings() {
  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-5 h-5 text-gray-500" />
        <h2 className="text-sm font-medium text-gray-900">Form Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Form Name
          </label>
          <input
            type="text"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter form name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="Enter form description"
          />
        </div>
      </div>
    </div>
  );
}