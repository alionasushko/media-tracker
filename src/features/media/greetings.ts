export interface Greeting {
  lead: string;
  em: string;
}

export const GREETINGS: Greeting[] = [
  { lead: 'Something', em: 'is waiting' },
  { lead: 'Press play, turn', em: 'the page' },
  { lead: "Today's pick", em: 'is yours' },
  { lead: 'A small ritual', em: 'for today' },
  { lead: 'Make space for', em: 'what you love' },
  { lead: 'One more', em: 'chapter' },
  { lead: 'The quiet', em: 'in-between' },
  { lead: 'Make a little', em: 'time for it' },
  { lead: 'Open something', em: "you'll love" },
  { lead: 'Back to the', em: 'good stuff' },
];

const DAY_MS = 24 * 60 * 60 * 1000;

export const getCurrentGreeting = (now = Date.now()): Greeting => {
  const tzOffsetMs = new Date(now).getTimezoneOffset() * 60_000;
  const localDayIndex = Math.floor((now - tzOffsetMs) / DAY_MS);
  return GREETINGS[localDayIndex % GREETINGS.length];
};
