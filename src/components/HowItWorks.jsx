const steps = [
  ['01', 'Tell us about your business', 'Submit your details and what you would like to promote.'],
  ['02', 'Our team reviews your request', 'We review the information and determine the right next steps.'],
  ['03', 'Discuss your campaign', 'We talk through goals, locations, creative needs, and requirements.'],
  ['04', 'Review your advertisement', 'Where included, we prepare creative for your review and approval.'],
  ['05', 'Move forward with the campaign', 'Once agreed, our team coordinates the campaign and next steps.'],
]

export default function HowItWorks() {
  return (
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32"><div className="mb-16 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="eyebrow">The process</p><h2 className="section-title">Simple to start.<br /><span>Clear to manage.</span></h2></div><p className="max-w-sm text-base leading-7 text-[#617080]">From first enquiry to campaign launch, we keep every part of the process clear and well-managed.</p></div><div className="grid border-t border-[#c9c8c1] lg:grid-cols-5">{steps.map(([number, title, copy]) => <div key={number} className="grid grid-cols-[48px_1fr] gap-5 border-b border-[#c9c8c1] py-7 lg:block lg:border-b-0 lg:border-r lg:px-6 lg:py-8 lg:first:pl-0 lg:last:border-r-0"><span className="text-xs font-semibold tracking-[0.18em] text-[#b27d11]">{number}</span><div><h3 className="mt-0 text-base font-semibold lg:mt-12">{title}</h3><p className="mt-3 text-sm leading-6 text-[#617080]">{copy}</p></div></div>)}</div></section>
  )
}
