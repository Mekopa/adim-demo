import React from 'react';
import { FormStep } from '../../types/formBuilder';
import FormFieldPreview from './FormFieldPreview';

interface StepPreviewProps {
  step: FormStep;
}

export default function StepPreview({ step }: StepPreviewProps) {
  return (
    <div className="bg-surface rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-text mb-4">{step.title}</h3>
      
      <div className="space-y-6">
        {step.fields.map((field) => (
          <FormFieldPreview key={field.id} field={field} />
        ))}
        
        {step.fields.length === 0 && (
          <div className="py-8 text-center text-secondary">
            <p>Drag and drop fields here</p>
          </div>
        )}
      </div>
    </div>
  );
}