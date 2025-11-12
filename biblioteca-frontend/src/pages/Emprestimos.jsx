const mockEmprestimos = [
  { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', ano: 1899 },
  { id: 2, titulo: '1984', autor: 'George Orwell', ano: 1949 },
  { id: 3, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', ano: 1954 },
  {
    id: 4,
    titulo: 'Harry Potter e a Pedra Filosofal',
    autor: 'J.K. Rowling',
    ano: 1997,
  },
]

export default function Emprestimos() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#abd1c6] mb-6">Empréstimos</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEmprestimos.map(emprestimo => (
          <div
            key={emprestimo.id}
            className="bg-[#e8e4e6] p-6 rounded-lg shadow-md border"
          >
            <h2 className="text-xl font-semibold text-[#001e1d] mb-2">
              {emprestimo.titulo}
            </h2>
            <p className="text-[#0f3433] mb-1">Autor: {emprestimo.autor}</p>
            <p className="text-[#0f3433]">Ano: {emprestimo.ano}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
