import type { ReactNode } from 'react'

import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

import { MapOverlay } from '../atoms'

export interface MapBannerProps {
  /** An error alert; omitted, the banner is a quiet hint. */
  severity?: 'error'
  children: ReactNode
}

// Floating pill over the bottom-center of the map so it never collides with the top-left risk bar
const PLACEMENT = {
  position: 'absolute',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  maxWidth: 'calc(100% - 24px)',
  zIndex: 2,
} as const

/** One line floating over the map: a hint before the first trip, or a map error. */
export function MapBanner({ severity, children }: MapBannerProps) {
  if (severity) {
    return (
      <Alert severity={severity} sx={{ ...PLACEMENT, width: 'max-content' }}>
        {children}
      </Alert>
    )
  }
  return (
    <MapOverlay sx={{ ...PLACEMENT, px: 2.25, py: 1, borderRadius: 999 }}>
      <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 600, color: 'surface.hudText' }}>
        {children}
      </Typography>
    </MapOverlay>
  )
}
