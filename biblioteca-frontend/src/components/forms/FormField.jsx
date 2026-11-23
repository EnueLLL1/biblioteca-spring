import { AlertCircle } from 'lucide-react'

function getControlClassName(hasError) {
  return `w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 ${
    hasError ? 'border-danger bg-danger-soft/30' : 'border-edge-strong'
  }`
}

export default function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  actionSlot = null,
  children,
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = `${id}-error`
  const describedBy = [hintId, error ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="block text-sm font-semibold text-ink">
          {label}
          {required && (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {actionSlot}
      </div>

      {hint && (
        <p id={hintId} className="mb-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      )}

      {children({
        id,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': describedBy,
        className: getControlClassName(Boolean(error)),
      })}

      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
