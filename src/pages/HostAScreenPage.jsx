
import { Link } from 'react-router-dom'
import {
  Building2,
  Monitor,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Handshake,
} from 'lucide-react'

const benefits = [
  {
    icon: Building2,
    title: 'For Apartment Associations',
    description:
      'Explore whether your community is suitable for hosting a digital advertising screen.',
  },
  {
    icon: Users,
    title: 'For Property Managers',
    description:
      'Discuss placement requirements, access arrangements and community coordination.',
  },
  {
    icon: Monitor,
    title: 'Screen Placement Planning',
    description:
      'Review potential locations and practical installation considerations.',
  },
  {
    icon: ShieldCheck,
    title: 'Permission and Coordination',
    description:
      'Discuss community permissions, responsibilities and hosting arrangements before proceeding.',
  },
]

const steps = [
  {
    title: 'Submit Your Enquiry',
    description:
      'Share your name, community details and preferred way to contact you.',
  },
  {
    title: 'Discuss Your Community',
    description:
      'Talk about the property, potential screen locations and suitability.',
  },
  {
    title: 'Review Requirements',
    description:
      'Discuss permissions, installation considerations and partnership terms.',
  },
  {
    title: 'Confirm Next Steps',
    description:
      'Proceed only after the proposed arrangements and responsibilities are agreed.',
  },
]

export default function HostAScreenPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-slate-950 px-5 py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
              Host a Screen
            </p>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              Make your community part of the Adsrow network.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 md:text-lg">
              Are you an apartment association member or property manager?
              Connect with Adsrow to explore the possibility of hosting a
              digital advertising screen in your community.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-4 font-bold text-slate-950 transition hover:bg-amber-300"
            >
              Enquire About Hosting <ArrowRight size={18} />
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-9">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
              <Building2 size={32} />
            </div>

            <h2 className="mt-6 text-2xl font-extrabold">
              Community Partnership
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Every property is different. Screen hosting depends on location
              suitability, community permissions and agreed arrangements.
            </p>

            <div className="mt-7 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-400"
                />
                <p className="text-sm leading-6 text-slate-300">
                  Discuss possible screen locations.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-400"
                />
                <p className="text-sm leading-6 text-slate-300">
                  Understand installation and maintenance requirements.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-400"
                />
                <p className="text-sm leading-6 text-slate-300">
                  Review the proposed partnership before making a commitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who can host */}
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              Who Can Participate?
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Building partnerships with communities.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              If you manage or represent a residential property, you can contact
              Adsrow to discuss a potential screen-hosting partnership.
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

                  <h3 className="mt-5 text-xl font-extrabold text-slate-950">
                    {benefit.title}
                  </h3>

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
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
              How Hosting Works
            </p>

            <h2 className="mt-4 text-3xl font-extrabold text-slate-950 md:text-4xl">
              Four steps to explore a partnership.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 md:p-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 font-extrabold text-amber-800">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-950">
                    {step.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-amber-400 px-7 py-10 text-center md:px-12 md:py-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-amber-400">
            <Handshake size={28} />
          </div>

          <h2 className="mt-5 text-3xl font-extrabold text-slate-950 md:text-4xl">
            Interested in hosting a screen?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-800">
            Tell us about your apartment or property. We can discuss suitability,
            permissions and potential partnership arrangements.
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
