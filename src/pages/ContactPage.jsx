
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="bg-slate-950 px-5 py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Contact Adsrow
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Let's create better advertising opportunities.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Want to advertise your business or explore hosting a digital screen
            in your community? Tell us what you need.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950">
              We'd love to hear from you.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Sign in to share your requirements through the protected partner
              enquiry page. Our next steps will depend on your campaign,
              location and partnership needs.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">
                    Advertising enquiries
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Tell us about your brand, campaign and target audience.
                  </p>
                  <Link
                    to="/advertise"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-amber-700"
                  >
                    Explore advertising <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl border border-slate-200 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">
                    Screen-hosting partnerships
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Apartment associations and property managers can discuss
                    potential screen-hosting opportunities.
                  </p>
                  <Link
                    to="/host-a-screen"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-amber-700"
                  >
                    Host a screen <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-7 md:p-9">
            <h2 className="text-2xl font-extrabold text-slate-950">Ready to talk?</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Sign in or create an account to send an enquiry to the Adsrow team.
            </p>
            <Link
              to="/partner-form"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-bold text-white"
            >
              Start an enquiry <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
