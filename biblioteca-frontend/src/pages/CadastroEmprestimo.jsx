import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Plus } from 'lucide-react'
import { emprestimosAPI, livrosAPI, usuariosAPI } from '../services/api'
import { EmprestimoValidator } from '../services/validation'
import { extractApiError } from '../utils/apiError'
import { addDaysISO, formatDateBR, getTodayISO } from '../utils/date'
import FormField from '../components/forms/FormField'
import UsuarioForm from '../components/forms/UsuarioForm'
import ModalDialog from '../components/ui/ModalDialog'
import PageHeader from '../components/ui/PageHeader'
import { useToast } from '../components/ui/toastContext'

export default function CadastrarEmprestimo() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialLivroParam = searchParams.get('livroId') ?? ''

  const [form, setForm] = useState({
    idLivro: initialLivroParam,
    idUsuario: '',
  })
  const [livrosDisponiveis, setLivrosDisponiveis] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)
  const [userModalOpen, setUserModalOpen] = useState(false)

  const formRef = useRef(null)
  const livroSelectId = useId()
  const usuarioSelectId = useId()
  const { showToast } = useToast()

  const hojeISO = getTodayISO()
  const devolucaoISO = addDaysISO(hojeISO, 7)

  const carregarDados = useCallback(async () => {
    setLoadingData(true)
    setLoadError('')
    try {
      const [livrosData, usuariosData] = await Promise.all([
        livrosAPI.listarDisponiveis(),
        usuariosAPI.listarTodos(),
      ])
      const safeLivros = Array.isArray(livrosData) ? livrosData : []
      const safeUsuarios = Array.isArray(usuariosData) ? usuariosData : []

      setLivrosDisponiveis(safeLivros)
      setUsuarios(safeUsuarios)

      if (initialLivroParam) {
        const exists = safeLivros.some(l => String(l.idLivro) === String(initialLivroParam))
        if (!exists) {
          setForm(prev => ({ ...prev, idLivro: '' }))
        }
      }
    } catch (error) {
      setLoadError(
        extractApiError(error, 'Não foi possível carregar livros disponíveis e usuários.').message
      )
    } finally {
      setLoadingData(false)
    }
  }, [initialLivroParam])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const focusFirstInvalid = () => {
    requestAnimationFrame(() => {
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSubmitError('')

    const dadosLimpos = EmprestimoValidator.limparDados(form)
    const validator = new EmprestimoValidator()

    if (!validator.validar(dadosLimpos)) {
      setErrors(validator.getErrors())
      focusFirstInvalid()
      return
    }

    setErrors({})
    setSaving(true)

    try {
      await emprestimosAPI.criar({
        livroId: dadosLimpos.idLivro,
        usuarioId: dadosLimpos.idUsuario,
      })
      showToast({ type: 'success', message: 'Empréstimo registrado com sucesso.' })
      navigate('/emprestimos')
    } catch (error) {
      const parsed = extractApiError(error, 'Não foi possível registrar o empréstimo.')
      setSubmitError(parsed.message)
    } finally {
      setSaving(false)
    }
  }

  const handleQuickUserCreated = criado => {
    setUsuarios(prev => [...prev, criado])
    setForm(prev => ({ ...prev, idUsuario: String(criado.id) }))
    setErrors(prev => ({ ...prev, idUsuario: undefined }))
    setUserModalOpen(false)
    showToast({ type: 'success', message: `Usuário "${criado.nome}" cadastrado.` })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <Link
          to="/emprestimos"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Voltar para empréstimos</span>
        </Link>
      </div>

      <PageHeader
        eyebrow="Circulação · Retirada"
        title="Registrar empréstimo"
        description="Vincule um exemplar disponível a um leitor cadastrado. O prazo padrão de devolução é de 7 dias."
      />

      <div className="rounded-2xl border border-edge bg-surface p-6 shadow-xs sm:p-8">
        {loadingData ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-14 animate-pulse rounded-xl bg-subtle" />
            ))}
          </div>
        ) : loadError ? (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            <span>{loadError}</span>
            <button
              type="button"
              onClick={carregarDados}
              className="rounded-lg border border-danger/40 px-3 py-1.5 font-semibold transition hover:bg-danger/10"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
            {submitError && (
              <div
                role="alert"
                className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
              >
                {submitError}
              </div>
            )}

            <FormField
              id={livroSelectId}
              label="Livro disponível"
              hint={`${livrosDisponiveis.length} ${
                livrosDisponiveis.length === 1 ? 'exemplar disponível' : 'exemplares disponíveis'
              } para retirada.`}
              error={errors.idLivro}
              required
            >
              {props => (
                <select
                  {...props}
                  required
                  disabled={saving}
                  value={form.idLivro}
                  onChange={e => setForm(prev => ({ ...prev, idLivro: e.target.value }))}
                >
                  <option value="">Selecione um livro disponível</option>
                  {livrosDisponiveis.map(livro => (
                    <option key={livro.idLivro} value={livro.idLivro}>
                      {livro.tituloLivro} — {livro.autorLivro} (ISBN {livro.isbnLivro})
                    </option>
                  ))}
                </select>
              )}
            </FormField>

            <FormField
              id={usuarioSelectId}
              label="Leitor"
              hint={`${usuarios.length} ${
                usuarios.length === 1 ? 'leitor cadastrado' : 'leitores cadastrados'
              }.`}
              error={errors.idUsuario}
              required
              actionSlot={
                <button
                  type="button"
                  onClick={() => setUserModalOpen(true)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-accent transition hover:bg-accent-soft"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Novo usuário</span>
                </button>
              }
            >
              {props => (
                <select
                  {...props}
                  required
                  disabled={saving}
                  value={form.idUsuario}
                  onChange={e => setForm(prev => ({ ...prev, idUsuario: e.target.value }))}
                >
                  <option value="">Selecione um leitor</option>
                  {usuarios.map(usuario => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nome} ({usuario.email})
                    </option>
                  ))}
                </select>
              )}
            </FormField>

            <div className="rounded-xl border border-edge bg-canvas/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-ink-muted uppercase">
                <Calendar className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                <span>Vigência automática do empréstimo</span>
              </div>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-ink-muted">Data da retirada</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-ink">
                    {formatDateBR(hojeISO)} (hoje)
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-muted">Devolução prevista (+7 dias)</dt>
                  <dd className="mt-0.5 font-mono font-semibold text-ink">
                    {formatDateBR(devolucaoISO)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-edge pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => navigate('/emprestimos')}
                className="inline-flex items-center justify-center rounded-lg border border-edge-strong bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-subtle disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || livrosDisponiveis.length === 0 || usuarios.length === 0}
                className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-xs transition hover:bg-accent-hover disabled:opacity-50"
              >
                {saving ? 'Registrando...' : 'Confirmar empréstimo'}
              </button>
            </div>
          </form>
        )}
      </div>

      <ModalDialog
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title="Novo usuário"
        description="O leitor será selecionado automaticamente neste empréstimo."
        lightDismiss={false}
      >
        <UsuarioForm
          onSuccess={handleQuickUserCreated}
          onCancel={() => setUserModalOpen(false)}
        />
      </ModalDialog>
    </div>
  )
}
