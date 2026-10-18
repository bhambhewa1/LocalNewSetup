'use client'

// React Imports
import Image from 'next/image'
import { SyntheticEvent, useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Divider, IconButton, ImageList, ImageListItem, ImageListItemBar, MenuItem, Typography } from '@mui/material'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import APILoader from '@/components/loader/APILoader'
import { HttpVerb, makeApiCall } from '@/API/APICall'
import { propertyAPI } from '@/API/API'
import { toast } from 'react-toastify'
import useMutateList from '@/hooks/useMutateList'
import type { propertyListType } from '@/types/propety'
import { Controller, useForm } from 'react-hook-form'
import {
  directions,
  furnishedStatus,
  imageExtensions,
  listingType,
  MediaType,
  propertyStatus,
  propertyType,
  videoExtensions
} from '@/utils/constants'
import PreviewLargeMediaDialog from '../preview-large-media'
import { queryClient } from '@/components/GlobalQueryClient'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux-store'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data: propertyListType
}

const PropertyDialog = ({ open, setOpen, data }: Props) => {
  // States
  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState<any>(null)
  const [uploads, setUploads] = useState<File[]>([])
  const [openPreview, setOpenPreview] = useState(false)
  const [media, setMedia] = useState<{ type: string; url: string }>({ type: '', url: '' })
  const user = useSelector((state: RootState) => state?.loggedUserReducer.loggedUser)

  const reactMutation = useMutateList()

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<propertyListType>({
    defaultValues: { ...data }
  })

  const handleClose = () => {
    setOpen(false)
    if (data?._id) {
      queryClient.invalidateQueries({ queryKey: ['Property'] })
    }
  }

  const handleFileUpload = (e: any) => {
    const files = e.target.files
    const validTypes = ['image/', 'video/']

    const updatedUploads = [...uploads]
    Object.keys(files).forEach(key => {
      if (!validTypes.some(type => files[key].type.startsWith(type))) {
        toast.error('Only image and video files are accepted.')
        return
      }
      const index = updatedUploads.length === 0 ? parseInt(key, 10) : updatedUploads.length
      updatedUploads[index] = files[key]
    })
    setUploads(updatedUploads)
    const fileInput = document.getElementById('file-upload') as HTMLInputElement | null
    if (fileInput) {
      fileInput.value = ''
    }
    // if (!docType) {
    //   setDocType(file.name?.split('.')[0])
    // }
  }

  // const getPropertyData = async () => {
  //   setIsLoading(true)
  //   const { status, data: getPropertyData } = await makeApiCall(HttpVerb.GET, propertyAPI.getProperty + `/${data?._id}`)
  //   if (status) {
  //     reset({ ...control._formValues, ...(getPropertyData || {}) })
  //   }
  //   setIsLoading(false)
  // }

  const handleDeleteMedia = async (fileName: string) => {
    setIsLoading(true)
    const deleteProperty = {
      ModuleName: 'PropertyMedia',
      ApiData: {
        method: HttpVerb.DELETE,
        url: propertyAPI.deletePropertyMedia + `/${data?._id}`,
        payload: { fileName }
      },
      ItemId: data?._id
    }
    try {
      const res = await reactMutation.mutateAsync(deleteProperty)
      reset({ ...control._formValues, media: res?.media })
      // getPropertyData()
      toast.success(`File deleted successfully!`)
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const convertToFormData = (data: Record<string, any>): FormData => {
    const formData = new FormData()
    for (const key in data) {
      if (key === 'dimension') {
        formData.append(key, JSON.stringify(data[key]))
      } else {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key])
        }
      }
    }
    if (uploads.length) {
      // formData.append('media', JSON.stringify(uploads))
      uploads.forEach(file => {
        formData.append('media', file) // 👈 same key for all files
      })
    }
    return formData
  }

  const onSubmit = async (formData: propertyListType) => {
    const updatedFormData = { ...formData, organization: user?.organization?._id }
    const { _id, dealers, media, ...rest } = updatedFormData
    const fData = convertToFormData(rest)

    const addProperty = {
      ModuleName: 'Property',
      ApiData: {
        method: HttpVerb.POST,
        url: propertyAPI.createProperty,
        payload: fData,
        contentType: 'multipart/form-data'
      }
    }
    const updateProperty = {
      ModuleName: 'Property',
      ApiData: {
        method: HttpVerb.PUT,
        url: propertyAPI.updateProperty + `/${formData._id}`,
        payload: fData,
        contentType: 'multipart/form-data'
      },
      ItemId: formData?._id
    }
    try {
      await reactMutation.mutateAsync(formData?._id ? updateProperty : addProperty)
      toast.success(`Property ${formData?._id ? 'updated' : 'added'} successfully!`)
      handleClose()
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   getPropertyData()
  // }, [])

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
        Property Details
      </DialogTitle>
      <form autoComplete='off' onReset={() => reset({ ...data })} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label={
                      <p>
                        Property Name <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Enter property name'
                    {...(errors?.name && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='owner'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label={
                      <p>
                        Property Owner <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Enter property owner'
                    {...(errors?.owner && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='propertyType'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    id='select-propertyType'
                    label={
                      <p>
                        Select Property Type <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Select property type'
                    {...field}
                    {...(errors.propertyType && { error: true, helperText: 'This field is required.' })}
                  >
                    {/* <MenuItem value=''>Select Property Type</MenuItem> */}
                    {propertyType.map(({ key, label }: { key: string; label: string }) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='furnishedStatus'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    id='select-furnishedStatus'
                    label={
                      <p>
                        Select Furnished Status <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Select furnished status'
                    {...field}
                    {...(errors.furnishedStatus && { error: true, helperText: 'This field is required.' })}
                  >
                    {/* <MenuItem value=''>Select Furnished Status</MenuItem> */}
                    {furnishedStatus.map(({ key, label }: { key: string; label: string }) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='listingType'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    id='select-listingType'
                    label={
                      <p>
                        Select Listing Type <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Select listing type'
                    {...field}
                    {...(errors.listingType && { error: true, helperText: 'This field is required.' })}
                  >
                    {/* <MenuItem value=''>Select Listing Type </MenuItem> */}
                    {listingType.map(({ key, label }: { key: string; label: string }) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label={
                      <p>
                        Address <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Enter property address'
                    {...(errors?.address && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='price'
                control={control}
                // rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label={
                      <p>
                        Price <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Enter price'
                    {...(errors?.price && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='status'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    id='select-propertyStatus'
                    label={
                      <p>
                        Select Property Status <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Select status'
                    {...field}
                    {...(errors.status && { error: true, helperText: 'This field is required.' })}
                  >
                    {/* <MenuItem value=''>Select Furnished Status</MenuItem> */}
                    {propertyStatus.map(({ key, label }: { key: string; label: string }) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='description'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    type='text'
                    label={
                      <p>
                        Description <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Enter description here...'
                    {...(errors?.description && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>

            <Divider sx={{ width: '100%', my: 4 }}>
              <Typography variant='h6' sx={{ px: 4 }}>
                Dimension
              </Typography>
            </Divider>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='dimension.length'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label={
                      <p>
                        Length <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Enter property length'
                    {...(errors?.dimension?.length && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='dimension.width'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label={
                      <p>
                        Width <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Enter property width'
                    {...(errors?.dimension?.width && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='dimension.area'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='text'
                    label={
                      <p>
                        Area <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Enter property area'
                    {...(errors?.dimension?.area && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='dimension.facing'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    id='select-facing'
                    label={
                      <p>
                        Select Face <span className='text-red-500'>*</span>
                      </p>
                    }
                    placeholder='Select facing'
                    {...field}
                    {...(errors.dimension?.facing && { error: true, helperText: 'This field is required.' })}
                  >
                    {/* <MenuItem value=''>Select Direction</MenuItem> */}
                    {directions.map(({ key, label }: { key: string; label: string }) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Divider sx={{ width: '100%', mt: 4 }}>
              <Typography variant='h6' sx={{ px: 4 }}>
                Gallery
              </Typography>
            </Divider>

            {control._formValues?._id && (
              <Grid size={{ xs: 12 }}>
                <ImageList className='custom-scrollbar pb-1 flex overflow-x-auto' cols={2.5}>
                  {control._formValues?.media?.length > 0 ? (
                    control._formValues.media.map((item: string, index: number) => {
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
                          <ImageListItemBar
                            position='top'
                            sx={{
                              background: 'transparent', // no background
                              height: 'auto',
                              padding: 0,
                              display: 'flex',
                              justifyContent: 'flex-end', // push icon to right
                              alignItems: 'flex-start'
                            }}
                            actionIcon={
                              <IconButton
                                size='small'
                                aria-label={`remove ${item}`}
                                onClick={e => {
                                  e.stopPropagation()
                                  handleDeleteMedia(item)
                                }}
                                sx={{
                                  borderRadius: 0, // 👈 this makes it square
                                  width: 30, // 👈 optional: force width
                                  height: 30, // 👈 optional: force height
                                  color: 'white',
                                  backgroundColor: 'rgba(0,0,0,0.5)'
                                  // m: 1 // margin
                                  // '&:hover': {
                                  //   backgroundColor: 'rgba(0,0,0,0.7)'
                                  // }
                                }}
                              >
                                <i className='tabler-x' />
                              </IconButton>
                            }
                          />
                        </ImageListItem>
                      )
                    })
                  ) : (
                    <Typography className='mx-auto'>No images/videos found</Typography>
                  )}
                </ImageList>
              </Grid>
            )}

            <Grid
              size={{ xs: 12 }}
              display='flex'
              flexDirection='column'
              justifyContent='end'
              alignItems='end'
              marginBottom={3}
            >
              <Typography variant='body2' className='text-[#2F2B3DE6]'>
                Upload images or videos below:
              </Typography>
              <Button
                color='primary'
                variant='tonal'
                startIcon={<i className='tabler-upload' />}
                className='max-sm:is-full'
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                New Upload Media
              </Button>
              <input
                id='file-upload'
                type='file'
                multiple
                accept='image/*,video/*'
                className='hidden'
                onChange={handleFileUpload}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ImageList className='custom-scrollbar pb-1 flex overflow-x-auto' cols={2.5}>
                {/* {(data?.media ?? []).length > 0 &&
                  (data?.media ?? []).map((item: any, index: number) => (
                    <ImageListItem key={index} className='flex-none w-48'>
                      <img src={item} />
                      <ImageListItemBar
                        title={item?.name}
                        position='top'
                        actionIcon={
                          <IconButton
                            aria-label={`cross ${item.name}`}
                            onClick={() => setUploads(prev => prev.filter((_, i) => i !== index))}
                          >
                            <i className='tabler-x text-white' />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))} */}
                {uploads.length > 0 &&
                  uploads.map((item: File, index: number) => (
                    <ImageListItem
                      key={index}
                      className='flex-none w-48 cursor-pointer'
                      onClick={() => {
                        setOpenPreview(true)
                        setMedia({
                          type: item?.type?.startsWith('image/') ? MediaType.IMAGE : MediaType.VIDEO,
                          url: URL.createObjectURL(item)
                        })
                      }}
                    >
                      {item?.type?.startsWith('image/') ? (
                        <Image
                          src={URL.createObjectURL(item)}
                          alt={item?.name}
                          className='w-full'
                          width={100}
                          height={140}
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(item)}
                          className='w-full h-[140px] rounded-md object-cover'
                          muted
                          loop
                          playsInline
                          onMouseEnter={e => e.currentTarget.play()}
                          onMouseLeave={e => e.currentTarget.pause()}
                        />
                      )}
                      {/* <ImageListItemBar
                        // title={item?.name}
                        position='top'
                        actionIcon={
                          <IconButton
                            aria-label={`cross ${item.name}`}
                            onClick={e => {
                              e.stopPropagation()
                              setUploads(prev => prev.filter((_, i) => i !== index))
                            }}
                          >
                            <i className='tabler-x text-white' />
                          </IconButton>
                        }
                      /> */}
                      <ImageListItemBar
                        position='top'
                        sx={{
                          background: 'transparent', // no background
                          height: 'auto',
                          padding: 0,
                          display: 'flex',
                          justifyContent: 'flex-end', // push icon to right
                          alignItems: 'flex-start'
                        }}
                        actionIcon={
                          <IconButton
                            size='small'
                            aria-label={`remove ${item.name}`}
                            onClick={e => {
                              e.stopPropagation()
                              setUploads(prev => prev.filter((_, i) => i !== index))
                            }}
                            sx={{
                              borderRadius: 0, // 👈 this makes it square
                              width: 30, // 👈 optional: force width
                              height: 30, // 👈 optional: force height
                              color: 'white',
                              backgroundColor: 'rgba(0,0,0,0.5)'
                              // m: 1 // margin
                              // '&:hover': {
                              //   backgroundColor: 'rgba(0,0,0,0.7)'
                              // }
                            }}
                          >
                            <i className='tabler-x' />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
              </ImageList>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' disabled={isLoading} type='submit'>
            Submit
          </Button>
          <Button variant='contained' color='error' disabled={isLoading} onClick={handleClose}>
            Cancel
          </Button>
          {/* <Button variant='tonal' color='secondary' type='reset' disabled={isLoading}>
            Reset
          </Button> */}
        </DialogActions>
      </form>
      <PreviewLargeMediaDialog open={openPreview} setOpen={setOpenPreview} media={media} />
    </Dialog>
  )
}

export default PropertyDialog
