import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { categoriasAPI } from '../services/api'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const categoriasData = await categoriasAPI.listarTodos()
      setCategorias(categoriasData)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      alert('Erro ao carregar categorias! Verifique se o Spring Boot está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    if (!confirm('Tem certeza que deseja deletar esta categoria?')) return
    try {
      await categoriasAPI.deletar(id)
      alert('Categoria deletada com sucesso!')
      carregarDados()
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('Erro ao deletar categoria!')
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
        <h1 className="text-3xl font-bold text-[#abd1c6]">📂 Categorias</h1>
        <Link
          to="/categorias/cadastro"
          className="bg-[#86b8fe] hover:bg-[#aaccfd] text-[#2236b4] font-bold px-6 py-3 rounded-lg transition"
        >
          + Nova Categoria
        </Link>
      </div>

      {categorias.length === 0 ? (
        <p className="text-[#abd1c6] text-center">
          Nenhuma categoria cadastrada. Crie a primeira!
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map(categoria => (
            <div
              key={categoria.idCategoria}
              className="bg-[#e8e4e6] p-6 rounded-lg shadow-md border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#001e1d] mb-2">
                  {categoria.nomeCategoria}
                </h2>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleDelete(categoria.idCategoria)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg transition"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
