import { HashRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { DocsPage } from './pages/DocsPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<DocsPage />} />
      </Routes>
    </HashRouter>
  )
}
