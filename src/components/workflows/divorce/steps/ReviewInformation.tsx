import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DivorceFormData } from '../types';

export default function ReviewInformation() {
  const { watch } = useFormContext<DivorceFormData>();
  const formData = watch();

  const formatAssets = (assets: DivorceFormData['assets']) => {
    if (!assets || assets.length === 0) return 'No assets listed';
    return assets.map((asset, index) => (
      `${index + 1}. ${asset.name} (Desired owner: ${
        asset.desiredOwner === 'spouse1' ? formData.spouse1Name : formData.spouse2Name
      })${asset.reason ? ` - Reason: ${asset.reason}` : ''}`
    )).join('\n');
  };

  const sections = [
    {
      id: 'spouse',
      title: 'Spouse Information',
      fields: [
        { id: 'spouse1Name', label: 'Spouse 1 Name', value: formData.spouse1Name },
        { id: 'spouse2Name', label: 'Spouse 2 Name', value: formData.spouse2Name },
        { 
          id: 'clientName',
          label: 'Client Name', 
          value: formData.clientName === 'spouse1' ? formData.spouse1Name : formData.spouse2Name 
        },
      ],
    },
    {
      id: 'children',
      title: 'Children Information',
      fields: [
        { id: 'hasChildren', label: 'Has Children', value: formData.hasChildren ? 'Yes' : 'No' },
        {
          id: 'childrenDetails',
          label: 'Children',
          value: formData.hasChildren && formData.children?.length > 0
            ? formData.children.map((child, index) => (
                `Child ${index + 1}: ${child.age} years old, Custody: ${
                  child.custodialParent === 'spouse1' ? formData.spouse1Name : formData.spouse2Name
                }${child.custodyReason ? ` - Reason: ${child.custodyReason}` : ''}`
              )).join('\n')
            : 'No children',
        },
      ],
    },
    {
      id: 'assets',
      title: 'Asset Information',
      fields: [
        { 
          id: 'assetsList',
          label: 'Assets', 
          value: formatAssets(formData.assets)
        },
      ],
    },
    {
      id: 'work',
      title: 'Work Information',
      fields: [
        { 
          id: 'spouse1Work',
          label: `${formData.spouse1Name || 'Spouse 1'}'s Work Information`, 
          value: formData.spouse1WorkInfo || 'Not provided'
        },
        { 
          id: 'spouse2Work',
          label: `${formData.spouse2Name || 'Spouse 2'}'s Work Information`, 
          value: formData.spouse2WorkInfo || 'Not provided'
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-text">Review Information</h2>
      
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.id} className="space-y-4">
            <h3 className="text-md font-medium text-text">{section.title}</h3>
            <div className="bg-background rounded-lg p-4 space-y-4">
              {section.fields.map((field) => (
                <div key={field.id}>
                  <dt className="text-sm font-medium text-text-secondary">{field.label}</dt>
                  <dd className="mt-1 text-sm text-text whitespace-pre-wrap">
                    {field.value || 'Not provided'}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}