import { z } from 'zod';
import { mediaTypes, statuses } from './constants';

export const AddMediaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
  notes: z.string().trim().max(500, 'Notes must be at most 500 characters'),
  type: z.enum(mediaTypes),
  status: z.enum(statuses),
});
