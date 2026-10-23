const enquiryCountKey = (userId) => `adsrow:enquiries:${userId}`;

export function getSubmittedEnquiryCount(userId) {
  if (!userId) return 0;
  try {
    return Number.parseInt(localStorage.getItem(enquiryCountKey(userId)) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

export function recordSubmittedEnquiry(userId) {
  if (!userId) return;
  const nextCount = getSubmittedEnquiryCount(userId) + 1;
  try {
    localStorage.setItem(enquiryCountKey(userId), String(nextCount));
  } catch {
    // Storage may be unavailable; the enquiry itself has already succeeded.
  }
}
