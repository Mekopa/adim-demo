import React, { useState } from 'react';
import { FormConfig, FormStep } from '../../types/formBuilder';
import FormFieldRenderer from './FormFieldRenderer';

interface FormRendererProps {
  config: FormConfig;
  data?: Record<string, any>;
  onChange?: (data: Record<string, any>) => void;
}

export default function FormRenderer({ config, data = {}, onChange }: FormRendererProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = config.steps || [];
  const fields = config.fields || [];

  const handleFieldChange = (fieldId: string, value: any) => {
    onChange?.({ ...data, [fieldId]: value });
  };

  if (config.type === 'multi-step') {
    if (!steps || steps.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-secondary">No form sections have been created yet.</p>
          <p className="text-sm text-secondary mt-2">Add sections to preview the form.</p>
        </div>
      );
    }

    const currentStepData = steps[currentStep];

    return (
      <div className="max-w-2xl mx-auto rounded-lg shadow-sm p-6">

        <div className="space-y-6">
          {currentStepData.fields.map((field) => (
            <FormFieldRenderer 
              key={field.id} 
              field={field}
              value={data[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 space-y-6">
      {fields.map((field) => (
        <FormFieldRenderer 
          key={field.id} 
          field={field}
          value={data[field.id]}
          onChange={(value) => handleFieldChange(field.id, value)}
        />
      ))}
    </div>
  );
}