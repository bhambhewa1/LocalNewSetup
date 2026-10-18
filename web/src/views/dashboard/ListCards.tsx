// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import HorizontalWithSubtitle from '../../components/card-statistics/HorizontalWithSubtitle'
import { usersType } from '@/src/types/dashboard';

const ListCards = ({ dashboardData }: { dashboardData: usersType[] }) => {
    return (
        <Grid container spacing={6}>
            {dashboardData.map((item: usersType, i) => {
                const { id, ...rest } = item

                return (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                        <HorizontalWithSubtitle key={id} {...rest} />
                    </Grid>
                )
            })}
        </Grid>
    )
}

export default ListCards