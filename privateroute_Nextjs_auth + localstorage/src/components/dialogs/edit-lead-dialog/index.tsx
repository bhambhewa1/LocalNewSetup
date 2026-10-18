'use client'

// React Imports
import { SyntheticEvent, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { MenuItem } from '@mui/material'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import APILoader from '@/components/loader/APILoader'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { leadAPI } from '@/API/API'
import { toast } from 'react-toastify'
import useMutateList from '@/hooks/useMutateList'
import { Controller, useForm } from 'react-hook-form'
import { leadStatus } from '@/utils/constants'

import type { leadDataType } from '@/types/lead'
import { useSession } from 'next-auth/react'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data: leadDataType
}

const AddEditLeadDialog = ({ open, setOpen, data }: Props) => {
  // States
  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState<any>(null)
  const user = useSession()?.data?.user

  const reactMutation = useMutateList()

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<leadDataType>({
    defaultValues: { ...data }
  })

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = async (formData: leadDataType) => {
    const updatedFormData = {
      ...formData,
      organization: user?.organization?._id,
      address: formData?.address ? formData?.address : undefined, // once address submit after that user can update address,not to remove
      email: formData?.email ? formData?.email : undefined // once email submit after that user can update the email,not to remove
    }
    setIsLoading(true)
    const addProperty = {
      ModuleName: 'Lead',
      ApiData: {
        method: HttpVerb.POST,
        url: leadAPI.createLead,
        payload: updatedFormData,
        contentType: 'application/json'
      }
    }
    try {
      await reactMutation.mutateAsync(addProperty)
      toast.success(`Lead added successfully!`)
      handleClose()
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='lg'
      scroll='body'
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <APILoader isLoading={isLoading} />
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {data?._id ? 'Edit Lead Details' : 'Create Lead'}
      </DialogTitle>
      <form autoComplete='off' onReset={() => reset({ ...data })} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstname'
                control={control}
                rules={{ required: true }}
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
          </Grid>
        </DialogContent>
        <DialogActions className='pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' disabled={isLoading} type='submit'>
            Submit
          </Button>
          <Button variant='contained' color='error' disabled={isLoading} onClick={handleClose}>
            Cancel
          </Button>
          {/* <Button variant='tonal' color='secondary' type='reset' disabled={isLoading}>
            Reset
          </Button> */}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddEditLeadDialog
