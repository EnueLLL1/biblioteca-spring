import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  autoresAPI,
  categoriasAPI,
  generosAPI,
  livrosAPI,
} from '../../services/api'
import { CriarLivroDTOValidator } from '../../services/validation'
import { extractApiError } from '../../utils/apiError'
import ChipMultiSelect from '../ui/ChipMultiSelect'
import ModalDialog from '../ui/ModalDialog'
import StatusBadge from '../ui/StatusBadge'
import { useToast } from '../ui/toastContext'
import AutorForm from './AutorForm'
import CategoriaForm from './CategoriaForm'
import FormField from './FormField'
import GeneroForm from './GeneroForm'

const EMPTY_FORM = {
  tituloLivro: '',
  editoraLivro: '',
  anoPublicado: '',
  descricaoLivro: '',
  isbnLivro: '',
  disponivel: true,
  idAutor: '',
  idCategorias: [],
  idGeneros: [],
}

export default function LivroForm({ livroId = null, onSuccess, onCancel }) {
  const isEditing = Boolean(livroId)
  const [form, setForm] = useState(EMPTY_FORM)
  const [autores, setAutores] = useState([])
  const [categorias, setCategorias] = useState([])
  const [generos, setGeneros] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [resolutionError, setResolutionError] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)
  const [quickModal, setQuickModal] = useState(null) // 'autor' | 'categoria' | 'genero' | null

  const formRef = useRef(null)
  const { showToast } = useToast()

  const tituloId = useId()
  const editoraId = useId()
  const anoId = useId()
  const isbnId = useId()
  const autorId = useId()
  const descricaoId = useId()

  const focusFirstInvalid = () => {
    requestAnimationFrame(() => {
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    })
  }

  const carregarDados = useCallback(async () => {
    setLoadingData(true)
    setLoadError('')
    setResolutionError('')

    try {
      const [autoresData, categoriasData, generosData, livroData] = await Promise.all([
        autoresAPI.listarTodos(),
        categoriasAPI.listarTodos(),
        generosAPI.listarTodos(),
        isEditing ? livrosAPI.buscarPorId(livroId) : Promise.resolve(null),
      ])

      const safeAutores = Array.isArray(autoresData) ? autoresData : []
      const safeCategorias = Array.isArray(categoriasData) ? categoriasData : []
      const safeGeneros = Array.isArray(generosData) ? generosData : []

      setAutores(safeAutores)
      setCategorias(safeCategorias)
      setGeneros(safeGeneros)

      if (isEditing && livroData) {
        const matchedAutor = safeAutores.find(a => a.autorLivro === livroData.autorLivro)
        const livroCatNames = Array.from(livroData.categorias ?? [])
        const livroGenNames = Array.from(livroData.generos ?? [])

        const resolvedCatIds = safeCategorias
          .filter(c => livroCatNames.includes(c.nomeCategoria))
          .map(c => String(c.idCategoria))

        const resolvedGenIds = safeGeneros
          .filter(g => livroGenNames.includes(g.nomeGenero))
          .map(g => String(g.idGenero))

        if (
          !matchedAutor ||
          resolvedCatIds.length !== livroCatNames.length ||
          resolvedGenIds.length !== livroGenNames.length
        ) {
          setResolutionError(
            'Não foi possível mapear com segurança o autor, categorias ou gêneros originais deste livro. Recarregue antes de salvar para evitar perda de vínculos.'
          )
        }

        setForm({
          tituloLivro: livroData.tituloLivro ?? '',
          editoraLivro: livroData.editoraLivro ?? '',
          anoPublicado: livroData.anoPublicado != null ? String(livroData.anoPublicado) : '',
          descricaoLivro: livroData.descricaoLivro ?? '',
          isbnLivro: livroData.isbnLivro ?? '',
          disponivel: Boolean(livroData.disponivel),
          idAutor: matchedAutor ? String(matchedAutor.idAutor) : '',
          idCategorias: resolvedCatIds,
          idGeneros: resolvedGenIds,
        })
      }
    } catch (error) {
      setLoadError(
        extractApiError(error, 'Não foi possível carregar os dados necessários para o formulário.').message
      )
    } finally {
      setLoadingData(false)
    }
  }, [isEditing, livroId])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const handleSubmit = async event => {
    event.preventDefault()
    if (resolutionError) return
    setSubmitError('')

    const dadosLimpos = CriarLivroDTOValidator.limparDados(form)
    if (isEditing) {
      // Preserva a disponibilidade original em edição (controlada por empréstimos)
      dadosLimpos.disponivel = Boolean(form.disponivel)
    }

    const validator = new CriarLivroDTOValidator()
    if (!validator.validar(dadosLimpos)) {
      setErrors(validator.getErrors())
      focusFirstInvalid()
      return
    }

    setErrors({})
    setSaving(true)

    try {
      const resultado = isEditing
        ? await livrosAPI.atualizar(livroId, dadosLimpos)
        : await livrosAPI.criar(dadosLimpos)
      onSuccess?.(resultado)
    } catch (error) {
      const parsed = extractApiError(
        error,
        isEditing ? 'Erro ao atualizar livro.' : 'Erro ao cadastrar livro.'
      )
      if (Object.keys(parsed.fieldErrors).length > 0) {
        setErrors(parsed.fieldErrors)
        focusFirstInvalid()
      } else {
        setSubmitError(parsed.message)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleQuickAutorCreated = criado => {
    setAutores(prev => [...prev, criado])
    setForm(prev => ({ ...prev, idAutor: String(criado.idAutor) }))
    setErrors(prev => ({ ...prev, idAutor: undefined }))
    setQuickModal(null)
    showToast({ type: 'success', message: `Autor "${criado.autorLivro}" adicionado.` })
  }

  const handleQuickCategoriaCreated = criada => {
    setCategorias(prev => [...prev, criada])
    setForm(prev => ({
      ...prev,
      idCategorias: [...prev.idCategorias, String(criada.idCategoria)],
    }))
    setQuickModal(null)
    showToast({ type: 'success', message: `Categoria "${criada.nomeCategoria}" adicionada.` })
  }

  const handleQuickGeneroCreated = criado => {
    setGeneros(prev => [...prev, criado])
    setForm(prev => ({
      ...prev,
      idGeneros: [...prev.idGeneros, String(criado.idGenero)],
    }))
    setQuickModal(null)
    showToast({ type: 'success', message: `Gênero "${criado.nomeGenero}" adicionado.` })
  }

  if (loadingData) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="h-14 animate-pulse rounded-xl bg-subtle" />
        ))}
      </div>
    )
  }

  if (loadError) {
    return (
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
          Recarregar dados
        </button>
      </div>
    )
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
        {isEditing && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-edge bg-canvas/70 px-4 py-3 text-sm">
            <span className="font-medium text-ink-muted">
              Status atual de circulação (somente leitura)
            </span>
            <StatusBadge tone={form.disponivel ? 'success' : 'warning'}>
              {form.disponivel ? 'Disponível para empréstimo' : 'Emprestado no momento'}
            </StatusBadge>
          </div>
        )}

        {resolutionError && (
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            {resolutionError}
          </div>
        )}

        {submitError && (
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            {submitError}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id={tituloId}
            label="Título"
            hint="Até 200 caracteres."
            error={errors.tituloLivro}
            required
          >
            {props => (
              <input
                {...props}
                type="text"
                maxLength={200}
                required
                disabled={saving}
                placeholder="Ex: Dom Casmurro"
                value={form.tituloLivro}
                onChange={e => setForm(prev => ({ ...prev, tituloLivro: e.target.value }))}
              />
            )}
          </FormField>

          <FormField
            id={editoraId}
            label="Editora"
            hint="Até 100 caracteres."
            error={errors.editoraLivro}
            required
          >
            {props => (
              <input
                {...props}
                type="text"
                maxLength={100}
                required
                disabled={saving}
                placeholder="Ex: Companhia das Letras"
                value={form.editoraLivro}
                onChange={e => setForm(prev => ({ ...prev, editoraLivro: e.target.value }))}
              />
            )}
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id={anoId}
            label="Ano de publicação"
            hint="Informe um ano entre 1000 e 2100."
            error={errors.anoPublicado}
            required
          >
            {props => (
              <input
                {...props}
                type="number"
                min={1000}
                max={2100}
                required
                disabled={saving}
                placeholder="Ex: 1899"
                value={form.anoPublicado}
                onChange={e => setForm(prev => ({ ...prev, anoPublicado: e.target.value }))}
              />
            )}
          </FormField>

          <FormField
            id={isbnId}
            label="ISBN"
            hint="Aceita ISBN-10 ou ISBN-13 válido (com ou sem hífens)."
            error={errors.isbnLivro}
            required
          >
            {props => (
              <input
                {...props}
                type="text"
                maxLength={20}
                required
                disabled={saving}
                placeholder="Ex: 9788535911664"
                value={form.isbnLivro}
                onChange={e => setForm(prev => ({ ...prev, isbnLivro: e.target.value }))}
                className={`${props.className} font-mono`}
              />
            )}
          </FormField>
        </div>

        <FormField
          id={autorId}
          label="Autor"
          error={errors.idAutor}
          required
          actionSlot={
            <button
              type="button"
              onClick={() => setQuickModal('autor')}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-accent transition hover:bg-accent-soft"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Novo autor</span>
            </button>
          }
        >
          {props => (
            <select
              {...props}
              required
              disabled={saving}
              value={form.idAutor}
              onChange={e => setForm(prev => ({ ...prev, idAutor: e.target.value }))}
            >
              <option value="">Selecione um autor</option>
              {autores.map(autor => (
                <option key={autor.idAutor} value={autor.idAutor}>
                  {autor.autorLivro} ({autor.autorNacionalidade})
                </option>
              ))}
            </select>
          )}
        </FormField>

        <ChipMultiSelect
          legend="Categorias"
          options={categorias}
          selectedIds={form.idCategorias}
          onChange={ids => setForm(prev => ({ ...prev, idCategorias: ids }))}
          getId={c => c.idCategoria}
          getLabel={c => c.nomeCategoria}
          emptyMessage="Nenhuma categoria cadastrada ainda."
          actionSlot={
            <button
              type="button"
              onClick={() => setQuickModal('categoria')}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-accent transition hover:bg-accent-soft"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Nova categoria</span>
            </button>
          }
        />

        <ChipMultiSelect
          legend="Gêneros"
          options={generos}
          selectedIds={form.idGeneros}
          onChange={ids => setForm(prev => ({ ...prev, idGeneros: ids }))}
          getId={g => g.idGenero}
          getLabel={g => g.nomeGenero}
          emptyMessage="Nenhum gênero cadastrado ainda."
          actionSlot={
            <button
              type="button"
              onClick={() => setQuickModal('genero')}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-accent transition hover:bg-accent-soft"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Novo gênero</span>
            </button>
          }
        />

        <FormField
          id={descricaoId}
          label="Descrição / Sinopse"
          hint={`Resumo editorial da obra (${form.descricaoLivro.length}/500 caracteres).`}
          error={errors.descricaoLivro}
          required
        >
          {props => (
            <textarea
              {...props}
              rows={4}
              maxLength={500}
              required
              disabled={saving}
              placeholder="Descreva a obra..."
              value={form.descricaoLivro}
              onChange={e => setForm(prev => ({ ...prev, descricaoLivro: e.target.value }))}
            />
          )}
        </FormField>

        <div className="flex flex-col-reverse gap-3 border-t border-edge pt-5 sm:flex-row sm:justify-end">
          {onCancel && (
            <button
              type="button"
              disabled={saving}
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-lg border border-edge-strong bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-subtle disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={saving || Boolean(resolutionError)}
            className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg shadow-xs transition hover:bg-accent-hover disabled:opacity-50"
          >
            {saving
              ? 'Salvando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Cadastrar livro'}
          </button>
        </div>
      </form>

      <ModalDialog
        open={quickModal === 'autor'}
        onClose={() => setQuickModal(null)}
        title="Novo autor"
        description="O autor será selecionado automaticamente neste livro."
        lightDismiss={false}
      >
        <AutorForm onSuccess={handleQuickAutorCreated} onCancel={() => setQuickModal(null)} />
      </ModalDialog>

      <ModalDialog
        open={quickModal === 'categoria'}
        onClose={() => setQuickModal(null)}
        title="Nova categoria"
        description="A categoria será vinculada ao livro automaticamente."
        lightDismiss={false}
      >
        <CategoriaForm
          onSuccess={handleQuickCategoriaCreated}
          onCancel={() => setQuickModal(null)}
        />
      </ModalDialog>

      <ModalDialog
        open={quickModal === 'genero'}
        onClose={() => setQuickModal(null)}
        title="Novo gênero"
        description="O gênero será vinculado ao livro automaticamente."
        lightDismiss={false}
      >
        <GeneroForm onSuccess={handleQuickGeneroCreated} onCancel={() => setQuickModal(null)} />
      </ModalDialog>
    </>
  )
}
