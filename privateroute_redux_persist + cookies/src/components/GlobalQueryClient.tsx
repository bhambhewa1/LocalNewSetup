import { QueryClient } from '@tanstack/react-query'

// ✅ Singleton instance
// export const queryClient = new QueryClient()
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1 // Retry max 2 times after a failure
      // refetchOnMount: false,
      // refetchOnWindowFocus: false
    }
  }
})
