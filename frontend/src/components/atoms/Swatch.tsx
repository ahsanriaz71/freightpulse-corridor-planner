import Box from '@mui/material/Box'

export interface SwatchProps {
  color: string
  width: number | Record<string, number>
}

/** A short colored bar, used in the legend. */
export function Swatch({ color, width }: SwatchProps) {
  return (
    <Box
      sx={{
        width,
        height: 10,
        borderRadius: 999,
        bgcolor: color,
        border: 1,
        borderColor: 'surface.hudBorder',
        flexShrink: 0,
      }}
    />
  )
}
