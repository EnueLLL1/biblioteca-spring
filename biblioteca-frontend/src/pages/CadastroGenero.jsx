import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  generosAPI,
} from '../services/api'
import { GeneroValidator } from '../services/validation'

export default function CadastrarGenero() {
  const navigate = useNavigate()

  const [novoGenero, setNovoGenero] = useState({
    nomeGenero: '',
  })

  // ✅ Estado de erros usando o validador dedicado
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // ========================================
  // 🔥 VALIDAÇÃO USANDO GeneroValidator
  // ========================================

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    // 🧹 Limpar os dados (equivalente ao DTO Java)
    const dadosLimpos = GeneroValidator.limparDados(novoGenero)

    // ✅ Validar usando a classe separada (equivalente ao Genero.java)
    const validator = new GeneroValidator()
    const isValid = validator.validar(dadosLimpos)

    if (!isValid) {
      setErrors(validator.getErrors())
      setLoading(false)
      return
    }

    // ✅ Dados válidos - limpar erros e enviar
    setErrors({})

    try {
      await generosAPI.criar(dadosLimpos)
      alert('✅ Gênero criado com sucesso!')
      navigate('/generos')
    } catch (error) {
      console.error('Erro ao criar gênero:', error)

      // Verificar se é erro de duplicata ou outros
      if (error.response?.status === 400) {
        alert('❌ Erro nos dados enviados!')
      } else if (error.response?.status === 409) {
        alert('❌ Gênero já existe!')
      } else {
        alert('❌ Erro ao criar gênero!')
      }
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#abd1c6] mb-6">
          🎭 Cadastrar Novo Gênero
        </h1>

        <div className="bg-[#e8e4e6] rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Gênero */}
            <div>
              <label className="block text-[#001e1d] font-semibold mb-2">
                Nome do Gênero *
              </label>
              <input
                type="text"
                value={novoGenero.nomeGenero}
                onChange={e =>
                  setNovoGenero({ ...novoGenero, nomeGenero: e.target.value })
                }
                className={`w-full border rounded-lg px-4 py-2 bg-white ${
                  errors.nomeGenero ? 'border-red-500' : ''
                }`}
                placeholder="Ex: Drama"
                required
                disabled={loading}
              />
              {errors.nomeGenero && (
                <p className="text-red-500 text-sm mt-1">{errors.nomeGenero}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/generos')}
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
                {loading ? '⏳ Criando...' : '✅ Criar Gênero'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
