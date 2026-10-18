import { useState } from 'react'
import { Check, MessageCircle, Clock3, Send } from 'lucide-react'
import { validateEnquiry, submitEnquiry } from '../lib/enquire'

export default function EnquirySection() {
  const [formState, setFormState] = useState('idle')
  const [errors, setErrors] = useState({})

  function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextErrors = validateEnquiry(data)
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) {
      submitEnquiry(data)
      setFormState('review')
    }
  }

  return (
      <section id="enquire" className="bg-[#efece4]"><div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 lg:py-32"><div><p className="eyebrow">Start a conversation</p><h2 className="section-title">Put your brand<br /><span>in the right place.</span></h2><p className="mt-7 max-w-sm leading-7 text-[#617080]">Tell us a little about what you&apos;re building. We&apos;ll come back with the right locations and next steps.</p><div className="mt-10 flex flex-col gap-4 text-sm text-[#617080]"><span className="flex items-center gap-3"><MessageCircle size={17} className="text-[#b27d11]" /> A considered first conversation</span><span className="flex items-center gap-3"><Clock3 size={17} className="text-[#b27d11]" /> Vijayawada, Andhra Pradesh</span></div></div>{formState === 'review' ? <div className="flex min-h-[420px] flex-col items-center justify-center border border-[#d9d8d2] bg-[#f7f5ef] p-8 text-center"><div className="mb-6 grid size-14 place-items-center bg-[#e4a82b]"><Check /></div><h3 className="text-2xl font-semibold">Your enquiry is ready.</h3><p className="mt-3 max-w-sm leading-7 text-[#617080]">This form is set up for team review. Connect your preferred enquiry endpoint to send this information to Adsrow.</p></div> : <form onSubmit={handleSubmit} noValidate className="grid gap-5 border border-[#d9d8d2] bg-[#f7f5ef] p-6 sm:p-9"><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Your name<input name="name" className="field" placeholder="Name" aria-invalid={!!errors.name} />{errors.name && <span className="text-xs text-red-700">{errors.name}</span>}</label><label className="grid gap-2 text-sm font-medium">Company<input name="company" className="field" placeholder="Company name" aria-invalid={!!errors.company} />{errors.company && <span className="text-xs text-red-700">{errors.company}</span>}</label></div><label className="grid gap-2 text-sm font-medium">Work email<input name="email" type="email" className="field" placeholder="you@company.com" aria-invalid={!!errors.email} />{errors.email && <span className="text-xs text-red-700">{errors.email}</span>}</label><label className="grid gap-2 text-sm font-medium">How can we help?<textarea name="message" rows={5} className="field resize-none" placeholder="Tell us about your campaign or community." aria-invalid={!!errors.message} />{errors.message && <span className="text-xs text-red-700">{errors.message}</span>}</label><button type="submit" className="mt-2 inline-flex w-fit items-center gap-3 bg-[#10243c] px-6 py-4 text-sm font-medium text-white transition-transform hover:-translate-y-0.5">Send Enquiry <Send size={16} /></button><p className="text-xs leading-5 text-[#87909a]">This form is a conversation starter. Connect it to your preferred CRM or email endpoint before launch.</p></form>}</div></section>
  )
}
