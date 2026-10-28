import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import NetworkPage from "./pages/NetworkPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import WhyAdsrowPage from "./pages/WhyAdsrowPage";
import FaqsPage from "./pages/FaqsPage";
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
  return <Navigate to={`/contact${location.search}`} replace />;
}

function LegacyLocationsRedirect() {
  const location = useLocation();
  return <Navigate to={`/network${location.search}`} replace />;
}

function LegacyAdvertiseRedirect() {
  const location = useLocation();
  return <Navigate to={`/services${location.search}`} replace />;
}

function ProtectedDashboardPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <section className="section"><div className="container"><p>Checking your account…</p></div></section>;
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(getCurrentPath(location))}`} replace />;
  if (!user.email_confirmed_at) return <Navigate to={`/login?message=${encodeURIComponent("Please verify your email before opening the dashboard.")}`} replace />;
  return <DashboardPage />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/network" element={<NetworkPage />} />
        <Route path="/locations" element={<LegacyLocationsRedirect />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/why-adsrow" element={<WhyAdsrowPage />} />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/advertise" element={<LegacyAdvertiseRedirect />} />
        <Route path="/partner-form" element={<LegacyPartnerFormRedirect />} />
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
