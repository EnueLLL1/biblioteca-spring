import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { emprestimosAPI } from '../services/api'

export default function Emprestimos() {
    const navigate = useNavigate()
    const [emprestimos, setEmprestimos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        carregarEmprestimos()
    }, [])

    const carregarEmprestimos = async () => {
        setLoading(true)
        try {
            const data = await emprestimosAPI.listarAtivos()
            setEmprestimos(data)
        } catch (error) {
            console.error('Erro ao carregar empréstimos:', error)
            alert('Erro ao carregar empréstimos!')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-8 text-center text-[#abd1c6]">
                Carregando empréstimos...
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#abd1c6]">📖 Empréstimos Ativos</h1>
                <button
                    onClick={() => navigate('/emprestimos/cadastro')}
                    className="bg-[#74d09d] hover:bg-green-400 text-[#107c15] font-bold py-2 px-6 rounded-lg transition shadow-md"
                >
                    📖 Novo Empréstimo
                </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {emprestimos.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-400 text-lg mb-4">📚 Nenhum empréstimo ativo</p>
                        <button
                            onClick={() => navigate('/emprestimos/cadastro')}
                            className="bg-[#74d09d] hover:bg-green-400 text-[#107c15] font-bold py-3 px-8 rounded-lg transition"
                        >
                            Fazer Primeiro Empréstimo
                        </button>
                    </div>
                ) : (
                    emprestimos.map(emprestimo => (
                        <div
                            key={emprestimo.idEmprestimo}
                            className="bg-[#e8e4e6] p-6 rounded-lg shadow-md border"
                        >
                            <h2 className="text-xl font-semibold text-[#001e1d] mb-2">
                                {emprestimo.tituloLivro}
                            </h2>
                            <p className="text-[#0f3433] mb-1">
                                Autor: {emprestimo.autorLivro}
                            </p>
                            <p className="text-[#0f3433] mb-1">
                                Usuário: {emprestimo.nomeUsuario}
                            </p>
                            <p className="text-[#0f3433] mb-1">
                                Emprestado em: {new Date(emprestimo.dataEmprestimo).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-[#0f3433]">
                                Devolução: {new Date(emprestimo.dataDevolucao).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}
