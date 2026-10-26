import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { tokens } from '../../theme/tokens'
import { formatDuration, formatMiles, formatTime } from '../../utils/format'
import { Stat, StatusPill } from '../atoms'
import { RiskBar } from './RiskBar'
import type { RouteResult } from '../../types'

export interface RouteCardProps {
  route: RouteResult
  isRecommended: boolean
  isSelected: boolean
  reason?: string
  onSelect: () => void
}

export function RouteCard({ route, isRecommended, isSelected, reason, onSelect }: RouteCardProps) {
  return (
    <Card
      sx={{
        overflow: 'hidden',
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderWidth: isSelected ? 2 : 1,
        boxShadow: isSelected ? tokens.shadow.cardSelected : tokens.shadow.card,
        transition: 'border-color 150ms, box-shadow 150ms',
        '&:hover': {
          borderColor: isSelected ? 'primary.main' : 'text.secondary',
        },
      }}
    >
      <CardActionArea onClick={onSelect} aria-pressed={isSelected}>
        {/* Full-bleed corridor banner header */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            px: 2,
            py: 1.25,
            alignItems: 'center',
            bgcolor: isSelected ? 'secondary.main' : 'surface.subtle',
            color: isSelected ? 'primary.contrastText' : 'text.primary',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <StatusPill isActive={isSelected}>Corridor {route.id}</StatusPill>
          {isRecommended && <Chip label="★ Best Corridor" color="primary" size="small" />}
          <Box sx={{ flex: 1 }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              color: isSelected ? 'surface.hudTextSecondary' : 'text.secondary',
            }}
          >
            ETA {formatTime(route.arrival)}
          </Typography>
        </Stack>

        <Box sx={{ p: 2 }}>
          {/* Dispatch recommendation banner placed right under the header */}
          {reason && (
            <Box
              sx={{
                mb: 1.5,
                px: 1.25,
                py: 1,
                borderRadius: 1,
                bgcolor: 'surface.primaryTint',
                borderLeft: 3,
                borderColor: 'primary.main',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: 'text.primary', fontSize: '0.79rem', lineHeight: 1.45, fontWeight: 600 }}
              >
                {reason}
              </Typography>
            </Box>
          )}

          {/* Single-row 3-column primary telemetry strip */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 1.5 }}>
            <Stat label="Distance" value={formatMiles(route.distance_mi)} />
            <Stat label="Drive Time" value={formatDuration(route.duration_min)} />
            <Stat label="Avg Risk" value={route.avg_risk.toFixed(2)} isWarning={route.avg_risk >= 2} />
          </Box>

          {/* Labeled corridor weather profile bar */}
          <Box sx={{ mb: 1.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.68rem' }}>
                CHECKPOINT WEATHER PROFILE
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.68rem' }}>
                {route.checkpoints.length} pts
              </Typography>
            </Stack>
            <RiskBar checkpoints={route.checkpoints} />
          </Box>

          {/* Compact hazard exposure footer pills (one decimal so short stretches like 0.4 mi never read as 0) */}
          <Stack
            direction="row"
            spacing={0.75}
            useFlexGap
            sx={{
              pt: 1.25,
              borderTop: 1,
              borderColor: 'divider',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mr: 0.25 }}>
              Hazards:
            </Typography>
            <StatusPill isWarning={route.no_travel_mi > 0}>
              No Travel {formatMiles(route.no_travel_mi, 1)}
            </StatusPill>
            <StatusPill isWarning={route.severe_mi > 0}>
              Severe {formatMiles(route.severe_mi, 1)}
            </StatusPill>
            <StatusPill>High {formatMiles(route.high_mi, 1)}</StatusPill>
          </Stack>
        </Box>
      </CardActionArea>
    </Card>
  )
}
