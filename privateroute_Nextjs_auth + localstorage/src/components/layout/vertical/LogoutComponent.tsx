'use client'
import React from 'react'
import { Button, styled, Typography } from '@mui/material'
import { signOut, useSession } from 'next-auth/react'

const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

const LogoutComponent = () => {
  const { data: session, status } = useSession()

  const handleUserLogout = async () => {
    try {
      // Sign out from the app
      localStorage.clear()
      await signOut()
      // await signOut({ callbackUrl: '/login' })
      // await signOut({ redirect: false }) // sign out and don't redirect
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
          {(session?.user?.firstname || '') + ' ' + (session?.user?.lastname || '')}
        </Typography>
        <Typography className='font-medium' color='text.primary'>
          {session?.user?.role}
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
