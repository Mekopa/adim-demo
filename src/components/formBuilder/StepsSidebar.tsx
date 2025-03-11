import React from 'react';
import { Plus } from 'lucide-react';
import { FormStep } from '../../types/formBuilder';

interface StepsSidebarProps {
  steps: FormStep[];
  currentStep: number;
  onStepSelect: (index: number) => void;
  onAddStep: () => void;
}

export default function StepsSidebar({ 
  steps, 
  currentStep, 
  onStepSelect,
  onAddStep 
}: StepsSidebarProps) {
  return (
    <div className="w-64 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-medium text-text mb-4">Form Sections</h2>
        
        <div className="space-y-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => onStepSelect(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentStep === index
                  ? 'bg-surface text-primary'
                  : 'hover:bg-surface text-secondary'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{step.title}</span>
                <span className="text-sm text-gray-500">
                  {step.fields.length} fields
                </span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onAddStep}
          className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>
    </div>
  );
}