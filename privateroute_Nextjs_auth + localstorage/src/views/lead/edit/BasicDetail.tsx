'use client'

// React Imports
import { SyntheticEvent, useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Card, CardContent, CardHeader, MenuItem } from '@mui/material'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import APILoader from '@/components/loader/APILoader'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { leadAPI } from '@/API/API'
import { toast } from 'react-toastify'
import useMutateList from '@/hooks/useMutateList'
import { Controller, useForm } from 'react-hook-form'
import { leadStatus, RoleType } from '@/utils/constants'

import type { leadDataType } from '@/types/lead'
import useQueryList from '@/hooks/useQueryList'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

const initialData: leadDataType = {
  firstname: '',
  lastname: '',
  email: '',
  mobileNo: '',
  leadStatus: '',
  address: ''
}

const BasicDetail = () => {
  // States
  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState<any>(null)
  const params = useParams()
  const leadId = Array.isArray(params?.id) ? params?.id[0] : params?.id
  const role = useSession()?.data?.user?.role

  const getLead = {
    ModuleName: 'Lead',
    ApiData: { url: leadAPI.getLead + `/${leadId}` },
    isSingleItemFetch: true,
    ItemId: leadId
  }
  const { data, isLoading: queryLoading, isFetched, isError, error, refetch } = useQueryList(getLead)
  const reactMutation = useMutateList()

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<leadDataType>({
    defaultValues: { ...initialData, ...data }
  })

  const onSubmit = async (formData: leadDataType) => {
    const updatedFormData = {
      ...formData,
      address: formData?.address ? formData?.address : undefined,
      email: formData?.email ? formData?.email : undefined
    }
    setIsLoading(true)
    const updateProperty = {
      ModuleName: 'Lead',
      ApiData: {
        method: HttpVerb.PUT,
        url: leadAPI.updateLead + `/${formData._id}`,
        payload: updatedFormData,
        contentType: 'application/json'
      },
      ItemId: formData?._id
    }
    try {
      await reactMutation.mutateAsync(updateProperty)
      toast.success(`Lead updated successfully!`)
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    reset(data)
  }, [data])

  return (
    <Card>
      <CardHeader title='Basic Information' />
      <CardContent className='flex flex-col gap-4'>
        <APILoader isLoading={isLoading} />
        <form autoComplete='off' onReset={() => reset({ ...data })} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstname'
                control={control}
                rules={{ required: true }}
                disabled={role !== RoleType.MANAGER_STAFF}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label={
                      <p>
                        First Name <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Enter first name'
                    {...(errors?.firstname && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastname'
                control={control}
                rules={{ required: true }}
                disabled={role !== RoleType.MANAGER_STAFF}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label={
                      <p>
                        Last Name <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Enter last name'
                    {...(errors?.lastname && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='mobileNo'
                control={control}
                rules={{ required: true }}
                disabled={role !== RoleType.MANAGER_STAFF}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label={
                      <p>
                        Mobile Number <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Enter mobile number'
                    {...(errors?.mobileNo && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='email'
                control={control}
                disabled={role !== RoleType.MANAGER_STAFF}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='email'
                    label='Email'
                    placeholder='Enter email'
                    // {...(errors?.email && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='address'
                control={control}
                disabled={role !== RoleType.MANAGER_STAFF}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label='Address'
                    placeholder='Enter lead address'
                    {...(errors?.address && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='leadStatus'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    id='select-leadStatus'
                    label={
                      <p>
                        Select Lead Status <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Select leadStatus'
                    {...field}
                    {...(errors.leadStatus && { error: true, helperText: 'This field is required.' })}
                  >
                    {/* <MenuItem value=''>Select Furnished Status</MenuItem> */}
                    {leadStatus.map(({ key, label }: { key: string; label: string }) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }} className='flex gap-5'>
              {/* <Button variant='contained' disabled={isLoading} type='submit'>
              Submit
              </Button>
              <Button variant='tonal' color='secondary' type='reset' disabled={isLoading}>
              Reset
              </Button> */}
              <Button variant='contained' disabled={isLoading} type='submit'>
                Save Changes
              </Button>
              <Button variant='contained' color='warning' disabled={isLoading} type='reset'>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default BasicDetail
