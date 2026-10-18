// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'
import { getInitials } from '@/utils/getInitials'
import { Skeleton } from '@mui/material'

type DataType = {
  name: string
  totalLead: number
  avatar?: string
}

// Vars
const data: DataType[] = [
  { name: 'Jordan Stevenson', totalLead: 33 },
  { name: 'Bentlee Emblin', totalLead: 52 },
  { name: 'Benedetto Rossiter', totalLead: 12 },
  { name: 'Beverlie Krabbe', totalLead: 8 },
  { name: 'Jordan Stevenson', totalLead: 33 },
  { name: 'Bentlee Emblin', totalLead: 52 },
  { name: 'Benedetto Rossiter', totalLead: 12 },
  { name: 'Beverlie Krabbe', totalLead: 8 },
  { name: 'Jordan Stevenson', totalLead: 33 },
  { name: 'Bentlee Emblin', totalLead: 52 },
  { name: 'Benedetto Rossiter', totalLead: 12 },
  { name: 'Beverlie Krabbe', totalLead: 8 }
]

const SkeletonConsultantMost = ({ title }: { title: string }) => {
  return (
    <Card className='bs-full'>
      <CardHeader
        title={title}
        // action={<OptionMenu options={['Refresh', 'Update', 'Share']} />}
      />
      <Divider />
      <div className='flex justify-between plb-4 pli-6'>
        <Typography className='uppercase'>Name</Typography>
        <Typography className='uppercase'>Lead Count</Typography>
      </div>
      <Divider />
      <CardContent className='overflow-y-auto custom-scrollbar max-h-[440px] flex flex-col gap-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='flex items-center gap-4'>
            <Skeleton variant='circular' width={42} height={37} />
            <div className='flex justify-between items-center is-full gap-4'>
              <Skeleton variant='rectangular' width='100%' height={30} />
              <Skeleton variant='rectangular' width='100%' height={30} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default SkeletonConsultantMost
