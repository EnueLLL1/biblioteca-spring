import { useState, useEffect } from 'react'
import { livrosAPI, autoresAPI, categoriasAPI } from '../services/api'

export default function Livros() {
  const [livros, setLivros] = useState([])
  const [autores, setAutores] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)

  const [novoLivro, setNovoLivro] = useState({
    tituloLivro: '',
    editoraLivro: '',
    anoPublicado: '',
    // Talvez colocar url de capa para livros
    // urlCapaLivro: '',
    descricaoLivro: '',
    isbnLivro: '',
    disponivel: true,
    idAutor: '',
    idCategorias: [],
    idGeneros: [],
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [livrosData, autoresData, categoriasData] = await Promise.all([
        livrosAPI.listarTodos(),
        autoresAPI.listarTodos(),
        categoriasAPI.listarTodos(),
      ])
      setLivros(livrosData)
      setAutores(autoresData)
      setCategorias(categoriasData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      alert('Erro ao carregar dados! Verifique se o Spring Boot está rodando.')
    } finally {
      setLoading(false)
    }
  }

  // Função para validar checksum do ISBN-13
  const validarISBN13 = (isbn) => {
    if (isbn.length !== 13) return false

    let soma = 0
    for (let i = 0; i < 12; i++) {
      const digito = parseInt(isbn[i])
      soma += digito * (i % 2 === 0 ? 1 : 3)
    }

    const digitoVerificacao = (10 - (soma % 10)) % 10
    const ultimoDigito = parseInt(isbn[12])

    return digitoVerificacao === ultimoDigito
  }

  const validateForm = () => {
    const newErrors = {}

    // Título - obrigatório e não vazio após trim
    if (!novoLivro.tituloLivro || novoLivro.tituloLivro.trim() === '') {
      newErrors.tituloLivro = 'Título é obrigatório'
    }

    // Editora - obrigatório e não vazio após trim
    if (!novoLivro.editoraLivro || novoLivro.editoraLivro.trim() === '') {
      newErrors.editoraLivro = 'Editora é obrigatória'
    }

    // Ano - obrigatório, numérico, entre 1000 e 2100
    if (!novoLivro.anoPublicado) {
      newErrors.anoPublicado = 'Ano é obrigatório'
    } else {
      const ano = parseInt(novoLivro.anoPublicado)
      if (isNaN(ano) || ano < 1000 || ano > 2100) {
        newErrors.anoPublicado = 'Ano deve estar entre 1000 e 2100'
      }
    }

    // Descrição - obrigatório e não vazio após trim
    if (!novoLivro.descricaoLivro || novoLivro.descricaoLivro.trim() === '') {
      newErrors.descricaoLivro = 'Descrição é obrigatória'
    }

    // ISBN - obrigatório, deve ser válido (formato ISBN-13 com checksum)
    if (!novoLivro.isbnLivro || novoLivro.isbnLivro.trim() === '') {
      newErrors.isbnLivro = 'ISBN é obrigatório'
    } else {
      const isbn = novoLivro.isbnLivro.trim()
      if (!/^\d{13}$/.test(isbn)) {
        newErrors.isbnLivro = 'ISBN deve ter exatamente 13 dígitos numéricos'
      } else if (!validarISBN13(isbn)) {
        newErrors.isbnLivro = 'ISBN inválido (checksum incorreto)'
      }
    }

    // Autor - obrigatório
    if (!novoLivro.idAutor) {
      newErrors.idAutor = 'Selecione um autor'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Limpar erros anteriores
    setErrors({})

    // Validar formulário
    if (!validateForm()) {
      return
    }

    try {
      await livrosAPI.criar({
        ...novoLivro,
        tituloLivro: novoLivro.tituloLivro.trim(),
        editoraLivro: novoLivro.editoraLivro.trim(),
        anoPublicado: parseInt(novoLivro.anoPublicado),
        descricaoLivro: novoLivro.descricaoLivro.trim(),
        isbnLivro: novoLivro.isbnLivro.trim(),
        idAutor: parseInt(novoLivro.idAutor),
        idCategorias: novoLivro.idCategorias.map(id => parseInt(id)),
      })
      alert('Livro criado com sucesso!')
      setMostrarForm(false)
      carregarDados()
      // Limpar formulário e erros
      setNovoLivro({
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
      setErrors({})
    } catch (error) {
      console.error('Erro ao criar livro:', error)
      alert('Erro ao criar livro!')
    }
  }

  const handleDelete = async id => {
    if (!confirm('Tem certeza que deseja deletar este livro?')) return
    try {
      await livrosAPI.deletar(id)
      alert('Livro deletado com sucesso!')
      carregarDados()
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('Erro ao deletar livro!')
    }
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-[#abd1c6] text-xl">Carregando...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#abd1c6]">Livros</h1>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-[#86b8fe] hover:bg-[#aaccfd] text-[#2236b4] font-bold px-6 py-3 rounded-lg transition"
        >
          {mostrarForm ? 'Cancelar' : '+ Novo Livro'}
        </button>
      </div>

      {/* FORMULÁRIO */}

      {mostrarForm && (
        <div className="bg-[#e8e4e6] p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-[#001e1d] mb-4">
            Criar Novo Livro
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Título"
                  value={novoLivro.tituloLivro}
                  onChange={e =>
                    setNovoLivro({ ...novoLivro, tituloLivro: e.target.value })
                  }
                  className={`border rounded-lg px-4 py-2 bg-white ${
                    errors.tituloLivro ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.tituloLivro && (
                  <p className="text-red-500 text-sm mt-1">{errors.tituloLivro}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Editora"
                  value={novoLivro.editoraLivro}
                  onChange={e =>
                    setNovoLivro({ ...novoLivro, editoraLivro: e.target.value })
                  }
                  className={`border rounded-lg px-4 py-2 bg-white ${
                    errors.editoraLivro ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.editoraLivro && (
                  <p className="text-red-500 text-sm mt-1">{errors.editoraLivro}</p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Ano"
                  value={novoLivro.anoPublicado}
                  onChange={e =>
                    setNovoLivro({ ...novoLivro, anoPublicado: e.target.value })
                  }
                  className={`border rounded-lg px-4 py-2 bg-white ${
                    errors.anoPublicado ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.anoPublicado && (
                  <p className="text-red-500 text-sm mt-1">{errors.anoPublicado}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="ISBN (ex: 9788535911663)"
                  value={novoLivro.isbnLivro}
                  onChange={e =>
                    setNovoLivro({ ...novoLivro, isbnLivro: e.target.value })
                  }
                  className={`border rounded-lg px-4 py-2 bg-white ${
                    errors.isbnLivro ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.isbnLivro && (
                  <p className="text-red-500 text-sm mt-1">{errors.isbnLivro}</p>
                )}
              </div>
              <div>
                <select
                  value={novoLivro.idAutor}
                  onChange={e =>
                    setNovoLivro({ ...novoLivro, idAutor: e.target.value })
                  }
                  className={`border rounded-lg px-4 py-2 bg-white ${
                    errors.idAutor ? 'border-red-500' : ''
                  }`}
                  required
                >
                  <option value="">Selecione o Autor</option>
                  {autores.map(autor => (
                    <option key={autor.idAutor} value={autor.idAutor}>
                      {autor.autorLivro}
                    </option>
                  ))}
                </select>
                {errors.idAutor && (
                  <p className="text-red-500 text-sm mt-1">{errors.idAutor}</p>
                )}
              </div>
              <select
                multiple
                value={novoLivro.idCategorias}
                onChange={e =>
                  setNovoLivro({
                    ...novoLivro,
                    idCategorias: Array.from(
                      e.target.selectedOptions,
                      option => option.value
                    ),
                  })
                }
                className="border rounded-lg px-4 py-2 bg-white"
              >
                {categorias.map(cat => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nomeCategoria}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <textarea
                placeholder="Descrição"
                value={novoLivro.descricaoLivro}
                onChange={e =>
                  setNovoLivro({ ...novoLivro, descricaoLivro: e.target.value })
                }
                className={`border rounded-lg px-4 py-2 w-full bg-white ${
                  errors.descricaoLivro ? 'border-red-500' : ''
                }`}
                rows="3"
                required
              />
              {errors.descricaoLivro && (
                <p className="text-red-500 text-sm mt-1">{errors.descricaoLivro}</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#74d09d] hover:bg-green-300 text-[#107c15] font-bold px-6 py-3 rounded-lg w-full"
            >
              Criar Livro
            </button>
          </form>
        </div>
      )}

      {/*PARTE QUE É PRA CAREGAR OS LIVROS */}

      {livros.length === 0 ? (
        <p className="text-[#abd1c6] col-span-full text-center">
          Nenhum livro cadastrado. Crie o primeiro!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livros.map(livro => (
            <div
              key={livro.id}
              className="bg-[#e8e4e6] p-6 rounded-lg shadow-md border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#001e1d] mb-2">
                  {livro.tituloLivro}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    livro.disponivel
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {livro.disponivel ? 'Disponível' : 'Emprestado'}
                </span>
              </div>
              <h3 className="text-[#0f3433] mb-1">Autor: {livro.autorLivro}</h3>
              <h3 className="text-[#0f3433] mb-1">Ano: {livro.anoPublicado}</h3>

              {livro.categorias.length > 0 && (
                <p className="text-[#0f3433] mb-3">
                  {livro.categorias.join(', ')}
                </p>
              )}
              <p className="text-[#0f3433] mb-1">
                Descrição: {livro.descricaoLivro}
              </p>

              <button
                onClick={() => handleDelete(livro.idLivro)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg w-full transition"
              >
                Deletar
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
