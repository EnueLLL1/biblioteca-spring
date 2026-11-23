import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { ToastContext } from './toastContext'

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const STYLES = {
  success: 'border-success/30 bg-surface text-ink',
  error: 'border-danger/40 bg-surface text-ink',
  info: 'border-edge-strong bg-surface text-ink',
}

const ICON_COLORS = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-accent',
}

function ToastItem({ toast, onDismiss }) {
  const Icon = ICONS[toast.type] || Info
  const remainingRef = useRef(toast.duration)
  const startedAtRef = useRef(0)
  const timerRef = useRef(null)
  const pausedRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    if (remainingRef.current <= 0) return
    startedAtRef.current = Date.now()
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id)
    }, remainingRef.current)
  }, [clearTimer, onDismiss, toast.id])

  useEffect(() => {
    startTimer()
    return clearTimer
  }, [startTimer, clearTimer])

  const pause = () => {
    if (pausedRef.current) return
    pausedRef.current = true
    clearTimer()
    if (startedAtRef.current) {
      remainingRef.current = Math.max(
        500,
        remainingRef.current - (Date.now() - startedAtRef.current)
      )
    }
  }

  const resume = () => {
    if (!pausedRef.current) return
    pausedRef.current = false
    startTimer()
  }

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3.5 shadow-lg transition ${STYLES[toast.type] || STYLES.info}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${ICON_COLORS[toast.type] || ICON_COLORS.info}`}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium leading-snug text-ink">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar notificação"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-muted transition hover:bg-subtle hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [announcement, setAnnouncement] = useState('')
  const pendingRef = useRef([])
  const flushTimerRef = useRef(null)
  const idCounterRef = useRef(0)

  const dismissToast = useCallback(id => {
    setToasts(prev => prev.filter(item => item.id !== id))
  }, [])

  const pushVisibleToast = useCallback(item => {
    setToasts(prev => [...prev.slice(-3), item])
    setAnnouncement(item.message)
    if (typeof document !== 'undefined' && typeof document.ariaNotify === 'function') {
      try {
        document.ariaNotify(item.message)
      } catch {
        // Ignora caso ariaNotify exija gesto ou esteja indisponível
      }
    }
  }, [])

  const flushPending = useCallback(() => {
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current)
      flushTimerRef.current = null
    }
    if (pendingRef.current.length === 0) return

    const hasOpenModal =
      typeof document !== 'undefined' && document.querySelector('dialog[open]') !== null

    if (hasOpenModal) {
      flushTimerRef.current = setTimeout(flushPending, 150)
      return
    }

    const queue = pendingRef.current
    pendingRef.current = []
    queue.forEach(pushVisibleToast)
  }, [pushVisibleToast])

  useEffect(() => {
    if (typeof document === 'undefined') return undefined
    const handleDialogClose = () => {
      if (pendingRef.current.length > 0) {
        flushTimerRef.current = setTimeout(flushPending, 80)
      }
    }
    document.addEventListener('close', handleDialogClose, true)
    return () => {
      document.removeEventListener('close', handleDialogClose, true)
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
    }
  }, [flushPending])

  const showToast = useCallback(
    ({ message, type = 'info', duration }) => {
      if (!message) return
      const id = ++idCounterRef.current
      const resolvedDuration = duration ?? (type === 'error' ? 7000 : 4500)
      const item = { id, message, type, duration: resolvedDuration }

      const hasOpenModal =
        typeof document !== 'undefined' && document.querySelector('dialog[open]') !== null

      if (hasOpenModal) {
        pendingRef.current.push(item)
        if (!flushTimerRef.current) {
          flushTimerRef.current = setTimeout(flushPending, 150)
        }
        return
      }

      pushVisibleToast(item)
    },
    [flushPending, pushVisibleToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      <div aria-live="polite" aria-atomic="true" className="visually-hidden">
        {announcement}
      </div>

      <div
        role="region"
        aria-label="Notificações"
        className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2.5 pl-8 sm:pl-0"
      >
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
