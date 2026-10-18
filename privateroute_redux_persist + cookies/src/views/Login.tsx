'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

// Third-party Imports
// import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty, regex } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'
import type { AppDispatch, RootState } from '@/redux-store'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { Auth } from '@/API/API'
import { toast } from 'react-toastify'
import APILoader from '@/components/loader/APILoader'
import { useDispatch } from 'react-redux'
import { setLoggedUser } from '@/redux-store/slices/loggedInUserSlice'
import Cookies from 'js-cookie'

// Styled Custom Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 680,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

type FormData = InferInput<typeof schema>

const schema = object({
  // email: pipe(string(), nonEmpty('This field is required'), email('Email is invalid')),
  mobileNo: pipe(string(), nonEmpty('This field is required'), minLength(10, 'At least 10 digit required.')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(8, 'Your password must have 8 characters or more.'),
    regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[a-zA-Z\d@$!%*?&#]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.'
    )
  )
})

const Login = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Vars
  const darkImg = `${process.env.NEXT_PUBLIC_BASEPATH ?? ''}/images/pages/auth-mask-dark.png`
  const lightImg = `${process.env.NEXT_PUBLIC_BASEPATH ?? ''}/images/pages/auth-mask-light.png`
  const darkIllustration = `${process.env.NEXT_PUBLIC_BASEPATH ?? ''}/images/illustrations/auth/v2-login-dark.png`
  const lightIllustration = `${process.env.NEXT_PUBLIC_BASEPATH ?? ''}/images/illustrations/auth/v2-login-light.png`
  const borderedDarkIllustration = `${process.env.NEXT_PUBLIC_BASEPATH ?? ''}/images/illustrations/auth/v2-login-dark-border.png`
  const borderedLightIllustration = `${process.env.NEXT_PUBLIC_BASEPATH ?? ''}/images/illustrations/auth/v2-login-light-border.png`

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()

  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      mobileNo: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (formdata: FormData) => {
    setIsLoading(true)
    // const res = await signIn('credentials', {
    //   email: data.email,
    //   password: data.password,
    //   redirect: false
    // })
    const payload = { mobileNo: formdata.mobileNo, password: formdata.password }
    const { status, data } = await makeApiCall(HttpVerb.POST, Auth.Login, payload)
    if (status) {
      const redirectURL = searchParams.get('redirectTo') ?? '/'
      // console.log('redirectURL::', redirectURL)
      Cookies.set('userToken', data?.access_token) // used for api call authorization
      Cookies.set('role', data?.user?.role) // used for middleware of route protection
      dispatch(setLoggedUser(data?.user)) // used in the application in client component
      router.replace(redirectURL) // redirect to same url from where logout
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <APILoader isLoading={isLoading} />
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <LoginIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </div>
          {/* <Alert icon={false} className='bg-[var(--mui-palette-primary-lightOpacity)]'>
            <Typography variant='body2' color='primary.main'>
              Email: <span className='font-medium'>admin@vuexy.com</span> / Pass:{' '}
              <span className='font-medium'>admin</span>
            </Typography>
          </Alert> */}
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <Controller
              name='mobileNo'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  type='text'
                  label='Mobile Number'
                  placeholder='Enter your mobile number'
                  onChange={e => {
                    field.onChange(e.target.value)
                  }}
                  {...(errors.mobileNo && {
                    error: true,
                    helperText: errors?.mobileNo?.message
                  })}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Password'
                  placeholder='············'
                  id='login-password'
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={e => {
                    field.onChange(e.target.value)
                    errorState !== null && setErrorState(null)
                  }}
                  {...(errors.password && { error: true, helperText: errors.password.message })}
                />
              )}
            />
            {/* <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'> */}
            <div className='flex justify-end items-center gap-x-3 gap-y-1 flex-wrap'>
              {/* <FormControlLabel control={<Checkbox defaultChecked />} label='Remember me' /> */}
              {/* <Typography
                className='text-end'
                color='primary.main'
                component={Link}
                href={'/forgot-password'}
              >
                Forgot password?
              </Typography> */}
            </div>
            <Button fullWidth variant='contained' disabled={isLoading} type='submit'>
              Login
            </Button>
            {/* <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} href={'/register'} color='primary.main'>
                Create an account
              </Typography>
            </div> */}
            {/* <Divider className='gap-2'>or</Divider>
            <Button
              color='secondary'
              className='self-center text-textPrimary'
              startIcon={
                <img
                  src={`${process.env.NEXT_PUBLIC_BASEPATH ?? ''}/images/logos/google.png`}
                  alt='Google'
                  width={22}
                />
              }
              sx={{ '& .MuiButton-startIcon': { marginInlineEnd: 3 } }}
              // onClick={() => signIn('google')}
            >
              Sign in with Google
            </Button> */}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
