
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
      'Tell us about your business, advertising goals, preferred audience and campaign needs.',
  },
  {
    number: '02',
    icon: MapPin,
    title: 'Explore Screen Locations',
    description:
      'Discuss suitable residential communities, target areas and placement availability with the Adsrow team.',
  },
  {
    number: '03',
    icon: Palette,
    title: 'Prepare Your Advertisement',
    description:
      'Review your advertising creative and make sure the message is suitable for digital screen display.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Coordinate Your Campaign',
    description:
      'Confirm the campaign details and coordinate the next steps with the Adsrow team.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-white px-5 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
            How It Works
          </p>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950 md:text-5xl">
            From your first enquiry to campaign coordination.
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            A simple process to explore digital advertising opportunities
            through Adsrow's residential community screen network.
          </p>
        </div>

        <div className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <article
                key={step.number}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg md:p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Icon size={24} />
                  </div>

                  <span className="text-sm font-extrabold tracking-widest text-slate-300">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </article>
            )
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-slate-950 p-8 text-white md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <div>
            <h3 className="text-2xl font-extrabold md:text-3xl">
              Ready to take the first step?
            </h3>

            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Send us your requirements and discuss suitable advertising
              opportunities with the Adsrow team.
            </p>
          </div>

          <Link
            to="/contact"
            className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300 md:mt-0"
          >
            Start an Enquiry <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
