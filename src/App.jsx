import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import HowItWorksPage from './pages/HowItWorksPage'
import LocationsPage from './pages/LocationsPage'
import ServicesPage from './pages/ServicesPage'
import FaqsPage from './pages/FaqsPage'
import AdvertisePage from './pages/AdvertisePage'
import HostAScreenPage from './pages/HostAScreenPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/advertise" element={<AdvertisePage />} />
          <Route path="/host-a-screen" element={<HostAScreenPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
