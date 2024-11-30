// src/forms/divorce/template.ts

import { FormTemplate } from "../../types/workflow";

const template: FormTemplate['template'] = {
  title: 'Divorce Agreement',
  description: 'Generate a divorce agreement compliant with Lithuanian law',
  icon: 'Scales',
  questions: [
    {
      id: 'spouse1Name',
      label: 'Spouse 1 Name',
      type: 'text',
      required: true,
    },
    {
      id: 'spouse2Name',
      label: 'Spouse 2 Name',
      type: 'text',
      required: true,
    },
    {
      id: 'hasChildren',
      label: 'Has Children',
      type: 'checkbox',
      required: false,
    },
    {
      id: 'children',
      label: 'Children Information',
      type: 'dynamic',
      required: false,
      fields: [
        {
          id: 'age',
          label: 'Child Age',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      id: 'clientName',
      label: 'Client Name',
      type: 'text',
      required: true,
    },
    {
      id: 'wantsChildren',
      label: 'Wants Child Custody',
      type: 'checkbox',
      required: false,
    },
    {
      id: 'assets',
      label: 'Assets',
      type: 'textarea',
      required: true,
    },
    {
      id: 'desiredAssets',
      label: 'Desired Assets',
      type: 'textarea',
      required: true,
    },
    {
      id: 'spouse1WorkInfo',
      label: 'Spouse 1 Work Information',
      type: 'textarea',
      required: false,
    },
    {
      id: 'spouse2WorkInfo',
      label: 'Spouse 2 Work Information',
      type: 'textarea',
      required: false,
    },
  ],
};

export default template;