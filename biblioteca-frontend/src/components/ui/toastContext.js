import { createContext, useContext } from 'react'

export const ToastContext = createContext({
  showToast: () => {},
  dismissToast: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}
