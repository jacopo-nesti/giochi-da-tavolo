import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import GamesPage from './pages/GamesPage'
import GameDetailPage from './pages/GameDetailPage'
import AddGamePage from './pages/AddGamePage'
import EditGamePage from './pages/EditGamePage'
import CategoriesPage from './pages/CategoriesPage'

export default function App() {
  return <div className="app-shell"><Navbar /><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/games" element={<GamesPage />} />
    <Route path="/games/new" element={<AddGamePage />} />
    <Route path="/games/edit" element={<EditGamePage />} />
    <Route path="/games/:id/edit" element={<EditGamePage />} />
    <Route path="/games/:id" element={<GameDetailPage />} />
    <Route path="/categories" element={<CategoriesPage />} />
    <Route path="*" element={<main className="page-wrap"><div className="paper-panel"><h1>Pagina non trovata</h1><p>Questo indirizzo non porta a nessun gioco.</p></div></main>} />
  </Routes><Footer /></div>
}
