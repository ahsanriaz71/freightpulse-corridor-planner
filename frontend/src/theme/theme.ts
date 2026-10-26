import { createTheme } from '@mui/material/styles'

import { tokens } from './tokens'

// Map & custom surface colors as palette groups so MUI components can read them and
// `cssVariables: true` emits them as --mui-palette-* for plain CSS.
declare module '@mui/material/styles' {
  interface Palette {
    map: { routeOther: string; casing: string }
    surface: {
      subtle: string
      hud: string
      hudText: string
      hudTextSecondary: string
      hudBorder: string
      primaryTint: string
      errorTint: string
    }
  }
  interface PaletteOptions {
    map?: { routeOther: string; casing: string }
    surface?: {
      subtle: string
      hud: string
      hudText: string
      hudTextSecondary: string
      hudBorder: string
      primaryTint: string
      errorTint: string
    }
  }
}

const { color, font, radius, shadow } = tokens

export const theme = createTheme({
  cssVariables: true,
  // `md` is the tablet width from the PRD (768 px): the map sits beside the sidebar from there up
  breakpoints: { values: { xs: 0, sm: 600, md: 768, lg: 1200, xl: 1536 } },
  palette: {
    mode: 'light',
    primary: {
      main: color.primary,
      dark: color.primaryDark,
      light: color.primaryLight,
      contrastText: color.onPrimary,
    },
    secondary: { main: color.secondary },
    error: { main: color.error },
    background: { default: color.background, paper: color.surface },
    text: { primary: color.textPrimary, secondary: color.textSecondary },
    divider: color.divider,
    map: { routeOther: color.map.routeOther, casing: color.map.casing },
    surface: {
      subtle: color.surfaceSubtle,
      hud: color.surfaceHud,
      hudText: color.textHud,
      hudTextSecondary: color.textHudSecondary,
      hudBorder: color.hudBorder,
      primaryTint: color.primaryLight,
      errorTint: color.errorSubtle,
    },
  },
  shape: { borderRadius: radius.md },
  typography: {
    fontFamily: font.sans,
    h1: { fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.2 },
    subtitle1: { fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle2: { fontSize: '0.825rem', fontWeight: 700, letterSpacing: '-0.005em' },
    overline: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '-0.005em' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: radius.md, paddingTop: 9, paddingBottom: 9 },
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { borderRadius: radius.md * 1.5, boxShadow: shadow.card },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', fullWidth: true },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: radius.md,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
        outlined: {
          backgroundColor: color.surfaceSubtle,
          borderColor: color.divider,
          '&:hover': {
            backgroundColor: color.primaryLight,
            borderColor: color.primary,
            color: color.primary,
          },
        },
      },
    },
  },
})
