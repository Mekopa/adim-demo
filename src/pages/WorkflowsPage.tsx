import React, { useState } from 'react';
import { FileText, FileCheck } from 'lucide-react';
import WorkflowCard from '../components/workflows/WorkflowCard';
import DivorceWorkflowModal from '../components/workflows/divorce/DivorceWorkflowModal';
import TemplateWorkflowModal from '../components/workflows/template/TemplateWorkflowModal';

const workflows = [
  {
    id: 'divorce',
    title: 'Skyrybų iesškinio magistralė',
    description: 'Sukurkime išsamų skyrybų ieškinį pagal visas būtinas teisines nuostatas.',
    icon: FileText,
  },
  {
    id: 'template',
    title: 'Magistralių kūrimo įrankis',
    description: 'Susikurkite magistralė pagal savo poreikius',
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