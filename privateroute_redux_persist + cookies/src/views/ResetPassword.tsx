'use client'

// React Imports
import { SyntheticEvent, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Styled Component Imports
import AuthIllustrationWrapper from '@/components/auth/AuthIllustrationWrapper'
import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { object, string, pipe, nonEmpty, minLength, regex, forward, partialCheck } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { InferInput } from 'valibot'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { Auth } from '@/API/API'
import { toast } from 'react-toastify'
import APILoader from '@/components/loader/APILoader'

type FormData = InferInput<typeof schema>

const schema = pipe(
  object({
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

const ResetPassword = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<any>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [isLoading, setIsLoading] = useState(false)

  // Hooks

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (formdata: FormData) => {
    setIsLoading(true)
    const payload = { newPassword: formdata.confirmPassword, token }
    const { hasErrors, status, data, sessionId, errors } = await makeApiCall(HttpVerb.POST, Auth.ResetPassword, payload)
    if (status && !hasErrors) {
      toast.success('Password reset successfully, Kindly login')
      reset()
      setTimeout(() => {
        setIsLoading(false)
        router.replace('/login')
      }, 2000)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <AuthIllustrationWrapper>
      <APILoader isLoading={isLoading} />
      <Card className='flex flex-col sm:is-[450px] md:is-[500px]'>
        <CardContent className='sm:!p-12'>
          <Link href={'/'} className='flex justify-center mbe-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-1 mbe-6'>
            <Typography variant='h4'>Reset Password 🔒</Typography>
            <Typography>Your new password must be different from previously used passwords</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
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
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  endIcon={
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-closed'} />
                    </IconButton>
                  }
                  {...(errors.newPassword && { error: true, helperText: errors.newPassword.message })}
                />
              )}
            />

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
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...(errors.confirmPassword && { error: true, helperText: errors.confirmPassword.message })}
                />
              )}
            />

            <div className='flex flex-col gap-4'>
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
            </div>

            <Button fullWidth variant='contained' disabled={isLoading} type='submit'>
              Set New Password
            </Button>
            <Typography className='flex justify-center items-center' color='primary.main'>
              <Link href={'/login'} className='flex items-center gap-1.5'>
                <DirectionalIcon
                  ltrIconClass='tabler-chevron-left'
                  rtlIconClass='tabler-chevron-right'
                  className='text-xl'
                />
                <span>Back to login</span>
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </AuthIllustrationWrapper>
  )
}

export default ResetPassword
