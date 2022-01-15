import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react'

import { Toast } from 'types/Toast'
import ToastComponent from 'components/Toast'

interface ContextProps {
  addToast: (toast: Toast) => void
  removeToast: (id: number | undefined) => void
}

const ToastContext = createContext<Partial<ContextProps>>({})
let id = 1

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback(
    (toast: Toast) => {
      setToasts((toasts: Toast[]) => [
        ...toasts,
        {
          ...toast,
          id: id++
        }
      ])
    },
    [setToasts]
  )

  const removeToast = useCallback(
    (id: number | undefined) => {
      setToasts((toasts) => toasts.filter((toast: Toast) => toast.id !== id))
    },
    [setToasts]
  )

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast
      }}
    >
      <div
        className="absolute top-0 right-0 z-50 w-full max-w-sm xl:max-w-md"
        style={{ zIndex: 100 }}
      >
        {toasts?.map((toast: Toast, i: number) => (
          <ToastComponent key={i} {...toast} />
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  return useContext(ToastContext) as ContextProps
}
