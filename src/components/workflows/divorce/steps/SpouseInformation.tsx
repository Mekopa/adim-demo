import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DivorceFormData } from '../types';

export default function SpouseInformation() {
  const { register, watch, formState: { errors } } = useFormContext<DivorceFormData>();
  const spouse1Name = watch('spouse1Name');
  const spouse2Name = watch('spouse2Name');

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-text">Spouse Information</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="spouse1Name" className="block text-sm font-medium text-text-secondary">
            Spouse 1 Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="spouse1Name"
            {...register('spouse1Name')}
            className="mt-1 block w-full rounded-lg border-input-border bg-input p-2 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.spouse1Name && (
            <p className="mt-1 text-sm text-error">{errors.spouse1Name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="spouse2Name" className="block text-sm font-medium text-text-secondary">
            Spouse 2 Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="spouse2Name"
            {...register('spouse2Name')}
            className="mt-1 block w-full rounded-lg border-input-border bg-input p-2 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.spouse2Name && (
            <p className="mt-1 text-sm text-error">{errors.spouse2Name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Client <span className="text-error">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="spouse1"
                {...register('clientName')}
                className="text-primary focus:ring-primary"
              />
              <span className="text-text">{spouse1Name || 'Spouse 1'}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="spouse2"
                {...register('clientName')}
                className="text-primary focus:ring-primary"
              />
              <span className="text-text">{spouse2Name || 'Spouse 2'}</span>
            </label>
          </div>
          {errors.clientName && (
            <p className="mt-1 text-sm text-error">{errors.clientName.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}