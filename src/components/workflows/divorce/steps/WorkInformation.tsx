import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DivorceFormData } from '../types';

export default function WorkInformation() {
  const { register, formState: { errors } } = useFormContext<DivorceFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Work Information</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="spouse1WorkInfo" className="block text-sm font-medium text-gray-700">
            Spouse 1 Work Information
          </label>
          <textarea
            id="spouse1WorkInfo"
            {...register('spouse1WorkInfo')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Employment details, income, etc..."
          />
          {errors.spouse1WorkInfo && (
            <p className="mt-1 text-sm text-red-600">{errors.spouse1WorkInfo.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="spouse2WorkInfo" className="block text-sm font-medium text-gray-700">
            Spouse 2 Work Information
          </label>
          <textarea
            id="spouse2WorkInfo"
            {...register('spouse2WorkInfo')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Employment details, income, etc..."
          />
          {errors.spouse2WorkInfo && (
            <p className="mt-1 text-sm text-red-600">{errors.spouse2WorkInfo.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}