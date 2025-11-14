import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './componentes/Header.jsx'
import Home from './pages/Home.jsx'
import Livros from './pages/Livros.jsx'
import CadastroLivro from './pages/CadastroLivro.jsx'
import Autores from './pages/Autores.jsx'
import CadastroAutor from './pages/CadastroAutor.jsx'
import Categorias from './pages/Categorias.jsx'
import CadastroCategoria from './pages/CadastroCategoria.jsx'
import Generos from './pages/Generos.jsx'
import CadastroGenero from './pages/CadastroGenero.jsx'
import Emprestimos from './pages/Emprestimos.jsx'
import CadastroEmprestimo from './pages/CadastroEmprestimo.jsx'

function App() {
  return (
    <>
      <div className="min-h-screen bg-[#004643]">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* SEÇÃO DE LIVROS */}
          <Route path="/livros" element={<Livros />} />
          <Route path="/livros/cadastro" element={<CadastroLivro />} />

          {/* SEÇÃO DE AUTORES */}
          <Route path="/autores" element={<Autores />} />
          <Route path="/autores/cadastro" element={<CadastroAutor />} />

          {/* SEÇÃO DE CATEGORIAS */}
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/cadastro" element={<CadastroCategoria />} />

          {/* SEÇÃO DE GÊNEROS */}
          <Route path="/generos" element={<Generos />} />
          <Route path="/generos/cadastro" element={<CadastroGenero />} />

          {/* SEÇÃO DE EMPRÉSTIMOS */}
          <Route path="/emprestimos" element={<Emprestimos />} />
          <Route path="/emprestimos/cadastro" element={<CadastroEmprestimo />} />

        </Routes>
      </div>
    </>
  )
}

export default App
