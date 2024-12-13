import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ZodSchema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import WorkflowSteps from './WorkflowSteps';

interface Step {
  id: string;
  title: string;
  component: React.ComponentType;
}

interface WorkflowLayoutProps<T extends Record<string, any>> {
  steps: Step[];
  schema: ZodSchema;
  onSubmit: (data: T) => Promise<void>;
  defaultValues?: Partial<T>;
}

export default function WorkflowLayout<T extends Record<string, any>>({
  steps,
  schema,
  onSubmit,
  defaultValues,
}: WorkflowLayoutProps<T>) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const isLastStep = currentStep === steps.length - 1;
  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isValid = await methods.trigger();
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(prev => prev - 1);
  };

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
            onSubmit={methods.handleSubmit(onSubmit)} 
            className="h-full flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
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
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  Submit
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