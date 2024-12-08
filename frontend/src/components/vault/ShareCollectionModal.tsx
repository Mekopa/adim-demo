import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Users, Lock, Globe } from 'lucide-react';
import { Collection } from '../../types/vault';

const schema = z.object({
  shareType: z.enum(['private', 'public', 'team']),
  includeSubFiles: z.boolean(),
});

type ShareFormData = z.infer<typeof schema>;

interface ShareCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
  onShare: (data: ShareFormData) => Promise<void>;
  isLoading: boolean;
}

export default function ShareCollectionModal({
  isOpen,
  onClose,
  collection,
  onShare,
  isLoading,
}: ShareCollectionModalProps) {
  // Mock user having a team - in production, this would come from user context/API
  const hasTeam = true; // Toggle this to test visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShareFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      shareType: 'private',
      includeSubFiles: true,
    },
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
          <h2 className="text-xl font-semibold text-text">Share Collection</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-background rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onShare)} className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-text-secondary">
              Visibility
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  value="private"
                  {...register('shareType')}
                  className="text-primary focus:ring-primary"
                />
                <Lock className="w-5 h-5 text-text-secondary" />
                <div>
                  <div className="font-medium text-text">Private</div>
                  <div className="text-sm text-text-secondary">Only you can access</div>
                </div>
              </label>

              {/* Only show team option if user has a team */}
              {hasTeam && (
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    value="team"
                    {...register('shareType')}
                    className="text-primary focus:ring-primary"
                  />
                  <Users className="w-5 h-5 text-text-secondary" />
                  <div>
                    <div className="font-medium text-text">With your team</div>
                    <div className="text-sm text-text-secondary">Share with all team members</div>
                  </div>
                </label>
              )}

              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="radio"
                  value="public"
                  {...register('shareType')}
                  className="text-primary focus:ring-primary"
                />
                <Globe className="w-5 h-5 text-text-secondary" />
                <div>
                  <div className="font-medium text-text">Public</div>
                  <div className="text-sm text-text-secondary">Anyone can access</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeSubFiles"
              {...register('includeSubFiles')}
              className="rounded border-input-border text-primary focus:ring-primary"
            />
            <label htmlFor="includeSubFiles" className="text-sm text-text">
              Include all files in sub-collections
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
              {isLoading ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}