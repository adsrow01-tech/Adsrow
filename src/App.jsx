
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import HowItWorksPage from './pages/HowItWorksPage'
import LocationsPage from './pages/LocationsPage'
import ServicesPage from './pages/ServicesPage'
import WhyAdsrowPage from './pages/WhyAdsrowPage'
import FaqsPage from './pages/FaqsPage'
import AdvertisePage from './pages/AdvertisePage'
import HostAScreenPage from './pages/HostAScreenPage'
import ContactPage from './pages/ContactPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/why-adsrow" element={<WhyAdsrowPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="/advertise" element={<AdvertisePage />} />
          <Route path="/host-a-screen" element={<HostAScreenPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
