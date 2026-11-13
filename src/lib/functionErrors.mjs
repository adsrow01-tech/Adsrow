export async function describeFunctionError(error) {
  const response = error?.context;
  try {
    if (response && typeof response.clone === "function") {
      const body = await response.clone().json();
      if (typeof body?.error === "string" && body.error.trim()) return body.error;
      if (typeof body?.message === "string" && body.message.trim()) return body.message;
    }
  } catch {
    // The gateway may return an empty or non-JSON response.
  }

  const status = response?.status;
  if (status === 503) {
    return "The signup service is temporarily unavailable. Please try again shortly.";
  }
  if (status === 401 || status === 403) {
    return "Signup could not be authorized. Refresh the page and try again.";
  }

  const message = String(error?.message ?? "");
  if (/failed to send a request|fetch|network|cors/i.test(message) || !status) {
    return "The signup service is unavailable right now. Please try again shortly.";
  }
  return "Registration could not be completed. Please try again.";
}
