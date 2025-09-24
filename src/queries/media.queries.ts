import type { MediaFilters, UserItem } from '@/types/media';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUserItem, deleteUserItem, getUserItem, listUserItems, updateUserItem, } from './media.api';

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

      const prevItems = qc.getQueryData<UserItem[]>(['userItems', ownerId]);

      if (prevItems) {
        qc.setQueryData(
          ['userItems', ownerId],
          prevItems.filter((item) => item.id !== id),
        );
      }

      return { prevItems };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prevItems) {
        qc.setQueryData(['userItems', ownerId], ctx.prevItems);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['userItems', ownerId] });
    },
  });
};

export const useUserItem = (id: string) =>
  useQuery({ queryKey: ['userItem', id], queryFn: () => getUserItem(id), enabled: !!id });

export const useUserItems = (ownerId: string, filters: MediaFilters) =>
  useQuery({
    queryKey: ['userItems', ownerId, filters],
    queryFn: () => listUserItems(ownerId, filters),
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

      const prevLists = qc.getQueriesData<UserItem[]>({ queryKey: ['userItems', ownerId] });
      const prevItem = qc.getQueryData<UserItem>(['userItem', id]);

      if (prevItem) qc.setQueryData(['userItem', id], { ...prevItem, ...patch });

      prevLists.forEach(([key, list]) => {
        if (!list) return;
        qc.setQueryData(
          key as any,
          list.map((it) => (it.id === id ? { ...it, ...patch } : it)) as UserItem[],
        );
      });

      return { prevLists, prevItem };
    },
    onError: (_err, vars, ctx) => {
      ctx?.prevLists?.forEach(([key, list]) => qc.setQueryData(key as any, list));
      if (ctx?.prevItem) qc.setQueryData(['userItem', (vars as any).id], ctx.prevItem);
    },
    onSettled: (_res, _err, vars) => {
      qc.invalidateQueries({ queryKey: ['userItem', (vars as any).id] });
      qc.invalidateQueries({ queryKey: ['userItems', ownerId] });
    },
  });
};
