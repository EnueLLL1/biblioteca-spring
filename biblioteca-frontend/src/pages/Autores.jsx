import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Feather, Globe, Plus, Search, Trash2 } from 'lucide-react'
import { autoresAPI } from '../services/api'
import { extractApiError } from '../utils/apiError'
import { normalizeSearch } from '../utils/text'
import AutorForm from '../components/forms/AutorForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import ModalDialog from '../components/ui/ModalDialog'
import PageHeader from '../components/ui/PageHeader'
import { useToast } from '../components/ui/toastContext'

export default function Autores() {
  const [autores, setAutores] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const searchId = useId()
  const { showToast } = useToast()

  const carregarAutores = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await autoresAPI.listarTodos()
      setAutores(Array.isArray(data) ? data : [])
    } catch (error) {
      setLoadError(extractApiError(error, 'Não foi possível carregar os autores.').message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarAutores()
  }, [carregarAutores])

  const filtered = useMemo(() => {
    const q = normalizeSearch(query)
    if (!q) return autores
    return autores.filter(
      autor =>
        normalizeSearch(autor.autorLivro).includes(q) ||
        normalizeSearch(autor.autorNacionalidade).includes(q)
    )
  }, [autores, query])

  const handleCreated = async () => {
    setCreateOpen(false)
    showToast({ type: 'success', message: 'Autor cadastrado com sucesso.' })
    await carregarAutores()
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await autoresAPI.deletar(deleteTarget.idAutor)
      setDeleteTarget(null)
      showToast({ type: 'success', message: 'Autor removido com sucesso.' })
      await carregarAutores()
    } catch (error) {
      throw new Error(
        extractApiError(
          error,
          'Não foi possível remover este autor. Verifique se há livros associados.'
        ).message
      )
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Cadastros"
        title="Autores"
        description="Organize os escritores vinculados às obras do acervo."
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-xs transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Novo autor</span>
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
            onClick={carregarAutores}
            className="rounded-lg border border-danger/40 px-3 py-1 font-semibold transition hover:bg-danger/10"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {autores.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <label htmlFor={searchId} className="visually-hidden">
              Buscar autores por nome ou nacionalidade
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
              placeholder="Buscar por nome ou nacionalidade..."
              className="w-full rounded-lg border border-edge-strong bg-surface py-2 pr-3.5 pl-10 text-sm text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </div>
          <p className="text-xs font-medium text-ink-muted">
            {filtered.length} de {autores.length} {autores.length === 1 ? 'autor' : 'autores'}
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 animate-pulse rounded-xl border border-edge bg-surface p-5" />
          ))}
        </div>
      ) : autores.length === 0 ? (
        <EmptyState
          icon={Feather}
          title="Nenhum autor cadastrado"
          description="Adicione autores antes ou durante o cadastro de novos livros."
          action={
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Criar primeiro autor</span>
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum autor encontrado"
          description="Ajuste a busca para visualizar outros autores cadastrados."
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
          {autores.length > 0 &&
            filtered.map(autor => (
              <article
                key={autor.idAutor}
                className="flex flex-col justify-between gap-4 rounded-xl border border-edge bg-surface p-5 shadow-xs transition hover:border-edge-strong"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                      <Globe className="h-3 w-3" aria-hidden="true" />
                      <span>{autor.autorNacionalidade || 'Nacionalidade não informada'}</span>
                    </span>
                    <span className="font-mono text-xs text-ink-muted">#{autor.idAutor}</span>
                  </div>
                  <h2 className="font-serif text-xl font-semibold text-ink">{autor.autorLivro}</h2>
                </div>

                <div className="flex justify-end border-t border-edge pt-3">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(autor)}
                    aria-label={`Excluir ${autor.autorLivro}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger-soft/50 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Excluir</span>
                  </button>
                </div>
              </article>
            ))}
        </div>
      )}

      <ModalDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Cadastrar novo autor"
        lightDismiss={false}
      >
        <AutorForm onSuccess={handleCreated} onCancel={() => setCreateOpen(false)} />
      </ModalDialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir autor?"
        description={
          deleteTarget
            ? `Tem certeza que deseja excluir "${deleteTarget.autorLivro}"? Autores com livros cadastrados não podem ser removidos.`
            : ''
        }
        confirmLabel="Excluir"
      />
    </div>
  )
}
