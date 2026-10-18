'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { leadListingType } from '@/types/lead'

// Component Imports
import LeadListTable from './LeadListTable'
import APILoader from '@/components/loader/APILoader'
import { leadAPI } from '@/API/API'
import useQueryList from '@/hooks/useQueryList'

const LeadList = () => {
  const [filters, setFilters] = useState({
    leadStatus: '',
    search: '',
    pageSize: 10,
    page: 1
  })

  // const updatedFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ''))

  const getLeadListing = {
    ModuleName: 'Lead',
    ApiData: { url: leadAPI.getLeadListing, configParam: { params: { ...filters } } }
  }
  const { data, isLoading, isFetched, isError, error, refetch } = useQueryList(getLeadListing)

  // useEffect(() => {
  //   refetch()
  // }, [filters])

  if (isLoading) return <APILoader isLoading={isLoading} />

  return (
    <Grid container spacing={6}>
      {/* <Grid size={{ xs: 12 }}>
        <LeadListCards />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <LeadListTable filters={filters} setFilters={setFilters} tableData={data} />
      </Grid>
    </Grid>
  )
}

export default LeadList
