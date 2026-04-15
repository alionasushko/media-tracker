import type { MediaFilters, Status, UserItem } from '@/types/media';
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
import { db } from '@services/firebase';

const COL = 'items';
export const PAGE_SIZE = 20;

type DocSnapshot = QueryDocumentSnapshot;

export type ItemsPage = {
  items: UserItem[];
  cursor: DocSnapshot | null;
};

export const createUserItem = async (
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

export const updateUserItem = async (id: string, patch: Partial<UserItem>) => {
  const ref = doc(db, COL, id);
  const extra = patch.title !== undefined ? { titleLower: patch.title.toLowerCase() } : {};
  await updateDoc(ref, { ...patch, ...extra, updatedAt: Date.now() });
};

export const deleteUserItem = async (id: string) => {
  await deleteDoc(doc(db, COL, id));
};

export const getUserItem = async (id: string) => {
  const snap = await getDoc(doc(db, COL, id));
  return { id: snap.id, ...(snap.data() as Omit<UserItem, 'id'>) } as UserItem;
};

export const listUserItems = async (
  ownerId: string,
  filters: MediaFilters,
  pageSize: number = PAGE_SIZE,
  cursor: DocSnapshot | null = null,
): Promise<ItemsPage> => {
  const constraints: any[] = [where('ownerId', '==', ownerId)];

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
