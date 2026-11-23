import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  emprestimosAPI,
  livrosAPI,
  usuariosAPI,
} from '../services/api'
import { EmprestimoValidator } from '../services/validation'

export default function CadastrarEmprestimo() {
  const navigate = useNavigate()

  const [novoEmprestimo, setNovoEmprestimo] = useState({
    idLivro: '',
    idUsuario: '',
    dataEmprestimo: new Date().toISOString().split('T')[0], // Hoje
    dataDevolucao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hoje + 7 dias
  })

  const [livrosDisponiveis, setLivrosDisponiveis] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [carregandoDados, setCarregandoDados] = useState(true)

  // ✅ Estado de erros usando o validador dedicado
  const [errors, setErrors] = useState({})

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setCarregandoDados(true)
    try {
      const [livrosResponse, usuariosResponse] = await Promise.all([
        livrosAPI.listarDisponiveis(),
        usuariosAPI.listarTodos(),
      ])

      setLivrosDisponiveis(livrosResponse)
      setUsuarios(usuariosResponse)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar dados! Verifique se o Spring Boot está rodando.')
    } finally {
      setCarregandoDados(false)
    }
  }

  // ========================================
  // 🔥 VALIDAÇÃO USANDO EmprestimoValidator
  // ========================================

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    // 🧹 Limpar os dados (equivalente ao DTO Java)
    const dadosLimpos = EmprestimoValidator.limparDados(novoEmprestimo)

    // ✅ Validar usando a classe separada (equivalente ao ModelEmprestimos.java)
    const validator = new EmprestimoValidator()
    const isValid = validator.validar(dadosLimpos)

    if (!isValid) {
      setErrors(validator.getErrors())
      setLoading(false)
      return
    }

    // ✅ Dados válidos - limpar erros e enviar
    setErrors({})

    try {
      await emprestimosAPI.criar({
        livroId: dadosLimpos.idLivro,
        usuarioId: dadosLimpos.idUsuario,
      })
      alert('✅ Empréstimo criado com sucesso!')
      navigate('/emprestimos')
    } catch (error) {
      console.error('Erro ao criar empréstimo:', error)

      // Verificar tipo de erro
      if (error.response?.status === 400) {
        alert('❌ Dados inválidos! Verifique se o livro está disponível.')
      } else if (error.response?.status === 409) {
        alert('❌ Livro não está disponível para empréstimo!')
      } else {
        alert('❌ Erro ao criar empréstimo!')
      }
    }
    setLoading(false)
  }

  if (carregandoDados) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-[#abd1c6] text-xl">
          Carregando dados de livros e usuários...
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#abd1c6] mb-6">
          📖 Cadastrar Novo Empréstimo
        </h1>

        <div className="bg-[#e8e4e6] rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selecionar Livro */}
            <div>
              <label className="block text-[#001e1d] font-semibold mb-2">
                Livros Disponíveis *
              </label>
              <select
                value={novoEmprestimo.idLivro}
                onChange={e => setNovoEmprestimo({ ...novoEmprestimo, idLivro: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2 bg-white ${
                  errors.idLivro ? 'border-red-500' : ''
                }`}
                required
                disabled={loading}
              >
                <option value="">
                  Selecione um livro disponível ({livrosDisponiveis.length} disponíveis)
                </option>
                {livrosDisponiveis.map(livro => (
                  <option key={livro.idLivro} value={livro.idLivro}>
                    {livro.tituloLivro} - {livro.autorLivro} (ISBN: {livro.isbnLivro})
                  </option>
                ))}
              </select>
              {errors.idLivro && (
                <p className="text-red-500 text-sm mt-1">{errors.idLivro}</p>
              )}
            </div>

            {/* Selecionar Usuário */}
            <div>
              <label className="block text-[#001e1d] font-semibold mb-2">
                Usuário *
              </label>
              <select
                value={novoEmprestimo.idUsuario}
                onChange={e => setNovoEmprestimo({ ...novoEmprestimo, idUsuario: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2 bg-white ${
                  errors.idUsuario ? 'border-red-500' : ''
                }`}
                required
                disabled={loading}
              >
                <option value="">
                  Selecione um usuário ({usuarios.length} cadastrados)
                </option>
                {usuarios.map(usuario => (
                  <option key={usuario.idUsuario} value={usuario.idUsuario}>
                    {usuario.nomeUsuario} - {usuario.emailUsuario}
                  </option>
                ))}
              </select>
              {errors.idUsuario && (
                <p className="text-red-500 text-sm mt-1">{errors.idUsuario}</p>
              )}
            </div>

            {/* Data Emprestimo */}
            <div>
              <label className="block text-[#001e1d] font-semibold mb-2">
                Data do Empréstimo *
              </label>
              <input
                type="date"
                value={novoEmprestimo.dataEmprestimo}
                onChange={e => setNovoEmprestimo({ ...novoEmprestimo, dataEmprestimo: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2 bg-white ${
                  errors.dataEmprestimo ? 'border-red-500' : ''
                }`}
                required
                disabled={loading}
              />
              {errors.dataEmprestimo && (
                <p className="text-red-500 text-sm mt-1">{errors.dataEmprestimo}</p>
              )}
            </div>

            {/* Data Devolução */}
            <div>
              <label className="block text-[#001e1d] font-semibold mb-2">
                Data de Devolução Prevista *
              </label>
              <input
                type="date"
                value={novoEmprestimo.dataDevolucao}
                onChange={e => setNovoEmprestimo({ ...novoEmprestimo, dataDevolucao: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2 bg-white ${
                  errors.dataDevolucao ? 'border-red-500' : ''
                }`}
                required
                disabled={loading}
                min={new Date().toISOString().split('T')[0]} // Não pode ser menor que hoje
              />
              {errors.dataDevolucao && (
                <p className="text-red-500 text-sm mt-1">{errors.dataDevolucao}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/emprestimos')}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#74d09d] hover:bg-green-400 text-[#107c15] font-bold py-3 rounded-lg transition disabled:opacity-50"
                disabled={loading || livrosDisponiveis.length === 0 || usuarios.length === 0}
              >
                {loading ? '⏳ Criando Empréstimo...' : '✅ Criar Empréstimo'}
              </button>
            </div>

            {/* Status dos Dados */}
            <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-lg">
              <strong>Status:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Livros disponíveis: {livrosDisponiveis.length}</li>
                <li>• Usuários cadastrados: {usuarios.length}</li>
                <li>• Empréstimo por 7 dias (padrão da biblioteca)</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
