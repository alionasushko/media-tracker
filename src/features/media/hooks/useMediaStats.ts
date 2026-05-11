import { useAllUserMedia } from '@/features/media/queries';
import type { Status, UserMedia } from '@/features/media/types';
import type { MediaType } from '@/shared/theme/tokens';

export interface MediaStats {
  total: number;
  byStatus: Record<Status, number>;
  byType: Record<MediaType, number>;
  ratings: number[];
  topTags: { tag: string; count: number }[];
  monthly: number[];
  monthLabels: string[];
  streak: number;
  heatmap: number[];
  heatmapStart: Date;
  heatmapEnd: Date;
  loaded: boolean;
}

const monthLabels = () => [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const blankStats = (): MediaStats => ({
  total: 0,
  byStatus: { plan: 0, progress: 0, done: 0, dropped: 0 },
  byType: { movie: 0, book: 0, series: 0, game: 0 },
  ratings: [0, 0, 0, 0, 0],
  topTags: [],
  monthly: Array.from({ length: 12 }, () => 0),
  monthLabels: monthLabels(),
  streak: 0,
  heatmap: Array.from({ length: 84 }, () => 0),
  heatmapStart: new Date(),
  heatmapEnd: new Date(),
  loaded: false,
});

const dayKey = (timestamp: number) => {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const computeStreak = (items: UserMedia[]) => {
  if (items.length === 0) return 0;
  const days = new Set<string>();
  items.forEach((m) => days.add(dayKey(m.updatedAt)));

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    if (days.has(`${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`)) {
      streak++;
    } else if (i > 0) {
      break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const useMediaStats = (ownerId: string): MediaStats => {
  const { data, isLoading } = useAllUserMedia(ownerId);
  const items = data ?? [];

  if (isLoading || items.length === 0) {
    return { ...blankStats(), loaded: !isLoading };
  }

  const stats = blankStats();
  stats.loaded = true;
  stats.total = items.length;

  const tagCounts = new Map<string, number>();
  const now = new Date();
  const year = now.getFullYear();

  // Heatmap: 12 weeks × 7 days = 84 cells, ending on today.
  const heatmapEnd = new Date();
  heatmapEnd.setHours(0, 0, 0, 0);
  const heatmapStart = new Date(heatmapEnd);
  heatmapStart.setDate(heatmapEnd.getDate() - 83);
  stats.heatmapStart = heatmapStart;
  stats.heatmapEnd = heatmapEnd;
  const heatmapCounts = new Map<number, number>();

  items.forEach((m) => {
    if (m.status) stats.byStatus[m.status]++;
    if (m.type) stats.byType[m.type]++;
    const r = m.rating ?? 0;
    if (r >= 1 && r <= 5) stats.ratings[r - 1]++;
    if (m.tags) {
      m.tags.forEach((t) => tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1));
    }
    const d = new Date(m.updatedAt);
    if (d.getFullYear() === year) {
      stats.monthly[d.getMonth()]++;
    }
    const dayMid = new Date(d);
    dayMid.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (dayMid.getTime() - heatmapStart.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (diffDays >= 0 && diffDays < 84) {
      heatmapCounts.set(diffDays, (heatmapCounts.get(diffDays) ?? 0) + 1);
    }
  });

  stats.streak = computeStreak(items);

  stats.topTags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  for (let i = 0; i < 84; i++) {
    const c = heatmapCounts.get(i) ?? 0;
    stats.heatmap[i] = c === 0 ? 0 : c < 2 ? 1 : c < 4 ? 2 : c < 6 ? 3 : 4;
  }

  return stats;
};
