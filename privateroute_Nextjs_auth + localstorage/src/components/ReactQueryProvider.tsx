'use client'

// Third-party Imports
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './GlobalQueryClient'

export const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
