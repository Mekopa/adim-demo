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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl w-full max-w-5xl h-[90vh] flex">
        {isMultiStep && (
          <div className="w-64 border-r border-secondary p-6">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className="flex items-center w-full"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 mr-3 ${
                    index === currentStep 
                      ? 'border-primary bg-primary text-white'
                      : index < currentStep
                      ? 'border-primary bg-primary text-white'
                      : 'border-secondary text-secondary' 
                  }`}>
                    {index < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    index === currentStep ? 'text-text' : 'text-secondary'
                  }`}>
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-xl font-semibold text-text">{workflow.name}</h2>
              {workflow.description && (
                <p className="text-sm text-text mt-1">{workflow.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-secondary" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 bg-background">
            <div className="max-w-2xl mx-auto space-y-6">
              <FormRenderer
                config={workflow}
                data={formData}
                onChange={setFormData}
              />
            </div>

            {/* <div className=" border-t flex justify-between gap-3 bg-white">
              <button
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
              </button> 
            </div> */}
          </form>
          <div className="p-6 flex justify-between">                                                                  
              <button                                                                                                                     
                type="button"                                                                                                             
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}                                                           
                disabled={currentStep === 0}                                                                                              
                className="px-4 py-2 text-text rounded-lg hover:bg-surface transition-colors disabled:opacity-50"        
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
        </div>
      </div>
    </div>
  );
}