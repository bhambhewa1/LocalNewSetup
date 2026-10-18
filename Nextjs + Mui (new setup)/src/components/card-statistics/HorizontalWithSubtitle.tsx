// MUI Imports
import { usersType } from '@/src/types/dashboard';
import { Collapse } from '@mui/material';
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useState } from 'react';

type UserWithoutId = Omit<usersType, "id">;

const HorizontalWithSubtitle = (props: UserWithoutId) => {
  // Props
  const { name, email, role, joinedDate, lastLogin, department } = props
  const [toggle, setToggle] = useState(false)
  return (
    <Card
      onClick={() => setToggle(!toggle)}
      sx={{
        cursor: "pointer",
        transition: '0.3s',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      <CardContent className='flex flex-col gap-3'>
        {/* Always visible */}
        <Typography variant='h4' sx={{ textAlign: 'center' }}>
          {name}
        </Typography>

        <div className='flex items-center gap-2 flex-wrap'>
          <Typography sx={{ fontWeight: 600 }}>
            Email:
          </Typography>

          <Typography color='text.primary'>
            {email}
          </Typography>
        </div>

        <div className='flex items-center gap-2 flex-wrap'>
          <Typography sx={{ fontWeight: 600 }}>
            Role:
          </Typography>

          <Typography variant='body2'>
            {role}
          </Typography>
        </div>

        {/* Animated content */}
        <Collapse in={toggle} timeout={400}>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
              <Typography sx={{ fontWeight: 600 }}>
                Joined Date:
              </Typography>

              <Typography>
                {joinedDate}
              </Typography>
            </div>

            <div className='flex gap-2'>
              <Typography sx={{ fontWeight: 600 }}>
                Last Login:
              </Typography>

              <Typography>
                {lastLogin}
              </Typography>
            </div>

            <div className='flex gap-2'>
              <Typography sx={{ fontWeight: 600 }}>
                Department:
              </Typography>

              <Typography>
                {department}
              </Typography>
            </div>
          </div>
        </Collapse>
      </CardContent>
    </Card>
  )
}

export default HorizontalWithSubtitle
