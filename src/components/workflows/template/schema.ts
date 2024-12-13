import { z } from 'zod';

export const templateFormSchema = z.object({
  field1: z.string().min(1, 'Field 1 is required'),
  field2: z.string().min(1, 'Field 2 is required'),
});