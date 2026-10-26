import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { useSelectedRouteId, useTripStore } from '../../store'
import { RouteCard } from '../molecules'
import type { TripResult } from '../../types'

export interface RouteListProps {
  trip: TripResult | undefined
  isLoading: boolean
}

const SKELETON_ROUTES = ['A', 'B', 'C'] as const
const PRIMARY_STAT_SLOTS = 3
const HAZARD_PILL_SLOTS = 3

export function RouteList({ trip, isLoading }: RouteListProps) {
  const selectedRouteId = useSelectedRouteId(trip)
  const selectRoute = useTripStore((s) => s.selectRoute)

  if (isLoading) {
    return (
      <Stack spacing={1.5} aria-busy="true" aria-label="Loading route weather telemetry">
        <Card
          sx={{
            p: 2,
            bgcolor: 'surface.primaryTint',
            borderColor: 'primary.main',
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.25 }}>
            <CircularProgress size={20} thickness={5} color="primary" />
            <Box>
              <Typography variant="subtitle2" color="primary.main">
                Computing Corridor Weather Risk
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div">
                Sampling TomTom truck geometry · Scoring Open-Meteo forecast…
              </Typography>
            </Box>
          </Stack>
          <LinearProgress color="primary" sx={{ height: 5, borderRadius: 999 }} />
        </Card>

        {SKELETON_ROUTES.map((id) => (
          <Card key={id} sx={{ overflow: 'hidden' }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                px: 2,
                py: 1.25,
                bgcolor: 'surface.subtle',
                borderBottom: 1,
                borderColor: 'divider',
                alignItems: 'center',
              }}
            >
              <Skeleton variant="rounded" animation="wave" width={76} height={22} />
              <Box sx={{ flex: 1 }} />
              <Skeleton variant="text" animation="wave" width={84} height={20} />
            </Stack>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 1.5 }}>
                {Array.from({ length: PRIMARY_STAT_SLOTS }, (_, i) => (
                  <Skeleton key={i} variant="rounded" animation="wave" height={52} />
                ))}
              </Box>
              <Skeleton variant="rounded" animation="wave" height={10} sx={{ mb: 1.5 }} />
              <Stack direction="row" spacing={0.75}>
                {Array.from({ length: HAZARD_PILL_SLOTS }, (_, i) => (
                  <Skeleton key={i} variant="rounded" animation="wave" width={88} height={22} />
                ))}
              </Stack>
            </Box>
          </Card>
        ))}
      </Stack>
    )
  }
  if (!trip) return null

  // Recommended route first, then the ranking order from the backend
  const order = trip.ranking.length ? trip.ranking : trip.routes.map((r) => r.id)
  const routes = [...trip.routes].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))

  return (
    <Stack spacing={1.5}>
      {trip.unsafe && (
        <Alert severity="error" variant="outlined">
          Every route crosses No Travel weather at this departure time. Consider leaving later.
        </Alert>
      )}
      {routes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          isRecommended={route.id === trip.recommended_route_id}
          isSelected={route.id === selectedRouteId}
          reason={route.id === trip.recommended_route_id ? trip.recommendation_reason : undefined}
          onSelect={() => selectRoute(route.id)}
        />
      ))}
    </Stack>
  )
}
