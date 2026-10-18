import { Link } from 'react-router-dom'

export default function Footer() {
  return (
      <footer className="bg-[#10243c] text-white"><div className="mx-auto max-w-7xl px-6 py-14 lg:px-10"><div className="flex flex-col justify-between gap-10 border-b border-white/15 pb-12 md:flex-row"><div><Link to="/" className="flex items-center gap-2.5"><span className="grid size-8 place-items-center bg-[#e4a82b] text-[#10243c]"><span className="text-sm font-black">A</span></span><span className="text-xl font-semibold tracking-[-0.04em]">adsrow</span></Link><p className="mt-5 max-w-xs text-sm leading-6 text-[#aebac4]">Billboard advertising across Vijayawada. Submit an enquiry and our team will contact you.</p></div><div className="grid grid-cols-2 gap-x-14 gap-y-4 text-sm text-[#aebac4]"><Link to="/how-it-works" className="hover:text-white">How It Works</Link><Link to="/locations" className="hover:text-white">Locations</Link><Link to="/services" className="hover:text-white">Services</Link><Link to="/advertise" className="hover:text-white">Advertise With Us</Link></div></div><div className="flex flex-col justify-between gap-3 pt-6 text-xs text-[#7f8f9d] sm:flex-row"><span>© {new Date().getFullYear()} Adsrow. Vijayawada, India.</span><span>Outdoor advertising, thoughtfully placed.</span></div></div></footer>
  )
}
