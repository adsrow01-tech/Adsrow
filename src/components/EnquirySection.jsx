import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  Send,
} from 'lucide-react'
import {
  submitEnquiry,
  validateEnquiry,
} from '../lib/enquire'
import { isVerifiedUser, useAuth } from '../context/AuthContext'

const initialValues = {
  name: '',
  email: '',
  phone: '',
  enquiryType: '',
  message: '',
}

const fieldClass =
  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100'

export default function EnquirySection({ requiresVerifiedUser = false }) {
  const navigate = useNavigate()
  const { refreshSession } = useAuth()
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

    if (status === 'sending') {
      return
    }

    const needsAuthentication = requiresVerifiedUser || values.enquiryType === 'Host a Screen'
    if (needsAuthentication) {
      setStatus('sending')
      const requestedPath = `/partner-form${values.enquiryType === 'Host a Screen' ? '?interest=hosting' : ''}`
      try {
        const currentUser = await refreshSession()
        if (!isVerifiedUser(currentUser)) {
          const reason = currentUser ? 'verify-email' : 'auth-required'
          navigate(`/login?next=${encodeURIComponent(requestedPath)}&reason=${reason}`, { replace: true })
          return
        }
      } catch {
        navigate(`/login?next=${encodeURIComponent(requestedPath)}&reason=auth-required`, { replace: true })
        return
      }
    }

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

      setValues({ ...initialValues })
      setErrors({})
      setStatus('success')
    } catch (error) {
      setStatus('error')

      setServerError(
        error instanceof Error
          ? error.message
          : 'We could not submit your enquiry. Please try again.'
      )
    }
  }

  function handleAnotherEnquiry() {
    setValues({ ...initialValues })
    setErrors({})
    setServerError('')
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <section
        role="status"
        aria-live="polite"
        className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center md:p-12"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 size={34} />
        </div>

        <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
          Thank You for Contacting Adsrow!
        </h2>

        <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
          Your enquiry has been submitted successfully. Our team
          will review your requirements and contact you soon.
        </p>

        <p className="mt-4 text-sm text-slate-500">
          We appreciate your interest in Adsrow.
        </p>

        <button
          type="button"
          onClick={handleAnotherEnquiry}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Submit Another Enquiry
          <ArrowRight size={18} />
        </button>
      </section>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={status === 'sending'}
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
            aria-describedby={
              errors.name ? 'name-error' : undefined
            }
            required
            disabled={status === 'sending'}
          />

          {errors.name && (
            <p
              id="name-error"
              className="mt-2 text-sm text-red-600"
            >
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
            aria-describedby={
              errors.email ? 'email-error' : undefined
            }
            required
            disabled={status === 'sending'}
          />

          {errors.email && (
            <p
              id="email-error"
              className="mt-2 text-sm text-red-600"
            >
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
            aria-describedby={
              errors.phone ? 'phone-error' : undefined
            }
            required
            disabled={status === 'sending'}
          />

          {errors.phone && (
            <p
              id="phone-error"
              className="mt-2 text-sm text-red-600"
            >
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
            disabled={status === 'sending'}
          >
            <option value="">Select an enquiry type</option>
            <option value="Advertising">
              Advertise With Adsrow
            </option>
            <option value="Host a Screen">
              Host a Screen
            </option>
            <option value="Partnership">
              Business Partnership
            </option>
            <option value="Other">Other Enquiry</option>
          </select>

          {errors.enquiryType && (
            <p
              id="type-error"
              className="mt-2 text-sm text-red-600"
            >
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
            aria-describedby={
              errors.message ? 'message-error' : undefined
            }
            required
            disabled={status === 'sending'}
          />

          {errors.message && (
            <p
              id="message-error"
              className="mt-2 text-sm text-red-600"
            >
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
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-amber-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? (
          <>
            <LoaderCircle
              className="animate-spin"
              size={19}
            />
            Submitting...
          </>
        ) : (
          <>
            Submit Enquiry
            <Send size={18} />
          </>
        )}
      </button>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Your information will be used to respond to your enquiry.
      </p>
    </form>
  )
}
