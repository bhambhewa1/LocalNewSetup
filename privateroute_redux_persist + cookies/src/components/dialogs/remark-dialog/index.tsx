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
import useMutateList from '@/hooks/useMutateList'
import { HttpVerb } from '@/API/APICall'
import { leadTimeline } from '@/API/API'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'
import APILoader from '@/components/loader/APILoader'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux-store'

type RemarkProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const RemarkDialog = ({ open, setOpen }: RemarkProps) => {
  // States
  const params = useParams()
  const leadId = Array.isArray(params?.id) ? params?.id[0] : params?.id
  const [message, setMessage] = useState<string>('')
  const [errorState, setErrorState] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state: RootState) => state?.loggedUserReducer.loggedUser)

  const reactMutation = useMutateList()

  const handleClose = () => {
    setOpen(false)
  }

  const handleReset = () => {
    setMessage('')
    setErrorState(null)
  }

  const handleSubmit = async () => {
    if (!message) {
      setErrorState({ message: 'Remark is required' })
      return
    }
    setIsLoading(true)
    const payloadData = {
      ModuleName: 'Timeline',
      ApiData: {
        method: HttpVerb.POST,
        url: leadTimeline.create,
        payload: { message },
        configParam: { params: { leadId, userId: user?._id } }
      },
      ItemId: leadId
    }
    try {
      await reactMutation.mutateAsync(payloadData)
      toast.success('Message submitted successfully!')
      handleReset()
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
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Add Remark
        {/* <Typography component='span' className='flex flex-col text-center'>
          Updating a user details.
        </Typography> */}
      </DialogTitle>
      <APILoader isLoading={isLoading} />
      <form onSubmit={e => e.preventDefault()}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <CustomTextField
                name='message'
                label='Remark'
                fullWidth
                multiline
                rows={6}
                placeholder='write your message here...'
                value={message}
                onChange={e => {
                  setMessage(e.target.value)
                  errorState !== null && setErrorState(null)
                }}
                {...(errorState !== null && { error: errorState !== null, helperText: errorState?.message })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleReset}>
            Reset
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RemarkDialog
