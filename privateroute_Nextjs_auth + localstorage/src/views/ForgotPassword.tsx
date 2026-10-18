'use client'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import { SyntheticEvent, useState } from 'react'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { Auth } from '@/API/API'
import { toast } from 'react-toastify'
import APILoader from '@/components/loader/APILoader'

// Styled Custom Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 650,
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

const ForgotPassword = ({ mode }: { mode: SystemMode }) => {
  // Vars
  const darkImg = `${process.env.NEXT_PUBLIC_BASEPATH ?? ''}/images/pages/auth-mask-dark.png`
  const lightImg = `${process.env.NEXT_PUBLIC_BASEPATH ?? ''}/images/pages/auth-mask-light.png`
  const darkIllustration = `${process.env.NEXT_PUBLIC_BASEPATH ?? ''}/images/illustrations/auth/v2-forgot-password-dark.png`
  const lightIllustration = `${process.env.NEXT_PUBLIC_BASEPATH ?? ''}/images/illustrations/auth/v2-forgot-password-light.png`

  // Hooks
  const [errorState, setErrorState] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)
  const [email, setEmail] = useState('')

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    if (errorState !== null) {
      return
    }
    if (!email) {
      setErrorState({ email: 'Email is required' })
      return
    }
    setIsLoading(true)
    const payload = { email: email, resetPageUrl: window.location.origin + '/reset-password' }
    const { hasErrors, status, data, sessionId, errors } = await makeApiCall(
      HttpVerb.POST,
      Auth.ForgotPassword,
      payload
    )
    if (status && !hasErrors) {
      toast.success('Reset link sent to your email successfully')
      setIsLoading(false)
      setEmail('')
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
        <ForgotPasswordIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link
          href={'/login'}
          className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'
        >
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Forgot Password 🔒</Typography>
            <Typography>Enter your email and we&#39;ll send you instructions to reset your password</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={onSubmit} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label='Email'
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e?.target?.value)
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (e?.target?.value && !emailRegex.test(e.target.value)) {
                  setErrorState({ email: 'Email is invalid' })
                } else {
                  setErrorState(null)
                }
              }}
              placeholder='Enter your email'
              {...(errorState !== null && { error: errorState !== null, helperText: errorState?.email })}
            />
            <Button fullWidth variant='contained' disabled={isLoading} type='submit'>
              Send Reset Link
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
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
