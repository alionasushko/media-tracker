import { z } from 'zod';
import { statuses } from './library';

export const AddItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must be at most 100 characters'),
  notes: z.string().trim().max(500, 'Notes must be at most 500 characters'),
  type: z.enum(['movie', 'book', 'series', 'game']),
  status: z.enum(statuses),
});

export const typeButtons = [
  { value: 'movie', label: 'Movie', icon: 'movie-open-outline' },
  { value: 'book', label: 'Book', icon: 'book-open-page-variant' },
  { value: 'series', label: 'Series', icon: 'television-classic' },
  { value: 'game', label: 'Game', icon: 'controller-classic-outline' },
];

export const statusButtons = [
  { value: 'plan', label: 'Plan', icon: 'calendar-plus' },
  { value: 'progress', label: 'In Progress', icon: 'progress-clock' },
  { value: 'done', label: 'Done', icon: 'check-circle-outline' },
  { value: 'dropped', label: 'Dropped', icon: 'close-circle-outline' },
];
