'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

//Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { object, string, pipe, nonEmpty, minLength, regex, forward, partialCheck, email } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { InferInput } from 'valibot'
import Cookies from 'js-cookie'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { Auth } from '@/API/API'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import APILoader from '@/components/loader/APILoader'

type FormData = InferInput<typeof schema>

const schema = pipe(
  object({
    currentPassword: pipe(
      string(),
      nonEmpty('Please enter your current password.'),
      minLength(8, 'Your password must have 8 characters or more.'),
      regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[a-zA-Z\d@$!%*?&#]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.'
      )
    ),
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

const ChangePasswordCard = () => {
  // States
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false)
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState<any>()
  const router = useRouter()

  const handleClickShowCurrentPassword = () => setIsCurrentPasswordShown(!isCurrentPasswordShown)

  const handleClickShowNewPassword = () => setIsNewPasswordShown(!isNewPasswordShown)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (formdata: FormData) => {
    setIsLoading(true)
    const payload = {
      password: formdata.currentPassword,
      newPassword: formdata.confirmPassword,
      email: JSON.parse(Cookies.get('userInfo') || '{}')?.email
    }
    const { hasErrors, status, data, sessionId, errors } = await makeApiCall(
      HttpVerb.POST,
      Auth.ChangePassword,
      payload
    )
    if (status && !hasErrors) {
      toast.success('Password change successfully')
      reset()
      setTimeout(() => {
        setIsLoading(false)
        router.replace('/')
      }, 2000)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title='Change Password' />
      <CardContent>
        <APILoader isLoading={isLoading} />
        <form noValidate autoComplete='off' onReset={() => reset()} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='currentPassword'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='Current Password'
                    placeholder='············'
                    id='old-password'
                    type={isCurrentPasswordShown ? 'text' : 'password'}
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    endIcon={
                      <IconButton
                        edge='end'
                        onClick={handleClickShowCurrentPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isCurrentPasswordShown ? 'tabler-eye' : 'tabler-eye-closed'} />
                      </IconButton>
                    }
                    {...(errors.currentPassword && { error: true, helperText: errors.currentPassword.message })}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container className='mbs-6' spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='newPassword'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    label='New Password'
                    placeholder='············'
                    id='new-password'
                    type={isNewPasswordShown ? 'text' : 'password'}
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    endIcon={
                      <IconButton edge='end' onClick={handleClickShowNewPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={isNewPasswordShown ? 'tabler-eye' : 'tabler-eye-closed'} />
                      </IconButton>
                    }
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
            <Grid size={{ xs: 12 }} className='flex flex-col gap-4'>
              <Typography variant='h6'>Password Requirements:</Typography>
              <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-circle-filled text-[8px]' />
                  Minimum 8 characters long - the more, the better
                </div>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-circle-filled text-[8px]' />
                  At least one lowercase & one uppercase character
                </div>
                <div className='flex items-center gap-2.5'>
                  <i className='tabler-circle-filled text-[8px]' />
                  At least one number, symbol, and no whitespace character
                </div>
              </div>
            </Grid>
            <Grid size={{ xs: 12 }} className='flex gap-4'>
              <Button variant='contained' disabled={isLoading} type='submit'>
                Save Changes
              </Button>
              <Button variant='tonal' type='reset' disabled={isLoading} color='secondary'>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordCard
