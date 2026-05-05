export const spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 24,
  s6: 32,
  s7: 48,
  s8: 64,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xl2: 28,
  pill: 9999,
} as const;

export const motion = {
  fast: 200,
  base: 280,
  slow: 380,
  spring: { damping: 14, stiffness: 220, mass: 0.9 },
  springSoft: { damping: 18, stiffness: 180, mass: 1 },
} as const;

export const fonts = {
  sansRegular: 'InstrumentSans-Regular',
  sansMedium: 'InstrumentSans-Medium',
  sansSemiBold: 'InstrumentSans-SemiBold',
  sansBold: 'InstrumentSans-Bold',
  serifRegular: 'InstrumentSans-Regular',
  serifMedium: 'InstrumentSans-Medium',
  monoRegular: 'JetBrainsMono-Regular',
  monoMedium: 'JetBrainsMono-Medium',
  monoSemiBold: 'JetBrainsMono-SemiBold',
} as const;

export const typeAccents = {
  movie: '#D69969',
  book: '#7CA77C',
  series: '#9B85B5',
  game: '#B5C56B',
} as const;

export type MediaType = keyof typeof typeAccents;

export interface SemanticPalette {
  bg: string;
  bgDeep: string;
  surface1: string;
  surface2: string;
  surface3: string;
  hairline: string;
  hairlineStrong: string;
  ink: string;
  inkMute: string;
  inkFaint: string;
  inkGhost: string;
  accent: string;
  accentSoft: string;
  accentInk: string;
  statusPlan: string;
  statusProgress: string;
  statusDone: string;
  statusDropped: string;
}

export const darkPalette: SemanticPalette = {
  bg: '#0F0E0C',
  bgDeep: '#0A0907',
  surface1: '#1A1815',
  surface2: '#221F1B',
  surface3: '#2A2622',
  hairline: 'rgba(255, 245, 230, 0.07)',
  hairlineStrong: 'rgba(255, 245, 230, 0.13)',
  ink: '#F4EFE7',
  inkMute: 'rgba(244, 239, 231, 0.62)',
  inkFaint: 'rgba(244, 239, 231, 0.36)',
  inkGhost: 'rgba(244, 239, 231, 0.18)',
  accent: '#9B8EC4',
  accentSoft: 'rgba(155, 142, 196, 0.22)',
  accentInk: '#1A1230',
  statusPlan: '#9C9489',
  statusProgress: '#9B8EC4',
  statusDone: '#5FB37A',
  statusDropped: '#A06D5E',
};

export const lightPalette: SemanticPalette = {
  bg: '#F6F6F4',
  bgDeep: '#EEEEEB',
  surface1: '#FFFFFF',
  surface2: '#FFFFFF',
  surface3: '#ECECE8',
  hairline: 'rgba(20, 20, 20, 0.08)',
  hairlineStrong: 'rgba(20, 20, 20, 0.16)',
  ink: '#161616',
  inkMute: 'rgba(22, 22, 22, 0.62)',
  inkFaint: 'rgba(22, 22, 22, 0.42)',
  inkGhost: 'rgba(22, 22, 22, 0.18)',
  accent: '#6D5ACE',
  accentSoft: 'rgba(109, 90, 206, 0.14)',
  accentInk: '#FFFFFF',
  statusPlan: '#8C857B',
  statusProgress: '#6D5ACE',
  statusDone: '#3F8E5A',
  statusDropped: '#A05C4A',
};

export interface AppTokens {
  spacing: typeof spacing;
  radii: typeof radii;
  motion: typeof motion;
  fonts: typeof fonts;
  typeAccents: typeof typeAccents;
  semantic: SemanticPalette;
}

export const buildTokens = (mode: 'light' | 'dark'): AppTokens => ({
  spacing,
  radii,
  motion,
  fonts,
  typeAccents,
  semantic: mode === 'dark' ? darkPalette : lightPalette,
});
