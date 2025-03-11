import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { FormConfig, FormStep } from '../../types/formBuilder';
import FormFieldRenderer from './FormFieldRenderer';

interface FormPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FormConfig;
}

export default function FormPreviewModal({ isOpen, onClose, config }: FormPreviewModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  if (!isOpen) return null;

  const isMultiStep = config.type === 'multi-step';
  const steps = config.steps || [];
  const currentStepData = isMultiStep ? steps[currentStep] : null;
  const displayFields = isMultiStep ? currentStepData?.fields : config.fields;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

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
            <h2 className="text-xl font-semibold text-gray-900">
              {isMultiStep ? currentStepData?.title : config.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-2xl mx-auto space-y-6">
              {displayFields?.map((field) => (
                <FormFieldRenderer 
                  key={field.id} 
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => setFormData(prev => ({ ...prev, [field.id]: value }))}
                />
              ))}
            </div>
          </div>

          {isMultiStep && (
            <div className="p-6 border-t flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}