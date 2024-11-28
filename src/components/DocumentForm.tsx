import React from 'react';
import { X } from 'lucide-react';
import { DocumentTemplate, DocumentFormData } from '../types';

interface DocumentFormProps {
  template: DocumentTemplate;
  onSubmit: (data: DocumentFormData) => void;
  onClose: () => void;
}

export default function DocumentForm({ template, onSubmit, onClose }: DocumentFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: DocumentFormData = {};
    template.questions.forEach(q => {
      data[q.id] = formData.get(q.id) as string;
    });
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{template.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {template.questions.map((question) => (
            <div key={question.id}>
              <label
                htmlFor={question.id}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {question.label}
                {question.required && <span className="text-red-500">*</span>}
              </label>
              
              {question.type === 'textarea' ? (
                <textarea
                  id={question.id}
                  name={question.id}
                  required={question.required}
                  className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              ) : question.type === 'select' ? (
                <select
                  id={question.id}
                  name={question.id}
                  required={question.required}
                  className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an option</option>
                  {question.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={question.type}
                  id={question.id}
                  name={question.id}
                  required={question.required}
                  className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Generate Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}