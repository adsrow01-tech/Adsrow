import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./globals.css";
import "./styles/adsrow-99-banner.css";
import "./styles/home-benefits.css";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./styles/loading-screen.css";

const rootElement = document.getElementById("root");
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider><App /></AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

(rootElement.hasChildNodes() ? hydrateRoot(rootElement, app) : createRoot(rootElement).render(app));
