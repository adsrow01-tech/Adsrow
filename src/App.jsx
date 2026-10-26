import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import { PageHero, EnquirySection } from "./components/SiteComponents";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import LocationsPage from "./pages/LocationsPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import WhyAdsrowPage from "./pages/WhyAdsrowPage";
import FaqsPage from "./pages/FaqsPage";
import AdvertisePage from "./pages/AdvertisePage";
import HostAScreenPage from "./pages/HostAScreenPage";
import ContactPage from "./pages/ContactPage";
import { LoginPage, SignupPage } from "./pages/AuthPages";
import { ForgotPasswordPage, ResetPasswordPage } from "./pages/AuthRecoveryPages";
import { PrivacyPage, TermsPage } from "./pages/LegalPages";
import DashboardPage from "./pages/DashboardPage";
import { useAuth } from "./context/AuthContext";
import { getCurrentPath } from "./lib/redirect";

function LegacyPartnerFormRedirect() {
  const location = useLocation();
  return <Navigate to={`/partner-form${location.search}`} replace />;
}

function ProtectedAdvertisePage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <section className="section"><div className="container"><p>Checking your account…</p></div></section>;
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(getCurrentPath(location))}`} replace />;
  return <AdvertisePage />;
}

function ProtectedDashboardPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <section className="section"><div className="container"><p>Checking your account…</p></div></section>;
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(getCurrentPath(location))}`} replace />;
  if (!user.email_confirmed_at) return <Navigate to={`/login?message=${encodeURIComponent("Please verify your email before opening the dashboard.")}`} replace />;
  return <DashboardPage />;
}

function ProtectedPartnerFormPage() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <section className="section"><div className="container"><p>Checking your account…</p></div></section>;
  }

  if (!user) {
    const destination = getCurrentPath(location);
    return <Navigate to={`/login?next=${encodeURIComponent(destination)}`} replace />;
  }

  return (
    <>
      <PageHero
        eyebrow="PARTNER WITH ADSROW"
        title="Tell us how you would like to partner."
        description="Share your business or community details and our team will follow up with next steps."
      />
      <EnquirySection />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/why-adsrow" element={<WhyAdsrowPage />} />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/advertise" element={<ProtectedAdvertisePage />} />
        <Route path="/partner-form" element={<ProtectedPartnerFormPage />} />
        <Route path="/advertise/enquiry" element={<LegacyPartnerFormRedirect />} />
        <Route path="/dashboard" element={<ProtectedDashboardPage />} />
        <Route path="/host-a-screen" element={<HostAScreenPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
