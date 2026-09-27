import { createRouter, createRootRoute, createRoute, Outlet, Link } from '@tanstack/react-router'
import { Layout } from '@app/components/Layout'
import { HomePage } from '@features/home/HomePage'
import { SettingsPage } from '@features/settings/SettingsPage'

export const rootRoute = createRootRoute({
  component: () => <Layout />,
})

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
})

export const routeTree = rootRoute.addChildren([indexRoute, settingsRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}