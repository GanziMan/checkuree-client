const colors = {
  // Background colors
  'bg-base': '#f8f8f8',
  'bg-primary': '#bdddc3',
  'bg-primary-hover': '#92c39f',
  'bg-primary-press': '#59996b',
  'bg-secondary': '#f6f6f6',
  'bg-secondary-hover': '#e7e7e7',
  'bg-secondary-press': '#d1d1d1',
  'bg-tertiary': '#59996b',
  'bg-tertiary-hover': '#428758',
  'bg-tertiary-press': '#306b44',
  'bg-destructive': '#fccccc',
  'bg-destructive-hover': '#f9a8a8',
  'bg-destructive-press': '#f37676',
  'bg-interactive-secondary': '#f6f6f6',
  'bg-interactive-destructive': '#EA5353',
  'bg-interactive-primary': '#BDDDC3',
  'bg-interactive-disabled': '#e7e7e7',

  // Border colors
  'border-brand': '#59996b',
  'border-danger': '#ea5353',
  'border-disabled': '#b0b0b0',
  'border-warning': '#f2bd2d',
  'border-primary': '#d1d1d1',
  'border-primary-hover': '#428758',
  'border-primary-press': '#306b44',
  'border-secondary': '#d1d1d1',
  'border-secondary-hover': '#b0b0b0',
  'border-secondary-press': '#888888',
  'border-interactive-secondary': '#e7e7e7',

  // Text colors
  'text-primary': '#171717',
  'text-secondary': '#5d5d5d',
  'text-tertiary': '#B0B0B0',
  'text-disabled': '#888888',
  'text-brand': '#428758',
  'text-danger': '#d62c2c',
  'text-success': '#306b44',
  'text-warning': '#ec9e14',
  'text-interactive-primary': '#20452e',
  'text-interactive-primary-press': '#265637',
  'text-interactive-hover': '#1b3926',
  'text-interactive-press': '#0e2016',
  'text-interactive-destructive': '#951f1f',
  'text-interactive-inverse': '#f6f6f6',
  'text-interactive-secondary': '#B0B0B0',
  'text-interactive-tertiary': '#F1F8F3',

  // Shadow colors
  'shadow-12': '#0000001f',
  'shadow-16': '#00000029',
  'shadow-20': '#00000033',
  'shadow-24': '#0000003d',
}

// Font size 설정
const fontSize = {
  '3xl-bold': ['40px', { lineHeight: '120%', fontWeight: '700' }],
  '2xl-bold': ['32px', { lineHeight: '120%', fontWeight: '700' }],
  'xl-bold': ['20px', { lineHeight: 'auto', fontWeight: '700' }],
  'xl-semibold': ['20px', { lineHeight: 'auto', fontWeight: '600' }],
  'xl-medium': ['20px', { lineHeight: 'auto', fontWeight: '500' }],
  'xl-regular': ['28px', { lineHeight: '120%', fontWeight: '400' }],
  'l-bold': ['18px', { lineHeight: 'auto', fontWeight: '700' }],
  'l-semibold': ['18px', { lineHeight: 'auto', fontWeight: '600' }],
  'l-medium': ['18px', { lineHeight: 'auto', fontWeight: '500' }],
  'm-bold': ['16px', { lineHeight: 'auto', fontWeight: '700' }],
  'm-semibold': ['16px', { lineHeight: 'auto', fontWeight: '600' }],
  'm-medium': ['16px', { lineHeight: 'auto', fontWeight: '500' }],
  's-bold': ['14px', { lineHeight: 'auto', fontWeight: '700' }],
  's-semibold': ['14px', { lineHeight: 'auto', fontWeight: '600' }],
  's-medium': ['14px', { lineHeight: 'auto', fontWeight: '500' }],
  'xs-semibold': ['12px', { lineHeight: 'auto', fontWeight: '600' }],
  'xs-medium': ['12px', { lineHeight: 'auto', fontWeight: '500' }],
}
const fontFamily = {
  suit: ['SUIT', 'sans-serif'],
  appleLiGothic: ['AppleLiGothic'],
}
export const extend = {
  colors,
  fontSize,
  fontFamily,
  scrollbar: {
    none: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      '-ms-overflow-style': 'none', // IE and Edge
      'scrollbar-width': 'none', // Firefox
    },
  },
}
