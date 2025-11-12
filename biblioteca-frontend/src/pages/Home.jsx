import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#fffffe] mb-4">
          Bem-vindo à Biblioteca
        </h1>
        <p className="text-lg text-[#abd1c6] mb-8">
          Gerencie seus livros e autores de forma fácil e eficiente.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link to="/livros">
            <div className="bg-[#86b8fe] p-6 rounded-lg shadow-md border hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold text-[#2236b4] mb-2">
                Livros
              </h2>
              <p className="text-[#13395e]">Explore nossa coleção de livros.</p>
            </div>
          </Link>
          <Link to="/autores">
            <div className="bg-[#74d09d] p-6 rounded-lg shadow-md hover:bg-green-300">
              <h2 className="text-2xl font-semibold text-[#107c15] mb-2">
                Autores
              </h2>
              <p className="text-[#117206]">Conheça os autores disponíveis.</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
