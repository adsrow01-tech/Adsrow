
import { Link } from 'react-router-dom'
import { ArrowRight, Target, Eye, Users, Monitor, MapPin } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'Help businesses reach relevant audiences through digital advertising screens placed in residential communities.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'Build a trusted community-focused advertising network that connects brands with everyday audiences.',
  },
  {
    icon: Users,
    title: 'Our Approach',
    description:
      'Bring advertisers, apartment associations and residents together through useful, well-managed screen placements.',
  },
]

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="bg-slate-950 px-5 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            About Adsrow
          </p>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Bringing brands closer to the communities that matter.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Adsrow is building a community-focused digital screen advertising
            network, helping businesses communicate with audiences in
            residential spaces.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Connect With Us <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Who We Are
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950 md:text-4xl">
              A smarter way to reach local audiences.
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Traditional advertising can be broad and difficult to target.
              Adsrow aims to create a more focused alternative by connecting
              brands with residential communities through digital screens.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              We bring together businesses looking to advertise and apartment
              associations interested in hosting screens. Our goal is to make
              local advertising easier to plan, coordinate and understand.
            </p>
          </div>

          <div className="rounded-3xl bg-amber-50 p-8 md:p-10">
            <div className="grid gap-5">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <Monitor className="text-amber-500" size={30} />
                <h3 className="mt-4 text-lg font-bold text-slate-950">
                  Digital Screen Network
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Advertising opportunities designed around residential
                  community spaces.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <MapPin className="text-amber-500" size={30} />
                <h3 className="mt-4 text-lg font-bold text-slate-950">
                  Local Focus
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A Vijayawada-focused approach to connecting brands with
                  nearby communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              What Guides Us
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Built around connection and trust.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-slate-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    {value.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {value.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-amber-400 px-7 py-10 text-center md:px-12 md:py-14">
          <h2 className="text-3xl font-extrabold text-slate-950 md:text-4xl">
            Let's build better local advertising together.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-800">
            Are you a business looking to advertise or an apartment association
            interested in hosting a screen? Let's start a conversation.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="rounded-full bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
            >
              Contact Adsrow
            </Link>

            <Link
              to="/host-a-screen"
              className="rounded-full border border-slate-950/30 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Host a Screen
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
