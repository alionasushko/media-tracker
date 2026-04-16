export const statuses = ['plan', 'progress', 'done', 'dropped'] as const;

export const mediaTypes = ['movie', 'book', 'series', 'game'] as const;

const statusLabels: Record<(typeof statuses)[number], string> = {
  plan: 'Plan',
  progress: 'In Progress',
  done: 'Done',
  dropped: 'Dropped',
};

const statusIcons: Record<(typeof statuses)[number], string> = {
  plan: 'calendar-plus',
  progress: 'progress-clock',
  done: 'check-circle-outline',
  dropped: 'close-circle-outline',
};

const mediaTypeLabels: Record<(typeof mediaTypes)[number], string> = {
  movie: 'Movie',
  book: 'Book',
  series: 'Series',
  game: 'Game',
};

const mediaTypeIcons: Record<(typeof mediaTypes)[number], string> = {
  movie: 'movie-open-outline',
  book: 'book-open-page-variant',
  series: 'television-classic',
  game: 'controller-classic-outline',
};

export const statusButtons = statuses.map((value) => ({
  value,
  label: statusLabels[value],
  icon: statusIcons[value],
}));

export const typeButtons = mediaTypes.map((value) => ({
  value,
  label: mediaTypeLabels[value],
  icon: mediaTypeIcons[value],
}));

export const statusFilters = [
  { value: 'all', label: 'All' },
  ...statuses.map((value) => ({ value, label: statusLabels[value] })),
] as const;

export const typeFilters = [
  { value: 'all', label: 'All' },
  ...mediaTypes.map((value) => ({ value, label: mediaTypeLabels[value] })),
] as const;
