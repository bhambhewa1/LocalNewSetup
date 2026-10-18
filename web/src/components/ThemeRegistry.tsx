'use client'

import * as React from 'react'
import theme from '../theme/theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

export default function ThemeRegistry({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}