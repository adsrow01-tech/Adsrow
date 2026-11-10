import { useEffect, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();
  const { pathname } = location;
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = previousScrollRestoration; };
  }, []);
  useLayoutEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.key, location.hash]);
  return (
    <div className={pathname === "/" ? "site-shell home-shell" : "site-shell"}>
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
