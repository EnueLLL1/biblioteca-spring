const mockLivros = [
    { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', ano: 1899 },
    { id: 2, titulo: '1984', autor: 'George Orwell', ano: 1949 },
    { id: 3, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', ano: 1954 },
    { id: 4, titulo: 'Harry Potter e a Pedra Filosofal', autor: 'J.K. Rowling', ano: 1997 },
]

export default function Livros() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Livros</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockLivros.map(livro => (
                    <div key={livro.id} className="bg-white p-6 rounded-lg shadow-md border">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{livro.titulo}</h2>
                        <p className="text-gray-600 mb-1">Autor: {livro.autor}</p>
                        <p className="text-gray-600">Ano: {livro.ano}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}
