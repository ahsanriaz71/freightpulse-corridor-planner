import type { ReactNode } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export interface StatusPillProps {
  children: ReactNode
  /** Highlight with the solid primary accent (e.g. active forecast time or selected corridor). */
  isActive?: boolean
  /** Highlight with the error/warning surface tint (e.g. non-zero Severe or No Travel miles). */
  isWarning?: boolean
  ariaLive?: 'polite' | 'off'
}

/** Compact tabular badge shared by route cards (risk & hazard miles) and the heatmap slider (forecast hour). */
export function StatusPill({ children, isActive = false, isWarning = false, ariaLive }: StatusPillProps) {
  const bgcolor = isWarning ? 'surface.errorTint' : isActive ? 'primary.main' : 'surface.subtle'
  const borderColor = isWarning ? 'error.main' : isActive ? 'primary.main' : 'divider'
  const textColor = isWarning ? 'error.main' : isActive ? 'primary.contrastText' : 'text.primary'

  return (
    <Box
      sx={{
        px: 1.15,
        py: 0.35,
        borderRadius: 1,
        bgcolor,
        border: 1,
        borderColor,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: textColor,
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          fontSize: '0.75rem',
          lineHeight: 1.2,
        }}
        aria-live={ariaLive}
      >
        {children}
      </Typography>
    </Box>
  )
}
