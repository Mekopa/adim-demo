import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import { FormConfig, FormField, FormStep } from '../../types/formBuilder';
import { saveFormState } from '../../utils/formBuilderUtils';
import FieldPalette from './FieldPalette';
import FormPreview from './FormPreview';
import FormBuilderHeader from './FormBuilderHeader';
import StepsSidebar from './StepsSidebar';

interface FormBuilderProps {
  config: FormConfig;
}

export default function FormBuilder({ config }: FormBuilderProps) {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<FormField[]>(config.fields || []);
  const [steps, setSteps] = useState<FormStep[]>(config.steps || []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const currentConfig = {
    ...config,
    fields: formFields,
    steps: steps,
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = ({ active }: { active: any }) => {
    setActiveId(active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.id === 'form-preview') {
      const newField: FormField = {
        id: `${active.id}_${Date.now()}`,
        type: active.id,
        label: `New ${active.id} field`,
        required: false,
        placeholder: `Enter ${active.id}...`,
      };

      if (config.type === 'multi-step') {
        if (steps.length > 0) {
          setSteps(steps.map((step, index) => 
            index === currentStep 
              ? { ...step, fields: [...step.fields, newField] }
              : step
          ));
        }
      } else {
        setFormFields([...formFields, newField]);
      }
    }
  };

  const handleAddStep = () => {
    const newStep: FormStep = {
      id: `step_${Date.now()}`,
      title: 'New Section',
      fields: [],
    };
    setSteps([...steps, newStep]);
    setCurrentStep(steps.length);
  };

  const handleSave = () => {
    const formState = saveFormState(currentConfig, formData);
    localStorage.setItem(`form_${config.id}`, JSON.stringify(formState));
    navigate(`/flow-builder/${config.id}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <FormBuilderHeader
        config={currentConfig}
        onSave={handleSave}
        onBack={() => navigate('/workflowV2')}
        onPreview={() => setShowPreview(true)}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <FieldPalette />

          <div className="flex-1 overflow-y-auto p-6">
            <FormPreview
              type={config.type}
              fields={formFields}
              steps={steps}
              currentStep={currentStep}
              onAddStep={handleAddStep}
              showPreview={showPreview}
              onClosePreview={() => setShowPreview(false)}
            />
          </div>

          {config.type === 'multi-step' && (
            <StepsSidebar
              steps={steps}
              currentStep={currentStep}
              onStepSelect={setCurrentStep}
              onAddStep={handleAddStep}
            />
          )}
        </DndContext>
      </div>
    </div>
  );
}