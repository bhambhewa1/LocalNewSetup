// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'
import { ThemeColor } from '@/@core/types'

const dashboardData = [
  {
    title: 'Total Dealers',
    key: 'totalDealers',
    stats: 0,
    avatarIcon: 'tabler-users',
    avatarColor: 'primary' as ThemeColor
  },
  {
    title: 'Total Staff Manager',
    key: 'totalStaffManager',
    stats: 0,
    avatarIcon: 'tabler-school',
    avatarColor: 'primary' as ThemeColor
  },
  {
    title: 'Total Talecaller',
    key: 'totalTalecaller',
    stats: 0,
    avatarIcon: 'tabler-users',
    avatarColor: 'primary' as ThemeColor
  },
  {
    title: 'Total Lead',
    key: 'totalLead',
    stats: 0,
    avatarIcon: 'tabler-user-search',
    avatarColor: 'warning' as ThemeColor
  }
]

const ListCards = ({ data }: { data?: Record<string, string> }) => {
  const safeData = data ?? {}
  const lastN = Object.keys(safeData).length

  return (
    <Grid container spacing={6}>
      {dashboardData.slice(-lastN).map((item, i) => {
        const { key, ...rest } = item

        return (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <HorizontalWithSubtitle key={key} {...rest} stats={Number(safeData[key]) || 0} />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default ListCards

// // MUI Imports
// import Grid from '@mui/material/Grid2'

// // Type Imports
// import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

// // Component Imports
// import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// const dashboardData = [
//   {
//     title: 'Total Dealers',
//     key: 'totalDealers',
//     stats: 0,
//     avatarIcon: 'tabler-users',
//     avatarColor: 'primary'
//     // subtitle: 'Total User'
//   },
//   {
//     title: 'Total Staff Manager',
//     key: 'totalStaffManager',
//     stats: 0,
//     avatarIcon: 'tabler-school',
//     avatarColor: 'primary'
//     // subtitle: 'Total User'
//   },
//   {
//     title: 'Total Talecaller',
//     key: 'totalTalecaller',
//     stats: 0,
//     avatarIcon: 'tabler-users',
//     avatarColor: 'primary'
//     // subtitle: 'Total User'
//   },
//   {
//     title: 'Total Lead',
//     key: 'totalLead',
//     stats: 0,
//     avatarIcon: 'tabler-user-search',
//     avatarColor: 'warning'
//     // subtitle: 'Not interacted lead'
//   }
// ]

// const ListCards = ({ data }: { data: any }) => {
//   return (
//     <Grid container spacing={6}>
//       {dashboardData.slice(-Object.keys(data).length)?.map((item, i) => (
//         <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
//           <HorizontalWithSubtitle {...item, stats: data[item.key]} />
//         </Grid>
//       ))}
//     </Grid>
//   )
// }

// export default ListCards
