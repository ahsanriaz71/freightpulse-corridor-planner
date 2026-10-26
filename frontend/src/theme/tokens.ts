import type { RiskLevel } from '../types'

/**
 * Design tokens: the only place in the project where raw colors, fonts and radii live.
 * Everything else reads them through the MUI theme (`theme.palette.*`), the CSS
 * variables MUI emits from it (`--mui-palette-*`), or the helpers in `risk.ts`.
 */
export const tokens = {
  color: {
    primary: '#4F46E5',
    primaryDark: '#3730A3',
    primaryLight: '#EEF2FF',
    onPrimary: '#ffffff',
    secondary: '#0F172A',
    background: '#E2E8F0',
    surface: '#ffffff',
    surfaceSubtle: '#F8FAFC',
    surfaceHud: 'rgba(15, 23, 42, 0.90)',
    textHud: '#F8FAFC',
    textHudSecondary: '#94A3B8',
    hudBorder: 'rgba(255, 255, 255, 0.14)',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    divider: '#CBD5E1',
    error: '#DC2626',
    errorSubtle: '#FEF2F2',
    risk: {
      Low: '#16A34A',
      Moderate: '#EAB308',
      High: '#F97316',
      Severe: '#DC2626',
      'No Travel': '#7E22CE',
    } satisfies Record<RiskLevel, string>,
    map: {
      routeOther: '#64748B',
      casing: '#0F172A',
      transparent: 'rgba(0,0,0,0)',
    },
  },
  shadow: {
    card: '0 2px 6px rgba(15, 23, 42, 0.06)',
    cardSelected: '0 10px 28px -6px rgba(79, 70, 229, 0.28)',
    sidebar: '-6px 0 28px rgba(15, 23, 42, 0.08)',
    header: '0 4px 20px rgba(15, 23, 42, 0.18)',
    pin: '0 4px 14px rgba(15, 23, 42, 0.38)',
    popup: '0 12px 32px rgba(15, 23, 42, 0.28)',
    chipText: '0 1px 2px rgba(0, 0, 0, 0.30)',
  },
  font: {
    sans: '"Plus Jakarta Sans", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
  radius: {
    md: 8,
  },
} as const
