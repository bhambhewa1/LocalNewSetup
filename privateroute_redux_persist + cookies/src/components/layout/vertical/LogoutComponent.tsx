'use client'
import React from 'react'
import { Button, styled, Typography } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { clearLoggedUser } from '@/redux-store/slices/loggedInUserSlice'
import { persistor, type RootState } from '@/redux-store'
import Cookies from 'js-cookie'

const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const LogoutComponent = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state?.loggedUserReducer.loggedUser)
  const pathname = usePathname()

  const handleUserLogout = async () => {
    try {
      // Sign out from the app
      // dispatch(clearLoggedUser()) // Clear Redux state when AuthGuard use cookies otherwise purge()
      persistor.purge() // or persistor.flush() if you only want to persist now-updated state
      Cookies.remove('userToken')
      Cookies.remove('role')
      router.replace(`/login?redirectTo=${pathname}`) // after login redirect to same route
    } catch (error) {
      console.error(error)

      // Show above error in a toast like following
      // toastService.error((err as Error).message)
    }
  }

  return (
    <div className='flex flex-col plb-2 pli-3'>
      <div className='flex justify-between'>
        <Typography className='font-medium mb-1' color='text.primary'>
          {(user?.firstname || '') + ' ' + (user?.lastname || '')}
        </Typography>
        <Typography className='font-medium' color='text.primary'>
          {user?.role}
        </Typography>
        {/* <BadgeContentSpan /> */}
      </div>
      <Button
        fullWidth
        variant='contained'
        color='warning'
        // size='small'
        endIcon={<i className='tabler-logout' />}
        onClick={handleUserLogout}
        sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
      >
        Logout
      </Button>
    </div>
  )
}

export default LogoutComponent
