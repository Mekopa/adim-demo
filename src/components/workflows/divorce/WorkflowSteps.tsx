import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  component: React.ComponentType;
}

interface WorkflowStepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function WorkflowSteps({ steps, currentStep, onStepClick }: WorkflowStepsProps) {
  return (
    <div className="w-80 bg-background p-6 overflow-y-auto">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <li key={step.id}>
                <button
                  onClick={() => onStepClick(index)}
                  className="group w-full"
                  disabled={!isCompleted && !isCurrent}
                >
                  <div className="flex items-center">
                    <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      {isCompleted ? (
                        <div className="h-full w-full rounded-full bg-primary group-hover:bg-primary-hover">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <div
                          className={`h-full w-full rounded-full border-2 ${
                            isCurrent
                              ? 'border-primary'
                              : 'border-border'
                          }`}
                        >
                          {isCurrent && (
                            <div className="absolute -inset-px rounded-full border-2 border-primary" />
                          )}
                        </div>
                      )}
                    </div>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        isCompleted || isCurrent
                          ? 'text-text'
                          : 'text-text-secondary'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}