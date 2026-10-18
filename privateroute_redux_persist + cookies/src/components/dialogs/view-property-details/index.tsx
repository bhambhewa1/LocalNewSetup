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
import { Divider, ImageList, ImageListItem, ImageListItemBar, MenuItem, Typography } from '@mui/material'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import APILoader from '@/components/loader/APILoader'
import type { propertyListType } from '@/types/propety'
import { imageExtensions, MediaType, videoExtensions } from '@/utils/constants'
import PreviewLargeMediaDialog from '../preview-large-media'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data: propertyListType
}
const ViewPropertyDialog = ({ open, setOpen, data }: Props) => {
  // States
  const [isLoading, setIsLoading] = useState(false)
  const [openPreview, setOpenPreview] = useState(false)
  const [media, setMedia] = useState<{ type: string; url: string }>({ type: '', url: '' })

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
      <APILoader isLoading={isLoading} />
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        View Property Details
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <Grid container spacing={5}>
          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Property Name:</Typography>
            <Typography>{data?.name}</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Property Owner:</Typography>
            <Typography>{data?.owner}</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Property Type:</Typography>
            <Typography>{data?.propertyType}</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Furnished Status:</Typography>
            <Typography>{data?.furnishedStatus}</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Listing Type:</Typography>
            <Typography>{data?.listingType}</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Address:</Typography>
            <Typography>{data?.address}</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Price:</Typography>
            <Typography>{data?.price}</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Property Status:</Typography>
            <Typography>{data?.status}</Typography>
          </Grid>
          <Grid size={{ xs: 12 }} container rowSpacing={3}>
            <Typography variant='h6'>Description:</Typography>
            <Typography>{data?.description}</Typography>
          </Grid>

          <Divider sx={{ width: '100%' }}>
            <Typography variant='h6' sx={{ px: 4 }}>
              Dimension
            </Typography>
          </Divider>

          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Length:</Typography>
            <Typography>{data?.dimension?.length}</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Width:</Typography>
            <Typography>{data?.dimension?.width}</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Area:</Typography>
            <Typography>{data?.dimension?.area}</Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 4 }} container rowSpacing={3}>
            <Typography variant='h6'>Front Direction (Face):</Typography>
            <Typography>{data?.dimension?.facing}</Typography>
          </Grid>

          <Divider sx={{ width: '100%' }}>
            <Typography variant='h6' sx={{ px: 4 }}>
              Gallery
            </Typography>
          </Divider>

          <Grid size={{ xs: 12 }}>
            <ImageList className='custom-scrollbar pb-1 flex overflow-x-auto' cols={2.5}>
              {data?.media?.length > 0 ? (
                data?.media?.map((item: string, index: number) => {
                  const extension = item.split('.').pop()?.toLowerCase() || ''
                  const url = `${item}`
                  let type = ''
                  if (imageExtensions.includes(extension)) type = MediaType.IMAGE
                  if (videoExtensions.includes(extension)) type = MediaType.VIDEO
                  return (
                    <ImageListItem
                      key={index}
                      className='flex-none w-48 cursor-pointer'
                      onClick={() => {
                        setOpenPreview(true)
                        setMedia({ type, url })
                      }}
                    >
                      {type === MediaType.IMAGE ? (
                        <Image src={url} alt={item} className='w-full' width={100} height={140} />
                      ) : (
                        <video
                          src={url}
                          className='w-full h-[140px] rounded-md object-cover'
                          muted
                          loop
                          playsInline
                          onMouseEnter={e => e.currentTarget.play()}
                          onMouseLeave={e => e.currentTarget.pause()}
                        />
                      )}
                    </ImageListItem>
                  )
                })
              ) : (
                <Typography className='mx-auto'>No images/videos found</Typography>
              )}
            </ImageList>
          </Grid>
        </Grid>
      </DialogContent>
      <PreviewLargeMediaDialog open={openPreview} setOpen={setOpenPreview} media={media} />
    </Dialog>
  )
}

export default ViewPropertyDialog
