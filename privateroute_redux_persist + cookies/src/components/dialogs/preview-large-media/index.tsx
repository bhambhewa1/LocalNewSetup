'use client'

// React Imports
import { SyntheticEvent, useState } from 'react'
import Image from 'next/image'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import { MediaType } from '@/utils/constants'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  media: { type: string; url: string }
}
const PreviewLargeMediaDialog = ({ open, setOpen, media }: Props) => {
  const handleClose = () => {
    setOpen(false)
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
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {media.type === MediaType.IMAGE ? 'Preview Image' : 'Preview Video'}
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        {media.type === MediaType.IMAGE ? (
          <Image src={media.url} alt='Preview' className='w-full' layout='responsive' width={100} height={100} />
        ) : (
          <video controls style={{ maxWidth: '100%', maxHeight: '80vh' }}>
            <source src={media.url} />
            Your browser does not support the video tag.
          </video>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PreviewLargeMediaDialog
