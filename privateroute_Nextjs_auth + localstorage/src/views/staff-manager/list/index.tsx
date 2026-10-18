'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

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

  // const updatedFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ''))
  // updatedFilters.role = RoleType.MANAGER_STAFF

  const getLeadListing = {
    ModuleName: RoleType.MANAGER_STAFF,
    ApiData: { url: userAPI.getUserListing, configParam: { params: { ...filters, role: RoleType.MANAGER_STAFF } } }
  }
  const { data, isLoading, isFetched, isError, error, refetch } = useQueryList(getLeadListing)

  // useEffect(() => {
  //   refetch()
  // }, [filters])

  if (isLoading) return <APILoader isLoading={isLoading} />

  return (
    <Grid container spacing={6}>
      {/* <Grid size={{ xs: 12 }}>
        <UserListCards />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <UserListTable filters={filters} setFilters={setFilters} tableData={data} />
      </Grid>
    </Grid>
  )
}

export default UserList
