'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import { appsManagementAPI, Auth } from '@/API/API'
import useQueryList from '@/hooks/useQueryList'
import useMutateList from '@/hooks/useMutateList'
import { HttpVerb } from '@/API/APICall'
import { toast } from 'react-toastify'
import APILoader from '@/components/loader/APILoader'
import { email, forward, minLength, nonEmpty, object, partialCheck, pipe, regex, string } from 'valibot'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { Divider, FormControlLabel, Switch } from '@mui/material'

type EditUserInfoData = {
  _id?: string
  firstname?: string
  lastname?: string
  email?: string
  newPassword?: string
  confirmPassword?: string
}

type EditUserInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  viewMode?: boolean
  data?: EditUserInfoData
}

const getSchema = (requirePassword: boolean) => {
  // Always-required fields
  const baseSchema: Record<string, any> = {
    firstname: pipe(string(), nonEmpty('This field is required')),
    lastname: pipe(string(), nonEmpty('This field is required')),
    email: pipe(string(), nonEmpty('This field is required'), email('Email is invalid'))
  }

  if (!requirePassword) {
    return object(baseSchema)
  }

  // Only apply password match check if password is required
  return pipe(
    object({
      ...baseSchema,
      newPassword: pipe(
        string(),
        nonEmpty('Please enter your new password.'),
        minLength(8, 'Your password must have 8 characters or more.'),
        regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[a-zA-Z\d@$!%*?&#]{8,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.'
        )
      ),
      confirmPassword: pipe(
        string(),
        nonEmpty('Please enter your confirm password.'),
        minLength(8, 'Your password must have 8 characters or more.'),
        regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[a-zA-Z\d@$!%*?&#]{8,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.'
        )
      )
    }),
    forward(
      partialCheck(
        [['newPassword'], ['confirmPassword']],
        input => input.newPassword === input.confirmPassword,
        'The passwords do not match.'
      ),
      ['confirmPassword']
    )
  )
}

const EditUserInfo = ({ open, setOpen, viewMode, data }: EditUserInfoProps) => {
  const userData = { ...data, newPassword: '', confirmPassword: '' }
  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState<any>(null)
  const [changePassword, setChangePassword] = useState(false)

  const reactMutation = useMutateList()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EditUserInfoData>({
    resolver: valibotResolver(getSchema(changePassword) as any),
    defaultValues: { ...userData }
  })

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = async (formData: EditUserInfoData) => {
    setIsLoading(true)
    const formattedUser = {
      firstname: formData?.firstname,
      lastname: formData?.lastname,
      email: formData?.email,
      password: changePassword ? formData?.confirmPassword : undefined
    }
    // console.log('next dAta:', formattedUser)
    const payloadData = {
      ModuleName: 'Admins',
      ApiData: {
        method: HttpVerb.PUT,
        url: appsManagementAPI.updateAdmin + `/${userData?._id}`,
        payload: formattedUser
      },
      ItemId: userData?._id
    }
    try {
      await reactMutation.mutateAsync(payloadData)
      toast.success('Admin detail updated successfully!')
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
      maxWidth='md'
      scroll='body'
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <APILoader isLoading={isLoading} />
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {viewMode ? 'View' : 'Edit'} Administrator Information
        <Typography component='span' className='flex flex-col text-center'>
          {viewMode ? 'Showing a administrator details.' : 'Updating a administrator details.'}
        </Typography>
      </DialogTitle>
      <form noValidate autoComplete='off' onReset={() => reset({ ...userData })} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='firstname'
                control={control}
                disabled={viewMode}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    type='text'
                    label='First Name'
                    placeholder='Enter your first name'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...(errors.firstname && { error: true, helperText: errors?.firstname?.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='lastname'
                control={control}
                disabled={viewMode}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    type='text'
                    label='Last Name'
                    placeholder='Enter your last name'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...(errors.lastname && { error: true, helperText: errors?.lastname?.message })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='email'
                control={control}
                disabled={viewMode}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    type='email'
                    label='Email'
                    placeholder='Enter your email'
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    {...(errors.email && { error: true, helperText: errors?.email?.message || errorState?.message[0] })}
                  />
                )}
              />
            </Grid>

            {!viewMode && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={changePassword}
                        onChange={e => {
                          setChangePassword(e.target.checked)
                          reset({ ...control._formValues, newPassword: '', confirmPassword: '' }) // re-run validation and reset with new schema
                        }}
                      />
                    }
                    label='Do you want to change the password?'
                  />
                  <Divider sx={{ flexGrow: 1 }} />
                </div>

                {changePassword && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name='newPassword'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='New Password'
                            placeholder='············'
                            id='new-password'
                            type='password'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...(errors.newPassword && { error: true, helperText: errors.newPassword.message })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Controller
                        name='confirmPassword'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label='Confirm Password'
                            placeholder='············'
                            id='confirm-password'
                            type='password'
                            onChange={e => {
                              field.onChange(e.target.value)
                              errorState !== null && setErrorState(null)
                            }}
                            {...(errors.confirmPassword && { error: true, helperText: errors.confirmPassword.message })}
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          {!viewMode && (
            <>
              <Button variant='contained' disabled={isLoading} type='submit'>
                Submit
              </Button>
              <Button variant='tonal' color='secondary' type='reset' disabled={isLoading}>
                Reset
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditUserInfo
