import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import ProfilePage from './pages/ProfilePage'
import TvSeriesPage from './pages/TvSeriesPage'
import MoviesPage from './pages/MoviesPage'
import VarietyPage from './pages/VarietyPage'
import AnimePage from './pages/AnimePage'
import KidsPage from './pages/KidsPage'
import DocumentaryPage from './pages/DocumentaryPage'
import SportsPage from './pages/SportsPage'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/video/:id" element={<DetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tv-series" element={<TvSeriesPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/variety" element={<VarietyPage />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/kids" element={<KidsPage />} />
          <Route path="/documentary" element={<DocumentaryPage />} />
          <Route path="/sports" element={<SportsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
