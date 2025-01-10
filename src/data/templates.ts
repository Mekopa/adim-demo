import { DocumentTemplate } from '../types';

export const templates: DocumentTemplate[] = [
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement',
    description: 'Create a customized NDA for protecting confidential information',
    icon: 'FileKey',
    questions: [
      {
        id: 'partyA',
        label: 'First Party Name',
        type: 'text',
        required: true
      },
      {
        id: 'partyB',
        label: 'Second Party Name',
        type: 'text',
        required: true
      },
      {
        id: 'purpose',
        label: 'Purpose of Disclosure',
        type: 'textarea',
        required: true
      },
      {
        id: 'duration',
        label: 'Agreement Duration',
        type: 'select',
        options: ['1 year', '2 years', '3 years', '5 years'],
        required: true
      }
    ]
  },
  {
    id: 'contract',
    title: 'Service Agreement',
    description: 'Generate a professional service agreement contract',
    icon: 'FileText',
    questions: [
      {
        id: 'provider',
        label: 'Service Provider',
        type: 'text',
        required: true
      },
      {
        id: 'client',
        label: 'Client Name',
        type: 'text',
        required: true
      },
      {
        id: 'services',
        label: 'Services Description',
        type: 'textarea',
        required: true
      },
      {
        id: 'startDate',
        label: 'Start Date',
        type: 'date',
        required: true
      }
    ]
  },
  {
    id: 'power-of-attorney',
    title: 'Power of Attorney',
    description: 'Create a power of attorney document',
    icon: 'Shield',
    questions: [
      {
        id: 'grantor',
        label: 'Grantor Name',
        type: 'text',
        required: true
      },
      {
        id: 'attorney',
        label: 'Attorney-in-Fact Name',
        type: 'text',
        required: true
      },
      {
        id: 'powers',
        label: 'Powers Granted',
        type: 'textarea',
        required: true
      }
    ]
  }
];