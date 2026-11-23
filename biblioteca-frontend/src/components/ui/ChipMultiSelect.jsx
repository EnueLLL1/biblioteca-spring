import { Check } from 'lucide-react'

export default function ChipMultiSelect({
  legend,
  options,
  selectedIds,
  onChange,
  getId,
  getLabel,
  emptyMessage = 'Nenhuma opção disponível.',
  actionSlot = null,
}) {
  const selectedSet = new Set(selectedIds.map(String))

  const toggle = id => {
    const strId = String(id)
    const next = new Set(selectedSet)
    if (next.has(strId)) {
      next.delete(strId)
    } else {
      next.add(strId)
    }
    onChange(Array.from(next))
  }

  return (
    <fieldset className="rounded-xl border border-edge bg-canvas/50 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <legend className="text-sm font-semibold text-ink">
          {legend}
          {selectedSet.size > 0 && (
            <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
              {selectedSet.size} {selectedSet.size === 1 ? 'selecionado' : 'selecionados'}
            </span>
          )}
        </legend>
        {actionSlot}
      </div>

      {options.length === 0 ? (
        <p className="text-sm text-ink-muted">{emptyMessage}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map(option => {
            const id = getId(option)
            const label = getLabel(option)
            const checked = selectedSet.has(String(id))

            return (
              <label
                key={id}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent ${
                  checked
                    ? 'border-accent bg-accent text-accent-fg'
                    : 'border-edge-strong bg-surface text-ink hover:bg-subtle'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggle(id)}
                />
                {checked && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                <span>{label}</span>
              </label>
            )
          })}
        </div>
      )}
    </fieldset>
  )
}
