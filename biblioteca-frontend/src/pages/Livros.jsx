import { useState, useEffect } from 'react'
import { livrosAPI, autoresAPI, categoriasAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Livros() {
  const [livros, setLivros] = useState([])
  const [, setAutores] = useState([])
  const [, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()


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
          onClick={() => navigate('/livros/cadastro')}
          className="bg-[#86b8fe] hover:bg-[#aaccfd] text-[#2236b4] font-bold px-6 py-3 rounded-lg transition"
        >
          Novo Livro
        </button>
      </div>

      {/*PARTE QUE É PRA CARREGAR OS LIVROS */}

      {livros.length === 0 ? (
        <p className="text-[#abd1c6] col-span-full text-center">
          Nenhum livro cadastrado. Crie o primeiro!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livros.map(livro => (
            <div
              key={livro.idLivro}
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
