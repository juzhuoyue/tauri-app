import { Outlet, Link, useLocation } from '@tanstack/react-router'
import { clsx } from 'clsx'

export function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-6 py-4">
        <nav className="flex items-center gap-6 max-w-7xl mx-auto">
          <Link
            to="/"
            className={clsx(
              'font-medium transition-colors',
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Tauri App
          </Link>
          <Link
            to="/settings"
            className={clsx(
              'text-sm transition-colors',
              location.pathname === '/settings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            设置
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}