import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Pessoas from './pages/Pessoas'
import Categorias from './pages/Categorias'
import Transacoes from './pages/Transacoes'
import Relatorios from './pages/Relatorios'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Pessoas />} />
        <Route path="/pessoas" element={<Pessoas />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/transacoes" element={<Transacoes />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </Layout>
  )
}

export default App