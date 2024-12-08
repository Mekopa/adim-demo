import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
});

interface CreateSubCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  isLoading: boolean;
}

export default function CreateSubCollectionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateSubCollectionModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ name: string }>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text">New Sub-collection</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-background rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit(({ name }) => onSubmit(name))} className="p-6">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
              Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full rounded-lg border-input-border bg-input p-2 text-text focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-text-secondary hover:bg-background rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}