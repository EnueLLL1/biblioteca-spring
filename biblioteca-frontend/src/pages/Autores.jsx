import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { autoresAPI } from '../services/api'

export default function Autores() {
    const navigate = useNavigate()
    const [autores, setAutores] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        carregarAutores()
    }, [])

    const carregarAutores = async () => {
        setLoading(true)
        try {
            const data = await autoresAPI.listarTodos()
            setAutores(data)
        } catch (error) {
            console.error('Erro ao carregar autores:', error)
            alert('Erro ao carregar autores!')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8 text-center text-[#abd1c6]">
                Carregando autores...
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#abd1c6]">✍️ Autores</h1>
                <button
                    onClick={() => navigate('/autores/cadastro')}
                    className="bg-[#74d09d] hover:bg-green-400 text-[#107c15] font-bold py-2 px-6 rounded-lg transition shadow-md"
                >
                    📝 Novo Autor
                </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {autores.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-400 text-lg mb-4">📚 Nenhum autor cadastrado ainda</p>
                        <button
                            onClick={() => navigate('/autores/cadastro')}
                            className="bg-[#74d09d] hover:bg-green-400 text-[#107c15] font-bold py-3 px-8 rounded-lg transition"
                        >
                            Criar Primeiro Autor
                        </button>
                    </div>
                ) : (
                    autores.map(autor => (
                        <div key={autor.idAutor} className="bg-[#e8e4e6] p-6 rounded-lg shadow-md border">
                            <h2 className="text-xl font-semibold text-[#001e1d] mb-2">
                                {autor.autorLivro}
                            </h2>
                            <p className="text-[#0f3433] mb-1">
                                Nacionalidade: {autor.autorNacionalidade}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}
