import { auth } from '@/shared/services/firebase';

export const useCurrentUserId = (): string | null => auth.currentUser?.uid ?? null;
