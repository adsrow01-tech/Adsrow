const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEnquiry(values = {}) {
  const errors = {};

  const name = String(values.name ?? "").trim();
  const email = String(values.email ?? "").trim();
  const phone = String(values.phone ?? "").trim();
  const enquiryType = String(values.enquiryType ?? "").trim();
  const message = String(values.message ?? "").trim();

  if (!name) {
    errors.name = "Please enter your name.";
  }

  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Please enter your phone number.";
  }

  if (!enquiryType) {
    errors.enquiryType = "Please select an enquiry type.";
  }

  if (!message) {
    errors.message = "Please tell us about your requirements.";
  }

  return errors;
}

export async function submitEnquiry(values) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error(
      "Web3Forms is not configured. Please check your environment variables."
    );
  }

  const formData = new FormData();

  formData.append("access_key", accessKey);
  formData.append("subject", "New Customer Enquiry - Adsrow Website");
  formData.append("from_name", "Adsrow Website");
  formData.append("name", String(values.name ?? "").trim());
  formData.append("email", String(values.email ?? "").trim());
  formData.append("phone", String(values.phone ?? "").trim());
  formData.append(
    "enquiry_type",
    String(values.enquiryType ?? "").trim()
  );
  formData.append("message", String(values.message ?? "").trim());

  let response;

  try {
    response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error(
      "Unable to connect to the enquiry service. Check your internet connection and try again."
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The enquiry service returned an invalid response. Please try again."
    );
  }

  if (!response.ok || data.success !== true) {
    throw new Error(
      data.message || "Your enquiry could not be submitted. Please try again."
    );
  }

  return data;
}