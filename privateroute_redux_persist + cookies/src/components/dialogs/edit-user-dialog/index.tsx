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

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import APILoader from '@/components/loader/APILoader'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { userAPI } from '@/API/API'
import { toast } from 'react-toastify'
import useMutateList from '@/hooks/useMutateList'
import {
  boolean,
  custom,
  email,
  forward,
  minLength,
  nonEmpty,
  object,
  optional,
  partialCheck,
  pipe,
  regex,
  string
} from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { InferInput } from 'valibot'
import type { userDataType } from '@/types/user'
import { Controller, useForm } from 'react-hook-form'
import { RoleType, showUserStatus, UserStatus } from '@/utils/constants'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux-store'
import { MenuItem } from '@mui/material'

const allowNonEmptyEmail = () => {
  return pipe(
    string(),
    custom(value => {
      if (typeof value !== 'string') return false // Type guard
      if (!value.trim()) return true // Allow empty string
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }, 'Please enter a valid email address.')
  )
}

const allowNonEmptyPassword = () => {
  return pipe(
    string(),
    custom(value => {
      if (typeof value !== 'string') return false

      if (!value.trim()) return true // Allow empty string

      const isLongEnough = value.length >= 8
      const isStrongEnough = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)

      return isLongEnough && isStrongEnough
    }, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
  )
}

const getPasswordSchema = (isEditMode: boolean) => {
  return pipe(
    string(),
    custom(value => {
      if (typeof value !== 'string') return false

      if (isEditMode) {
        // If in edit mode, allow empty password field (for existing users)
        if (!value.trim()) return true
      } else {
        // If not in edit mode (for new users), make the password required
        if (!value.trim()) return false
      }
      const isLongEnough = value.length >= 8
      const isStrongEnough = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)
      return isLongEnough && isStrongEnough
    }, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
  )
}

const getStatusSchema = (isStatusRequired: boolean) => {
  const base = string()
  return isStatusRequired
    ? pipe(
        base,
        custom(value => {
          if (typeof value !== 'string') return false // Type guard
          return !!value.trim()
        }, 'This field is required.')
      )
    : optional(base) // Mark as optional explicitly
}

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data: userDataType
}

const AddEditUserDialog = ({ open, setOpen, data }: Props) => {
  // States
  const [isLoading, setIsLoading] = useState(false)
  const [isHidePassword, setIsHidePassword] = useState(true)
  const reactMutation = useMutateList()
  const user = useSelector((state: RootState) => state?.loggedUserReducer.loggedUser)

  const schema = object({
    firstname: pipe(string(), nonEmpty('This field is required.')),
    lastname: pipe(string(), nonEmpty('This field is required.')),
    mobileNo: pipe(string(), nonEmpty('This field is required'), minLength(10, 'At least 10 digit required.')),
    email: allowNonEmptyEmail(),
    password: getPasswordSchema(Boolean(data?._id)), // Dynamically set password validation based on whether it's a new user or not
    status: getStatusSchema(Boolean(data?.status && data?.status !== UserStatus.ACTIVE))
  })

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<userDataType>({
    resolver: valibotResolver(schema),
    defaultValues: { ...data }
  })

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = async (formData: userDataType) => {
    const updateFormData = {
      ...formData,
      organization: user?.organization?._id,
      email: formData?.email ? formData?.email : undefined, // once email submit after that user can update the email,not to remove
      password: formData?.password && !data?._id ? formData?.password : undefined, // once password submit after that user can update password,not to remove
      role: data?.role
    }
    setIsLoading(true)
    const addUser = {
      ModuleName: data?.role as RoleType,
      ApiData: {
        method: HttpVerb.POST,
        url: userAPI.createUser,
        payload: updateFormData,
        contentType: 'application/json'
      },
      OtherEffectedModules: [data?.role as RoleType]
    }
    const updateUser = {
      ModuleName: data?.role as RoleType,
      ApiData: {
        method: HttpVerb.PUT,
        url: userAPI.updateUser + `/${data._id}`,
        payload: updateFormData,
        contentType: 'application/json'
      },
      ItemId: data?._id,
      OtherEffectedModules: [data?.role as RoleType]
    }
    try {
      await reactMutation.mutateAsync(data?._id ? updateUser : addUser)
      toast.success(`${data?._id ? 'Updated' : 'Added'} ${data?.role?.toLowerCase()} successfully!`)
      handleClose()
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    reset(data)
  }, [data])

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
        {data?._id ? `Edit Details` : `Create New`}
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
                    {...(errors.firstname && { error: true, helperText: errors.firstname.message })}
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
                    {...(errors?.lastname && { error: true, helperText: errors.lastname.message })}
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
                    {...(errors?.mobileNo && { error: true, helperText: errors.mobileNo.message })}
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
                    {...(errors?.email && { error: true, helperText: errors.email.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type={isHidePassword ? 'password' : 'text'}
                    label={<p>Password {!data?._id && <span className='text-red-500'>*</span>}</p>}
                    placeholder='password'
                    endIcon={
                      isHidePassword ? (
                        <i className='tabler-eye-closed cursor-pointer' onClick={() => setIsHidePassword(false)} />
                      ) : (
                        <i className='tabler-eye cursor-pointer' onClick={() => setIsHidePassword(true)} />
                      )
                    }
                    // {...(errors?.password && { error: true, helperText: 'This field is required.' })}
                    {...(errors.password && { error: true, helperText: errors?.password?.message })}
                  />
                )}
              />
            </Grid>
            {data?.status && data?.status !== UserStatus.ACTIVE && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='status'
                  control={control}
                  // rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      select
                      fullWidth
                      id='select-status'
                      label={
                        <p>
                          Select Status <span className='text-red-500'>*</span>
                        </p>
                      }
                      placeholder='Select Status'
                      {...field}
                      {...(errors.status && { error: true, helperText: 'This field is required.' })}
                    >
                      <MenuItem value={UserStatus.ACTIVE}>{showUserStatus[UserStatus.ACTIVE]}</MenuItem>
                      <MenuItem value={UserStatus.TEMP_INACTIVE}>{showUserStatus[UserStatus.TEMP_INACTIVE]}</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
            )}
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

export default AddEditUserDialog
