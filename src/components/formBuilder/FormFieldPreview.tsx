import React from 'react';
import { FormField } from '../../types/formBuilder';

interface FormFieldPreviewProps {
  field: FormField;
}

export default function FormFieldPreview({ field }: FormFieldPreviewProps) {
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={field.placeholder}
          />
        );
      case 'textarea':
        return (
          <textarea
            className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder={field.placeholder}
          />
        );
      case 'select':
        return (
          <select className="mt-1 block w-full rounded-md border-border shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return <div className='text-secondary'>Unsupported field type</div>;
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-12 bg-blue-500 rounded" />
      </div>
      <div className="p-4 border border-secondary rounded-lg hover:border-blue-500 transition-colors">
        <label className="block text-sm font-medium text-text mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {renderField()}
      </div>
    </div>
  );
}