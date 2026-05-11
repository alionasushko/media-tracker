import type { MaterialCommunityIcons } from '@expo/vector-icons';

export const STATUS = {
  PLAN: 'plan',
  PROGRESS: 'progress',
  DONE: 'done',
  DROPPED: 'dropped',
} as const;

export const MEDIA_TYPE = {
  MOVIE: 'movie',
  BOOK: 'book',
  SERIES: 'series',
  GAME: 'game',
} as const;

export const statuses = [
  STATUS.PLAN,
  STATUS.PROGRESS,
  STATUS.DONE,
  STATUS.DROPPED,
] as const;

export const mediaTypes = [
  MEDIA_TYPE.MOVIE,
  MEDIA_TYPE.BOOK,
  MEDIA_TYPE.SERIES,
  MEDIA_TYPE.GAME,
] as const;

type Status = (typeof statuses)[number];
type MediaType = (typeof mediaTypes)[number];
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export const statusLabels: Record<Status, string> = {
  [STATUS.PLAN]: 'Plan',
  [STATUS.PROGRESS]: 'In progress',
  [STATUS.DONE]: 'Done',
  [STATUS.DROPPED]: 'Dropped',
};

export const statusActionLabels: Record<Status, string> = {
  [STATUS.PLAN]: 'Plan to consume',
  [STATUS.PROGRESS]: 'In progress',
  [STATUS.DONE]: 'Mark as done',
  [STATUS.DROPPED]: 'Dropped',
};

export const mediaTypeLabels: Record<MediaType, string> = {
  [MEDIA_TYPE.MOVIE]: 'Movie',
  [MEDIA_TYPE.BOOK]: 'Book',
  [MEDIA_TYPE.SERIES]: 'Series',
  [MEDIA_TYPE.GAME]: 'Game',
};

export const mediaTypePluralLabels: Record<MediaType, string> = {
  [MEDIA_TYPE.MOVIE]: 'Movies',
  [MEDIA_TYPE.BOOK]: 'Books',
  [MEDIA_TYPE.SERIES]: 'Series',
  [MEDIA_TYPE.GAME]: 'Games',
};

export const mediaTypeIconNames: Record<MediaType, IconName> = {
  [MEDIA_TYPE.MOVIE]: 'movie-open-outline',
  [MEDIA_TYPE.BOOK]: 'book-open-page-variant',
  [MEDIA_TYPE.SERIES]: 'television-classic',
  [MEDIA_TYPE.GAME]: 'controller-classic-outline',
};

const toOptions = <V extends string>(
  values: readonly V[],
  labels: Record<V, string>,
): { value: V; label: string }[] => values.map((value) => ({ value, label: labels[value] }));

export const statusOptions = toOptions(statuses, statusLabels);
export const mediaTypeOptions = toOptions(mediaTypes, mediaTypeLabels);
export const mediaTypePluralOptions = toOptions(mediaTypes, mediaTypePluralLabels);
