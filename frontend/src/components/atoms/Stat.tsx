import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export interface StatProps {
  label: string
  value: string
  /** Show the value in the error color, for example miles at a dangerous level. */
  isWarning?: boolean
}

/** A small labelled figure, used in route cards. */
export function Stat({ label, value, isWarning = false }: StatProps) {
  return (
    <Box
      sx={{
        px: 1.25,
        py: 0.875,
        borderRadius: 1,
        bgcolor: isWarning ? 'surface.errorTint' : 'surface.subtle',
        border: 1,
        borderColor: isWarning ? 'error.main' : 'divider',
      }}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{
          color: isWarning ? 'error.main' : 'text.secondary',
          fontWeight: 700,
          fontSize: '0.66rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 800,
          mt: 0.25,
          fontVariantNumeric: 'tabular-nums',
          color: isWarning ? 'error.main' : 'text.primary',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}
