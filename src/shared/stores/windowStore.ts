import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'

interface WindowState {
  isMaximized: boolean
  toggleMaximize: () => Promise<void>
  minimize: () => Promise<void>
  close: () => Promise<void>
  init: () => Promise<void>
}

export const useWindowStore = create<WindowState>((set) => ({
  isMaximized: false,
  toggleMaximize: async () => {
    await invoke('toggle_maximize')
    set((state) => ({ isMaximized: !state.isMaximized }))
  },
  minimize: async () => {
    await invoke('minimize_window')
  },
  close: async () => {
    await invoke('close_window')
  },
  init: async () => {
    const maximized = await invoke<boolean>('is_maximized')
    set({ isMaximized: maximized })

    await listen('window-state-changed', (event: { payload: boolean }) => {
      set({ isMaximized: event.payload })
    })
  },
}))