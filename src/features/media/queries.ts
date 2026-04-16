import type { MediaFilters, Status, UserItem } from '@/features/media/types';
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

const COL = 'items';
export const PAGE_SIZE = 20;

type DocSnapshot = QueryDocumentSnapshot;

type QueryConstraint =
  | ReturnType<typeof where>
  | ReturnType<typeof orderBy>
  | ReturnType<typeof startAfter>
  | ReturnType<typeof limit>;

export type ItemsPage = {
  items: UserItem[];
  cursor: DocSnapshot | null;
};

const createUserItem = async (
  input: Partial<UserItem> & {
    ownerId: string;
    title: string;
    notes: string;
    type: UserItem['type'];
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
  return { id: snap.id, ...(snap.data() as Omit<UserItem, 'id'>) } as UserItem;
};

const updateUserItem = async (id: string, patch: Partial<UserItem>) => {
  const ref = doc(db, COL, id);
  const extra = patch.title !== undefined ? { titleLower: patch.title.toLowerCase() } : {};
  await updateDoc(ref, { ...patch, ...extra, updatedAt: Date.now() });
};

const deleteUserItem = async (id: string) => {
  await deleteDoc(doc(db, COL, id));
};

const getUserItem = async (id: string) => {
  const snap = await getDoc(doc(db, COL, id));
  return { id: snap.id, ...(snap.data() as Omit<UserItem, 'id'>) } as UserItem;
};

const listUserItems = async (
  ownerId: string,
  filters: MediaFilters,
  pageSize: number = PAGE_SIZE,
  cursor: DocSnapshot | null = null,
): Promise<ItemsPage> => {
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

  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UserItem);
  const nextCursor = snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null;

  return { items, cursor: nextCursor };
};

// ---------- React Query hooks ----------

export const useCreateItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUserItem,
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: ['userItems', variables.ownerId] });
    },
  });
};

export const useUpdateItem = (ownerId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<UserItem> }) =>
      updateUserItem(id, patch),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({ queryKey: ['userItem', variables.id] });
      qc.invalidateQueries({ queryKey: ['userItems', ownerId] });
    },
  });
};

export const useDeleteItem = (ownerId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUserItem(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['userItems', ownerId] });

      const prevLists = qc.getQueriesData<InfiniteData<ItemsPage>>({
        queryKey: ['userItems', ownerId],
      });

      prevLists.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<InfiniteData<ItemsPage>>(key, {
          ...data,
          pages: data.pages.map((p) => ({
            ...p,
            items: p.items.filter((it) => it.id !== id),
          })),
        });
      });

      return { prevLists };
    },
    onError: (_err, _id, ctx) => {
      ctx?.prevLists?.forEach(([key, data]) =>
        qc.setQueryData<InfiniteData<ItemsPage>>(key, data ?? undefined),
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['userItems', ownerId] });
    },
  });
};

export const useUserItem = (id: string) =>
  useQuery({ queryKey: ['userItem', id], queryFn: () => getUserItem(id), enabled: !!id });

export const useUserItems = (ownerId: string, filters: MediaFilters) =>
  useInfiniteQuery({
    queryKey: ['userItems', ownerId, filters],
    queryFn: ({ pageParam }) => listUserItems(ownerId, filters, undefined, pageParam),
    initialPageParam: null as ItemsPage['cursor'],
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    enabled: !!ownerId,
  });

export const useUpdateItemOptimistic = (ownerId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<UserItem> }) =>
      updateUserItem(id, patch),
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ['userItems', ownerId] });
      await qc.cancelQueries({ queryKey: ['userItem', id] });

      const prevLists = qc.getQueriesData<InfiniteData<ItemsPage>>({
        queryKey: ['userItems', ownerId],
      });
      const prevItem = qc.getQueryData<UserItem>(['userItem', id]);

      if (prevItem) qc.setQueryData(['userItem', id], { ...prevItem, ...patch });

      prevLists.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData<InfiniteData<ItemsPage>>(key, {
          ...data,
          pages: data.pages.map((p) => ({
            ...p,
            items: p.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
          })),
        });
      });

      return { prevLists, prevItem };
    },
    onError: (_err, vars, ctx) => {
      ctx?.prevLists?.forEach(([key, data]) =>
        qc.setQueryData<InfiniteData<ItemsPage>>(key, data ?? undefined),
      );
      if (ctx?.prevItem) qc.setQueryData(['userItem', vars.id], ctx.prevItem);
    },
    onSettled: (_res, _err, vars) => {
      qc.invalidateQueries({ queryKey: ['userItem', vars.id] });
      qc.invalidateQueries({ queryKey: ['userItems', ownerId] });
    },
  });
};
