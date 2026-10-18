
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
      'Promote your products and services through digital screens in residential communities.',
    details:
      'Discuss your brand, campaign objectives, preferred audience and suitable screen placements with the Adsrow team.',
  },
  {
    icon: MapPin,
    number: '02',
    title: 'Location-Based Advertising',
    description:
      'Explore advertising opportunities in selected residential areas.',
    details:
      'Share your preferred locations and target audience so potential placements can be discussed for your campaign.',
  },
  {
    icon: Palette,
    number: '03',
    title: 'Advertisement Creative Support',
    description:
      'Make your brand message clear, engaging and suitable for digital displays.',
    details:
      'Discuss your existing creative or the support you may need to prepare content for a digital screen.',
  },
  {
    icon: BarChart3,
    number: '04',
    title: 'Campaign Coordination',
    description:
      'Coordinate campaign requirements and discuss reporting expectations.',
    details:
      'Review campaign details, proposed placements, schedules and reporting needs with the Adsrow team.',
  },
]

export default function ServicesPage() {
  return (
    <main className="bg-white">
      <section className="bg-slate-950 px-5 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Our Services
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Digital advertising solutions for local businesses.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Discover advertising opportunities through digital screens in
            residential communities, with support for placement discussions,
            creative preparation and campaign coordination.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Discuss Your Requirements <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              What We Offer
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Support for every stage of your campaign.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Choose the service you are interested in and send an enquiry to
              discuss the available options.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon

              return (
                <article
                  key={service.number}
                  className="rounded-3xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg md:p-9"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      <Icon size={27} />
                    </div>

                    <span className="text-sm font-extrabold tracking-widest text-slate-300">
                      {service.number}
                    </span>
                  </div>

                  <h2 className="mt-6 text-2xl font-extrabold text-slate-950">
                    {service.title}
                  </h2>

                  <p className="mt-3 leading-7 text-slate-700">
                    {service.description}
                  </p>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {service.details}
                  </p>

                  <Link
                    to="/contact"
                    className="mt-7 inline-flex items-center gap-2 font-bold text-slate-950 transition hover:text-amber-600"
                  >
                    Enquire Now <ArrowRight size={17} />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 md:py-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-amber-400 p-8 md:p-12">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-extrabold text-slate-950 md:text-4xl">
                Not sure which service fits your needs?
              </h2>

              <p className="mt-4 leading-7 text-slate-800">
                Tell us about your business and goals. We can discuss suitable
                advertising options based on your requirements and placement
                availability.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-slate-800"
            >
              Contact Adsrow <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
