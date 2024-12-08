// src/forms/divorce/promptBuilder.ts

import { DocumentFormData } from '../../types/workflow';
import promptTemplate from './prompt';
import { Child } from './types';

interface DivorceFormData extends DocumentFormData {
  hasChildren: boolean;
  children?: Child[];
  spouse1Name: string;
  spouse2Name: string;
  clientName: string;
  wantsChildren: boolean;
  assets: string;
  desiredAssets: string;
  spouse1WorkInfo: string;
  spouse2WorkInfo: string;
  // Add other specific fields as necessary
}

export const buildPrompt = (formData: DocumentFormData): string => {
  const divorceData = formData as DivorceFormData;

  const childrenInfo =
    divorceData.hasChildren && divorceData.children && divorceData.children.length > 0
      ? divorceData.children
          .map((child: Child, index: number) => `Child ${index + 1} Age: ${child.age}`)
          .join(', ')
      : 'No children';

  let prompt = promptTemplate.replace('{{childrenInfo}}', childrenInfo);

  // Replace other placeholders
  Object.keys(divorceData).forEach((key) => {
    if (key === 'children') return; // Already handled
    const value =
      typeof divorceData[key] === 'boolean'
        ? divorceData[key]
          ? 'Yes'
          : 'No'
        : String(divorceData[key]);
    const placeholder = `{{${key}}}`;
    prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
  });

  return prompt;
};