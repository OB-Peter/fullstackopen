import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notification: '',
  timeoutId: null,

  actions: {
    setNotification: (message, seconds = 5) => {
      // Clear any existing timeout
      const currentTimeout = useNotificationStore.getState().timeoutId
      if (currentTimeout) clearTimeout(currentTimeout)

      // Set the message
      set({ notification: message })

      // Auto-clear after X seconds
      const timeoutId = setTimeout(() => {
        set({ notification: '', timeoutId: null })
      }, seconds * 1000)

      set({ timeoutId })
    },
  },
}))

export const useNotification = () =>
  useNotificationStore((state) => state.notification)

export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions)