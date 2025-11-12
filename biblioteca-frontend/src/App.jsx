import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './componentes/Header.jsx'
import Home from './pages/Home.jsx'
import Livros from './pages/Livros.jsx'
import Autores from './pages/Autores.jsx'
import Emprestimos from './pages/Emprestimos.jsx'


// import Sobre from './pages/Sobre.jsx'
// <Route path="/sobre" element={<Sobre />} />


function App(){
    return (
      <>
        <main className="bg-[#004643]">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/livros" element={<Livros />} />
            <Route path="/autores" element={<Autores />} />
            <Route path="/emprestimos" element={<Emprestimos />} />
            
          </Routes>
        </main>
      </>
    )
}


export default App
