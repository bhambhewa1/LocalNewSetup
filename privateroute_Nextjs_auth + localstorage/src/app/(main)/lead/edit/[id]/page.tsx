// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import LeadEditor from '@/views/lead/edit'

const BasicDetailTab = dynamic(() => import('@views/lead/edit/BasicDetail'))
const ActivityTimelineTab = dynamic(() => import('@views/lead/edit/ActivityTimeline'))

// Vars
const tabContentList = (data?: any): { [key: string]: ReactElement } => ({
  basicDetail: <BasicDetailTab />,
  activityTimeline: <ActivityTimelineTab />
})

const page = () => {
  const data = ''

  return (
    <>
      <Breadcrumb pageName='Edit Lead Information' />
      <LeadEditor tabContentList={tabContentList(data)} />
    </>
  )
}

export default page
