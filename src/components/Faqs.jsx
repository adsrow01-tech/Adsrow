
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'

const questions = [
  {
    question: 'What is Adsrow?',
    answer:
      'Adsrow connects businesses with residential communities through digital screen advertising opportunities.',
  },
  {
    question: 'How can my business advertise?',
    answer:
      'Submit an enquiry with your business details, target audience and campaign goals. The Adsrow team can discuss potential placements and requirements.',
  },
  {
    question: 'Can our apartment host a screen?',
    answer:
      'Yes, apartment associations and property managers can enquire about potential screen-hosting partnerships, subject to suitability and permissions.',
  },
  {
    question: 'Which areas are you targeting?',
    answer:
      'Adsrow is exploring target areas in Vijayawada, including Benz Circle, Patamata, Poranki, Gunadala and Mangalagiri Road. Contact us to discuss current availability.',
  },
  {
    question: 'How do I get pricing details?',
    answer:
      'Send us your campaign requirements and preferred locations. Pricing and available options can then be discussed with the Adsrow team.',
  },
]

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="bg-white px-5 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
            FAQs
          </p>

          <h2 className="mt-4 text-3xl font-extrabold text-slate-950 md:text-4xl">
            Questions about Adsrow?
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Find answers to some common questions about advertising and screen
            hosting.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {questions.map((item, index) => {
            const isOpen = openIndex === index
            const answerId = `home-faq-${index}`

            return (
              <article
                key={item.question}
                className={`overflow-hidden rounded-2xl border transition ${
                  isOpen
                    ? 'border-amber-300 bg-amber-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                >
                  <span className="font-bold leading-7 text-slate-950">
                    {item.question}
                  </span>

                  <ChevronDown
                    size={21}
                    className={`shrink-0 text-amber-700 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div id={answerId} className="px-5 pb-5">
                    <p className="border-t border-slate-200 pt-4 leading-7 text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/faqs"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-amber-400 hover:text-slate-950"
          >
            View All FAQs <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
