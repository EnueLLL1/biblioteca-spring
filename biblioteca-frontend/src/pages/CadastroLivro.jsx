import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  livrosAPI,
  autoresAPI,
  categoriasAPI,
  generosAPI,
} from '../services/api'
import { CriarLivroDTOValidator } from '../services/validation'

export default function CadastrarLivro() {
  const navigate = useNavigate()
  const [autores, setAutores] = useState([])
  const [categorias, setCategorias] = useState([])
  const [generos, setGeneros] = useState([])
  const [loading, setLoading] = useState(true)

  const [novoLivro, setNovoLivro] = useState({
    tituloLivro: '',
    editoraLivro: '',
    anoPublicado: '',
    descricaoLivro: '',
    isbnLivro: '',
    disponivel: true,
    idAutor: '',
    idCategorias: [],
    idGeneros: [],
  })

  // ✅ Estado de erros usando o validador separado
  const [errors, setErrors] = useState({})

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [autoresData, categoriasData, generosData] = await Promise.all([
        autoresAPI.listarTodos(),
        categoriasAPI.listarTodos(),
        generosAPI.listarTodos(),
      ])
      setAutores(autoresData)
      setCategorias(categoriasData)
      setGeneros(generosData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar dados!')
    } finally {
      setLoading(false)
    }
  }



  // ========================================
  // 🔥 VALIDAÇÃO USANDO CriarLivroDTOValidator
  // ========================================


  const handleSubmit = async e => {
    e.preventDefault()

    // 🧹 Limpar os dados (equivalente ao DTO Java)
    const dadosLimpos = CriarLivroDTOValidator.limparDados(novoLivro)

    // ✅ Validar usando a classe separada (equivalente ao CriarLivroDTO.java)
    const validator = new CriarLivroDTOValidator()
    const isValid = validator.validar(dadosLimpos)

    if (!isValid) {
      setErrors(validator.getErrors())
      return
    }

    // ✅ Dados válidos - limpar erros e enviar
    setErrors({})

    try {
      await livrosAPI.criar(dadosLimpos)
      alert('✅ Livro criado com sucesso!')
      navigate('/livros')
    } catch (error) {
      console.error('Erro ao criar livro:', error)
      alert('❌ Erro ao criar livro!')
    }
  }

  const handleCategoriaChange = e => {
    const options = Array.from(e.target.selectedOptions)
    const valores = options.map(option => option.value)
    setNovoLivro({ ...novoLivro, idCategorias: valores })
  }

  const handleGeneroChange = e => {
    const options = Array.from(e.target.selectedOptions)
    const valores = options.map(option => option.value)
    setNovoLivro({ ...novoLivro, idGeneros: valores })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-[#abd1c6]">
        Carregando...
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#abd1c6] mb-6">
          📚 Cadastrar Novo Livro
        </h1>

        <div className="bg-[#e8e4e6] rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título e Editora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#001e1d] font-semibold mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={novoLivro.tituloLivro}
                  onChange={e =>
                    setNovoLivro({ ...novoLivro, tituloLivro: e.target.value })
                  }
                  className={`w-full border rounded-lg px-4 py-2 bg-white ${
                    errors.tituloLivro ? 'border-red-500' : ''
                  }`}
                  placeholder="Ex: Dom Casmurro"
                  required
                />
                {errors.tituloLivro && (
                  <p className="text-red-500 text-sm mt-1">{errors.tituloLivro}</p>
                )}
              </div>
              <div>
                <label className="block text-[#001e1d] font-semibold mb-2">
                  Editora *
                </label>
                <input
                  type="text"
                  value={novoLivro.editoraLivro}
                  onChange={e =>
                    setNovoLivro({ ...novoLivro, editoraLivro: e.target.value })
                  }
                  className={`w-full border rounded-lg px-4 py-2 bg-white ${
                    errors.editoraLivro ? 'border-red-500' : ''
                  }`}
                  placeholder="Ex: Saraiva"
                  required
                />
                {errors.editoraLivro && (
                  <p className="text-red-500 text-sm mt-1">{errors.editoraLivro}</p>
                )}
              </div>
            </div>

            {/* Ano e ISBN */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#001e1d] font-semibold mb-2">
                  Ano de Publicação *
                </label>
                <input
                  type="number"
                  value={novoLivro.anoPublicado}
                  onChange={e =>
                    setNovoLivro({ ...novoLivro, anoPublicado: e.target.value })
                  }
                  className={`w-full border rounded-lg px-4 py-2 bg-white ${
                    errors.anoPublicado ? 'border-red-500' : ''
                  }`}
                  placeholder="Ex: 1899"
                  min="1000"
                  max="2100"
                  required
                />
                {errors.anoPublicado && (
                  <p className="text-red-500 text-sm mt-1">{errors.anoPublicado}</p>
                )}
              </div>
              <div>
                <label className="block text-[#001e1d] font-semibold mb-2">
                  ISBN *
                </label>
                <input
                  type="text"
                  value={novoLivro.isbnLivro}
                  onChange={e =>
                    setNovoLivro({ ...novoLivro, isbnLivro: e.target.value })
                  }
                  className={`w-full border rounded-lg px-4 py-2 bg-white ${
                    errors.isbnLivro ? 'border-red-500' : ''
                  }`}
                  placeholder="Ex: 9788535911664"
                  required
                />
                {errors.isbnLivro && (
                  <p className="text-red-500 text-sm mt-1">{errors.isbnLivro}</p>
                )}
                {!errors.isbnLivro && (
                  <p className="text-xs text-gray-600 mt-1">
                    Use ISBN válido (13 dígitos com checksum)
                  </p>
                )}
              </div>
            </div>

            {/* Autor */}
            <div>
              <label className="block text-[#001e1d] font-semibold mb-2">
                Autor *
              </label>
              <select
                value={novoLivro.idAutor}
                onChange={e =>
                  setNovoLivro({ ...novoLivro, idAutor: e.target.value })
                }
                className={`w-full border rounded-lg px-4 py-2 bg-white ${
                  errors.idAutor ? 'border-red-500' : ''
                }`}
                required
              >
                <option value="">Selecione um autor</option>
                {autores.map(autor => (
                  <option key={autor.idAutor} value={autor.idAutor}>
                    {autor.autorLivro} ({autor.autorNacionalidade})
                  </option>
                ))}
              </select>
              {errors.idAutor && (
                <p className="text-red-500 text-sm mt-1">{errors.idAutor}</p>
              )}
            </div>

            {/* Categorias */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[#001e1d] font-semibold">
                  Categorias (segure Ctrl para múltiplas)
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/categorias/cadastro')}
                  className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg transition"
                >
                  ➕ Criar Categoria
                </button>
              </div>
              <select
                multiple
                value={novoLivro.idCategorias}
                onChange={handleCategoriaChange}
                className="w-full border rounded-lg px-4 py-2 bg-white h-32"
              >
                {categorias.map(cat => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nomeCategoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Gêneros */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[#001e1d] font-semibold">
                  Gêneros (segure Ctrl para múltiplos)
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/generos/cadastro')}
                  className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg transition"
                >
                  ➕ Criar Gênero
                </button>
              </div>
              <select
                multiple
                value={novoLivro.idGeneros}
                onChange={handleGeneroChange}
                className="w-full border rounded-lg px-4 py-2 bg-white h-32"
              >
                {generos.map(gen => (
                  <option key={gen.idGenero} value={gen.idGenero}>
                    {gen.nomeGenero}
                  </option>
                ))}
              </select>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-[#001e1d] font-semibold mb-2">
                Descrição *
              </label>
              <textarea
                value={novoLivro.descricaoLivro}
                onChange={e =>
                  setNovoLivro({ ...novoLivro, descricaoLivro: e.target.value })
                }
                className={`w-full border rounded-lg px-4 py-2 bg-white ${
                  errors.descricaoLivro ? 'border-red-500' : ''
                }`}
                rows="4"
                placeholder="Descreva o livro..."
                required
              />
              {errors.descricaoLivro && (
                <p className="text-red-500 text-sm mt-1">{errors.descricaoLivro}</p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/livros')}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#74d09d] hover:bg-green-400 text-[#107c15] font-bold py-3 rounded-lg transition"
              >
                ✅ Criar Livro
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
