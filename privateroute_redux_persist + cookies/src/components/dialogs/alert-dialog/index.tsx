'use client'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import DialogCloseButton from '../DialogCloseButton'

type AlertDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  iconName?: string
  message?: string
  handleConfirm: () => void
}

const AlertDialog = ({ open, setOpen, iconName, message, handleConfirm }: AlertDialogProps) => {
  // const reactMutation = useMutateList()

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirmation = async () => {
    handleConfirm()
    handleClose()
  }

  return (
    <Dialog
      fullWidth
      // maxWidth='md'
      scroll='body'
      open={open}
      onClose={handleClose}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='relative flex flex-col gap-2 text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {/* Trash Icon Positioned at the Top */}
        <div className='absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full shadow-lg px-2 py-1'>
          <i className={`${iconName} text-white text-6xl`} />
        </div>

        <Typography component='span' className='flex flex-col text-center'>
          Before proceeding...
        </Typography>
      </DialogTitle>
      <DialogContent className='text-center text-lg'>
        <div>{message}</div>
      </DialogContent>
      <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='contained' onClick={handleConfirmation}>
          Confirm
        </Button>
        <Button variant='tonal' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlertDialog
