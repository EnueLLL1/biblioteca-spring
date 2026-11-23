import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

const WIDTH_TOKENS = {
  'max-w-sm': '24rem',
  'max-w-md': '28rem',
  'max-w-lg': '32rem',
  'max-w-xl': '36rem',
  'max-w-2xl': '42rem',
}

export default function ModalDialog({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  lightDismiss = true,
}) {
  const dialogRef = useRef(null)
  const pressedOutsideRef = useRef(false)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return

    if (!dialog.hasAttribute('open') && typeof dialog.showModal === 'function') {
      dialog.showModal()
    }

    return () => {
      if (dialog.hasAttribute('open') && typeof dialog.close === 'function') {
        dialog.close()
      }
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog || !lightDismiss) return undefined
    if (typeof HTMLDialogElement !== 'undefined' && 'closedBy' in HTMLDialogElement.prototype) {
      return undefined
    }

    const isOutside = event => {
      const rect = dialog.getBoundingClientRect()
      return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
    }

    const onPointerDown = event => {
      pressedOutsideRef.current = isOutside(event)
    }

    const onPointerUp = event => {
      if (pressedOutsideRef.current && isOutside(event)) {
        dialog.close()
      }
      pressedOutsideRef.current = false
    }

    dialog.addEventListener('pointerdown', onPointerDown)
    dialog.addEventListener('pointerup', onPointerUp)
    return () => {
      dialog.removeEventListener('pointerdown', onPointerDown)
      dialog.removeEventListener('pointerup', onPointerUp)
    }
  }, [open, lightDismiss])

  if (!open) return null

  const handleClose = event => {
    event.currentTarget.returnValue = ''
    onClose?.()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      closedby={lightDismiss ? 'any' : 'closerequest'}
      onClose={handleClose}
      style={{ '--modal-max-width': WIDTH_TOKENS[maxWidth] || '32rem' }}
      className="modal-panel"
    >
      <div className="flex items-start justify-between gap-4 border-b border-edge px-6 py-4">
        <div>
          <h1 id={titleId} className="font-serif text-xl font-semibold text-ink">
            {title}
          </h1>
          {description && (
            <p id={descId} className="mt-1 text-sm text-ink-muted">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Fechar janela"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition hover:bg-subtle hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  )
}
