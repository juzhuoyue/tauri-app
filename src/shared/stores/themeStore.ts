import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  resolveTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: (theme) => {
        set({ theme })
        get().resolveTheme()
      },
      resolveTheme: () => {
        const { theme } = get()
        let resolved: 'light' | 'dark' = 'light'
        if (theme === 'system') {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } else {
          resolved = theme
        }
        set({ resolvedTheme: resolved })
        document.documentElement.classList.toggle('dark', resolved === 'dark')
      },
    }),
    { name: 'theme-storage', partialize: (state) => ({ theme: state.theme }) }
  )
)

if (typeof window !== 'undefined') {
  useThemeStore.getState().resolveTheme()
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useThemeStore.getState().theme === 'system') {
      useThemeStore.getState().resolveTheme()
    }
  })
}