import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const accountSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  email: z.string().email('Invalid email address'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AccountSettingsProps {
  isSaving: boolean;
  onSave: (data: AccountFormData) => Promise<void>;
}

export default function AccountSettings({ isSaving, onSave }: AccountSettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Change Password</h3>
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-text-secondary">
            Current Password
          </label>
          <input
            {...register('currentPassword')}
            type="password"
            id="currentPassword"
            className="mt-1 block w-full rounded-md bg-input border-input-border focus:border-input-focus focus:ring-input-focus"
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-error">{errors.currentPassword.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-text-secondary">
            New Password
          </label>
          <input
            {...register('newPassword')}
            type="password"
            id="newPassword"
            className="mt-1 block w-full rounded-md bg-input border-input-border focus:border-input-focus focus:ring-input-focus"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-error">{errors.newPassword.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary">
            Confirm New Password
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full rounded-md bg-input border-input-border focus:border-input-focus focus:ring-input-focus"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Settings</h3>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md bg-input border-input-border focus:border-input-focus focus:ring-input-focus"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}