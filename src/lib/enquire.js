// ponytail: fire-and-forget POST to a third-party form endpoint (Formspree,
// Basin, Getform, ...). Upgrade path: await the response and surface an
// error state in the form once confirmed delivery is required.
const ENDPOINT = import.meta.env.VITE_ENQUIRY_ENDPOINT

export function validateEnquiry(data) {
  const errors = {}
  if (!String(data.get('name')).trim()) errors.name = 'Please enter your name.'
  if (!String(data.get('company')).trim()) errors.company = 'Please enter your company name.'
  if (!String(data.get('email')).match(/^\S+@\S+\.\S+$/)) errors.email = 'Please enter a valid email address.'
  if (!String(data.get('message')).trim()) errors.message = 'Tell us a little about your campaign.'
  return errors
}

export function submitEnquiry(data) {
  if (!ENDPOINT) return Promise.resolve() // no endpoint configured: keep the existing preview behaviour
  return fetch(ENDPOINT, {
    method: 'POST',
    body: data,
    headers: { Accept: 'application/json' },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Enquiry endpoint returned ${res.status}`)
    })
    .catch((error) => console.error('Enquiry submission failed:', error))
}
