import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Mail, Phone, Plus, Search, Trash2, Users as UsersIcon } from 'lucide-react'
import { usuariosAPI } from '../services/api'
import { extractApiError } from '../utils/apiError'
import { normalizeSearch } from '../utils/text'
import UsuarioForm from '../components/forms/UsuarioForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import ModalDialog from '../components/ui/ModalDialog'
import PageHeader from '../components/ui/PageHeader'
import { useToast } from '../components/ui/toastContext'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const searchId = useId()
  const captionId = useId()
  const { showToast } = useToast()

  const carregarUsuarios = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await usuariosAPI.listarTodos()
      setUsuarios(Array.isArray(data) ? data : [])
    } catch (error) {
      setLoadError(extractApiError(error, 'Não foi possível carregar os usuários.').message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarUsuarios()
  }, [carregarUsuarios])

  const filtered = useMemo(() => {
    const q = normalizeSearch(query)
    if (!q) return usuarios
    return usuarios.filter(
      u =>
        normalizeSearch(u.nome).includes(q) ||
        normalizeSearch(u.email).includes(q) ||
        normalizeSearch(u.telefone).includes(q)
    )
  }, [usuarios, query])

  const handleCreated = async () => {
    setCreateOpen(false)
    showToast({ type: 'success', message: 'Usuário cadastrado com sucesso.' })
    await carregarUsuarios()
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await usuariosAPI.deletar(deleteTarget.id)
      setDeleteTarget(null)
      showToast({ type: 'success', message: 'Usuário removido com sucesso.' })
      await carregarUsuarios()
    } catch (error) {
      throw new Error(
        extractApiError(
          error,
          'Não foi possível excluir este usuário. Verifique se há empréstimos vinculados.'
        ).message
      )
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Cadastros"
        title="Usuários"
        description="Gerencie os leitores cadastrados para retirada de livros."
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg shadow-xs transition hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Novo usuário</span>
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
            onClick={carregarUsuarios}
            className="rounded-lg border border-danger/40 px-3 py-1 font-semibold transition hover:bg-danger/10"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {usuarios.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <label htmlFor={searchId} className="visually-hidden">
              Buscar usuários por nome, e-mail ou telefone
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
              placeholder="Buscar por nome, e-mail ou telefone..."
              className="w-full rounded-lg border border-edge-strong bg-surface py-2 pr-3.5 pl-10 text-sm text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
          </div>
          <p className="text-xs font-medium text-ink-muted">
            {filtered.length} de {usuarios.length} {usuarios.length === 1 ? 'leitor' : 'leitores'}
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-16 animate-pulse rounded-xl border border-edge bg-surface" />
          ))}
        </div>
      ) : usuarios.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="Nenhum usuário cadastrado"
          description="Cadastre leitores para poder registrar novos empréstimos de livros."
          action={
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Cadastrar primeiro usuário</span>
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum usuário encontrado"
          description="Nenhum leitor corresponde ao filtro informado."
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
              Lista de usuários cadastrados na biblioteca
            </caption>
            <thead className="border-b border-edge bg-subtle/70 text-xs font-semibold tracking-wider text-ink-muted uppercase">
              <tr>
                <th scope="col" className="px-5 py-3.5">
                  Leitor
                </th>
                <th scope="col" className="px-5 py-3.5">
                  E-mail
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Telefone
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {filtered.map(usuario => (
                <tr key={usuario.id} className="transition hover:bg-subtle/35">
                  <th scope="row" className="px-5 py-4 font-semibold text-ink">
                    <span className="font-serif text-base">{usuario.nome}</span>
                    <span className="ml-2 font-mono text-xs font-normal text-ink-muted">
                      #{usuario.id}
                    </span>
                  </th>
                  <td data-label="E-mail" className="px-5 py-4 text-ink-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                      <span>{usuario.email}</span>
                    </span>
                  </td>
                  <td data-label="Telefone" className="px-5 py-4 font-mono text-xs text-ink-muted">
                    {usuario.telefone ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden="true" />
                        <span>{usuario.telefone}</span>
                      </span>
                    ) : (
                      'Não informado'
                    )}
                  </td>
                  <td data-label="Ações" className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(usuario)}
                      aria-label={`Excluir ${usuario.nome}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-danger-soft/50 px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Excluir</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Cadastrar novo usuário"
        description="Informe os dados do leitor para liberar empréstimos."
        lightDismiss={false}
      >
        <UsuarioForm onSuccess={handleCreated} onCancel={() => setCreateOpen(false)} />
      </ModalDialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir usuário?"
        description={
          deleteTarget
            ? `Deseja remover "${deleteTarget.nome}" (${deleteTarget.email})? Usuários com histórico de empréstimos não podem ser excluídos.`
            : ''
        }
        confirmLabel="Excluir"
      />
    </div>
  )
}
