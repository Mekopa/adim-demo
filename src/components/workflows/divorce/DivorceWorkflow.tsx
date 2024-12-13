import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { divorceFormSchema } from './schema';
import { DivorceFormData } from './types';
import WorkflowSteps from './WorkflowSteps';
import SpouseInformation from './steps/SpouseInformation';
import ChildrenInformation from './steps/ChildrenInformation';
import AssetInformation from './steps/AssetInformation';
import WorkInformation from './steps/WorkInformation';
import ReviewInformation from './steps/ReviewInformation';
import DocumentPreview from './DocumentPreview';
import LoadingOverlay from './LoadingOverlay';
import { generateDivorceDocument } from './api';

interface DivorceWorkflowProps {
  onComplete: () => void;
}

const steps = [
  { id: 'spouse', title: 'Spouse Information', component: SpouseInformation },
  { id: 'children', title: 'Children Information', component: ChildrenInformation },
  { id: 'assets', title: 'Asset Information', component: AssetInformation },
  { id: 'work', title: 'Work Information', component: WorkInformation },
  { id: 'review', title: 'Review', component: ReviewInformation },
];

export default function DivorceWorkflow({ onComplete }: DivorceWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);

  const methods = useForm<DivorceFormData>({
    resolver: zodResolver(divorceFormSchema),
    defaultValues: {
      hasChildren: false,
      children: [],
      assets: [],
    },
    mode: 'onChange',
  });

  const isLastStep = currentStep === steps.length - 1;
  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const isValid = await methods.trigger();
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (data: DivorceFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const document = await generateDivorceDocument(data);
      setGeneratedDocument(document);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate document');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  if (generatedDocument) {
    return <DocumentPreview content={generatedDocument} onClose={onComplete} />;
  }

  return (
    <div className="h-full flex">
      <WorkflowSteps
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />
      
      <div className="flex-1 flex flex-col border-l border-border">
        <FormProvider {...methods}>
          <form 
            onSubmit={methods.handleSubmit(handleSubmit)} 
            className="h-full flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                {error && (
                  <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
                    <p className="text-sm text-error">{error}</p>
                  </div>
                )}
                <CurrentStepComponent />
              </div>
            </div>
            
            <div className="border-t border-border p-6 flex justify-between bg-surface">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-background rounded-lg transition-colors"
                disabled={currentStep === 0}
              >
                Previous
              </button>
              
              {isLastStep ? (
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Document
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}