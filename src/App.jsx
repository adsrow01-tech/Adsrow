import React, { Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import { useAuth } from "./context/AuthContext";
import { getCurrentPath } from "./lib/redirect";
import { lazyRoute } from "./lib/lazyRoute";

const HomePage = lazyRoute(() => import("./pages/HomePage"));
const AboutPage = lazyRoute(() => import("./pages/AboutPage"));
const PackageComparisonPage = lazyRoute(() => import("./pages/PackageComparisonPage"));
const NetworkPage = lazyRoute(() => import("./pages/NetworkPage"));
const HowItWorksPage = lazyRoute(() => import("./pages/HowItWorksPage"));
const WhyAdsrowPage = lazyRoute(() => import("./pages/WhyAdsrowPage"));
const FaqsPage = lazyRoute(() => import("./pages/FaqsPage"));
const HostAScreenPage = lazyRoute(() => import("./pages/HostAScreenPage"));
const ContactPage = lazyRoute(() => import("./pages/ContactPage"));
const LoginPage = lazyRoute(() => import("./pages/AuthPages").then(({ LoginPage: component }) => ({ default: component })));
const SignupPage = lazyRoute(() => import("./pages/AuthPages").then(({ SignupPage: component }) => ({ default: component })));
const ForgotPasswordPage = lazyRoute(() => import("./pages/AuthRecoveryPages").then(({ ForgotPasswordPage: component }) => ({ default: component })));
const ResetPasswordPage = lazyRoute(() => import("./pages/AuthRecoveryPages").then(({ ResetPasswordPage: component }) => ({ default: component })));
const PrivacyPage = lazyRoute(() => import("./pages/LegalPages").then(({ PrivacyPage: component }) => ({ default: component })));
const RefundPolicyPage = lazyRoute(() => import("./pages/LegalPages").then(({ RefundPolicyPage: component }) => ({ default: component })));
const TermsPage = lazyRoute(() => import("./pages/LegalPages").then(({ TermsPage: component }) => ({ default: component })));
const DashboardPage = lazyRoute(() => import("./pages/DashboardPage"));
const NotFoundPage = lazyRoute(() => import("./pages/NotFoundPage"));
const BlogArticlePage = lazyRoute(() => import("./pages/BlogPage").then(({ BlogArticlePage: component }) => ({ default: component })));
const BlogPage = lazyRoute(() => import("./pages/BlogPage").then(({ BlogPage: component }) => ({ default: component })));

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
  return <Navigate to={`/contact${location.search || "?type=advertiser"}`} replace />;
}

function LegacyPackagesRedirect() {
  const location = useLocation();
  return <Navigate to={`/packages${location.search}${location.hash}`} replace />;
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
    <Suspense fallback={<section className="section"><div className="container"><p>Loading Adsrow…</p></div></section>}>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/packages" element={<PackageComparisonPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogArticlePage />} />
        <Route path="/package-comparison" element={<LegacyPackagesRedirect />} />
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
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

const lazyRoutes = [
  HomePage, AboutPage, PackageComparisonPage, NetworkPage, HowItWorksPage,
  WhyAdsrowPage, FaqsPage, HostAScreenPage, ContactPage, LoginPage, SignupPage,
  ForgotPasswordPage, ResetPasswordPage, PrivacyPage, RefundPolicyPage,
  TermsPage, DashboardPage, NotFoundPage, BlogArticlePage, BlogPage,
];

export function preloadAppRoutes() {
  return Promise.all(lazyRoutes.map((route) => route.preload()));
}
