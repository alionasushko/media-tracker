export type MediaType = 'movie' | 'book' | 'series' | 'game';
export type Status = 'plan' | 'progress' | 'done' | 'dropped';

export interface UserItem {
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

export type StatusFilter = 'all' | 'plan' | 'progress' | 'done' | 'dropped';
export type TypeFilter = 'all' | 'movie' | 'book' | 'series' | 'game';

export interface MediaFilters {
  q: string;
  status: StatusFilter;
  type: TypeFilter;
  sort: { key: SortKey; order: 'asc' | 'desc' };
}
