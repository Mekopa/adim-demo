import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Check } from 'lucide-react';
import { Collection, CreateGroupInput } from '../../types/vault';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  collectionIds: z.array(z.string()).min(1, 'Select at least one collection'),
});

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGroupInput & { collectionIds: string[] }) => Promise<void>;
  isLoading: boolean;
  collections: Collection[];
}

export default function CreateGroupModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  collections,
}: CreateGroupModalProps) {
  const ungroupedCollections = collections.filter(c => !c.groups || c.groups.length === 0);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      collectionIds: [],
    },
  });

  const selectedCollections = watch('collectionIds');

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text">New Group</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-background rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
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

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Select Collections
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {ungroupedCollections.length === 0 ? (
                <p className="text-sm text-text-secondary">No collections available</p>
              ) : (
                ungroupedCollections.map((collection) => (
                  <label
                    key={collection.id}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={collection.id}
                      {...register('collectionIds')}
                      className="rounded border-input-border text-primary focus:ring-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-text truncate">{collection.name}</div>
                      {collection.description && (
                        <div className="text-sm text-text-secondary truncate">
                          {collection.description}
                        </div>
                      )}
                    </div>
                    {selectedCollections.includes(collection.id) && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </label>
                ))
              )}
            </div>
            {errors.collectionIds && (
              <p className="mt-1 text-sm text-error">{errors.collectionIds.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-text-secondary hover:bg-background rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || ungroupedCollections.length === 0}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}