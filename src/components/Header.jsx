
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'Locations', path: '/locations' },
  { name: 'Services', path: '/services' },
  { name: 'Advertise', path: '/advertise' },
  { name: 'Why Adsrow', path: '/why-adsrow' },
  { name: 'FAQs', path: '/faqs' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  const navClass = ({ isActive }) =>
    `whitespace-nowrap text-sm font-semibold transition-colors ${
      isActive
        ? 'text-amber-600'
        : 'text-slate-700 hover:text-amber-600'
    }`

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="Adsrow home"
          className="shrink-0 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl"
        >
          adsrow<span className="text-amber-500">.</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-4 xl:flex"
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={navClass}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contact"
          className="hidden shrink-0 items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold !text-white transition hover:bg-amber-400 hover:!text-slate-950 lg:inline-flex"
        >
          Contact Us
          <ArrowUpRight size={17} />
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="rounded-xl p-2 text-slate-950 transition hover:bg-slate-100 xl:hidden"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg xl:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-amber-600'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <Link
              to="/host-a-screen"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-amber-600"
            >
              Host a Screen
            </Link>

            <Link
              to="/contact"
              onClick={closeMenu}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-bold !text-white transition hover:bg-amber-400 hover:!text-slate-950"
            >
              Contact Us
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
