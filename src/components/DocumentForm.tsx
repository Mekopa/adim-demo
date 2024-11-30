// src/components/DocumentForm.tsx

import React, { useState } from 'react';
import { Question, DocumentFormData } from '../types/workflow';

interface DocumentFormProps {
  template: {
    title: string;
    description: string;
    icon: string;
    questions: Question[];
  };
  onSubmit: (data: DocumentFormData) => void;
  onClose: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ template, onSubmit, onClose }) => {
  const initializeFormData = () => {
    const data: DocumentFormData = {};
    template.questions.forEach((question) => {
      if (question.type === 'checkbox') {
        data[question.id] = false;
      } else if (question.type === 'dynamic') {
        data[question.id] = [];
      } else if (question.type === 'number') {
        data[question.id] = 0;
      } else {
        data[question.id] = '';
      }
    });
    return data;
  };

  const [formData, setFormData] = useState<DocumentFormData>(initializeFormData());

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle dynamic fields (e.g., children)
  const handleDynamicChange = (
    fieldId: string,
    index: number,
    value: DocumentFormData
  ) => {
    const updatedItems = [...(formData[fieldId] as DocumentFormData[])];
    updatedItems[index] = { ...updatedItems[index], ...value };
    setFormData((prev) => ({ ...prev, [fieldId]: updatedItems }));
  };

  const addDynamicItem = (fieldId: string, fields: Question[]) => {
    const newItem: DocumentFormData = {};
    fields.forEach((field) => {
      newItem[field.id] = field.type === 'number' ? 0 : '';
    });
    setFormData((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] as DocumentFormData[]), newItem],
    }));
  };

  const removeDynamicItem = (fieldId: string, index: number) => {
    const updatedItems = (formData[fieldId] as DocumentFormData[]).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [fieldId]: updatedItems }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{template.title} Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {template.questions.map((question) => {
          switch (question.type) {
            case 'text':
            case 'textarea':
            case 'select':
            case 'checkbox':
            case 'number':
              return (
                <div key={question.id}>
                  <label className="block text-sm font-medium text-gray-700">
                    {question.label}
                    {question.required && <span className="text-red-500">*</span>}
                  </label>
                  {question.type === 'textarea' ? (
                    <textarea
                      name={question.id}
                      value={formData[question.id] as string}
                      onChange={handleChange}
                      required={question.required}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  ) : question.type === 'select' ? (
                    <select
                      name={question.id}
                      value={formData[question.id] as string}
                      onChange={handleChange}
                      required={question.required}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="">Select...</option>
                      {question.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : question.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      name={question.id}
                      checked={formData[question.id] as boolean}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <input
                      type={question.type === 'number' ? 'number' : 'text'}
                      name={question.id}
                      value={formData[question.id] as string | number}
                      onChange={handleChange}
                      required={question.required}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  )}
                </div>
              );
            case 'dynamic':
              return (
                <div key={question.id} className="ml-4">
                  <h3 className="text-md font-medium mb-2">{question.label}</h3>
                  {(formData[question.id] as DocumentFormData[]).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      {question.fields?.map((field) => (
                        <input
                          key={field.id}
                          type={field.type === 'number' ? 'number' : 'text'}
                          name={`${question.id}_${field.id}_${index}`}
                          placeholder={field.label}
                          value={item[field.id] as string | number}
                          onChange={(e) =>
                            handleDynamicChange(question.id, index, {
                              [field.id]:
                                field.type === 'number' ? parseFloat(e.target.value) : e.target.value,
                            })
                          }
                          required={field.required}
                          className="mt-1 block w-1/2 border border-gray-300 rounded-md p-2"
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => removeDynamicItem(question.id, index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDynamicItem(question.id, question.fields || [])}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    Add {question.label.slice(0, -1)}
                  </button>
                </div>
              );
            default:
              return null;
          }
        })}

        {/* Submit and Close Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Generate Document
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;