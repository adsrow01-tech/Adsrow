import { MonitorPlay, Target, ScanLine, BarChart3 } from 'lucide-react'

const services = [
  { Icon: MonitorPlay, title: 'Billboard advertising', copy: 'Put your brand on billboards in high-visibility locations across Vijayawada.' },
  { Icon: Target, title: 'Location-based targeting', copy: 'Choose the areas and neighbourhoods that are most relevant to your brief.' },
  { Icon: ScanLine, title: 'Creative support', copy: 'Make your message work beautifully at billboard size, with practical help when you need it.' },
  { Icon: BarChart3, title: 'Campaign coordination', copy: 'Submit an enquiry and our team will contact you to take the campaign forward.' },
]

export default function Services() {
  return (
      <section id="services" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"><div className="max-w-2xl"><p className="eyebrow">What we offer</p><h2 className="section-title">A better place<br /><span>to be remembered.</span></h2></div><div className="mt-16 grid border-t border-[#c9c8c1] lg:grid-cols-2">{services.map(({ Icon, title, copy }) => <div key={title} className="grid grid-cols-[48px_1fr] gap-5 border-b border-[#c9c8c1] py-8 lg:pr-16"><Icon size={23} strokeWidth={1.5} className="text-[#b27d11]" /><div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 max-w-md text-sm leading-6 text-[#617080]">{copy}</p></div></div>)}</div></section>
  )
}
