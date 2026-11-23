import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import ConfirmDialog from '../ui/ConfirmDialog'
import EmptyState from '../ui/EmptyState'
import ModalDialog from '../ui/ModalDialog'
import PageHeader from '../ui/PageHeader'
import { useToast } from '../ui/toastContext'
import { extractApiError } from '../../utils/apiError'
import { normalizeSearch } from '../../utils/text'

export default function SimpleCatalogPage({
  eyebrow,
  title,
  description,
  singular,
  article = 'o',
  newButtonLabel,
  modalTitle,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
  deleteConfirmTitle,
  deleteErrorFallback,
  icon: Icon,
  api,
  getId,
  getName,
  FormComponent: FormComp,
}) {
  const FormComponent = FormComp
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const searchId = useId()
  const { showToast } = useToast()

  const carregarDados = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await api.listarTodos()
      setItems(Array.isArray(data) ? data : [])
    } catch (error) {
      setLoadError(extractApiError(error, `Não foi possível carregar ${title.toLowerCase()}.`).message)
    } finally {
      setLoading(false)
    }
  }, [api, title])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const filteredItems = useMemo(() => {
    const q = normalizeSearch(query)
    if (!q) return items
    return items.filter(item => normalizeSearch(getName(item)).includes(q))
  }, [items, query, getName])

  const handleCreated = async () => {
    setCreateOpen(false)
    showToast({ type: 'success', message: `${singular} cadastrad${article} com sucesso.` })
    await carregarDados()
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.deletar(getId(deleteTarget))
      setDeleteTarget(null)
      showToast({ type: 'success', message: `${singular} removid${article} com sucesso.` })
      await carregarDados()
    } catch (error) {
      throw new Error(extractApiError(error, deleteErrorFallback).message)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-xs transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>{newButtonLabel}</span>
          </button>
        }
      />

      {loadError && (
        <div
          role="alert"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          <span>{loadError}</span>
          <button
            type="button"
            onClick={carregarDados}
            className="rounded-lg border border-danger/40 px-3 py-1 font-semibold transition hover:bg-danger/10"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <label htmlFor={searchId} className="visually-hidden">
              {searchPlaceholder}
            </label>
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-muted"
              aria-hidden="true"
            />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-edge-strong bg-surface py-2 pr-3.5 pl-10 text-sm text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </div>
          <p className="text-xs font-medium text-ink-muted">
            {filteredItems.length} de {items.length} {items.length === 1 ? 'registro' : 'registros'}
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-28 animate-pulse rounded-xl border border-edge bg-surface p-5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Icon}
          title={emptyTitle}
          description={emptyDescription}
          action={
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>{newButtonLabel}</span>
            </button>
          }
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum resultado encontrado"
          description="Ajuste o termo de busca para visualizar outros registros."
          action={
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-lg border border-edge-strong bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-subtle"
            >
              Limpar busca
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map(item => {
            const id = getId(item)
            const name = getName(item)
            return (
              <article
                key={id}
                className="flex items-center justify-between gap-4 rounded-xl border border-edge bg-surface p-5 shadow-xs transition hover:border-edge-strong"
              >
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2 text-xs text-ink-muted">
                    <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    <span className="font-mono">#{id}</span>
                  </div>
                  <h2 className="truncate font-serif text-lg font-semibold text-ink">{name}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  aria-label={`Deletar ${name}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-danger/30 bg-danger-soft/50 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Deletar</span>
                </button>
              </article>
            )
          })}
        </div>
      )}

      <ModalDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={modalTitle}
        lightDismiss={false}
      >
        <FormComponent onSuccess={handleCreated} onCancel={() => setCreateOpen(false)} />
      </ModalDialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteConfirmTitle}
        description={
          deleteTarget
            ? `Tem certeza que deseja remover "${getName(deleteTarget)}"? Esta ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Deletar"
      />
    </div>
  )
}
