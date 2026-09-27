import { useEffect } from 'react'
import { useThemeStore } from './themeStore'
import { useWindowStore } from './windowStore'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const resolveTheme = useThemeStore((s) => s.resolveTheme)
  const initWindow = useWindowStore((s) => s.init)

  useEffect(() => {
    resolveTheme()
    initWindow()
  }, [resolveTheme, initWindow])

  return <>{children}</>
}