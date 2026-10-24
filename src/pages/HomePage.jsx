
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Monitor,
  MapPin,
  Palette,
  BarChart3,
  CheckCircle2,
  CalendarDays,
  Building2,
  Users,
} from 'lucide-react'

const services = [
  {
    icon: Monitor,
    title: 'Community Screen Network',
    description:
      'Reach residents through digital screens placed in gated-community lift lobbies.',
  },
  {
    icon: MapPin,
    title: 'Area-Targeted Campaigns',
    description:
      'Choose the communities and Vijayawada areas that fit your campaign.',
  },
  {
    icon: Palette,
    title: 'Ad Design & Video',
    description:
      'Bring your message to life with clear creative made for digital screens.',
  },
  {
    icon: BarChart3,
    title: 'Campaign Reports',
    description:
      'Review proof-of-play information and available QR scans or enquiries.',
  },
]

const steps = [
  ['01', 'Choose locations', 'Select the communities that best fit your audience.'],
  ['02', 'Pick your schedule', 'Tell us when you want your campaign to run.'],
  ['03', 'Share your ad', 'Provide your image or video, or ask Adsrow about creative support.'],
  ['04', 'Go live remotely', 'Your approved campaign can run across the selected screens.'],
  ['05', 'Get your report', 'Review where and how often your ad played, plus available QR scans and enquiries.'],
]

const areas = [
  'Bhavanipuram',
  'Governorpet',
  'Labbipet',
  'Moghalrajpuram',
  'Benz Circle',
  'Patamata',
  'Gunadala',
  'Ajit Singh Nagar',
  'Kanuru',
  'Poranki',
]

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden bg-white text-[#172334]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#E8F6FF]">
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-[#3BA7F2]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-80 w-80 rounded-full bg-[#7FE7D6]/20 blur-3xl" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-10 lg:py-24">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3BA7F2]/30 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.13em] text-[#0B3D91] sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-[#7FE7D6]" />
              Now launching in Vijayawada
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-[#12152B] sm:text-5xl md:text-6xl xl:text-[4.35rem]">
              Your brand,
              <span className="mt-2 block text-[#0B3D91]">
                in the lift lobby.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Adsrow brings digital advertising screens into gated
              communities—so your message can reach residents where they pause,
              wait and notice every day.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/partner-form"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[#0B3D91] px-6 py-4 font-bold text-white shadow-lg shadow-[#0B3D91]/15 transition hover:-translate-y-0.5 hover:bg-[#082F70]"
              >
                Book a campaign
                <ArrowRight size={19} />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-[#0B3D91]/20 bg-white px-6 py-4 font-bold text-[#12152B] transition hover:border-[#3BA7F2] hover:bg-white/70"
              >
                See how it works
                <ArrowUpRight size={19} />
              </a>
            </div>

            <div className="mt-7 flex items-start gap-3 text-sm leading-6 text-slate-600">
              <MapPin className="mt-1 shrink-0 text-[#0B3D91]" size={18} />
              <p>
                Starting with a pilot network of gated communities in
                Vijayawada, Andhra Pradesh.
              </p>
            </div>
          </div>

          {/* LIFT-LOBBY SCREEN PREVIEW */}
          <div className="mx-auto w-full max-w-lg min-w-0">
            <div className="rounded-[2rem] border border-white bg-white/80 p-3 shadow-2xl shadow-[#0B3D91]/10 sm:p-5">
              <div className="rounded-[1.5rem] bg-[#12152B] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7FE7D6]">
                      Adsrow network
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-white">
                      Lift lobby display
                    </p>
                  </div>

                  <span className="rounded-full border border-[#7FE7D6]/30 bg-[#7FE7D6]/10 px-3 py-2 text-[11px] font-bold text-[#7FE7D6]">
                    SCREEN PREVIEW
                  </span>
                </div>

                <div className="mx-auto mt-5 max-w-[310px] rounded-[1.4rem] border-[5px] border-slate-700 bg-slate-900 p-2 shadow-xl">
                  <div className="relative flex min-h-[390px] flex-col justify-between overflow-hidden rounded-[1rem] bg-gradient-to-br from-[#0B3D91] via-[#1265B7] to-[#3BA7F2] p-6 text-white sm:min-h-[440px]">
                    <div className="pointer-events-none absolute -right-12 top-12 h-44 w-44 rounded-full border-[26px] border-white/10" />

                    <div className="relative">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7FE7D6]">
                        A message for your neighbourhood
                      </p>

                      <h2 className="mt-6 text-4xl font-extrabold leading-[1.03] tracking-tight sm:text-5xl">
                        HELLO,
                        <br />
                        NEIGHBOUR.
                      </h2>

                      <p className="mt-5 max-w-[220px] text-sm leading-6 text-white/85">
                        Your brand, right where the community pauses.
                      </p>
                    </div>

                    <div className="relative flex items-end justify-between gap-3 border-t border-white/25 pt-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                          Advertise locally
                        </p>
                        <p className="mt-1 text-lg font-extrabold">
                          Make it memorable.
                        </p>
                      </div>

                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#7FE7D6] text-[#12152B]">
                        <ArrowUpRight size={25} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 px-1 pb-1">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Community advertising
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Illustrative screen concept
                    </p>
                  </div>
                  <Monitor className="shrink-0 text-[#7FE7D6]" size={24} />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#DCECF8] bg-white px-5 py-4 shadow-lg shadow-[#0B3D91]/5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F6FF] text-[#0B3D91]">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-500">The Adsrow idea</p>
                <p className="mt-1 font-bold text-[#12152B]">
                  Not where they pass. Where they pause.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILOT NETWORK */}
      <section className="border-y border-[#DCECF8] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-5 py-6 sm:grid-cols-3 sm:px-8 lg:px-10">
          {[
            ['30', 'Digital screens in the pilot plan'],
            ['20', 'Gated communities'],
            ['1', 'Dashboard to manage campaigns'],
          ].map(([number, label], index) => (
            <div
              key={label}
              className={`px-4 py-4 text-center sm:py-3 ${
                index
                  ? 'border-t border-[#DCECF8] sm:border-l sm:border-t-0'
                  : ''
              }`}
            >
              <p className="text-3xl font-extrabold tracking-tight text-[#0B3D91]">
                {number}
              </p>
              <p className="mt-1 text-sm text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-24 px-5 py-16 sm:px-8 md:py-24 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#0B3D91]">
              Simple from start to report
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#12152B] sm:text-4xl md:text-5xl">
              From campaign idea to screen.
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              A straightforward process to plan a local campaign and understand
              where it ran.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map(([number, title, description]) => (
              <article
                key={number}
                className="rounded-2xl border border-[#DCECF8] bg-white p-5 transition hover:-translate-y-1 hover:border-[#3BA7F2] hover:shadow-lg hover:shadow-[#0B3D91]/5"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F6FF] text-sm font-extrabold text-[#0B3D91]">
                  {number}
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-[#12152B]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[#F6FBFF] px-5 py-16 sm:px-8 md:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#0B3D91]">
                What we do
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#12152B] sm:text-4xl md:text-5xl">
                Local advertising, made practical.
              </h2>
              <p className="mt-5 max-w-xl leading-8 text-slate-600">
                From selecting communities to preparing creative and reviewing
                campaign reports, Adsrow helps bring the pieces together.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex w-fit items-center gap-2 font-bold text-[#0B3D91] transition hover:text-[#3BA7F2]"
            >
              Explore services <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="group rounded-2xl border border-[#DCECF8] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#3BA7F2] hover:shadow-xl hover:shadow-[#0B3D91]/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F6FF] text-[#0B3D91] transition group-hover:bg-[#0B3D91] group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-lg font-extrabold leading-7 text-[#12152B]">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {description}
                </p>
                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0B3D91] hover:text-[#3BA7F2]"
                >
                  Enquire now <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="px-5 py-16 sm:px-8 md:py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div className="relative rounded-[2rem] bg-[#E8F6FF] p-5 sm:p-8">
            <div className="rounded-[1.5rem] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#E8F6FF] text-[#0B3D91]">
                  <MapPin size={25} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#0B3D91]">
                    Pilot rollout
                  </p>
                  <p className="mt-1 font-extrabold text-[#12152B]">
                    Vijayawada, Andhra Pradesh
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {areas.map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-2 rounded-xl border border-[#DCECF8] px-3 py-3 text-sm font-medium text-slate-700"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#3BA7F2]" />
                    {area}
                  </div>
                ))}
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-500">
                Areas are indicative of the pilot rollout; availability should
                be confirmed when planning a campaign.
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#0B3D91]">
              Where we’re starting
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#12152B] sm:text-4xl md:text-5xl">
              Reach people closer to home.
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              Adsrow’s pilot network focuses on gated communities across
              Vijayawada. Choose the areas that make sense for your audience
              and discuss suitable communities with our team.
            </p>

            <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-700">
              <li className="flex gap-3">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#0B3D91]"
                  size={19}
                />
                Gated communities and apartment lift lobbies
              </li>
              <li className="flex gap-3">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#0B3D91]"
                  size={19}
                />
                Campaign planning around selected areas
              </li>
              <li className="flex gap-3">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-[#0B3D91]"
                  size={19}
                />
                Other venue types may be considered for future expansion
              </li>
            </ul>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0B3D91] px-6 py-4 font-bold text-white transition hover:bg-[#082F70]"
            >
              Ask about locations <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY ADSROW */}
      <section className="bg-[#12152B] px-5 py-16 text-white sm:px-8 md:py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#7FE7D6]">
              Why Adsrow
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Not where they pass.
              <br />
              Where they pause.
            </h2>
            <p className="mt-5 leading-8 text-slate-300">
              A lift-lobby screen gives your message a place within the
              community environment—not just beside a road.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                Users,
                'Reach residents',
                'Place your message within selected communities.',
              ],
              [
                MapPin,
                'Choose locations',
                'Plan around communities that fit your audience.',
              ],
              [
                CalendarDays,
                'Adjust campaign plans',
                'Discuss schedule and creative changes with Adsrow.',
              ],
              [
                BarChart3,
                'Review campaign activity',
                'Access available play reports and campaign response data.',
              ],
            ].map(([Icon, title, description]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
              >
                <Icon size={23} className="text-[#7FE7D6]" />
                <h3 className="mt-4 font-extrabold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOST A SCREEN */}
      <section className="px-5 py-16 sm:px-8 md:py-20 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 rounded-[2rem] border border-[#DCECF8] bg-gradient-to-r from-[#E8F6FF] to-white p-7 sm:p-10 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.16em] text-[#0B3D91]">
              <Building2 size={18} />
              Partner with Adsrow
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#12152B] sm:text-4xl">
              Bring a digital screen to your community.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">
              Apartment associations and venue partners can talk to us about
              screen installation, maintenance, community notices and
              partnership terms.
            </p>
          </div>

          <Link
            to="/partner-form"
            className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[#0B3D91] px-7 py-4 font-bold text-white transition hover:bg-[#082F70]"
          >
            Host a screen <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-16 sm:px-8 md:pb-24 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#E8F6FF] p-7 sm:p-10 md:flex-row md:items-center md:p-12">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#0B3D91]">
              Ready to get started?
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#12152B] sm:text-4xl">
              Let’s plan your first campaign.
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-slate-600">
              Tell us what you want to promote and which communities you want
              to reach.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-[#0B3D91] px-7 py-4 font-bold text-white transition hover:bg-[#082F70]"
          >
            Contact Adsrow <ArrowRight size={19} />
          </Link>
        </div>
      </section>
    </div>
  )
}
