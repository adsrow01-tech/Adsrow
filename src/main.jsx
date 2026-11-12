import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./globals.css";
import "./styles/adsrow-99-banner.css";
import "./styles/home-benefits.css";
import { AuthProvider } from "./context/AuthContext";
import App, { preloadRoute } from "./App";
import "./styles/loading-screen.css";

const rootElement = document.getElementById("root");
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider><App /></AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  // The prerendered document is already visible. Load only its route module
  // before hydration so the app-wide Suspense fallback cannot replace that
  // content while a public page's code is fetched.
  const hydrate = () => hydrateRoot(rootElement, app);
  void preloadRoute(window.location.pathname).then(hydrate, hydrate);
} else {
  createRoot(rootElement).render(app);
}
