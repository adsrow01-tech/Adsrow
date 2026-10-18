
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-react'

const faqs = [
  {
    question: 'What is Adsrow?',
    answer:
      'Adsrow is a community-focused digital advertising concept that aims to connect businesses with residential communities through digital advertising screens.',
  },
  {
    question: 'How can I advertise with Adsrow?',
    answer:
      'Visit the Contact page and submit your business details, campaign goals, preferred audience and location requirements. The Adsrow team can discuss potential options with you.',
  },
  {
    question: 'Where does Adsrow operate?',
    answer:
      'Adsrow is focused on exploring advertising opportunities in Vijayawada, Andhra Pradesh. Contact us to discuss location suitability and current screen availability.',
  },
  {
    question: 'Are screens already available in every listed location?',
    answer:
      'Not necessarily. Locations shown on this website are target areas for exploration and do not guarantee that a screen is installed or available there. Please enquire about current availability.',
  },
  {
    question: 'Can apartment associations host an Adsrow screen?',
    answer:
      'Apartment associations and property managers can contact Adsrow to discuss property suitability, permissions, installation requirements and potential hosting arrangements.',
  },
  {
    question: 'Can Adsrow help with advertisement design?',
    answer:
      'Creative support can be discussed based on your campaign requirements. You can mention whether you already have an advertisement or need help preparing screen-ready content.',
  },
  {
    question: 'How much does advertising cost?',
    answer:
      'Pricing is not specified on this website. Contact Adsrow with your campaign requirements and preferred locations to discuss the available options and applicable costs.',
  },
  {
    question: 'How do I submit an enquiry?',
    answer:
      'Open the Contact page, fill in the required details and submit the form. The enquiry service must be configured for your submission to be delivered successfully.',
  },
]

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <main className="bg-white">
      <section className="bg-slate-950 px-5 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Frequently Asked Questions
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Got questions? Let's make things clear.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Find answers about Adsrow, digital screen advertising, potential
            locations and community screen-hosting partnerships.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <MessageCircle size={28} />
            </div>

            <h2 className="mt-5 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Everything you need to know.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Whether you're a business looking to advertise or a community
              interested in hosting a screen, these answers can help you
              understand the process.
            </p>

            <div className="mt-8 rounded-2xl bg-amber-50 p-6">
              <h3 className="text-lg font-extrabold text-slate-950">
                Still have a question?
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                Contact us with your specific requirements and we'll discuss
                the next steps.
              </p>

              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 font-bold text-slate-950 hover:text-amber-700"
              >
                Contact Adsrow <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              const answerId = `faq-answer-${index}`

              return (
                <article
                  key={faq.question}
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
                    onClick={() =>
                      setOpenIndex(isOpen ? -1 : index)
                    }
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
                  >
                    <span className="font-bold leading-7 text-slate-950">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={21}
                      className={`shrink-0 text-amber-700 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={answerId}
                      className="px-5 pb-5 md:px-6 md:pb-6"
                    >
                      <p className="border-t border-slate-200 pt-4 leading-7 text-slate-600">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-950 px-7 py-10 text-center text-white md:px-12 md:py-14">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Let's talk about your requirements.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
            Send us your advertising or screen-hosting enquiry to explore
            potential opportunities with Adsrow.
          </p>

          <Link
            to="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Ask Us a Question <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  )
}
