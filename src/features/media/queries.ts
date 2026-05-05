import type { MediaFilters, Status, UserMedia } from '@/features/media/types';
import { db } from '@/shared/services/firebase';
import { deleteCoverByUrl } from '@/shared/services/storage';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';

// ---------- Query key factory ----------

export const mediaKeys = {
  all: ['userMedia'] as const,
  forOwner: (ownerId: string) => [...mediaKeys.all, ownerId] as const,
  lists: (ownerId: string) => [...mediaKeys.forOwner(ownerId), 'list'] as const,
  list: (ownerId: string, filters: MediaFilters) =>
    [...mediaKeys.lists(ownerId), filters] as const,
  byOwner: (ownerId: string) => [...mediaKeys.forOwner(ownerId), 'byOwner'] as const,
  entry: (id: string) => [...mediaKeys.all, 'entry', id] as const,
};

// ---------- Firestore access ----------

const COL = 'media';
export const PAGE_SIZE = 20;

type DocSnapshot = QueryDocumentSnapshot;

type QueryConstraint =
  | ReturnType<typeof where>
  | ReturnType<typeof orderBy>
  | ReturnType<typeof startAfter>
  | ReturnType<typeof limit>;

export type MediaPage = {
  media: UserMedia[];
  cursor: DocSnapshot | null;
};

const createUserMedia = async (
  input: Partial<UserMedia> & {
    ownerId: string;
    title: string;
    notes: string;
    type: UserMedia['type'];
    status: Status;
  },
) => {
  const now = Date.now();
  const docRef = await addDoc(collection(db, COL), {
    ownerId: input.ownerId,
    title: input.title,
    titleLower: input.title.toLowerCase(),
    notes: input.notes,
    type: input.type,
    status: input.status,
    rating: 0,
    createdAt: now,
    updatedAt: now,
  });
  const snap = await getDoc(docRef);
  return { id: snap.id, ...(snap.data() as Omit<UserMedia, 'id'>) } as UserMedia;
};

const updateUserMedia = async (id: string, patch: Partial<UserMedia>) => {
  const ref = doc(db, COL, id);
  const extra = patch.title !== undefined ? { titleLower: patch.title.toLowerCase() } : {};
  await updateDoc(ref, { ...patch, ...extra, updatedAt: Date.now() });
};

const deleteUserMedia = async ({ id, coverUrl }: { id: string; coverUrl?: string | null }) => {
  if (coverUrl) {
    try {
      await deleteCoverByUrl(coverUrl);
    } catch (e) {
      console.warn('[deleteUserMedia] failed to delete cover:', e);
    }
  }
  await deleteDoc(doc(db, COL, id));
};

const getUserMedia = async (id: string) => {
  const snap = await getDoc(doc(db, COL, id));
  return { id: snap.id, ...(snap.data() as Omit<UserMedia, 'id'>) } as UserMedia;
};

const listUserMedia = async (
  ownerId: string,
  filters: MediaFilters,
  pageSize: number = PAGE_SIZE,
  cursor: DocSnapshot | null = null,
): Promise<MediaPage> => {
  const constraints: QueryConstraint[] = [where('ownerId', '==', ownerId)];

  if (filters.status && filters.status !== 'all') {
    constraints.push(where('status', '==', filters.status));
  }

  if (filters.type && filters.type !== 'all') {
    constraints.push(where('type', '==', filters.type));
  }

  if (filters.q) {
    const qLower = filters.q.toLowerCase();
    constraints.push(where('titleLower', '>=', qLower));
    constraints.push(where('titleLower', '<=', qLower + ''));
    constraints.push(orderBy('titleLower', 'asc'));
  } else {
    const sortKey = filters.sort?.key ?? 'updatedAt';
    const sortOrder = filters.sort?.order ?? 'desc';
    constraints.push(orderBy(sortKey, sortOrder));
  }

  if (cursor) constraints.push(startAfter(cursor));
  constraints.push(limit(pageSize));

  const q = query(collection(db, COL), ...constraints);
  const snap = await getDocs(q);

  const media = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UserMedia);
  const nextCursor = snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null;

  return { media, cursor: nextCursor };
};

const listAllUserMedia = async (ownerId: string): Promise<UserMedia[]> => {
  if (!ownerId) return [];
  const q = query(
    collection(db, COL),
    where('ownerId', '==', ownerId),
    orderBy('updatedAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UserMedia);
};

// ---------- React Query hooks ----------

export const useCreateMedia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUserMedia,
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: mediaKeys.forOwner(variables.ownerId) });
    },
  });
};

export const useUpdateMedia = (ownerId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<UserMedia> }) =>
      updateUserMedia(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: mediaKeys.forOwner(ownerId) });
      await qc.cancelQueries({ queryKey: mediaKeys.entry(id) });

      const prevLists = qc.getQueriesData<InfiniteData<MediaPage>>({
        queryKey: mediaKeys.lists(ownerId),
      });
      const prevEntry = qc.getQueryData<UserMedia>(mediaKeys.entry(id));
      const prevByOwner = qc.getQueryData<UserMedia[]>(mediaKeys.byOwner(ownerId));

      if (prevEntry) qc.setQueryData(mediaKeys.entry(id), { ...prevEntry, ...patch });

      prevLists.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<InfiniteData<MediaPage>>(key, {
          ...data,
          pages: data.pages.map((p) => ({
            ...p,
            media: p.media.map((m) => (m.id === id ? { ...m, ...patch } : m)),
          })),
        });
      });

      if (prevByOwner) {
        qc.setQueryData<UserMedia[]>(
          mediaKeys.byOwner(ownerId),
          prevByOwner.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        );
      }

      return { prevLists, prevEntry, prevByOwner };
    },
    onError: (_err, vars, ctx) => {
      ctx?.prevLists?.forEach(([key, data]) =>
        qc.setQueryData<InfiniteData<MediaPage>>(key, data ?? undefined),
      );
      if (ctx?.prevEntry) qc.setQueryData(mediaKeys.entry(vars.id), ctx.prevEntry);
      if (ctx?.prevByOwner) qc.setQueryData(mediaKeys.byOwner(ownerId), ctx.prevByOwner);
    },
    onSettled: (_res, _err, vars) => {
      qc.invalidateQueries({ queryKey: mediaKeys.entry(vars.id) });
      qc.invalidateQueries({ queryKey: mediaKeys.forOwner(ownerId) });
    },
  });
};

export const useDeleteMedia = (ownerId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUserMedia,
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: mediaKeys.forOwner(ownerId) });
      await qc.cancelQueries({ queryKey: mediaKeys.entry(id) });

      const prevLists = qc.getQueriesData<InfiniteData<MediaPage>>({
        queryKey: mediaKeys.lists(ownerId),
      });
      const prevByOwner = qc.getQueryData<UserMedia[]>(mediaKeys.byOwner(ownerId));

      prevLists.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<InfiniteData<MediaPage>>(key, {
          ...data,
          pages: data.pages.map((p) => ({
            ...p,
            media: p.media.filter((m) => m.id !== id),
          })),
        });
      });

      if (prevByOwner) {
        qc.setQueryData<UserMedia[]>(
          mediaKeys.byOwner(ownerId),
          prevByOwner.filter((m) => m.id !== id),
        );
      }

      return { prevLists, prevByOwner };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.prevLists?.forEach(([key, data]) =>
        qc.setQueryData<InfiniteData<MediaPage>>(key, data ?? undefined),
      );
      if (ctx?.prevByOwner) qc.setQueryData(mediaKeys.byOwner(ownerId), ctx.prevByOwner);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: mediaKeys.forOwner(ownerId) });
    },
  });
};

export const useUserMediaEntry = (id: string) =>
  useQuery({
    queryKey: mediaKeys.entry(id),
    queryFn: () => getUserMedia(id),
    enabled: !!id,
  });

export const useUserMedia = (ownerId: string, filters: MediaFilters) =>
  useInfiniteQuery({
    queryKey: mediaKeys.list(ownerId, filters),
    queryFn: ({ pageParam }) => listUserMedia(ownerId, filters, undefined, pageParam),
    initialPageParam: null as MediaPage['cursor'],
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    enabled: !!ownerId,
  });

export const useAllUserMedia = (ownerId: string) =>
  useQuery({
    queryKey: mediaKeys.byOwner(ownerId),
    queryFn: () => listAllUserMedia(ownerId),
    enabled: !!ownerId,
  });
