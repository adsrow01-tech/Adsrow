
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEnquiry(values = {}) {
  const errors = {}

  const name = String(values.name ?? '').trim()
  const email = String(values.email ?? '').trim()
  const phone = String(values.phone ?? '').trim()
  const enquiryType = String(values.enquiryType ?? '').trim()
  const message = String(values.message ?? '').trim()

  if (!name) {
    errors.name = 'Please enter your name.'
  }

  if (!email) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!phone) {
    errors.phone = 'Please enter your phone number.'
  }

  if (!enquiryType) {
    errors.enquiryType = 'Please select an enquiry type.'
  }

  if (!message) {
    errors.message = 'Please tell us about your requirements.'
  }

  return errors
}

export async function submitEnquiry(values) {
  const endpoint = import.meta.env.VITE_ENQUIRY_ENDPOINT

  if (!endpoint) {
    throw new Error(
      'The enquiry service is not configured yet. Please contact the website administrator.'
    )
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: String(values.name ?? '').trim(),
      email: String(values.email ?? '').trim(),
      phone: String(values.phone ?? '').trim(),
      enquiryType: String(values.enquiryType ?? '').trim(),
      message: String(values.message ?? '').trim(),
      source: 'Adsrow Website',
      submittedAt: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    throw new Error(
      'We could not submit your enquiry. Please try again.'
    )
  }

  return response
}
