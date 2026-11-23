import { useId, useRef, useState } from 'react'
import { usuariosAPI } from '../../services/api'
import { UsuarioValidator } from '../../services/validation'
import { extractApiError } from '../../utils/apiError'
import FormField from './FormField'

export default function UsuarioForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null)
  const nomeId = useId()
  const emailId = useId()
  const telefoneId = useId()

  const focusFirstInvalid = () => {
    requestAnimationFrame(() => {
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSubmitError('')

    const dadosLimpos = UsuarioValidator.limparDados(form)
    const validator = new UsuarioValidator()

    if (!validator.validar(dadosLimpos)) {
      setErrors(validator.getErrors())
      focusFirstInvalid()
      return
    }

    setErrors({})
    setLoading(true)

    try {
      const criado = await usuariosAPI.criar(dadosLimpos)
      onSuccess?.(criado)
    } catch (error) {
      const parsed = extractApiError(error, 'Erro ao cadastrar usuário.')
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

      <FormField id={nomeId} label="Nome completo" error={errors.nome} required>
        {props => (
          <input
            {...props}
            type="text"
            autoComplete="name"
            required
            autoFocus
            disabled={loading}
            placeholder="Ex: Maria Clara Oliveira"
            value={form.nome}
            onChange={e => setForm(prev => ({ ...prev, nome: e.target.value }))}
          />
        )}
      </FormField>

      <FormField
        id={emailId}
        label="E-mail"
        hint="Formato: nome@dominio.com (deve ser único)."
        error={errors.email}
        required
      >
        {props => (
          <input
            {...props}
            type="email"
            autoComplete="email"
            required
            disabled={loading}
            placeholder="Ex: maria@biblioteca.com"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
          />
        )}
      </FormField>

      <FormField
        id={telefoneId}
        label="Telefone"
        hint="Opcional. Ex: (11) 99999-9999."
        error={errors.telefone}
      >
        {props => (
          <input
            {...props}
            type="tel"
            autoComplete="tel"
            disabled={loading}
            placeholder="(11) 99999-9999"
            value={form.telefone}
            onChange={e => setForm(prev => ({ ...prev, telefone: e.target.value }))}
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
          {loading ? 'Salvando...' : 'Salvar usuário'}
        </button>
      </div>
    </form>
  )
}
