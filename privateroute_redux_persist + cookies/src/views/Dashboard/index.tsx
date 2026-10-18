'use client'
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { dashboardAPI } from '@/API/API'
import APILoader from '@/components/loader/APILoader'
import ListCards from './ListCards'
import useQueryList from '@/hooks/useQueryList'

const Dashboard = () => {
  // const [isLoading, setIsLoading] = useState(false)
  // const [data, setData] = useState({})
  const getDashboard = {
    ModuleName: 'Dashboard',
    ApiData: { url: dashboardAPI.getDashboard }
  }
  const { data, isLoading, isFetched, isError, error } = useQueryList(getDashboard)

  // const getDashboard = async () => {
  //   setIsLoading(true)
  //   const { status, data } = await makeApiCall(HttpVerb.GET, dashboardAPI.getDashboard)
  //   if (status) {
  //     setData(data)
  //   }
  //   setIsLoading(false)
  // }

  // useEffect(() => {
  //   getDashboard()
  // }, [])

  return (
    <>
      <APILoader isLoading={isLoading} />
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>{/* <UserListCards data={dashboardData} /> */}</Grid>
        <Grid size={{ xs: 12 }}>
          <ListCards data={data} />
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard
