// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { leadStatus } from '@/utils/constants'

const TableFilters = ({
  filters,
  setFilters
}: {
  filters: { leadStatus: string; search: string; pageSize: number; page: number }
  setFilters: (filters: { leadStatus: string; search: string; pageSize: number; page: number }) => void
}) => {
  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            select
            fullWidth
            id='select-leadStatus'
            value={filters.leadStatus}
            onChange={e => setFilters({ ...filters, leadStatus: e.target.value, page: 1 })}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Lead Status</MenuItem>
            {leadStatus.map(({ key, label }: { key: string; label: string }) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
