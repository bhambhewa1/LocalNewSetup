// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

import { Skeleton } from '@mui/material'

const SkeletonLeadAnalysisChart = () => {
  return (
    <Card className='bs-full'>
      <CardHeader title='Monthly Lead Status' subheader='Current Year Overview' />
      <div className='flex justify-center mb-5'>
        <Skeleton variant='circular' width={350} height={350} />
      </div>
    </Card>
  )
}

export default SkeletonLeadAnalysisChart
