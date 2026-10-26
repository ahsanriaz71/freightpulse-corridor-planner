import type { ReactNode } from 'react'

import Paper from '@mui/material/Paper'
import type { SxProps, Theme } from '@mui/material/styles'

export interface MapOverlayProps {
  children: ReactNode
  sx?: SxProps<Theme>
}

/** Frosted-glass floating HUD surface shared by the map legend, heatmap slider and map banner. */
export function MapOverlay({ children, sx }: MapOverlayProps) {
  return (
    <Paper
      elevation={4}
      sx={[
        {
          position: 'absolute',
          zIndex: 1,
          borderRadius: 2.5,
          bgcolor: 'surface.hud',
          color: 'surface.hudText',
          backdropFilter: 'blur(12px)',
          border: 1,
          borderColor: 'surface.hudBorder',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Paper>
  )
}
