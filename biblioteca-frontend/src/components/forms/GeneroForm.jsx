import { useId, useRef, useState } from 'react'
import { generosAPI } from '../../services/api'
import { GeneroValidator } from '../../services/validation'
import { extractApiError } from '../../utils/apiError'
import FormField from './FormField'

export default function GeneroForm({ onSuccess, onCancel }) {
  const [nomeGenero, setNomeGenero] = useState('')
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

    const dadosLimpos = GeneroValidator.limparDados({ nomeGenero })
    const validator = new GeneroValidator()

    if (!validator.validar(dadosLimpos)) {
      setErrors(validator.getErrors())
      focusFirstInvalid()
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const criado = await generosAPI.criar(dadosLimpos)
      onSuccess?.(criado)
    } catch (error) {
      const parsed = extractApiError(error, 'Erro ao cadastrar gênero.')
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
        label="Nome do gênero"
        hint="Ex: Romance, Ficção Científica, Drama (até 50 caracteres)."
        error={errors.nomeGenero}
        required
      >
        {props => (
          <input
            {...props}
            type="text"
            maxLength={50}
            required
            autoFocus
            disabled={loading}
            placeholder="Ex: Ficção Científica"
            value={nomeGenero}
            onChange={e => setNomeGenero(e.target.value)}
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
          {loading ? 'Salvando...' : 'Salvar gênero'}
        </button>
      </div>
    </form>
  )
}
