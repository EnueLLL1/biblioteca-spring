import { useId, useRef, useState } from 'react'
import { categoriasAPI } from '../../services/api'
import { CategoriaValidator } from '../../services/validation'
import { extractApiError } from '../../utils/apiError'
import FormField from './FormField'

export default function CategoriaForm({ onSuccess, onCancel }) {
  const [nomeCategoria, setNomeCategoria] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null)
  const nomeId = useId()

  const focusFirstInvalid = () => {
    requestAnimationFrame(() => {
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSubmitError('')

    const dadosLimpos = CategoriaValidator.limparDados({ nomeCategoria })
    const validator = new CategoriaValidator()

    if (!validator.validar(dadosLimpos)) {
      setErrors(validator.getErrors())
      focusFirstInvalid()
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const criada = await categoriasAPI.criar(dadosLimpos)
      onSuccess?.(criada)
    } catch (error) {
      const parsed = extractApiError(error, 'Erro ao cadastrar categoria.')
      if (Object.keys(parsed.fieldErrors).length > 0) {
        setErrors(parsed.fieldErrors)
        focusFirstInvalid()
      } else {
        setSubmitError(parsed.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      {submitError && (
        <div
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          {submitError}
        </div>
      )}

      <FormField
        id={nomeId}
        label="Nome da categoria"
        hint="Ex: Literatura Brasileira, Tecnologia, Didático (até 100 caracteres)."
        error={errors.nomeCategoria}
        required
      >
        {props => (
          <input
            {...props}
            type="text"
            maxLength={100}
            required
            autoFocus
            disabled={loading}
            placeholder="Ex: Literatura Brasileira"
            value={nomeCategoria}
            onChange={e => setNomeCategoria(e.target.value)}
          />
        )}
      </FormField>

      <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-lg border border-edge-strong bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-subtle disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar categoria'}
        </button>
      </div>
    </form>
  )
}
