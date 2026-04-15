import type { MediaFilters, UserItem } from '@/types/media';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import {
  createUserItem,
  deleteUserItem,
  getUserItem,
  listUserItems,
  updateUserItem,
  type ItemsPage,
} from './media.api';

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
        qc.setQueryData(key as any, {
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
      ctx?.prevLists?.forEach(([key, data]) => qc.setQueryData(key as any, data));
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
        qc.setQueryData(key as any, {
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
      ctx?.prevLists?.forEach(([key, data]) => qc.setQueryData(key as any, data));
      if (ctx?.prevItem) qc.setQueryData(['userItem', (vars as any).id], ctx.prevItem);
    },
    onSettled: (_res, _err, vars) => {
      qc.invalidateQueries({ queryKey: ['userItem', (vars as any).id] });
      qc.invalidateQueries({ queryKey: ['userItems', ownerId] });
    },
  });
};
