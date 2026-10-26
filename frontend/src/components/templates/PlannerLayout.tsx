import type { ReactNode } from 'react'

import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'

import { tokens } from '../../theme/tokens'

export interface PlannerLayoutProps {
  header: ReactNode
  sidebar: ReactNode
  map: ReactNode
  isLoading?: boolean
}

// Narrower on a tablet (768 px, theme `md`) so the map keeps more than half the width
const SIDEBAR_WIDTH = { md: 380, lg: 440 }

/** Top command bar with the map on the left and the dispatch panel on the right on tablets and up. */
export function PlannerLayout({ header, sidebar, map, isLoading = false }: PlannerLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        height: '100dvh',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 3 }}>
        {header}
        {isLoading && (
          <LinearProgress
            color="primary"
            sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3 }}
          />
        )}
      </Box>

      <Box
        sx={{
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: `1fr ${SIDEBAR_WIDTH.md}px`, lg: `1fr ${SIDEBAR_WIDTH.lg}px` },
          gridTemplateRows: { xs: '48dvh 1fr', md: '1fr' },
        }}
      >
        <Box sx={{ minHeight: 0, position: 'relative' }}>{map}</Box>

        <Paper
          component="aside"
          square
          elevation={0}
          sx={{
            borderLeft: { md: 1 },
            borderColor: { md: 'divider' },
            bgcolor: 'surface.subtle',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 2,
            boxShadow: { md: tokens.shadow.sidebar },
          }}
        >
          <Box sx={{ p: 2.5 }}>{sidebar}</Box>
        </Paper>
      </Box>
    </Box>
  )
}
