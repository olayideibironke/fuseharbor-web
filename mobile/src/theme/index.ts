export { colors } from './colors';
export type { ColorKey } from './colors';
export { typography, fontFamily } from './typography';

export const radius = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 28,
  xxl: 32,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const shadows = {
  card: {
    shadowColor: '#23262b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  soft: {
    shadowColor: '#23262b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  brand: {
    shadowColor: '#23262b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 4,
  },
} as const;
