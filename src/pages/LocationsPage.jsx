
import { Link } from 'react-router-dom'
import { MapPin, ArrowRight, Navigation } from 'lucide-react'

const locations = [
  {
    name: 'Benz Circle',
    number: '01',
    description:
      'Explore potential digital screen advertising opportunities around this Vijayawada area.',
  },
  {
    name: 'Patamata',
    number: '02',
    description:
      'Discuss residential community placements and local campaign possibilities.',
  },
  {
    name: 'Poranki',
    number: '03',
    description:
      'Explore advertising options for businesses targeting nearby communities.',
  },
  {
    name: 'Gunadala',
    number: '04',
    description:
      'Enquire about suitable screen placements for your advertising requirements.',
  },
  {
    name: 'Mangalagiri Road',
    number: '05',
    description:
      'Discuss location-based campaigns along this Vijayawada corridor.',
  },
]

export default function LocationsPage() {
  return (
    <main className="bg-white">
      <section className="bg-slate-950 px-5 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Our Locations
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Local connections start with the right location.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Discover the Vijayawada areas we are considering for
            community-focused digital advertising. Contact Adsrow to discuss
            current placement availability.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Ask About Locations <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Vijayawada, Andhra Pradesh
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Explore our target areas.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              These are potential target areas, not a confirmation that screens
              are already installed or available in every location.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <article
                key={location.number}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg"
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
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-950 transition hover:text-amber-600"
                >
                  Enquire About This Area <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 md:py-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-slate-950 p-8 text-white md:p-12">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                <Navigation size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold md:text-3xl">
                  Have another location in mind?
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-300">
                  Share your preferred area and campaign requirements. The
                  Adsrow team can discuss whether a suitable placement may be
                  available.
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Contact Adsrow <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
