
import { Link } from 'react-router-dom'
import {
  MessageSquareText,
  MapPin,
  Palette,
  Rocket,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MessageSquareText,
    title: 'Share Your Requirements',
    description:
      'Tell us about your business, advertising goals, preferred audience and campaign requirements.',
    detail: 'Start with a simple enquiry through our website.',
  },
  {
    number: '02',
    icon: MapPin,
    title: 'Discuss Screen Locations',
    description:
      'Explore suitable residential communities, target areas and potential screen placements with our team.',
    detail: 'Placement depends on availability and suitability.',
  },
  {
    number: '03',
    icon: Palette,
    title: 'Review Your Creative',
    description:
      'Discuss your advertisement content and make sure the message is suitable for a digital screen.',
    detail: 'Creative support can be discussed based on your needs.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Coordinate the Campaign',
    description:
      'Review the proposed campaign details, schedule and next steps with the Adsrow team.',
    detail: 'Campaign execution follows confirmation of the agreed details.',
  },
]

export default function HowItWorksPage() {
  return (
    <main className="bg-white">
      <section className="bg-slate-950 px-5 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            How It Works
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            A straightforward path from enquiry to advertising.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Understand how businesses can explore digital screen advertising
            opportunities with Adsrow, from the first conversation to campaign
            coordination.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Start an Enquiry <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Four Simple Steps
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Here's how the process works.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Each campaign starts with understanding your goals and discussing
              suitable options before moving forward.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {steps.map((step) => {
              const Icon = step.icon

              return (
                <article
                  key={step.number}
                  className="rounded-3xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg md:p-9"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <Icon size={27} />
                    </div>

                    <span className="text-sm font-extrabold tracking-widest text-slate-300">
                      STEP {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-extrabold text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {step.description}
                  </p>

                  <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />
                    <p className="text-sm leading-6 text-slate-600">
                      {step.detail}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 md:p-10">
              <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
                For Advertisers
              </p>

              <h2 className="mt-4 text-2xl font-extrabold text-slate-950 md:text-3xl">
                Looking to promote your business?
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Tell us about your brand, target audience and preferred
                locations so we can discuss potential campaign options.
              </p>

              <Link
                to="/advertise"
                className="mt-6 inline-flex items-center gap-2 font-bold text-slate-950 hover:text-amber-600"
              >
                Advertising Details <ArrowRight size={18} />
              </Link>
            </div>

            <div className="rounded-3xl bg-white p-8 md:p-10">
              <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
                For Communities
              </p>

              <h2 className="mt-4 text-2xl font-extrabold text-slate-950 md:text-3xl">
                Interested in hosting a screen?
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Apartment associations and property managers can contact us to
                discuss community suitability and hosting requirements.
              </p>

              <Link
                to="/host-a-screen"
                className="mt-6 inline-flex items-center gap-2 font-bold text-slate-950 hover:text-amber-600"
              >
                Explore Screen Hosting <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-amber-400 px-7 py-10 text-center md:px-12 md:py-14">
          <h2 className="text-3xl font-extrabold text-slate-950 md:text-4xl">
            Your campaign starts with a conversation.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-800">
            Send an enquiry to discuss your goals, location preferences and
            potential advertising opportunities with Adsrow.
          </p>

          <Link
            to="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
          >
            Contact Adsrow <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  )
}
