/**
 * Seed the Firestore emulator with test media data.
 *
 * Usage:
 *   npx tsx scripts/seed-emulator.ts
 *
 * Creates a test user (test@example.com / password123) in the Auth emulator
 * and populates the Firestore `items` collection with sample media.
 *
 * Requires emulators running (firebase emulators:start).
 */

const AUTH_URL = 'http://127.0.0.1:9099';
const FIRESTORE_URL = 'http://127.0.0.1:8080';

async function getProjectId(): Promise<string> {
  // Read from GoogleService-Info.plist to match the app's project
  const { readFileSync } = await import('fs');
  const plist = readFileSync('ios/mediatracker/GoogleService-Info.plist', 'utf-8');
  const match = plist.match(/<key>PROJECT_ID<\/key>\s*<string>([^<]+)<\/string>/);
  if (match) return match[1];
  return 'demo-media-tracker';
}

async function getTestUser(): Promise<{ localId: string; idToken: string }> {
  // Try sign-up first
  const res = await fetch(
    `${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        returnSecureToken: true,
      }),
    },
  );

  if (res.ok) {
    return (await res.json()) as { localId: string; idToken: string };
  }

  // Already exists — sign in
  const signIn = await fetch(
    `${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        returnSecureToken: true,
      }),
    },
  );
  if (!signIn.ok) throw new Error('Failed to create or sign in test user');
  return (await signIn.json()) as { localId: string; idToken: string };
}

type MediaType = 'movie' | 'book' | 'series' | 'game';
type Status = 'plan' | 'progress' | 'done' | 'dropped';

interface SeedItem {
  title: string;
  type: MediaType;
  status: Status;
  rating: number;
  notes: string;
}

const ITEMS: SeedItem[] = [
  // Movies
  { title: 'Inception', type: 'movie', status: 'done', rating: 5, notes: 'Mind-bending masterpiece. The ending is still debated.' },
  { title: 'The Shawshank Redemption', type: 'movie', status: 'done', rating: 5, notes: 'One of the greatest films ever made.' },
  { title: 'Interstellar', type: 'movie', status: 'done', rating: 4, notes: 'Beautiful visuals, great soundtrack by Hans Zimmer.' },
  { title: 'Dune: Part Two', type: 'movie', status: 'done', rating: 4, notes: 'Even better than Part One.' },
  { title: 'Oppenheimer', type: 'movie', status: 'plan', rating: 0, notes: '' },
  { title: 'The Batman', type: 'movie', status: 'dropped', rating: 2, notes: 'Too long, lost interest halfway through.' },

  // Books
  { title: 'Dune', type: 'book', status: 'done', rating: 5, notes: 'The world-building is unmatched.' },
  { title: 'Project Hail Mary', type: 'book', status: 'done', rating: 5, notes: 'Could not put it down. Rocky is the best.' },
  { title: '1984', type: 'book', status: 'done', rating: 4, notes: 'Terrifyingly relevant.' },
  { title: 'The Three-Body Problem', type: 'book', status: 'progress', rating: 0, notes: 'On chapter 12, the science is fascinating.' },
  { title: 'Neuromancer', type: 'book', status: 'plan', rating: 0, notes: '' },
  { title: 'Snow Crash', type: 'book', status: 'plan', rating: 0, notes: '' },

  // Series
  { title: 'Breaking Bad', type: 'series', status: 'done', rating: 5, notes: 'Perfect from start to finish.' },
  { title: 'Severance', type: 'series', status: 'progress', rating: 0, notes: 'Watching season 2, the mystery keeps deepening.' },
  { title: 'The Last of Us', type: 'series', status: 'done', rating: 4, notes: 'Faithful adaptation, episode 3 was incredible.' },
  { title: 'Shogun', type: 'series', status: 'done', rating: 5, notes: 'Stunning cinematography and storytelling.' },
  { title: 'House of the Dragon', type: 'series', status: 'progress', rating: 0, notes: 'Season 2 just started.' },
  { title: 'Arcane', type: 'series', status: 'plan', rating: 0, notes: '' },

  // Games
  { title: 'Elden Ring', type: 'game', status: 'done', rating: 5, notes: 'A modern classic. The DLC is even better.' },
  { title: "Baldur's Gate 3", type: 'game', status: 'done', rating: 5, notes: 'Best RPG in years. So many choices.' },
  { title: 'Hades', type: 'game', status: 'done', rating: 4, notes: 'Incredibly addictive roguelike.' },
  { title: 'Zelda: Tears of the Kingdom', type: 'game', status: 'progress', rating: 0, notes: 'The building mechanics are genius.' },
  { title: 'Hollow Knight: Silksong', type: 'game', status: 'plan', rating: 0, notes: '' },
  { title: 'Cyberpunk 2077', type: 'game', status: 'dropped', rating: 3, notes: 'Came back after patches, still not my thing.' },
];

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
}

function toFirestoreDoc(
  item: SeedItem,
  ownerId: string,
  createdAt: number,
): { fields: Record<string, FirestoreValue> } {
  return {
    fields: {
      ownerId: { stringValue: ownerId },
      title: { stringValue: item.title },
      titleLower: { stringValue: item.title.toLowerCase() },
      type: { stringValue: item.type },
      status: { stringValue: item.status },
      rating: { integerValue: String(item.rating) },
      notes: { stringValue: item.notes },
      createdAt: { integerValue: String(createdAt) },
      updatedAt: { integerValue: String(createdAt) },
    },
  };
}

async function seed() {
  const projectId = await getProjectId();
  console.log(`Using project: ${projectId}`);

  const { localId: ownerId, idToken } = await getTestUser();
  console.log(`Owner ID: ${ownerId}`);
  console.log(`(Sign in with test@example.com / password123)\n`);

  const baseTime = Date.now();

  for (let i = 0; i < ITEMS.length; i++) {
    const item = ITEMS[i];
    const createdAt = baseTime - (ITEMS.length - i) * 60_000;
    const doc = toFirestoreDoc(item, ownerId, createdAt);

    const res = await fetch(
      `${FIRESTORE_URL}/v1/projects/${projectId}/databases/(default)/documents/items`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(doc),
      },
    );

    if (!res.ok) {
      const err = await res.text();
      console.error(`Failed to create "${item.title}": ${err}`);
    } else {
      console.log(`  + [${item.type}] ${item.title} (${item.status})`);
    }
  }

  console.log(`\nSeeded ${ITEMS.length} items.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
