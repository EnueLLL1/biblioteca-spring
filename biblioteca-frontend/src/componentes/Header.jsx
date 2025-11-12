import { Link } from 'react-router-dom'

export default function Header() {
    return (
      <header className="bg-[#012b29] text-[#fffffe] shadow-md">
        <div className="container mx-auto px-4 py-4 ">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold hover:text-blue-200">
              <div>Biblioteca</div>
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="hover:text-blue-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/livros" className="hover:text-blue-200">
                    Livros
                  </Link>
                </li>
                <li>
                  <Link to="/autores" className="hover:text-blue-200">
                    Autores
                  </Link>
                </li>
                <li>
                  <Link to="/emprestimos" className="hover:text-blue-200">
                    Empréstimos
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    )
}
