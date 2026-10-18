import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
const faqs = [
  ['What is Adsrow?', 'Adsrow is a billboard advertising service in Vijayawada. You submit an enquiry with your requirements, and our team contacts you to discuss the right options for your campaign.'],
  ['Where are the billboards located?', 'We work across Vijayawada. Share the areas you want to reach in an enquiry and our team will contact you with current availability.'],
  ['Can you help with the creative?', 'Yes. You can supply finished artwork or work with our team to adapt your message for a clear, effective billboard format.'],
  ['What happens after I submit an enquiry?', 'Our team reviews your enquiry and contacts you to discuss your campaign, locations, and next steps.'],
]

export default function Faqs() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
      <section id="faqs" className="mx-auto max-w-4xl px-6 pb-24 lg:pb-32"><div className="mb-12"><p className="eyebrow">Good to know</p><h2 className="section-title">Questions, answered.</h2></div><div className="border-t border-[#c9c8c1]">{faqs.map(([question, answer], index) => <div key={question} className="border-b border-[#c9c8c1]"><button className="flex w-full items-center justify-between gap-5 py-6 text-left text-base font-medium" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={18} className={`shrink-0 text-[#b27d11] transition-transform ${openFaq === index ? 'rotate-180' : ''}`} /></button>{openFaq === index && <p className="max-w-2xl pb-6 pr-10 text-sm leading-7 text-[#617080]">{answer}</p>}</div>)}</div></section>
  )
}
