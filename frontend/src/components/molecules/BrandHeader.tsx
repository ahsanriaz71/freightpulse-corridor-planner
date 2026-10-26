import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export interface BrandHeaderProps {
  isLoading?: boolean
}

/** Full-width top command header with truck emblem, title, product summary and live telemetry badge. */
export function BrandHeader({ isLoading = false }: BrandHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        px: { xs: 2, md: 3 },
        py: 1.35,
        bgcolor: 'secondary.main',
        color: 'primary.contrastText',
        borderBottom: 1,
        borderColor: 'surface.hudBorder',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.75,
            bgcolor: 'primary.main',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 17h4V5H2v12h3" />
            <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
            <circle cx="7.5" cy="17.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
          </svg>
        </Box>
        <Box>
          <Typography variant="h1" sx={{ color: 'inherit', fontSize: '1.15rem', lineHeight: 1.2 }}>
            Route Planner
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'surface.hudTextSecondary',
              fontSize: '0.78rem',
              lineHeight: 1.3,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Compare 3 truck routes by the weather you'll meet on the way.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          px: 1.25,
          py: 0.5,
          borderRadius: 999,
          bgcolor: 'surface.hudBorder',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {isLoading ? (
          <CircularProgress size={12} color="inherit" />
        ) : (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'success.main',
            }}
          />
        )}
        <Typography variant="caption" sx={{ color: 'surface.hudText', fontWeight: 700, letterSpacing: '0.03em' }}>
          {isLoading ? 'Syncing Telemetry…' : 'TomTom + Open-Meteo Live'}
        </Typography>
      </Box>
    </Box>
  )
}
