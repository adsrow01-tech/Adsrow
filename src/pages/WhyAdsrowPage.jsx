
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  MapPin,
  Users,
  Monitor,
  BarChart3,
  Palette,
  Handshake,
  CheckCircle2,
} from 'lucide-react'

const benefits = [
  {
    icon: MapPin,
    title: 'Location-Focused Advertising',
    description:
      'Explore advertising opportunities in selected residential communities and local areas.',
  },
  {
    icon: Users,
    title: 'Community-Based Reach',
    description:
      'Connect your brand with people in the residential spaces where they live and spend time.',
  },
  {
    icon: Monitor,
    title: 'Digital Screen Advertising',
    description:
      'Present your brand through digital screens instead of relying only on traditional advertising formats.',
  },
  {
    icon: Palette,
    title: 'Creative Support',
    description:
      'Get help preparing clear, engaging advertising creatives suitable for digital screens.',
  },
  {
    icon: BarChart3,
    title: 'Campaign Coordination',
    description:
      'Discuss your campaign requirements, selected placements and reporting needs with the Adsrow team.',
  },
  {
    icon: Handshake,
    title: 'Community Partnerships',
    description:
      'Give apartment associations and property managers an opportunity to explore hosting a screen.',
  },
]

const steps = [
  'Tell us about your business and advertising goals.',
  'Discuss suitable communities, screen placements and campaign requirements.',
  'Review the proposed creative and campaign details.',
  'Coordinate the campaign with the Adsrow team.',
]

export default function WhyAdsrowPage() {
  return (
    <main className="bg-white">
      <section className="bg-slate-950 px-5 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Why Choose Adsrow?
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Local advertising with a community-first approach.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Discover a different way to promote your business through digital
            screens in residential communities, with campaign planning and
            placement coordination.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Discuss Your Campaign <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              The Adsrow Advantage
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Designed around your advertising needs.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              From choosing placements to preparing creative content, our
              approach focuses on making campaign coordination straightforward.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {benefit.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Simple Process
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 md:text-4xl">
              From enquiry to campaign coordination.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Start by sharing your goals. The Adsrow team can then discuss
              placement options and the next steps based on your requirements.
            </p>

            <Link
              to="/how-it-works"
              className="mt-6 inline-flex items-center gap-2 font-bold text-slate-950 hover:text-amber-600"
            >
              See How It Works <ArrowRight size={18} />
            </Link>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm md:p-9">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 font-extrabold text-amber-800">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="flex gap-3 pt-2">
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

      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-amber-400 px-7 py-12 text-center md:px-12">
          <h2 className="text-3xl font-extrabold text-slate-950 md:text-4xl">
            Ready to explore advertising with Adsrow?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-800">
            Tell us what you want to promote and which audience you want to
            reach. We can discuss the available options with you.
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
