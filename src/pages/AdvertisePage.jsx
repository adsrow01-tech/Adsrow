
import { Link } from 'react-router-dom'
import {
  Monitor,
  Target,
  Palette,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

const benefits = [
  {
    icon: Target,
    title: 'Audience-Focused Planning',
    description:
      'Explain your target audience and campaign objectives so suitable options can be discussed.',
  },
  {
    icon: MapPin,
    title: 'Local Placement Options',
    description:
      'Explore potential screen placements in selected residential areas around Vijayawada.',
  },
  {
    icon: Monitor,
    title: 'Digital Screen Advertising',
    description:
      'Present your products, services or brand message through digital screen creatives.',
  },
  {
    icon: Palette,
    title: 'Creative Support',
    description:
      'Discuss the preparation or adaptation of advertising content for digital screen displays.',
  },
]

const campaignSteps = [
  'Share your business details and campaign objectives.',
  'Discuss target areas and potential screen placements.',
  'Review creative requirements and campaign details.',
  'Confirm the proposed arrangements before proceeding.',
]

export default function AdvertisePage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-slate-950 px-5 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Advertise With Adsrow
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Put your brand where communities connect.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Explore digital screen advertising opportunities in residential
            communities. Tell us about your business, audience and campaign
            goals to start a conversation with Adsrow.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-4 font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Enquire About Advertising <ArrowRight size={18} />
            </Link>

            <Link
              to="/locations"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Locations <MapPin size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Advertising Opportunities
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Advertising built around your goals.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Every business has different requirements. Adsrow helps you
              explore potential placements and campaign options based on your
              objectives.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Icon size={24} />
                  </div>

                  <h2 className="mt-5 text-xl font-extrabold text-slate-950">
                    {benefit.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {benefit.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-50 px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Getting Started
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 md:text-4xl">
              From idea to campaign planning.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Share your advertising requirements with us. We can discuss
              potential placements, creative needs and the next steps before
              confirming a campaign.
            </p>

            <Link
              to="/how-it-works"
              className="mt-6 inline-flex items-center gap-2 font-bold text-slate-950 transition hover:text-amber-600"
            >
              See How It Works <ArrowRight size={18} />
            </Link>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
            <div className="space-y-6">
              {campaignSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-extrabold text-amber-800">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="flex gap-3 pt-1.5">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <p className="leading-7 text-slate-700">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-amber-400 px-7 py-10 text-center md:px-12 md:py-14">
          <h2 className="text-3xl font-extrabold text-slate-950 md:text-4xl">
            Let's discuss your next campaign.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-800">
            Tell us what you want to promote, who you want to reach and which
            locations interest you. The Adsrow team can discuss potential
            options and availability.
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
