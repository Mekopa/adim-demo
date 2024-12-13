import React, { useState } from 'react';
import { FileText, FileCheck } from 'lucide-react';
import WorkflowCard from '../components/workflows/WorkflowCard';
import DivorceWorkflowModal from '../components/workflows/divorce/DivorceWorkflowModal';
import TemplateWorkflowModal from '../components/workflows/template/TemplateWorkflowModal';

const workflows = [
  {
    id: 'divorce',
    title: 'Divorce Document Drafter',
    description: 'Generate a comprehensive divorce document with all necessary legal provisions',
    icon: FileText,
  },
  {
    id: 'template',
    title: 'Template Workflow',
    description: 'A template workflow that can be modified for different use cases',
    icon: FileCheck,
  },
];

export default function WorkflowsPage() {
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);

  const handleWorkflowClick = (workflowId: string) => {
    setActiveWorkflow(workflowId);
  };

  const handleCloseWorkflow = () => {
    setActiveWorkflow(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            title={workflow.title}
            description={workflow.description}
            icon={workflow.icon}
            onClick={() => handleWorkflowClick(workflow.id)}
          />
        ))}
      </div>

      {/* Workflow Modals */}
      <DivorceWorkflowModal 
        isOpen={activeWorkflow === 'divorce'}
        onClose={handleCloseWorkflow}
      />
      
      <TemplateWorkflowModal
        isOpen={activeWorkflow === 'template'}
        onClose={handleCloseWorkflow}
      />
    </div>
  );
}