// MUI Imports
import Grid from '@mui/material/Grid2'

const SkeletonLeadListCards = () => {
  return (
    <Grid container spacing={6}>
      {Array.from({ length: 5 }).map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 12 / 5 }}>
          <HorizontalWithSubtitle />
        </Grid>
      ))}
    </Grid>
  )
}

export default SkeletonLeadListCards

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Type Imports
import type { ThemeColor } from '@core/types'
import { Skeleton } from '@mui/material'

export type UserDataType = {
  title: string
  stats: number
  avatarIcon: string
  avatarColor?: ThemeColor
  subtitle?: string
}

const HorizontalWithSubtitle = () => {
  return (
    <Card>
      <CardContent className='flex justify-between gap-1'>
        <div className='flex flex-col gap-1 flex-grow'>
          <Skeleton variant='rectangular' width='100%' height={37} />
          <div className='flex items-center gap-2 flex-wrap'>
            <Skeleton variant='rectangular' width='100%' height={37} />
          </div>
          <Skeleton variant='rectangular' width='100%' height={37} />
        </div>
        <Skeleton variant='circular' width={40} height={37} />
      </CardContent>
    </Card>
  )
}
