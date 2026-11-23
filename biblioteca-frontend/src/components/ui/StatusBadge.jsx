const TONE_MAP = {
  success: 'bg-success-soft text-success border-success/20',
  warning: 'bg-warning-soft text-warning border-warning/25',
  danger: 'bg-danger-soft text-danger border-danger/25',
  accent: 'bg-accent-soft text-accent border-accent/20',
  neutral: 'bg-subtle text-ink-muted border-edge',
}

export default function StatusBadge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TONE_MAP[tone] || TONE_MAP.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
