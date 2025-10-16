import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AnimePage from './pages/AnimePage'
import DetailPage from './pages/DetailPage'
import DocumentaryPage from './pages/DocumentaryPage'
import HomePage from './pages/HomePage'
import KidsPage from './pages/KidsPage'
import MoviesPage from './pages/MoviesPage'
import ProfilePage from './pages/ProfilePage'
import SportsPage from './pages/SportsPage'
import TvSeriesPage from './pages/TvSeriesPage'
import VarietyPage from './pages/VarietyPage'

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
