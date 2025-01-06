import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { FormState } from '../../types/formBuilder';
import FormRenderer from '../formBuilder/FormRenderer';

interface WorkflowPreviewProps {
  workflow: FormState;
  onClose: () => void;
  onComplete: (data: Record<string, any>) => void;
}

export default function WorkflowPreview({ workflow, onClose, onComplete }: WorkflowPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const isMultiStep = workflow.type === 'multi-step';
  const steps = workflow.steps || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] flex">
        {isMultiStep && (
          <div className="w-64 border-r border-gray-200 p-6">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className="flex items-center w-full"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mr-3 ${
                    index === currentStep 
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : index < currentStep
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300'
                  }`}>
                    {index < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    index === currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{workflow.name}</h2>
              {workflow.description && (
                <p className="text-sm text-gray-500 mt-1">{workflow.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 bg-gray-50">
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <FormRenderer
                config={workflow}
                data={formData}
                onChange={setFormData}
              />
            </div>

            <div className="p-6 border-t flex justify-end gap-3 bg-white">
              <div className="p-6 border-t flex justify-between fixed">
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  disabled={currentStep === steps.length - 1}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              {/* <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Flow Builder
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}