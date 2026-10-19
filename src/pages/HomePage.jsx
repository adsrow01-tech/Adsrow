
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Monitor,
  MapPin,
  Palette,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'

const services = [
  {
    icon: Monitor,
    title: 'Digital Screen Advertising',
    description:
      'Explore digital screen advertising opportunities for your business.',
  },
  {
    icon: MapPin,
    title: 'Location-Based Campaigns',
    description:
      'Discuss suitable locations for your advertising campaign.',
  },
  {
    icon: Palette,
    title: 'Ad Creative Support',
    description:
      'Prepare clear, engaging creative content for digital screens.',
  },
  {
    icon: BarChart3,
    title: 'Campaign Planning',
    description:
      'Define your campaign goals, audience and preferred locations.',
  },
]

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden bg-white">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#05091b] text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
          {/* LEFT SIDE */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-amber-400 sm:text-sm">
                Digital Screen Advertising
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
              Your Brand.
              <span className="mt-2 block text-amber-400">
                Their Community.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Connect your brand with residential communities through
              location-focused digital screen advertising opportunities.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/advertise"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-amber-400 px-6 py-4 font-bold !text-slate-950 transition hover:bg-amber-300"
              >
                Advertise With Us
                <ArrowRight size={19} />
              </Link>

              <Link
                to="/host-a-screen"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-600 px-6 py-4 font-bold !text-white transition hover:border-amber-400 hover:bg-white/5"
              >
                Host a Screen
                <ArrowUpRight size={19} />
              </Link>
            </div>

            <div className="mt-7 flex items-start gap-3 text-sm leading-6 text-slate-400">
              <MapPin className="mt-1 shrink-0 text-amber-400" size={17} />
              <p>
                Exploring digital advertising opportunities in Vijayawada,
                Andhra Pradesh.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: DISPLAY MOCKUP */}
          <div className="mx-auto w-full max-w-xl min-w-0">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl sm:p-5">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#111a30] p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Adsrow
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-white">
                      DIGITAL DISPLAY
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-amber-400 px-4 py-2 text-xs font-extrabold text-slate-950">
                    AD SPACE
                  </span>
                </div>

                <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 p-5 text-slate-950 sm:p-8">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full border-[22px] border-white/15" />

                  <div className="relative">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] sm:text-sm">
                      Make Your Brand Seen
                    </p>

                    <h2 className="mt-5 text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl">
                      HELLO,
                      <br />
                      NEIGHBOUR!
                    </h2>

                    <p className="mt-5 max-w-xs text-sm font-medium leading-6 sm:text-base">
                      Advertising that brings brands and communities closer.
                    </p>

                    <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold !text-white">
                      Your Brand Here
                      <ArrowUpRight size={17} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Community advertising
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Digital screen concept preview
                    </p>
                  </div>

                  <Monitor className="shrink-0 text-amber-400" size={25} />
                </div>
              </div>
            </div>

            {/* NO OVERLAP: CARD IS IN NORMAL DOCUMENT FLOW */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111a30] px-5 py-4 shadow-xl sm:mt-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <p className="text-xs text-slate-400">Advertising focus</p>
                <p className="mt-1 font-bold text-white">
                  Local Communities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-5 py-16 sm:px-8 md:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-amber-600">
                What We Do
              </p>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                Advertising made more local.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-600">
                Explore digital screen advertising services and potential
                community partnerships with Adsrow.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex w-fit items-center gap-2 font-bold text-slate-950 transition hover:text-amber-600"
            >
              Explore Services
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition group-hover:bg-amber-400 group-hover:text-slate-950">
                  <Icon size={25} />
                </div>

                <h3 className="mt-5 text-lg font-extrabold leading-7 text-slate-950">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {description}
                </p>

                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-950 transition hover:text-amber-700"
                >
                  Enquire Now
                  <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOST A SCREEN CTA */}
      <section className="bg-amber-400 px-5 py-14 sm:px-8 md:py-20 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-800">
              Partner With Adsrow
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Have a screen-hosting opportunity?
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-slate-800">
              Apartment associations and property managers can enquire about
              potential digital screen partnerships.
            </p>
          </div>

          <Link
            to="/host-a-screen"
            className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-4 font-bold !text-white transition hover:bg-slate-800"
          >
            Host a Screen
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>
    </div>
  )
}
