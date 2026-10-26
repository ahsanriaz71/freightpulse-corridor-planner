import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import Slider from '@mui/material/Slider'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import { useTripStore } from '../../store'
import { formatTime } from '../../utils/format'
import { MapOverlay, StatusPill } from '../atoms'
import type { Heatmap } from '../../types'

export interface HeatmapSliderProps {
  heatmap: Heatmap | undefined
  /** Shown in place of the time label while the heatmap is loading, retrying or failed. */
  statusText: string
}

const MAX_HOUR = 48
const MARKS = [0, 12, 24, 36, 48].map((value) => ({ value, label: `+${value} h` }))

/** 0-48 h slider with real-time labels, plus the heatmap on/off switch. Sits over the map. */
export function HeatmapSlider({ heatmap, statusText }: HeatmapSliderProps) {
  const hour = useTripStore((s) => s.heatmapHour)
  const isVisible = useTripStore((s) => s.isHeatmapVisible)
  const setHour = useTripStore((s) => s.setHeatmapHour)
  const setVisible = useTripStore((s) => s.setHeatmapVisible)

  const hours = heatmap?.hours ?? []
  const labelFor = (h: number) => (hours[h] ? formatTime(hours[h]) : `+${h} h`)
  const hasTime = Boolean(hours[hour])
  const status = hasTime ? `${formatTime(hours[hour])} · +${hour} h` : statusText

  return (
    <MapOverlay
      sx={{
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: { xs: 56, md: 24 },
        width: { xs: 'calc(100% - 16px)', sm: 460 },
        px: 2.25,
        pt: 1,
        pb: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.25 }}>
        <FormControlLabel
          sx={{ mr: 0, color: 'surface.hudText' }}
          control={<Switch size="small" checked={isVisible} onChange={(_, checked) => setVisible(checked)} />}
          label={
            <Typography variant="body2" sx={{ fontWeight: 700, ml: 0.5, color: 'surface.hudText' }}>
              Weather heatmap
            </Typography>
          }
        />
        <StatusPill isActive={hasTime} ariaLive="polite">
          {status}
        </StatusPill>
      </Box>
      <Slider
        size="small"
        min={0}
        max={MAX_HOUR}
        step={1}
        marks={MARKS}
        value={hour}
        disabled={!isVisible || !heatmap}
        onChange={(_, value) => setHour(Array.isArray(value) ? value[0] : value)}
        valueLabelDisplay="auto"
        valueLabelFormat={labelFor}
        aria-label="Forecast hour"
        sx={{
          mx: 0.5,
          width: 'calc(100% - 8px)',
          '& .MuiSlider-markLabel': { fontSize: 11, fontWeight: 600, color: 'surface.hudTextSecondary' },
        }}
      />
    </MapOverlay>
  )
}
