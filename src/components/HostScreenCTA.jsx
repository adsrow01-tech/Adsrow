import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HostScreenCTA() {
  return (
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28"><div className="grid items-center gap-10 border border-[#d9d8d2] bg-[#10243c] px-7 py-12 text-white sm:px-12 lg:grid-cols-[1fr_auto] lg:px-16"><div><p className="eyebrow text-[#e4a82b]">For property owners</p><h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Have a place for a billboard?</h2><p className="mt-5 max-w-lg leading-7 text-[#b8c1ca]">If you own or manage a property that could host a billboard, submit an enquiry and our team will contact you to discuss it.</p></div><Link to="/advertise" className="inline-flex items-center gap-3 bg-[#e4a82b] px-6 py-4 text-sm font-semibold text-[#10243c]">Host a Billboard <ArrowUpRight size={16} /></Link></div></section>
  )
}
