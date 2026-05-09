export const colors = {
  graphite: '#23262b',
  warmWhite: '#f7f4ee',
  copper: '#c97a2b',
  copperSoft: 'rgba(201, 122, 43, 0.12)',
  sand: '#e7d9c8',
  moss: '#7a8b5a',
  stone: '#8c877f',
  stoneSoft: 'rgba(140, 135, 127, 0.6)',
  linen: '#ded6cb',
  white: '#fffdf9',
  pureWhite: '#ffffff',
  red: '#c0392b',
  shadow: 'rgba(35, 38, 43, 0.08)',
} as const;

export type ColorKey = keyof typeof colors;
