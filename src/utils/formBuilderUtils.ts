import { FormField, FormStep, FormConfig, FormState } from '../types/formBuilder';

export function createField(type: string): FormField {
  const id = `${type}_${Date.now()}`;
  
  const baseField: FormField = {
    id,
    type,
    label: `New ${type} field`,
    required: false,
    placeholder: `Enter ${type}...`,
  };

  switch (type) {
    case 'select':
      return {
        ...baseField,
        options: ['Option 1', 'Option 2', 'Option 3'],
      };
    default:
      return baseField;
  }
}

export function createStep(): FormStep {
  return {
    id: `step_${Date.now()}`,
    title: 'New Section',
    fields: [],
  };
}

export function saveFormState(config: FormConfig, formData: Record<string, any>): FormState {
  const now = new Date();
  return {
    id: config.id,
    name: config.name,
    type: config.type,
    steps: config.steps,
    fields: config.fields,
    data: formData,
    createdAt: now,
    updatedAt: now,
  };
}