import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './componentes/Header.jsx'
import Home from './pages/Home.jsx'
import Livros from './pages/Livros.jsx'
import Autores from './pages/Autores.jsx'

function App(){
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/livros" element={<Livros />} />
                <Route path="/autores" element={<Autores />} />
            </Routes>
        </>
    )
}


export default App
