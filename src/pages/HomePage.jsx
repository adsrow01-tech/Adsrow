import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <>
      <section id="top" className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-6 pb-16 pt-36 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-24 lg:pt-32">
        <div className="relative z-10 max-w-xl">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#b27d11]"><span className="h-px w-8 bg-[#e4a82b]" /> Billboard advertising across Vijayawada</p>
          <h1 className="max-w-[620px] text-[clamp(3.5rem,7vw,6.7rem)] font-semibold leading-[0.92] tracking-[-0.075em] text-[#10243c]">Your business.<br /><span className="text-[#b27d11]">Seen where people live.</span></h1>
          <p className="mt-8 max-w-md text-lg leading-8 text-[#617080]">Promote your business with billboard advertising in Vijayawada. Submit an enquiry and our team will contact you to take it forward.</p>
          <div className="mt-10 flex flex-wrap items-center gap-5"><Link to="/advertise" className="inline-flex items-center gap-3 bg-[#10243c] px-6 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5">Enquire About Advertising <ArrowUpRight size={16} /></Link><Link to="/locations" className="inline-flex items-center gap-2 text-sm font-semibold text-[#10243c]">Explore Our Network <ChevronRight size={16} className="text-[#b27d11]" /></Link></div>
        </div>
        <div className="relative lg:translate-x-4"><div className="absolute -inset-5 border border-[#e4a82b]/35" /><div className="relative aspect-[1.12/1] overflow-hidden bg-[#d6d1c7]"><img src="/adsrow-lobby.png" alt="Digital advertising screen in a modern public space" className="size-full object-cover" /><div className="absolute bottom-5 left-5 flex items-center gap-3 bg-[#f7f5ef] px-4 py-3 text-xs text-[#10243c]"><span className="size-2 rounded-full bg-[#e4a82b]" /> A real-world audience, in context</div></div><p className="mt-4 text-right text-[11px] uppercase tracking-[0.18em] text-[#87909a]">Advertising in context / Vijayawada</p></div>
      </section>
      <section className="bg-[#e8e4da]"><div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-32"><div><p className="eyebrow">Make the comparison</p><h2 className="section-title">Context matters.<br /><span>So does control.</span></h2><p className="mt-7 max-w-md leading-7 text-[#617080]">Billboard advertising is not a replacement for every medium. It is a more considered choice when context, location, and flexibility matter.</p></div><div className="border-t border-[#a9a79f]"><div className="grid grid-cols-[1fr_1fr] border-b border-[#a9a79f] py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#617080]"><span>Conventional advertising</span><span className="text-[#10243c]">Adsrow network</span></div>{[['Placement context', 'Broad roadside visibility', 'Chosen, high-visibility locations'], ['Targeting', 'Fixed physical placement', 'Area-level selection'], ['Creative', 'Self-managed production', 'Creative support from our team'], ['Coordination', 'You manage the details', 'Our team coordinates everything']].map(([label, old, adsrow]) => <div key={label} className="grid grid-cols-[1fr_1fr] gap-5 border-b border-[#a9a79f] py-6 text-sm"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#b27d11]">{label}</p><p className="text-[#617080]">{old}</p></div><p className="font-medium text-[#10243c]">{adsrow}</p></div>)}</div></div></section>
    </>
  )
}
