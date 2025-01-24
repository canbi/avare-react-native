// LocationItemStoreState.ts
import { Note } from '@/presentation/_domain';

export interface LocationItemStoreState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;

  fetchNotesForLocation: (locationId: number) => Promise<void>;
}
