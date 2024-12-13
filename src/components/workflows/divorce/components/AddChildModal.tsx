import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const childDetailsSchema = z.object({
  age: z.number().min(0, 'Age must be positive').max(18, 'Age must be under 18'),
  custodialParent: z.enum(['spouse1', 'spouse2'], {
    required_error: 'Please select a custodial parent',
  }),
  custodyReason: z.string().optional(),
});

type ChildDetailsForm = z.infer<typeof childDetailsSchema>;

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: ChildDetailsForm) => void;
  spouse1Name?: string;
  spouse2Name?: string;
}

export default function AddChildModal({ 
  isOpen, 
  onClose, 
  onAdd,
  spouse1Name = 'Spouse 1',
  spouse2Name = 'Spouse 2',
}: AddChildModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChildDetailsForm>({
    resolver: zodResolver(childDetailsSchema),
    defaultValues: {
      age: 0,
      custodialParent: 'spouse1',
    },
  });

  const showCustodyReason = watch('custodialParent');

  if (!isOpen) return null;

  const handleFormSubmit = (data: ChildDetailsForm) => {
    onAdd(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text">Add Child</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-background rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-text-secondary mb-1">
              Child's Age
            </label>
            <input
              type="number"
              id="age"
              {...register('age', { valueAsNumber: true })}
              className="w-full rounded-lg border-input-border bg-input p-2 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.age && (
              <p className="mt-1 text-sm text-error">{errors.age.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Custodial Parent
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="spouse1"
                  {...register('custodialParent')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-text">{spouse1Name}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="spouse2"
                  {...register('custodialParent')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-text">{spouse2Name}</span>
              </label>
            </div>
            {errors.custodialParent && (
              <p className="mt-1 text-sm text-error">{errors.custodialParent.message}</p>
            )}
          </div>

          {showCustodyReason && (
            <div>
              <label htmlFor="custodyReason" className="block text-sm font-medium text-text-secondary mb-1">
                Reason for Custody (Optional)
              </label>
              <textarea
                id="custodyReason"
                {...register('custodyReason')}
                rows={3}
                className="w-full rounded-lg border-input-border bg-input p-2 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Explain why this parent should have custody..."
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:bg-background rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit(handleFormSubmit)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Add Child
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}