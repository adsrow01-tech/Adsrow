import { useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Adsrow home">
            <span className="grid size-8 place-items-center bg-[#e4a82b] text-[#10243c]"><span className="text-sm font-black">A</span></span>
            <span className="text-xl font-semibold tracking-[-0.04em]">adsrow</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-[#617080] lg:flex" aria-label="Primary navigation">
            <Link to="/how-it-works" className="transition-colors hover:text-[#10243c]">How It Works</Link>
            <Link to="/locations" className="transition-colors hover:text-[#10243c]">Locations</Link>
            <Link to="/services" className="transition-colors hover:text-[#10243c]">Services</Link>
            <Link to="/faqs" className="transition-colors hover:text-[#10243c]">FAQs</Link>
          </nav>
          <Link to="/advertise" className="hidden items-center gap-2 bg-[#10243c] px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 lg:flex">Advertise With Us <ArrowUpRight size={15} /></Link>
          <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav className="mx-4 flex flex-col gap-1 border border-[#d9d8d2] bg-[#f7f5ef] p-4 shadow-lg lg:hidden" aria-label="Mobile navigation">
          {['How It Works', 'Locations', 'Services', 'FAQs'].map((item) => <Link key={item} to={`/${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)} className="px-3 py-3 text-sm">{item}</Link>)}
          <Link to="/advertise" onClick={() => setMenuOpen(false)} className="mt-2 bg-[#10243c] px-3 py-3 text-sm font-medium text-white">Advertise With Us</Link>
        </nav>}
      </header>
  )
}
