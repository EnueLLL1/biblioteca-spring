import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, Plus, Repeat, Search } from 'lucide-react'
import { emprestimosAPI } from '../services/api'
import { extractApiError } from '../utils/apiError'
import { formatDateBR, getLoanDueStatus } from '../utils/date'
import { normalizeSearch } from '../utils/text'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'
import { useToast } from '../components/ui/toastContext'

const DUE_TONE = {
  overdue: 'danger',
  today: 'warning',
  upcoming: 'accent',
}

export default function Emprestimos() {
  const [ativos, setAtivos] = useState([])
  const [atrasados, setAtrasados] = useState([])
  const [tab, setTab] = useState('ativos') // 'ativos' | 'atrasados'
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [returnTarget, setReturnTarget] = useState(null)

  const searchId = useId()
  const captionId = useId()
  const { showToast } = useToast()

  const carregarEmprestimos = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const [ativosData, atrasadosData] = await Promise.all([
        emprestimosAPI.listarAtivos(),
        emprestimosAPI.listarAtrasados(),
      ])
      setAtivos(Array.isArray(ativosData) ? ativosData : [])
      setAtrasados(Array.isArray(atrasadosData) ? atrasadosData : [])
    } catch (error) {
      setLoadError(
        extractApiError(error, 'Não foi possível carregar os empréstimos.').message
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarEmprestimos()
  }, [carregarEmprestimos])

  const baseList = tab === 'atrasados' ? atrasados : ativos

  const filtered = useMemo(() => {
    const q = normalizeSearch(query)
    if (!q) return baseList
    return baseList.filter(
      item =>
        normalizeSearch(item.tituloLivro).includes(q) ||
        normalizeSearch(item.isbnLivro).includes(q) ||
        normalizeSearch(item.nomeUsuario).includes(q) ||
        normalizeSearch(item.emailUsuario).includes(q)
    )
  }, [baseList, query])

  const handleConfirmReturn = async () => {
    if (!returnTarget) return
    try {
      await emprestimosAPI.devolver(returnTarget.idEmprestimo)
      setReturnTarget(null)
      showToast({
        type: 'success',
        message: `Devolução de "${returnTarget.tituloLivro}" registrada.`,
      })
      await carregarEmprestimos()
    } catch (error) {
      throw new Error(extractApiError(error, 'Não foi possível registrar a devolução.').message)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Circulação · Movimentação"
        title="Empréstimos"
        description="Acompanhe retiradas em aberto, prazos de entrega e registre devoluções."
        actions={
          <Link
            to="/emprestimos/cadastro"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-xs transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Novo empréstimo</span>
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
            onClick={carregarEmprestimos}
            className="rounded-lg border border-danger/40 px-3 py-1 font-semibold transition hover:bg-danger/10"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filtrar empréstimos por situação"
          className="inline-flex w-fit rounded-xl border border-edge bg-surface p-1 shadow-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'ativos'}
            onClick={() => setTab('ativos')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === 'ativos'
                ? 'bg-accent text-accent-fg'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <span>Ativos</span>
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-xs ${
                tab === 'ativos' ? 'bg-black/15 text-accent-fg' : 'bg-subtle text-ink-muted'
              }`}
            >
              {ativos.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === 'atrasados'}
            onClick={() => setTab('atrasados')}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === 'atrasados'
                ? 'bg-accent text-accent-fg'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Em atraso</span>
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-xs ${
                tab === 'atrasados'
                  ? 'bg-black/15 text-accent-fg'
                  : atrasados.length > 0
                    ? 'bg-danger-soft text-danger'
                    : 'bg-subtle text-ink-muted'
              }`}
            >
              {atrasados.length}
            </span>
          </button>
        </div>

        {(ativos.length > 0 || atrasados.length > 0) && (
          <div className="relative w-full max-w-sm">
            <label htmlFor={searchId} className="visually-hidden">
              Buscar por livro, ISBN ou leitor
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
              placeholder="Buscar por livro, ISBN ou leitor..."
              className="w-full rounded-lg border border-edge-strong bg-surface py-2 pr-3.5 pl-10 text-sm text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-16 animate-pulse rounded-xl border border-edge bg-surface" />
          ))}
        </div>
      ) : baseList.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title={
            tab === 'atrasados'
              ? 'Nenhum empréstimo em atraso'
              : 'Nenhum empréstimo ativo no momento'
          }
          description={
            tab === 'atrasados'
              ? 'Todos os exemplares emprestados estão dentro do prazo de devolução.'
              : 'Quando um exemplar for retirado por um leitor, ele aparecerá aqui.'
          }
          action={
            tab === 'ativos' && (
              <Link
                to="/emprestimos/cadastro"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Registrar primeiro empréstimo</span>
              </Link>
            )
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum empréstimo encontrado"
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
        <div
          tabIndex={0}
          role="region"
          aria-labelledby={captionId}
          className="responsive-table-wrap rounded-2xl border border-edge bg-surface shadow-xs"
        >
          <table className="responsive-table text-left text-sm">
            <caption id={captionId} className="visually-hidden">
              {tab === 'atrasados'
                ? 'Lista de empréstimos em atraso'
                : 'Lista de empréstimos ativos'}
            </caption>
            <thead className="border-b border-edge bg-subtle/70 text-xs font-semibold tracking-wider text-ink-muted uppercase">
              <tr>
                <th scope="col" className="px-5 py-3.5">
                  Livro
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Leitor
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Retirada
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Devolução prevista
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Prazo
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {filtered.map(emprestimo => {
                const due = getLoanDueStatus(emprestimo.dataDevolucao)
                return (
                  <tr key={emprestimo.idEmprestimo} className="transition hover:bg-subtle/35">
                    <th scope="row" className="px-5 py-4 font-semibold text-ink">
                      <div className="font-serif text-base">{emprestimo.tituloLivro}</div>
                      {emprestimo.isbnLivro && (
                        <div className="mt-0.5 font-mono text-xs font-normal text-ink-muted">
                          ISBN {emprestimo.isbnLivro}
                        </div>
                      )}
                    </th>
                    <td data-label="Leitor" className="px-5 py-4">
                      <div className="font-medium text-ink">{emprestimo.nomeUsuario}</div>
                      {emprestimo.emailUsuario && (
                        <div className="text-xs text-ink-muted">{emprestimo.emailUsuario}</div>
                      )}
                    </td>
                    <td
                      data-label="Retirada"
                      className="px-5 py-4 font-mono text-xs text-ink-muted"
                    >
                      {formatDateBR(emprestimo.dataEmprestimo)}
                    </td>
                    <td
                      data-label="Devolução prevista"
                      className="px-5 py-4 font-mono text-xs text-ink"
                    >
                      {formatDateBR(emprestimo.dataDevolucao)}
                    </td>
                    <td data-label="Prazo" className="px-5 py-4">
                      <StatusBadge tone={DUE_TONE[due.state] || 'neutral'}>
                        {due.label}
                      </StatusBadge>
                    </td>
                    <td data-label="Ações" className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setReturnTarget(emprestimo)}
                        aria-label={`Devolver ${emprestimo.tituloLivro}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Devolver</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(returnTarget)}
        onClose={() => setReturnTarget(null)}
        onConfirm={handleConfirmReturn}
        variant="primary"
        title="Confirmar devolução?"
        description={
          returnTarget
            ? `Registrar a devolução de "${returnTarget.tituloLivro}" emprestado para ${returnTarget.nomeUsuario}? O exemplar voltará a ficar disponível no catálogo.`
            : ''
        }
        confirmLabel="Confirmar devolução"
      />
    </div>
  )
}
