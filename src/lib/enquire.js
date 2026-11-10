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

// Maps every public enquiry type to its dashboard record type.
function resolveRequestType(enquiryType) {
  const value = String(enquiryType ?? "").toLowerCase();
  if (value.includes("venue") || value.includes("host")) return "partner";
  if (value.includes("creative support")) return "support";
  return "contact";
}

// Records every enquiry in the Supabase `requests` table (the admin dashboard's
// source of truth) IN ADDITION to the Web3Forms email delivery, which stays the
// primary channel. A record-store failure must never block the site form: the
// enquiry still went through to the inbox, so every failure here is silent.
async function recordEnquiryToSupabase(values) {
  try {
    const { supabase, isSupabaseConfigured } = await import("./supabase");
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from("requests").insert({
      request_type: resolveRequestType(values.enquiryType),
      name: String(values.name ?? "").trim(),
      email: String(values.email ?? "").trim(),
      phone: String(values.phone ?? "").trim(),
      message: String(values.message ?? "").trim(),
      details: Object.fromEntries(Object.entries(values).filter(([key, value]) =>
        !["enquiryType", "name", "email", "phone", "message"].includes(key) && value !== undefined && value !== null && String(value).trim() !== "" && !Array.isArray(value))),
    });
  } catch {
    // Email delivery already succeeded; missing dashboard rows are not fatal.
  }
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
    // Email delivery succeeded: mirror the enquiry into the dashboard's
    // `requests` table in the background. A record-store failure must never
    // block the site form (it is fully handled inside the helper).
    void recordEnquiryToSupabase(values);
    return data;
  } catch (error) {
    if (error instanceof Error && error.message === ENQUIRY_SERVER_MESSAGE) throw error;
    throw new Error(ENQUIRY_SERVER_MESSAGE);
  }
}
