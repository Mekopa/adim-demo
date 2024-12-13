import React from 'react';
import { templateFormSchema } from './schema';
import { TemplateFormData } from './types';
import WorkflowLayout from '../shared/WorkflowLayout';

interface TemplateWorkflowProps {
  onComplete: () => void;
}

const steps = [
  { id: 'step1', title: 'Step 1', component: () => <div>Step 1 Content</div> },
  { id: 'step2', title: 'Step 2', component: () => <div>Step 2 Content</div> },
  { id: 'review', title: 'Review', component: () => <div>Review Content</div> },
];

export default function TemplateWorkflow({ onComplete }: TemplateWorkflowProps) {
  const handleSubmit = async (data: TemplateFormData) => {
    try {
      // Handle form submission
      console.log('Form submitted:', data);
      onComplete();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <WorkflowLayout<TemplateFormData>
      steps={steps}
      schema={templateFormSchema}
      onSubmit={handleSubmit}
      defaultValues={{
        field1: '',
        field2: '',
      }}
    />
  );
}