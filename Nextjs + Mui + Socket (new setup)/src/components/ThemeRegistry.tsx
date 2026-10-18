'use client'

import * as React from 'react'
import theme from '../theme/theme'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

export default function ThemeRegistry({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <AppRouterCacheProvider> {/* enable proper style injection during server-side 
                rendering, wrap your root layout with the AppRouterCacheProvider. */}
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    )
}