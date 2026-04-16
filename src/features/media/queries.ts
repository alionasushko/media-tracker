import type { MediaFilters, Status, UserMedia } from '@/features/media/types';
import { db } from '@/shared/services/firebase';
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

const deleteUserMedia = async (id: string) => {
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
    constraints.push(where('titleLower', '<=', qLower + '\uf8ff'));
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

// ---------- React Query hooks ----------

export const useCreateMedia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUserMedia,
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: ['userMedia', variables.ownerId] });
    },
  });
};

export const useUpdateMedia = (ownerId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<UserMedia> }) =>
      updateUserMedia(id, patch),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: ['userMediaEntry', variables.id] });
      qc.invalidateQueries({ queryKey: ['userMedia', ownerId] });
    },
  });
};

export const useDeleteMedia = (ownerId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUserMedia(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['userMedia', ownerId] });

      const prevLists = qc.getQueriesData<InfiniteData<MediaPage>>({
        queryKey: ['userMedia', ownerId],
      });

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

      return { prevLists };
    },
    onError: (_err, _id, ctx) => {
      ctx?.prevLists?.forEach(([key, data]) =>
        qc.setQueryData<InfiniteData<MediaPage>>(key, data ?? undefined),
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['userMedia', ownerId] });
    },
  });
};

export const useUserMediaEntry = (id: string) =>
  useQuery({ queryKey: ['userMediaEntry', id], queryFn: () => getUserMedia(id), enabled: !!id });

export const useUserMedia = (ownerId: string, filters: MediaFilters) =>
  useInfiniteQuery({
    queryKey: ['userMedia', ownerId, filters],
    queryFn: ({ pageParam }) => listUserMedia(ownerId, filters, undefined, pageParam),
    initialPageParam: null as MediaPage['cursor'],
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    enabled: !!ownerId,
  });

export const useUpdateMediaOptimistic = (ownerId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<UserMedia> }) =>
      updateUserMedia(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ['userMedia', ownerId] });
      await qc.cancelQueries({ queryKey: ['userMediaEntry', id] });

      const prevLists = qc.getQueriesData<InfiniteData<MediaPage>>({
        queryKey: ['userMedia', ownerId],
      });
      const prevEntry = qc.getQueryData<UserMedia>(['userMediaEntry', id]);

      if (prevEntry) qc.setQueryData(['userMediaEntry', id], { ...prevEntry, ...patch });

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

      return { prevLists, prevEntry };
    },
    onError: (_err, vars, ctx) => {
      ctx?.prevLists?.forEach(([key, data]) =>
        qc.setQueryData<InfiniteData<MediaPage>>(key, data ?? undefined),
      );
      if (ctx?.prevEntry) qc.setQueryData(['userMediaEntry', vars.id], ctx.prevEntry);
    },
    onSettled: (_res, _err, vars) => {
      qc.invalidateQueries({ queryKey: ['userMediaEntry', vars.id] });
      qc.invalidateQueries({ queryKey: ['userMedia', ownerId] });
    },
  });
};
