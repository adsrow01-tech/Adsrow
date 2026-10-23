
import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'Locations', path: '/locations' },
  { name: 'Services', path: '/services' },
  { name: 'Why Adsrow', path: '/why-adsrow' },
]

const contactLinks = [
  { name: 'Contact Us', path: '/contact' },
  { name: 'Host a Screen', path: '/host-a-screen' },
  { name: 'FAQs', path: '/faqs' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="text-3xl font-extrabold tracking-tight">
              adsrow<span className="text-amber-400">.</span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              Connecting brands with communities through digital advertising
              screens in residential spaces.
            </p>

            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Let's Talk <ArrowUpRight size={16} />
            </Link>
          </div>

          <div>
            <h3 className="text-base font-bold">Explore</h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 transition hover:text-amber-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold">Get Involved</h3>
            <ul className="mt-5 space-y-3">
              {contactLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 transition hover:text-amber-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold">Contact</h3>

            <ul className="mt-5 space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-amber-400" />
                <span>Vijayawada, Andhra Pradesh, India</span>
              </li>

              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-amber-400" />
                <Link
                  to="/contact"
                  className="transition hover:text-amber-400"
                >
                  Start an enquiry
                </Link>
              </li>

              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-amber-400" />
                <span>Start a partner enquiry through your Adsrow account</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Adsrow. All rights reserved.</p>
          <p>Connecting brands. Reaching communities.</p>
        </div>
      </div>
    </footer>
  )
}
