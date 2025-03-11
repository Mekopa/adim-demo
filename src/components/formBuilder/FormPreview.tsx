import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { FormType, FormField, FormStep } from '../../types/formBuilder';
import FormFieldPreview from './FormFieldPreview';
import StepPreview from './StepPreview';
import FormPreviewModal from './FormPreviewModal';

interface FormPreviewProps {
  type: FormType;
  fields: FormField[];
  steps?: FormStep[];
  currentStep?: number;
  onAddStep?: () => void;
  showPreview: boolean;
  onClosePreview: () => void;
}

export default function FormPreview({ 
  type, 
  fields, 
  steps = [], 
  currentStep = 0,
  onAddStep,
  showPreview,
  onClosePreview
}: FormPreviewProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-preview',
  });

  const dropStyles = isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200';

  if (type === 'multi-step') {
    const currentStepData = steps[currentStep];
    
    if (!currentStepData) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-secondary mb-4">No sections created yet</p>
          <button
            onClick={onAddStep}
            className="px-4 py-2 text-white rounded-lg hover:bg-surface transition-colors"
          >
            + Add Section
          </button>
        </div>
      );
    }

    return (
      <>
        <div ref={setNodeRef} className="max-w-3xl mx-auto">
          <StepPreview step={currentStepData} />
        </div>

        {showPreview && (
          <FormPreviewModal
            isOpen={showPreview}
            onClose={onClosePreview}
            steps={steps}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div 
        ref={setNodeRef}
        className={`max-w-3xl mx-auto bg-surface rounded-lg border-2 border-dashed ${dropStyles} transition-colors p-6 min-h-[600px]`}
      >
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text">
            <p className="text-lg">Drag and drop form fields here</p>
            <p className="text-sm mt-2">Your form preview will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {fields.map((field) => (
              <FormFieldPreview key={field.id} field={field} />
            ))}
          </div>
        )}
      </div>

      {showPreview && (
        <FormPreviewModal
          isOpen={showPreview}
          onClose={onClosePreview}
          fields={fields}
        />
      )}
    </>
  );
}