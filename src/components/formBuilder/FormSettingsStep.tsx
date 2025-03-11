import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormType, FormConfig } from '../../types/formBuilder';

const formSettingsSchema = z.object({
  name: z.string().min(1, 'Form name is required'),
  description: z.string().optional(),
});

interface FormSettingsStepProps {
  type: FormType;
  onSubmit: (config: FormConfig) => void;
}

export default function FormSettingsStep({ type, onSubmit }: FormSettingsStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSettingsSchema),
  });

  const handleFormSubmit = (data: any) => {
    const config: FormConfig = {
      id: Date.now().toString(),
      type,
      ...data,
      steps: type === 'multi-step' ? [] : undefined,
      fields: type === 'single-view' ? [] : undefined,
    };
    onSubmit(config);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">Form Settings</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Form Name
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter form name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="Enter form description"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Builder
          </button>
        </div>
      </form>
    </div>
  );
}