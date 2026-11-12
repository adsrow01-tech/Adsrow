import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./globals.css";
import "./styles/adsrow-99-banner.css";
import "./styles/home-benefits.css";
import { AuthProvider } from "./context/AuthContext";
import App, { preloadRoute } from "./App";
import "./styles/loading-screen.css";
import LoadingScreen from "./components/LoadingScreen";

function StartupOverlayDismissal({ onReady }) {
  useEffect(() => {
    onReady();
  }, [onReady]);

  return null;
}

const rootElement = document.getElementById("root");
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider><App /></AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  // Keep the startup experience consistent with development while the
  // prerendered route's client module loads and hydrates.
  const overlay = document.createElement("div");
  overlay.className = "startup-screen-overlay";
  document.body.append(overlay);
  const overlayRoot = createRoot(overlay);
  overlayRoot.render(<LoadingScreen />);

  const removeOverlay = () => {
    overlayRoot.unmount();
    overlay.remove();
  };
  const hydratedApp = (
    <React.StrictMode>
      <BrowserRouter>
        <StartupOverlayDismissal onReady={removeOverlay} />
        <AuthProvider><App /></AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
  const hydrate = () => hydrateRoot(rootElement, hydratedApp);
  void preloadRoute(window.location.pathname).then(hydrate, hydrate);
} else {
  createRoot(rootElement).render(app);
}
