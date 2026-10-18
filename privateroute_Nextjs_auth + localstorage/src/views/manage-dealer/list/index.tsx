'use client'

import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2' // Changed from Grid2 to standard Grid

// Component Imports
import UserListTable from './UserListTable'
import APILoader from '@/components/loader/APILoader'
import { userAPI } from '@/API/API'
import useQueryList from '@/hooks/useQueryList'
import { RoleType } from '@/utils/constants'

const UserList = () => {
  const [filters, setFilters] = useState({
    search: '',
    pageSize: 10,
    page: 1
  })

  // const updatedFilters = useMemo(() => {
  //   const filtered = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ''))
  //   return {
  //     ...filtered,
  //     role: RoleType.DEALER
  //   }
  // }, [filters])

  // const getLeadListing = {
  //   ModuleName: RoleType.DEALER,
  //   ApiData: { url: userAPI.getUserListing, configParam: { params: updatedFilters } }
  // }
  const getLeadListing = {
    ModuleName: RoleType.DEALER,
    ApiData: { url: userAPI.getUserListing, configParam: { params: { ...filters, role: RoleType.DEALER } } }
  }

  const { data, isLoading, isFetched, isError, error, refetch } = useQueryList(getLeadListing)

  // useEffect(() => {
  //   // refetch()
  // }, [filters])

  if (isLoading) return <APILoader isLoading={isLoading} />

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserListTable filters={filters} setFilters={setFilters} tableData={data} />
      </Grid>
    </Grid>
  )
}

export default UserList
