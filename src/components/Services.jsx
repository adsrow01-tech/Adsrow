
import { Link } from 'react-router-dom'
import {
  Monitor,
  MapPin,
  Palette,
  BarChart3,
  ArrowRight,
} from 'lucide-react'

const services = [
  {
    icon: Monitor,
    number: '01',
    title: 'Digital Screen Advertising',
    description:
      'Promote your products and services through digital advertising screens in residential community spaces.',
    features: [
      'Digital screen placements',
      'Brand and product promotions',
      'Community-focused campaigns',
    ],
  },
  {
    icon: MapPin,
    number: '02',
    title: 'Location-Based Campaigns',
    description:
      'Explore advertising placements in selected residential areas to align your campaign with local audiences.',
    features: [
      'Target-area discussions',
      'Community placement options',
      'Local campaign planning',
    ],
  },
  {
    icon: Palette,
    number: '03',
    title: 'Ad Creative Support',
    description:
      'Make your message clear and engaging with creative content prepared for digital screen displays.',
    features: [
      'Creative layout guidance',
      'Screen-friendly messaging',
      'Brand-focused presentation',
    ],
  },
  {
    icon: BarChart3,
    number: '04',
    title: 'Campaign Coordination',
    description:
      'Discuss your campaign requirements, proposed placements and reporting expectations with the Adsrow team.',
    features: [
      'Campaign requirement review',
      'Placement coordination',
      'Reporting discussions',
    ],
  },
]

export default function Services() {
  return (
    <section className="bg-white px-5 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
            Our Services
          </p>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950 md:text-5xl">
            Digital advertising designed around your goals.
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            From screen placements to creative support, Adsrow helps businesses
            explore advertising opportunities in residential communities.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <article
                key={service.number}
                className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl md:p-9"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition group-hover:bg-amber-400 group-hover:text-slate-950">
                    <Icon size={27} />
                  </div>

                  <span className="text-sm font-extrabold tracking-widest text-slate-300">
                    {service.number}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-extrabold text-slate-950">
                  {service.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {service.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="mt-7 inline-flex items-center gap-2 font-bold text-slate-950 transition hover:text-amber-600"
                >
                  Enquire About This Service <ArrowRight size={17} />
                </Link>
              </article>
            )
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-slate-950 px-7 py-10 text-center md:px-12 md:py-14">
          <h3 className="text-2xl font-extrabold text-white md:text-3xl">
            Have a campaign idea?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
            Tell us what you want to promote. We can discuss suitable options
            based on your campaign needs and placement availability.
          </p>

          <Link
            to="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Talk to Adsrow <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
