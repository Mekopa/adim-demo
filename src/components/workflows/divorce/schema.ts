import { z } from 'zod';

export const childSchema = z.object({
  age: z.number().min(0, 'Age must be positive').max(18, 'Age must be under 18'),
  custodialParent: z.enum(['spouse1', 'spouse2']),
  custodyReason: z.string().optional(),
});

export const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  desiredOwner: z.enum(['spouse1', 'spouse2'], {
    required_error: 'Please select desired owner',
  }),
  reason: z.string().optional(),
});

export const divorceFormSchema = z.object({
  spouse1Name: z.string().min(1, 'Spouse 1 name is required'),
  spouse2Name: z.string().min(1, 'Spouse 2 name is required'),
  clientName: z.enum(['spouse1', 'spouse2'], {
    required_error: 'Please select which spouse is the client',
  }),
  hasChildren: z.boolean().default(false),
  wantsChildren: z.boolean().default(false),
  children: z.array(childSchema).default([]),
  assets: z.array(assetSchema).default([]),
  spouse1WorkInfo: z.string().optional(),
  spouse2WorkInfo: z.string().optional(),
});