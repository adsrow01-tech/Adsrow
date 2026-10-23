
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight, Navigation } from 'lucide-react'

const locations = [
  {
    name: 'Benz Circle',
    description:
      'Explore advertising opportunities around this prominent Vijayawada area.',
    number: '01',
  },
  {
    name: 'Patamata',
    description:
      'Discuss potential residential community screen placements in the area.',
    number: '02',
  },
  {
    name: 'Poranki',
    description:
      'Explore local advertising possibilities for nearby residential communities.',
    number: '03',
  },
  {
    name: 'Gunadala',
    description:
      'Connect with Adsrow to discuss suitable screen placement options.',
    number: '04',
  },
  {
    name: 'Mangalagiri Road',
    description:
      'Discuss potential location-based campaigns along this Vijayawada corridor.',
    number: '05',
  },
]

export default function Locations() {
  return (
    <section className="bg-slate-50 px-5 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
              Our Locations
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950 md:text-5xl">
              Connecting local brands across Vijayawada.
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Explore the areas we are considering for community-focused
              advertising. Contact us to discuss current placement availability
              and campaign suitability.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 font-bold text-slate-950 transition hover:text-amber-600"
          >
            Enquire About Locations <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <article
              key={location.name}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition group-hover:bg-amber-400 group-hover:text-slate-950">
                  <MapPin size={24} />
                </div>

                <span className="text-sm font-extrabold tracking-widest text-slate-300">
                  {location.number}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-slate-950">
                {location.name}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {location.description}
              </p>

              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-slate-950"
              >
                Ask About This Area <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-slate-950 p-7 text-white md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                <Navigation size={24} />
              </div>

              <div>
                <h3 className="text-xl font-extrabold md:text-2xl">
                  Looking for a different location?
                </h3>

                <p className="mt-2 max-w-2xl leading-7 text-slate-300">
                  Tell us your preferred area in or around Vijayawada. We can
                  discuss whether a suitable placement may be available.
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Contact Us <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
