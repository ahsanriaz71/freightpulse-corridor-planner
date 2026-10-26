import { useMemo } from 'react'

import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import dayjs, { type Dayjs } from 'dayjs'

import { toLocalInput } from '../../utils/format'

export interface DepartureFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
  maxDaysAhead?: number
}

interface QuickPreset {
  label: string
  build: () => Dayjs
}

const QUICK_PRESETS: QuickPreset[] = [
  { label: 'Leave now', build: () => dayjs() },
  { label: '+3 hrs', build: () => dayjs().add(3, 'hour').startOf('hour') },
  { label: '+6 hrs', build: () => dayjs().add(6, 'hour').startOf('hour') },
  { label: 'Tomorrow 6 AM', build: () => dayjs().add(1, 'day').hour(6).minute(0).second(0) },
]

/** Full interactive MUI X Calendar & Clock Date-Time Picker scoped to the 14-day forecast window. */
export function DepartureField({ value, onChange, error, maxDaysAhead = 14 }: DepartureFieldProps) {
  const selected = useMemo(() => {
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed : dayjs()
  }, [value])

  const minDateTime = useMemo(() => dayjs().subtract(15, 'minute'), [])
  const maxDateTime = useMemo(() => dayjs().add(maxDaysAhead, 'day'), [maxDaysAhead])

  const handleChange = (next: Dayjs | null) => {
    if (next && next.isValid()) {
      onChange(toLocalInput(next.toDate()))
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={1}>
        <DateTimePicker
          label="Departure date & time"
          value={selected}
          onChange={handleChange}
          minDateTime={minDateTime}
          maxDateTime={maxDateTime}
          format="ddd, MMM D, YYYY · hh:mm A"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
          }}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
              error: Boolean(error),
              helperText: error,
            },
            actionBar: {
              actions: ['today', 'accept'],
            },
            popper: {
              placement: 'bottom-end',
              modifiers: [
                {
                  name: 'flip',
                  options: {
                    fallbackPlacements: ['top-end', 'left-start', 'left'],
                  },
                },
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'viewport',
                    altAxis: true,
                    tether: false,
                    padding: 12,
                  },
                },
              ],
            },
            desktopPaper: {
              sx: {
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                '& .MuiDateCalendar-root': {
                  height: 290,
                  maxHeight: 290,
                },
                '& .MuiTimeClock-root': {
                  maxHeight: 260,
                },
                '& .MuiPickersActionBar-root': {
                  py: 0.75,
                  px: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                },
              },
            },
          }}
        />

        <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {QUICK_PRESETS.map((preset) => (
            <Chip
              key={preset.label}
              label={preset.label}
              size="small"
              variant="outlined"
              onClick={() => handleChange(preset.build())}
            />
          ))}
        </Stack>
      </Stack>
    </LocalizationProvider>
  )
}
