
import { useState } from 'react'
import { ArrowRight, CheckCircle2, LoaderCircle, Send } from 'lucide-react'
import { submitEnquiry, validateEnquiry } from '../lib/enquire'

const initialValues = {
  name: '',
  email: '',
  phone: '',
  enquiryType: '',
  message: '',
}

const fieldClass =
  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100'

export default function EnquirySection() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [serverError, setServerError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setValues((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))

    setServerError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const validationErrors = validateEnquiry(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setStatus('idle')
      return
    }

    setStatus('sending')
    setServerError('')

    try {
      await submitEnquiry(values)
      setStatus('success')
      setValues(initialValues)
      setErrors({})
    } catch (error) {
      setStatus('error')
      setServerError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 size={34} />
        </div>

        <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
          Enquiry submitted successfully!
        </h2>

        <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
          Thank you for contacting Adsrow. Your enquiry has been submitted.
        </p>

        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-7 rounded-full bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800"
        >
          Submit Another Enquiry
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-9"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-950">
          Send an Enquiry
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Fields marked with * are required.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="enquiry-name"
            className="text-sm font-semibold text-slate-800"
          >
            Full Name *
          </label>

          <input
            id="enquiry-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            value={values.name}
            onChange={handleChange}
            className={fieldClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            required
          />

          {errors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-email"
            className="text-sm font-semibold text-slate-800"
          >
            Email Address *
          </label>

          <input
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
            className={fieldClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            required
          />

          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-phone"
            className="text-sm font-semibold text-slate-800"
          >
            Phone Number *
          </label>

          <input
            id="enquiry-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Enter your phone number"
            value={values.phone}
            onChange={handleChange}
            className={fieldClass}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            required
          />

          {errors.phone && (
            <p id="phone-error" className="mt-2 text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-type"
            className="text-sm font-semibold text-slate-800"
          >
            Enquiry Type *
          </label>

          <select
            id="enquiry-type"
            name="enquiryType"
            value={values.enquiryType}
            onChange={handleChange}
            className={fieldClass}
            aria-invalid={Boolean(errors.enquiryType)}
            aria-describedby={
              errors.enquiryType ? 'type-error' : undefined
            }
            required
          >
            <option value="">Select an enquiry type</option>
            <option value="Advertising">Advertise With Adsrow</option>
            <option value="Host a Screen">Host a Screen</option>
            <option value="Partnership">Business Partnership</option>
            <option value="Other">Other Enquiry</option>
          </select>

          {errors.enquiryType && (
            <p id="type-error" className="mt-2 text-sm text-red-600">
              {errors.enquiryType}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="enquiry-message"
            className="text-sm font-semibold text-slate-800"
          >
            Tell Us About Your Requirements *
          </label>

          <textarea
            id="enquiry-message"
            name="message"
            rows={5}
            placeholder="Describe your advertising goals or screen-hosting requirements..."
            value={values.message}
            onChange={handleChange}
            className={`${fieldClass} resize-y`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            required
          />

          {errors.message && (
            <p id="message-error" className="mt-2 text-sm text-red-600">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
        >
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-amber-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? (
          <>
            <LoaderCircle className="animate-spin" size={19} />
            Submitting...
          </>
        ) : (
          <>
            Submit Enquiry <Send size={18} />
          </>
        )}
      </button>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Your enquiry will be sent when the Adsrow enquiry service is configured.
      </p>
    </form>
  )
}
