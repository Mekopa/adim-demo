import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Layers } from 'lucide-react';

export default function CreateWorkflowPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Create New Workflow</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => navigate('/workflow-builder/dynamic')}
          className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-lg mb-4 group-hover:bg-purple-100 transition-colors">
            <Wand2 className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dynamic Form</h3>
          <p className="text-gray-500 text-sm">
            Create an interactive form with conditional logic and dynamic fields. Perfect for complex workflows.
          </p>
        </button>

        <button
          onClick={() => navigate('/workflow-builder/background')}
          className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4 group-hover:bg-blue-100 transition-colors">
            <Layers className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Background Process</h3>
          <p className="text-gray-500 text-sm">
            Set up automated document processing that runs in the background. Ideal for batch operations.
          </p>
        </button>
      </div>
    </div>
  );
}