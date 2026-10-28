const REQUIRED_FIELD_MESSAGE = "Please add this so we can send your plan.";
const PHONE_MESSAGE = "Enter a 10-digit mobile number.";

export const ENQUIRY_SERVER_MESSAGE =
  "Something went wrong on our side. Please try again, or WhatsApp us on +91 83746 22055.";

export function validateEnquiry(values = {}, requiredFields = []) {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!String(values[field] ?? "").trim()) {
      errors[field] = REQUIRED_FIELD_MESSAGE;
    }
  });

  const phone = String(values.phone ?? "").replace(/\s+/g, "");
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = PHONE_MESSAGE;

  return errors;
}

export async function submitEnquiry(values) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error("The enquiry form is temporarily unavailable. Please contact Adsrow on WhatsApp.");
  }

  const formData = new FormData();
  formData.append("access_key", accessKey);
  formData.append("subject", `${values.enquiryType} - Adsrow Website`);
  formData.append("from_name", "Adsrow Website");
  formData.append("enquiry_type", String(values.enquiryType ?? "").trim());

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || key === "enquiryType") return;
    formData.append(key, Array.isArray(value) ? value.join(", ") : String(value).trim());
  });

  let response;
  try {
    response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error(ENQUIRY_SERVER_MESSAGE);
  }

  try {
    const data = await response.json();
    if (!response.ok || data.success !== true) {
      throw new Error(ENQUIRY_SERVER_MESSAGE);
    }
    return data;
  } catch (error) {
    if (error instanceof Error && error.message === ENQUIRY_SERVER_MESSAGE) throw error;
    throw new Error(ENQUIRY_SERVER_MESSAGE);
  }
}
