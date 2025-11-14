import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  autoresAPI,
} from '../services/api'
import { AutorValidator } from '../services/validation'

export default function CadastrarAutor() {
  const navigate = useNavigate()

  const [novoAutor, setNovoAutor] = useState({
    autorLivro: '',
    autorNacionalidade: '',
  })

  // ✅ Estado de erros usando o validador dedicado
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // ========================================
  // 🔥 VALIDAÇÃO USANDO AutorValidator
  // ========================================

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    // 🧹 Limpar os dados (equivalente ao DTO Java)
    const dadosLimpos = AutorValidator.limparDados(novoAutor)

    // ✅ Validar usando a classe separada (equivalente ao ModelAutor.java)
    const validator = new AutorValidator()
    const isValid = validator.validar(dadosLimpos)

    if (!isValid) {
      setErrors(validator.getErrors())
      setLoading(false)
      return
    }

    // ✅ Dados válidos - limpar erros e enviar
    setErrors({})

    try {
      await autoresAPI.criar(dadosLimpos)
      alert('✅ Autor criado com sucesso!')
      navigate('/autores')
    } catch (error) {
      console.error('Erro ao criar autor:', error)

      // Verificar se é erro de duplicata ou outros
      if (error.response?.status === 400) {
        alert('❌ Erro nos dados enviados!')
      } else if (error.response?.status === 409) {
        alert('❌ Autor já existe!')
      } else {
        alert('❌ Erro ao criar autor!')
      }
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#abd1c6] mb-6">
          ✍️ Cadastrar Novo Autor
        </h1>

        <div className="bg-[#e8e4e6] rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Autor */}
            <div>
              <label className="block text-[#001e1d] font-semibold mb-2">
                Nome do Autor *
              </label>
              <input
                type="text"
                value={novoAutor.autorLivro}
                onChange={e =>
                  setNovoAutor({ ...novoAutor, autorLivro: e.target.value })
                }
                className={`w-full border rounded-lg px-4 py-2 bg-white ${
                  errors.autorLivro ? 'border-red-500' : ''
                }`}
                placeholder="Ex: Machado de Assis"
                required
                disabled={loading}
              />
              {errors.autorLivro && (
                <p className="text-red-500 text-sm mt-1">{errors.autorLivro}</p>
              )}
            </div>

            {/* Nacionalidade */}
            <div>
              <label className="block text-[#001e1d] font-semibold mb-2">
                Nacionalidade *
              </label>
              <input
                type="text"
                value={novoAutor.autorNacionalidade}
                onChange={e =>
                  setNovoAutor({ ...novoAutor, autorNacionalidade: e.target.value })
                }
                className={`w-full border rounded-lg px-4 py-2 bg-white ${
                  errors.autorNacionalidade ? 'border-red-500' : ''
                }`}
                placeholder="Ex: Brasileiro"
                required
                disabled={loading}
              />
              {errors.autorNacionalidade && (
                <p className="text-red-500 text-sm mt-1">{errors.autorNacionalidade}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/autores')}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#74d09d] hover:bg-green-400 text-[#107c15] font-bold py-3 rounded-lg transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? '⏳ Criando...' : '✅ Criar Autor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
