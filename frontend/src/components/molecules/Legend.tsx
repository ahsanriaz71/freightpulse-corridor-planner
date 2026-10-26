import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import { RISK_COLORS, RISK_LEVELS } from '../../theme/risk'
import { MapOverlay, Swatch } from '../atoms'

const OTHER_ROUTES_LABEL = 'Other routes'

/** Risk color key docked as a high-contrast pill bar at the top-left of the map. */
export function Legend() {
  const theme = useTheme()
  const items: [string, string][] = [
    ...RISK_LEVELS.map((level) => [level, RISK_COLORS[level]] as [string, string]),
    [OTHER_ROUTES_LABEL, theme.palette.map.routeOther],
  ]

  return (
    <MapOverlay
      sx={{
        top: { xs: 8, md: 16 },
        left: { xs: 8, md: 16 },
        right: { xs: 48, md: 'auto' },
        px: 1.75,
        py: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: 1,
        rowGap: 0.75,
      }}
    >
      <Typography
        variant="overline"
        sx={{
          color: 'surface.hudText',
          fontWeight: 800,
          mr: 0.5,
          lineHeight: 1,
        }}
      >
        Weather Risk:
      </Typography>
      {items.map(([label, color]) => (
        <Box
          key={label}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.65,
            px: 1,
            py: 0.25,
            borderRadius: 999,
            bgcolor: 'surface.hudBorder',
          }}
        >
          <Swatch color={color} width={14} />
          <Typography
            variant="caption"
            sx={{
              color: 'surface.hudText',
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </MapOverlay>
  )
}
