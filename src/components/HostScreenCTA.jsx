
import { Link } from 'react-router-dom'
import {
  Building2,
  Monitor,
  Handshake,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const benefits = [
  'Discuss suitable screen placement areas',
  'Understand installation and maintenance requirements',
  'Explore a potential advertising partnership',
]

export default function HostScreenCTA() {
  return (
    <section className="overflow-hidden bg-slate-950 px-5 py-16 text-white md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Host a Screen
          </p>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
            Turn your community into a place for meaningful connections.
          </h2>

          <p className="mt-6 max-w-xl leading-8 text-slate-300">
            Are you part of an apartment association or a property management
            team? Connect with Adsrow to discuss the possibility of hosting a
            digital advertising screen in your community.
          </p>

          <ul className="mt-7 space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-amber-400"
                />
                <span className="leading-7 text-slate-200">{benefit}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/host-a-screen"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-4 font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Explore Hosting <ArrowRight size={18} />
          </Link>
        </div>

        <div className="relative">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-9">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Community Partnership</p>
                <h3 className="mt-2 text-2xl font-extrabold">
                  Let's work together.
                </h3>
              </div>

              <div className="rounded-2xl bg-amber-400 p-4 text-slate-950">
                <Handshake size={30} />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-5">
                <Building2
                  size={25}
                  className="mt-1 shrink-0 text-amber-400"
                />
                <div>
                  <h4 className="font-bold">For Apartment Associations</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Discuss community suitability, permissions and partnership
                    requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-5">
                <Monitor
                  size={25}
                  className="mt-1 shrink-0 text-amber-400"
                />
                <div>
                  <h4 className="font-bold">For Property Managers</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Explore appropriate screen locations and practical
                    installation considerations.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-amber-400 p-5 text-slate-950">
              <p className="text-sm font-semibold">Have a suitable space?</p>
              <Link
                to="/contact"
                className="mt-2 inline-flex items-center gap-2 font-extrabold"
              >
                Tell Us About It <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
