'use client'
import React, { useEffect, useLayoutEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import { Typography } from '@mui/material'
import PropertyListTable from './PropertyListTable'
import useQueryList from '@/hooks/useQueryList'
import { propertyAPI } from '@/API/API'
import APILoader from '@/components/loader/APILoader'
import { HttpVerb, makeApiCall } from '@/API/APICall'

const AppsManagement = () => {
  // const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    propertyType: '',
    listingType: '',
    status: '',
    search: '',
    pageSize: 10,
    page: 1
  })
  // const [data, setData] = useState<any>({})

  // const getPropertyListing = async () => {
  //   const updatedFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ''))
  //   setIsLoading(true)
  //   const { status, data } = await makeApiCall(HttpVerb.GET, propertyAPI.getPropertyListing, {}, 'application/json', {
  //     params: updatedFilters
  //   })
  //   if (status) {
  //     setData(data)
  //   }
  //   setIsLoading(false)
  // }

  // useEffect(() => {
  //   getPropertyListing()
  // }, [filters])

  // const updatedFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ''))

  const getPropertyListing = {
    ModuleName: 'Property',
    ApiData: { url: propertyAPI.getPropertyListing, configParam: { params: { ...filters } } }
  }
  const { data, isLoading, isFetched, isError, error, refetch } = useQueryList(getPropertyListing)

  // useEffect(() => {
  //   refetch()
  // }, [filters])

  if (isLoading) return <APILoader isLoading={isLoading} />

  return (
    <>
      {/* <APILoader isLoading={isLoading} /> */}
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <PropertyListTable filters={filters} setFilters={setFilters} tableData={data} />
        </Grid>
      </Grid>
    </>
  )
}

export default AppsManagement
