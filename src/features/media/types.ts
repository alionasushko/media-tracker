import { mediaTypes, statuses } from './constants';

export type MediaType = (typeof mediaTypes)[number];
export type Status = (typeof statuses)[number];

export type StatusFilter = 'all' | Status;
export type TypeFilter = 'all' | MediaType;

export interface UserMedia {
  id: string;
  ownerId: string;
  mediaId?: string;
  type: MediaType;
  title: string;
  status: Status;
  rating?: number;
  notes?: string;
  tags?: string[];
  progress?: { current?: number; total?: number };
  coverUrl?: string | null;
  createdAt: number;
  updatedAt: number;
}

export type SortKey = 'updatedAt' | 'title' | 'rating';

export interface MediaFilters {
  q: string;
  status: StatusFilter;
  type: TypeFilter;
  sort: { key: SortKey; order: 'asc' | 'desc' };
}
