'use client'

import { useEffect, useState } from 'react'
// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiTimeline from '@mui/lab/Timeline'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import Typography from '@mui/material/Typography'
import type { TimelineProps } from '@mui/lab/Timeline'
import type { ButtonProps } from '@mui/material/Button'
import { format } from 'date-fns'

// Components Imports
import OptionMenu from '@core/components/option-menu'
import type { timelineType } from '@/types/lead'
import { Button, Tooltip } from '@mui/material'
import useQueryList from '@/hooks/useQueryList'
import { useParams } from 'next/navigation'
import { leadTimeline } from '@/API/API'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import RemarkDialog from '@/components/dialogs/remark-dialog'
import APILoader from '@/components/loader/APILoader'
import type { userDataType } from '@/types/user'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

type timelineWithUserName = Omit<timelineType, '_id'> & {
  _id: string
  user: userDataType
}

const ActivityTimeline = () => {
  const [timelineData, setTimelineData] = useState<timelineWithUserName[]>([])
  const params = useParams()
  const leadId = Array.isArray(params?.id) ? params?.id[0] : params?.id

  const buttonProps: ButtonProps = {
    variant: 'contained',
    children: (
      <>
        <i className='tabler-message-exclamation mr-2' /> <span>Add Remark</span>
      </>
    )
  }

  const payload = {
    ModuleName: 'Timeline',
    ApiData: { url: leadTimeline?.get + `/${leadId}` },
    isSingleItemFetch: true,
    ItemId: leadId // Ensure ItemId is a string,
  }
  const { data: ActivityTimelineData, isLoading, isFetched, isError, error } = useQueryList(payload)

  const timeConversion = (date: string) => {
    const get_date = new Date(date)
    const now = new Date()
    // Calculate the difference bewteen the time in milisec
    const diffInMiliSec = now.getTime() - get_date.getTime()

    const diffInSecs = diffInMiliSec / 1000
    const diffInMins = diffInSecs / 60
    const diffInHours = diffInMins / 60
    const diffInDays = diffInHours / 24

    if (diffInDays >= 1) {
      // Return days if the difference is more than or equal to 1 day
      return `${Math.floor(diffInDays)} Day ago`
    } else if (diffInHours >= 1) {
      // Return minutes if the difference is more than or equal to 1 minute but less than 1 day
      return `${Math.floor(diffInHours)} Hrs ago`
    } else if (diffInMins >= 1) {
      // Return minutes if the difference is more than or equal to 1 minute but less than 1 day
      return `${Math.floor(diffInMins)} Min ago`
    } else {
      // Return seconds if the difference is less than 1 minute
      return `${Math.floor(diffInSecs) > 0 ? Math.floor(diffInSecs) : 0} sec ago`
    }
  }

  useEffect(() => {
    setTimelineData(ActivityTimelineData)
  }, [ActivityTimelineData])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <APILoader isLoading={isLoading} />
          <CardHeader
            avatar={<i className='tabler-list-details text-xl' />}
            title={
              <div className='flex justify-between items-center'>
                <Typography className='text-[17px]'>Activity Timeline</Typography>{' '}
                <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={RemarkDialog} />
              </div>
            }
            titleTypographyProps={{ variant: 'h5' }}
            // action={<OptionMenu options={['Share timeline', 'Suggest edits', 'Report bug']} />}
            sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
          />
          <CardContent className='flex flex-col gap-6 pbe-5'>
            <Timeline>
              {timelineData?.length > 0 ? (
                timelineData?.map((timeline: timelineWithUserName) => (
                  <TimelineItem key={timeline?._id}>
                    <TimelineSeparator>
                      <TimelineDot color='primary' />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                        <Typography className='font-medium' color='text.primary'>
                          {timeline?.message}
                        </Typography>
                        {/* <Typography variant='caption'>12 min ago</Typography> */}
                      </div>
                      <Tooltip title={format(new Date(timeline?.createdAt), 'dd MMM yyyy, HH:mm:ss')}>
                        <Typography className='mbe-2' sx={{ display: 'inline' }}>
                          {timeConversion(timeline?.createdAt)}
                        </Typography>
                      </Tooltip>
                      <div className='flex items-center'>
                        <Typography className='font-medium'>
                          {' '}
                          By{' '}
                          <span className='text-[#d9a035]'>
                            {timeline?.user?.firstname} {timeline?.user?.lastname}
                          </span>
                        </Typography>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                ))
              ) : (
                <div className='mt-5 mb-8 text-center'> No timeline data available</div>
              )}
            </Timeline>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ActivityTimeline
