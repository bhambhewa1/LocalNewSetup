'use client'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import WebSocketClient from '../components/websocket/websocket'

export default function Home() {

  return (
    <>
      {/* Websocket live connection */}
      <Grid>
        <WebSocketClient />
      </Grid>
    </>
  )
}