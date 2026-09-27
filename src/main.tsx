import React from 'react'
import ReactDOM from 'react-dom/client'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StoreProvider } from '@shared/stores'
import { router } from '@app/router'
import '@shared/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <RouterProvider router={router} />
        <TanStackRouterDevtools />
      </StoreProvider>
    </QueryClientProvider>
  </React.StrictMode>
)