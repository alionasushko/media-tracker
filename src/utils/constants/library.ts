export const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'plan', label: 'Plan' },
  { value: 'progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'dropped', label: 'Dropped' },
] as const;

export const typeFilters = [
  { value: 'all', label: 'All' },
  { value: 'movie', label: 'Movie' },
  { value: 'book', label: 'Book' },
  { value: 'series', label: 'Series' },
  { value: 'game', label: 'Game' },
] as const;

export const statuses = ['plan', 'progress', 'done', 'dropped'] as const;
