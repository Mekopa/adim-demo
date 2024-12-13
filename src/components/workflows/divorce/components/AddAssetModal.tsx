import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const assetDetailsSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  desiredOwner: z.enum(['spouse1', 'spouse2'], {
    required_error: 'Please select desired owner',
  }),
  reason: z.string().optional(),
});

type AssetDetailsForm = z.infer<typeof assetDetailsSchema>;

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AssetDetailsForm) => void;
  spouse1Name?: string;
  spouse2Name?: string;
}

export default function AddAssetModal({
  isOpen,
  onClose,
  onAdd,
  spouse1Name = 'Spouse 1',
  spouse2Name = 'Spouse 2',
}: AddAssetModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AssetDetailsForm>({
    resolver: zodResolver(assetDetailsSchema),
  });

  const showReason = watch('desiredOwner');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text">Add Asset</h2>
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
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
              Asset Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className="w-full rounded-lg border-input-border bg-input p-2 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., House, Car, Bank Account"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Desired Owner
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="spouse1"
                  {...register('desiredOwner')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-text">{spouse1Name}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="spouse2"
                  {...register('desiredOwner')}
                  className="text-primary focus:ring-primary"
                />
                <span className="text-text">{spouse2Name}</span>
              </label>
            </div>
            {errors.desiredOwner && (
              <p className="mt-1 text-sm text-error">{errors.desiredOwner.message}</p>
            )}
          </div>

          {showReason && (
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-text-secondary mb-1">
                Reason (Optional)
              </label>
              <textarea
                id="reason"
                {...register('reason')}
                rows={3}
                className="w-full rounded-lg border-input-border bg-input p-2 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Explain why this spouse should receive this asset..."
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
              onClick={handleSubmit(onAdd)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Add Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}