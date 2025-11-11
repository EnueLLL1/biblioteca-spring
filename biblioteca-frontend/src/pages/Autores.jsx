const mockAutores = [
    { id: 1, nome: 'Machado de Assis', nacionalidade: 'Brasileiro', nascimento: 1839 },
    { id: 2, nome: 'George Orwell', nacionalidade: 'Britânico', nascimento: 1903 },
    { id: 3, nome: 'J.R.R. Tolkien', nacionalidade: 'Britânico', nascimento: 1892 },
    { id: 4, nome: 'J.K. Rowling', nacionalidade: 'Britânica', nascimento: 1965 },
]

export default function Autores() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Autores</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAutores.map(autor => (
                    <div key={autor.id} className="bg-white p-6 rounded-lg shadow-md border">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{autor.nome}</h2>
                        <p className="text-gray-600 mb-1">Nacionalidade: {autor.nacionalidade}</p>
                        <p className="text-gray-600">Ano de Nascimento: {autor.nascimento}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}
