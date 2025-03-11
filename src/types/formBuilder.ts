export type FormType = 'multi-step' | 'single-view';

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: any;
}

export interface FormStep {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormConfig {
  id: string;
  name: string;
  description?: string;
  type: FormType;
  steps?: FormStep[];
  fields?: FormField[];
}

export interface FormState extends FormConfig {
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}