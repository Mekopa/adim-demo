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
      title: 'Sutuoktiniių informacija',
      fields: [
        { id: 'spouse1Name', label: 'Sutuoktinis 1', value: formData.spouse1Name },
        { id: 'spouse2Name', label: 'Sutuoktinis 2', value: formData.spouse2Name },
        { 
          id: 'clientName',
          label: 'Kliento vardas', 
          value: formData.clientName === 'spouse1' ? formData.spouse1Name : formData.spouse2Name 
        },
      ],
    },
    {
      id: 'children',
      title: 'Informacija apie vaikus',
      fields: [
        { id: 'hasChildren', label: 'Ar turi vaikų?', value: formData.hasChildren ? 'TAIP' : 'NE' },
        {
          id: 'childrenDetails',
          label: 'Children',
          value: formData.hasChildren && formData.children?.length > 0
            ? formData.children.map((child, index) => (
                `Child ${index + 1}: ${child.age} years old, Custody: ${
                  child.custodialParent === 'spouse1' ? formData.spouse1Name : formData.spouse2Name
                }${child.custodyReason ? ` - Reason: ${child.custodyReason}` : ''}`
              )).join('\n')
            : 'Neturi vaikų',
        },
      ],
    },
    {
      id: 'assets',
      title: 'Turto ir skolų informacija',
      fields: [
        { 
          id: 'assetsList',
          label: 'Turtas/skolos', 
          value: formatAssets(formData.assets)
        },
      ],
    },
    {
      id: 'work',
      title: 'Darbo informacija',
      fields: [
        { 
          id: 'spouse1Work',
          label: `${formData.spouse1Name || 'Spouse 1'}'s Darbo informacija`, 
          value: formData.spouse1WorkInfo || 'nepateikta'
        },
        { 
          id: 'spouse2Work',
          label: `${formData.spouse2Name || 'Spouse 2'}'s Darbo informacija`, 
          value: formData.spouse2WorkInfo || 'nepateikta'
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-text">Informacijos peržvalga</h2>
      
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