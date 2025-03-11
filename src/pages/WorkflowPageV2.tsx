import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkflowCard from '../components/workflows/WorkflowCardV2';
import WorkflowPreview from '../components/workflows/WorkflowPreview';
import { FormState } from '../types/formBuilder';

export default function WorkflowsPageV2() {
  const navigate = useNavigate();
  const [selectedWorkflow, setSelectedWorkflow] = useState<FormState | null>(null);

  // Load saved workflows from localStorage
  const workflows = React.useMemo(() => {
    const items = Object.keys(localStorage)
      .filter(key => key.startsWith('form_'))
      .map(key => {
        try {
          return JSON.parse(localStorage.getItem(key)!) as FormState;
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean) as FormState[];

    return items;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-text">Workflows</h1>
        <button
          onClick={() => navigate('/create-workflow')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Workflow
        </button>
      </div>

      {workflows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onClick={() => setSelectedWorkflow(workflow)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-text mx-auto mb-4" />
          <h3 className="text-lg text-text font-medium mb-2">No workflows yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first workflow</p>
          <button
            onClick={() => navigate('/create-workflow')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Workflow
          </button>
        </div>
      )}

      {selectedWorkflow && (
        <WorkflowPreview
          workflow={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
          onComplete={(data) => {
            // Save form data and navigate to flow builder
            const formState = {
              ...selectedWorkflow,
              data,
              updatedAt: new Date()
            };
            localStorage.setItem(`form_${selectedWorkflow.id}`, JSON.stringify(formState));
            navigate(`/flow-builder/${selectedWorkflow.id}`);
          }}
        />
      )}
    </div>
  );
}