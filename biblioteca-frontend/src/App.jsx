import { Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import { ToastProvider } from './components/ui/ToastProvider.jsx'
import Autores from './pages/Autores.jsx'
import CadastroAutor from './pages/CadastroAutor.jsx'
import CadastroCategoria from './pages/CadastroCategoria.jsx'
import CadastroEmprestimo from './pages/CadastroEmprestimo.jsx'
import CadastroGenero from './pages/CadastroGenero.jsx'
import CadastroLivro from './pages/CadastroLivro.jsx'
import CadastroUsuario from './pages/CadastroUsuario.jsx'
import Categorias from './pages/Categorias.jsx'
import Emprestimos from './pages/Emprestimos.jsx'
import Generos from './pages/Generos.jsx'
import Home from './pages/Home.jsx'
import Livros from './pages/Livros.jsx'
import Usuarios from './pages/Usuarios.jsx'

function App() {
  return (
    <ToastProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* LIVROS */}
          <Route path="/livros" element={<Livros />} />
          <Route path="/livros/cadastro" element={<CadastroLivro />} />
          <Route path="/livros/:id/editar" element={<CadastroLivro />} />

          {/* EMPRÉSTIMOS */}
          <Route path="/emprestimos" element={<Emprestimos />} />
          <Route path="/emprestimos/cadastro" element={<CadastroEmprestimo />} />

          {/* AUTORES */}
          <Route path="/autores" element={<Autores />} />
          <Route path="/autores/cadastro" element={<CadastroAutor />} />

          {/* USUÁRIOS */}
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/usuarios/cadastro" element={<CadastroUsuario />} />

          {/* CATEGORIAS */}
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/cadastro" element={<CadastroCategoria />} />

          {/* GÊNEROS */}
          <Route path="/generos" element={<Generos />} />
          <Route path="/generos/cadastro" element={<CadastroGenero />} />
        </Routes>
      </AppShell>
    </ToastProvider>
  )
}

export default App
