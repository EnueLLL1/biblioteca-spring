import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Edit3,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react'
import { livrosAPI } from '../services/api'
import { extractApiError } from '../utils/apiError'
import { normalizeSearch } from '../utils/text'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'
import { useToast } from '../components/ui/toastContext'

export default function Livros() {
  const [livros, setLivros] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'available' | 'borrowed'
  const [categoriaFilter, setCategoriaFilter] = useState('')
  const [generoFilter, setGeneroFilter] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const searchId = useId()
  const statusId = useId()
  const categoriaId = useId()
  const generoId = useId()
  const { showToast } = useToast()

  const carregarLivros = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await livrosAPI.listarTodos()
      setLivros(Array.isArray(data) ? data : [])
    } catch (error) {
      setLoadError(
        extractApiError(
          error,
          'Não foi possível carregar os livros. Verifique se a API está em execução.'
        ).message
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarLivros()
  }, [carregarLivros])

  const categoriasDisponiveis = useMemo(() => {
    const set = new Set()
    livros.forEach(livro => {
      Array.from(livro.categorias ?? []).forEach(cat => {
        if (cat) set.add(cat)
      })
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [livros])

  const generosDisponiveis = useMemo(() => {
    const set = new Set()
    livros.forEach(livro => {
      Array.from(livro.generos ?? []).forEach(gen => {
        if (gen) set.add(gen)
      })
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [livros])

  const filteredLivros = useMemo(() => {
    const q = normalizeSearch(query)

    return livros.filter(livro => {
      if (statusFilter === 'available' && !livro.disponivel) return false
      if (statusFilter === 'borrowed' && livro.disponivel) return false

      const cats = Array.from(livro.categorias ?? [])
      const gens = Array.from(livro.generos ?? [])

      if (categoriaFilter && !cats.includes(categoriaFilter)) return false
      if (generoFilter && !gens.includes(generoFilter)) return false

      if (!q) return true
      return (
        normalizeSearch(livro.tituloLivro).includes(q) ||
        normalizeSearch(livro.autorLivro).includes(q) ||
        normalizeSearch(livro.editoraLivro).includes(q) ||
        normalizeSearch(livro.isbnLivro).includes(q)
      )
    })
  }, [livros, query, statusFilter, categoriaFilter, generoFilter])

  const hasActiveFilters =
    Boolean(query.trim()) ||
    statusFilter !== 'all' ||
    Boolean(categoriaFilter) ||
    Boolean(generoFilter)

  const limparFiltros = () => {
    setQuery('')
    setStatusFilter('all')
    setCategoriaFilter('')
    setGeneroFilter('')
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await livrosAPI.deletar(deleteTarget.idLivro)
      setDeleteTarget(null)
      showToast({ type: 'success', message: 'Livro removido do acervo.' })
      await carregarLivros()
    } catch (error) {
      const status = error?.status ?? error?.response?.status
      if (status === 500) {
        throw new Error(
          'Não foi possível excluir este livro porque ele possui histórico de empréstimos vinculado no sistema.'
        )
      }
      throw new Error(extractApiError(error, 'Erro ao excluir livro.').message)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Circulação · Catálogo"
        title="Livros"
        description="Pesquise por título, autor, editora ou ISBN, filtre por disponibilidade e acompanhe cada exemplar."
        actions={
          <Link
            to="/livros/cadastro"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-xs transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Novo livro</span>
          </Link>
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
            onClick={carregarLivros}
            className="rounded-lg border border-danger/40 px-3 py-1 font-semibold transition hover:bg-danger/10"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {livros.length > 0 && (
        <section
          aria-label="Filtros do acervo"
          className="mb-6 rounded-2xl border border-edge bg-surface p-4 shadow-xs"
        >
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <label htmlFor={searchId} className="mb-1 block text-xs font-semibold text-ink-muted">
                Busca rápida
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted"
                  aria-hidden="true"
                />
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Título, autor, editora ou ISBN..."
                  className="w-full rounded-lg border border-edge-strong bg-canvas/60 py-2 pr-3 pl-9 text-sm text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
              </div>
            </div>

            <div>
              <label htmlFor={statusId} className="mb-1 block text-xs font-semibold text-ink-muted">
                Disponibilidade
              </label>
              <select
                id={statusId}
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-edge-strong bg-canvas/60 px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <option value="all">Todos ({livros.length})</option>
                <option value="available">
                  Disponíveis ({livros.filter(l => l.disponivel).length})
                </option>
                <option value="borrowed">
                  Emprestados ({livros.filter(l => !l.disponivel).length})
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor={categoriaId}
                className="mb-1 block text-xs font-semibold text-ink-muted"
              >
                Categoria
              </label>
              <select
                id={categoriaId}
                value={categoriaFilter}
                onChange={e => setCategoriaFilter(e.target.value)}
                className="w-full rounded-lg border border-edge-strong bg-canvas/60 px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <option value="">Todas as categorias</option>
                {categoriasDisponiveis.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={generoId} className="mb-1 block text-xs font-semibold text-ink-muted">
                Gênero
              </label>
              <select
                id={generoId}
                value={generoFilter}
                onChange={e => setGeneroFilter(e.target.value)}
                className="w-full rounded-lg border border-edge-strong bg-canvas/60 px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <option value="">Todos os gêneros</option>
                {generosDisponiveis.map(gen => (
                  <option key={gen} value={gen}>
                    {gen}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-edge pt-3 text-xs text-ink-muted">
            <span>
              Exibindo <strong className="text-ink">{filteredLivros.length}</strong> de{' '}
              {livros.length} {livros.length === 1 ? 'livro' : 'livros'}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={limparFiltros}
                className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Limpar filtros</span>
              </button>
            )}
          </div>
        </section>
      )}

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-72 animate-pulse rounded-2xl border border-edge bg-surface p-6" />
          ))}
        </div>
      ) : livros.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhum livro cadastrado"
          description="Comece adicionando as primeiras obras para gerenciar empréstimos e categorias."
          action={
            <Link
              to="/livros/cadastro"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Cadastrar primeiro livro</span>
            </Link>
          }
        />
      ) : filteredLivros.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum livro corresponde aos filtros"
          description="Tente alterar a busca ou limpar os filtros ativos."
          action={
            <button
              type="button"
              onClick={limparFiltros}
              className="rounded-lg border border-edge-strong bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-subtle"
            >
              Limpar filtros
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredLivros.map(livro => {
            const tags = [
              ...Array.from(livro.categorias ?? []),
              ...Array.from(livro.generos ?? []),
            ]
            const visibleTags = tags.slice(0, 4)
            const hiddenCount = Math.max(0, tags.length - visibleTags.length)

            return (
              <article
                key={livro.idLivro}
                className="flex flex-col justify-between rounded-2xl border border-edge bg-surface p-6 shadow-xs transition hover:border-edge-strong"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <StatusBadge tone={livro.disponivel ? 'success' : 'warning'}>
                      {livro.disponivel ? 'Disponível' : 'Emprestado'}
                    </StatusBadge>
                    <span className="font-mono text-xs font-medium text-ink-muted">
                      {livro.anoPublicado}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl font-semibold leading-snug text-ink">
                    {livro.tituloLivro}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-ink-muted">
                    {livro.autorLivro}
                    {livro.editoraLivro ? ` · ${livro.editoraLivro}` : ''}
                  </p>

                  {livro.isbnLivro && (
                    <p className="mt-2 font-mono text-xs text-ink-muted">
                      ISBN {livro.isbnLivro}
                    </p>
                  )}

                  {livro.descricaoLivro && (
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                      {livro.descricaoLivro}
                    </p>
                  )}

                  {visibleTags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {visibleTags.map(tag => (
                        <span
                          key={tag}
                          className="rounded-full border border-edge bg-subtle px-2.5 py-0.5 text-xs font-medium text-ink-muted"
                        >
                          {tag}
                        </span>
                      ))}
                      {hiddenCount > 0 && (
                        <span className="rounded-full border border-edge bg-subtle px-2.5 py-0.5 font-mono text-xs text-ink-muted">
                          +{hiddenCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-2 border-t border-edge pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {livro.disponivel && (
                      <Link
                        to={`/emprestimos/cadastro?livroId=${livro.idLivro}`}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-fg transition hover:bg-accent-hover"
                      >
                        <span>Emprestar</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    )}

                    <Link
                      to={`/livros/${livro.idLivro}/editar`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-edge-strong bg-surface px-3 py-2 text-xs font-semibold text-ink transition hover:bg-subtle"
                    >
                      <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Editar</span>
                    </Link>

                    <button
                      type="button"
                      disabled={!livro.disponivel}
                      title={
                        !livro.disponivel
                          ? 'Devolva o livro antes de tentar removê-lo'
                          : undefined
                      }
                      aria-label={`Excluir ${livro.tituloLivro}`}
                      onClick={() => setDeleteTarget(livro)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-danger/30 bg-danger-soft/50 px-3 py-2 text-xs font-semibold text-danger transition hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Excluir</span>
                    </button>
                  </div>

                  {!livro.disponivel && (
                    <p className="text-[11px] text-ink-muted">
                      Exemplar emprestado — exclusão bloqueada até a devolução.
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir livro?"
        description={
          deleteTarget
            ? `Tem certeza que deseja excluir "${deleteTarget.tituloLivro}"? Livros com histórico de empréstimos não podem ser apagados.`
            : ''
        }
        confirmLabel="Excluir"
      />
    </div>
  )
}
