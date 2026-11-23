import { useEffect, useId, useRef, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
}) {
  const dialogRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return
    setErrorMsg('')
    setSubmitting(false)
    if (!dialog.hasAttribute('open') && typeof dialog.showModal === 'function') {
      dialog.showModal()
    }
    return () => {
      if (dialog.hasAttribute('open') && typeof dialog.close === 'function') {
        dialog.close()
      }
    }
  }, [open])

  if (!open) return null

  const handleClose = event => {
    event.currentTarget.returnValue = ''
    setErrorMsg('')
    setSubmitting(false)
    onClose?.()
  }

  const handleConfirmClick = async () => {
    setSubmitting(true)
    setErrorMsg('')
    try {
      await onConfirm?.()
      dialogRef.current?.close('confirmed')
    } catch (error) {
      setErrorMsg(error?.message || 'Não foi possível concluir a operação.')
    } finally {
      setSubmitting(false)
    }
  }

  const confirmClass =
    variant === 'danger'
      ? 'bg-danger text-white hover:opacity-90'
      : 'bg-accent text-accent-fg hover:bg-accent-hover'

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      closedby="closerequest"
      onClose={handleClose}
      style={{ '--modal-max-width': '28rem' }}
      className="modal-panel"
    >
      <div className="p-6">
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              variant === 'danger' ? 'bg-danger-soft text-danger' : 'bg-accent-soft text-accent'
            }`}
          >
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 id={titleId} className="font-serif text-xl font-semibold text-ink">
              {title}
            </h1>
            {description && (
              <p id={descId} className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {description}
              </p>
            )}
          </div>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger"
          >
            {errorMsg}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            disabled={submitting}
            onClick={() => dialogRef.current?.close('cancel')}
            className="inline-flex items-center justify-center rounded-lg border border-edge-strong bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-subtle disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleConfirmClick}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${confirmClass}`}
          >
            {submitting ? 'Processando...' : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
