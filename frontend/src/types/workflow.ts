// src/types/index.ts

export type QuestionType = 'text' | 'textarea' | 'select' | 'checkbox' | 'dynamic' | 'number';

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  fields?: Question[]; // For dynamic fields like children
}

export interface FormTemplate {
  id: string;
  template: {
    title: string;
    description: string;
    icon: string;
    questions: Question[];
  };
  promptTemplate: string;
  endpoint: string;
}

// src/types/index.ts

export interface FormObject {
  [key: string]: FormValue;
}

export type FormValue =
  | string
  | number
  | boolean
  | FormObject
  | FormObject[]
  | undefined;

export interface DocumentFormData {
  [key: string]: FormValue;
}