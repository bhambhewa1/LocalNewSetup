// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { listingType, propertyStatus, propertyType } from '@/utils/constants'

const TableFilters = ({
  filters,
  setFilters
}: {
  filters: { propertyType: string; listingType: string; status: string; search: string; pageSize: number; page: number }
  setFilters: (filters: {
    propertyType: string
    listingType: string
    status: string
    search: string
    pageSize: number
    page: number
  }) => void
}) => {
  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-propertyType'
            value={filters.propertyType}
            onChange={e => setFilters({ ...filters, propertyType: e.target.value, page: 1 })}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Property Type</MenuItem>
            {propertyType.map(({ key, label }: { key: string; label: string }) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-listingType'
            value={filters.listingType}
            onChange={e => setFilters({ ...filters, listingType: e.target.value, page: 1 })}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Listing Type</MenuItem>
            {listingType.map(({ key, label }: { key: string; label: string }) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <CustomTextField
            select
            fullWidth
            id='select-propertyStatus'
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value, page: 1 })}
            slotProps={{
              select: { displayEmpty: true }
            }}
          >
            <MenuItem value=''>Select Property Status</MenuItem>
            {propertyStatus.map(({ key, label }: { key: string; label: string }) => (
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
