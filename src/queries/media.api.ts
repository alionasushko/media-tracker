import type { MediaFilters, Status, UserItem } from '@/types/media';
import { db } from '@services/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

const COL = 'items';

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
  await updateDoc(ref, { ...patch, updatedAt: Date.now() });
};

export const deleteUserItem = async (id: string) => {
  await deleteDoc(doc(db, COL, id));
};

export const getUserItem = async (id: string) => {
  const snap = await getDoc(doc(db, COL, id));
  return { id: snap.id, ...(snap.data() as Omit<UserItem, 'id'>) } as UserItem;
};

export const listUserItems = async (ownerId: string, filters: MediaFilters) => {
  const constraints: any[] = [where('ownerId', '==', ownerId)];

  // Server-side filters
  if (filters.status && filters.status !== 'all') {
    constraints.push(where('status', '==', filters.status));
  }

  if (filters.type && filters.type !== 'all') {
    constraints.push(where('type', '==', filters.type));
  }

  // Server-side sorting
  const sortKey = filters.sort?.key ?? 'updatedAt';
  const sortOrder = filters.sort?.order ?? 'desc';
  constraints.push(orderBy(sortKey, sortOrder));

  const q = query(collection(db, 'items'), ...constraints);
  const snap = await getDocs(q);

  let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as UserItem);

  // Client-side text search
  if (filters.q) {
    const qLower = filters.q.toLowerCase();
    items = items.filter((i) => i.title.toLowerCase().includes(qLower));
  }

  return items;
};
