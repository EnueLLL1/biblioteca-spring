import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Feather,
  Plus,
  Repeat,
  Users,
} from 'lucide-react'
import {
  autoresAPI,
  emprestimosAPI,
  livrosAPI,
  usuariosAPI,
} from '../services/api'
import { formatDateBR, getLoanDueStatus } from '../utils/date'
import PageHeader from '../components/ui/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'

function KpiCard({ title, value, subtitle, icon, to, tone = 'accent' }) {
  const Icon = icon
  const iconStyle =
    tone === 'warning'
      ? 'bg-warning-soft text-warning'
      : 'bg-accent-soft text-accent'

  return (
    <Link
      to={to}
      className="group flex flex-col justify-between rounded-2xl border border-edge bg-surface p-5 shadow-xs transition hover:border-edge-strong"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wider text-ink-muted uppercase">{title}</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-ink">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyle}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-edge pt-3 text-xs text-ink-muted">
        <span>{subtitle}</span>
        <ArrowRight
          className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:text-ink"
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}

export default function Home() {
  const [stats, setStats] = useState({
    livros: [],
    ativos: [],
    atrasados: [],
    autores: [],
    usuarios: [],
  })
  const [partialFailure, setPartialFailure] = useState(false)
  const [loading, setLoading] = useState(true)

  const carregarResumo = useCallback(async () => {
    setLoading(true)
    setPartialFailure(false)

    const results = await Promise.allSettled([
      livrosAPI.listarTodos(),
      emprestimosAPI.listarAtivos(),
      emprestimosAPI.listarAtrasados(),
      autoresAPI.listarTodos(),
      usuariosAPI.listarTodos(),
    ])

    const [livrosRes, ativosRes, atrasadosRes, autoresRes, usuariosRes] = results
    setPartialFailure(results.some(r => r.status === 'rejected'))

    setStats({
      livros: livrosRes.status === 'fulfilled' && Array.isArray(livrosRes.value) ? livrosRes.value : [],
      ativos: ativosRes.status === 'fulfilled' && Array.isArray(ativosRes.value) ? ativosRes.value : [],
      atrasados:
        atrasadosRes.status === 'fulfilled' && Array.isArray(atrasadosRes.value)
          ? atrasadosRes.value
          : [],
      autores:
        autoresRes.status === 'fulfilled' && Array.isArray(autoresRes.value) ? autoresRes.value : [],
      usuarios:
        usuariosRes.status === 'fulfilled' && Array.isArray(usuariosRes.value)
          ? usuariosRes.value
          : [],
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    carregarResumo()
  }, [carregarResumo])

  const disponiveis = stats.livros.filter(l => l.disponivel).length
  const emprestados = stats.livros.length - disponiveis

  return (
    <div>
      <PageHeader
        eyebrow="Visão Geral"
        title="Painel da Biblioteca"
        description="Acompanhe disponibilidade do acervo, circulação ativa e pendências de devolução em tempo real."
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

      {partialFailure && (
        <div
          role="alert"
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning"
        >
          <span>Alguns indicadores não puderam ser carregados. Verifique se o back-end Spring Boot está ativo.</span>
          <button
            type="button"
            onClick={carregarResumo}
            className="rounded-lg border border-warning/40 px-3 py-1 font-semibold transition hover:bg-warning/10"
          >
            Atualizar
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-36 animate-pulse rounded-2xl border border-edge bg-surface" />
          ))}
        </div>
      ) : (
        <section aria-label="Indicadores principais" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Acervo total"
            value={stats.livros.length}
            subtitle={`${disponiveis} disponíveis · ${emprestados} emprestados`}
            icon={BookOpen}
            to="/livros"
          />
          <KpiCard
            title="Empréstimos ativos"
            value={stats.ativos.length}
            subtitle={
              stats.atrasados.length > 0
                ? `${stats.atrasados.length} em atraso`
                : 'Todos dentro do prazo'
            }
            icon={Repeat}
            to="/emprestimos"
            tone={stats.atrasados.length > 0 ? 'warning' : 'accent'}
          />
          <KpiCard
            title="Autores"
            value={stats.autores.length}
            subtitle="Escritores catalogados"
            icon={Feather}
            to="/autores"
          />
          <KpiCard
            title="Usuários"
            value={stats.usuarios.length}
            subtitle="Leitores habilitados"
            icon={Users}
            to="/usuarios"
          />
        </section>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section
          aria-labelledby="overdue-heading"
          className="rounded-2xl border border-edge bg-surface p-6 shadow-xs lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-edge pb-4">
            <div className="flex items-center gap-2.5">
              {stats.atrasados.length > 0 ? (
                <AlertTriangle className="h-5 w-5 text-danger" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
              )}
              <h2 id="overdue-heading" className="font-serif text-xl font-semibold text-ink">
                Empréstimos em atraso
              </h2>
            </div>
            <Link
              to="/emprestimos"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Gerenciar empréstimos
            </Link>
          </div>

          {loading ? (
            <div className="h-24 animate-pulse rounded-xl bg-subtle" />
          ) : stats.atrasados.length === 0 ? (
            <div className="rounded-xl border border-dashed border-edge bg-canvas/60 px-5 py-8 text-center">
              <p className="font-medium text-ink">Nenhum empréstimo em atraso no momento.</p>
              <p className="mt-1 text-sm text-ink-muted">
                As devoluções previstas para hoje ou dias futuros podem ser conferidas em Empréstimos.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-edge">
              {stats.atrasados.slice(0, 5).map(item => {
                const due = getLoanDueStatus(item.dataDevolucao)
                return (
                  <li
                    key={item.idEmprestimo}
                    className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-serif text-base font-semibold text-ink">
                        {item.tituloLivro}
                      </p>
                      <p className="text-xs text-ink-muted">
                        Leitor: {item.nomeUsuario} · Previsto para{' '}
                        <span className="font-mono">{formatDateBR(item.dataDevolucao)}</span>
                      </p>
                    </div>
                    <StatusBadge tone="danger">{due.label}</StatusBadge>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section
          aria-labelledby="quick-actions-heading"
          className="rounded-2xl border border-edge bg-surface p-6 shadow-xs"
        >
          <h2 id="quick-actions-heading" className="font-serif text-xl font-semibold text-ink">
            Ações rápidas
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Atalhos diretos para as rotinas diárias da biblioteca.
          </p>
          <div className="mt-5 space-y-2.5">
            <Link
              to="/emprestimos/cadastro"
              className="flex items-center justify-between rounded-xl border border-edge bg-canvas/70 px-4 py-3 text-sm font-semibold text-ink transition hover:border-edge-strong hover:bg-subtle"
            >
              <span>Registrar empréstimo</span>
              <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
            </Link>
            <Link
              to="/livros/cadastro"
              className="flex items-center justify-between rounded-xl border border-edge bg-canvas/70 px-4 py-3 text-sm font-semibold text-ink transition hover:border-edge-strong hover:bg-subtle"
            >
              <span>Cadastrar novo livro</span>
              <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
            </Link>
            <Link
              to="/usuarios/cadastro"
              className="flex items-center justify-between rounded-xl border border-edge bg-canvas/70 px-4 py-3 text-sm font-semibold text-ink transition hover:border-edge-strong hover:bg-subtle"
            >
              <span>Cadastrar usuário</span>
              <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
            </Link>
            <Link
              to="/autores/cadastro"
              className="flex items-center justify-between rounded-xl border border-edge bg-canvas/70 px-4 py-3 text-sm font-semibold text-ink transition hover:border-edge-strong hover:bg-subtle"
            >
              <span>Cadastrar autor</span>
              <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
