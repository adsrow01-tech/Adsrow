import { ADSROW_WHATSAPP_NUMBER } from "../lib/packageData";

export function packageWhatsappHref({ name, dailyPrice, months, audience }) {
  const monthCost = dailyPrice * 30;
  const totalCost = monthCost * months;
  const message = [
    "Hi Adsrow Team!",
    "",
    `I'm interested in the ${name}.`,
    `Commitment: ${months} month${months === 1 ? "" : "s"}.`,
    `Daily price shown: ₹${dailyPrice.toLocaleString("en-IN")}.`,
    `30-day campaign cost shown: ₹${monthCost.toLocaleString("en-IN")}.`,
    `Total for ${months} month${months === 1 ? "" : "s"}: ₹${totalCost.toLocaleString("en-IN")}.`,
    audience ? `Estimated audience shown: ${audience}.` : "",
    "",
    "Please confirm current availability, pricing and audience estimates, and guide me through the next steps.",
  ].filter(Boolean).join("\n");

  return `https://wa.me/${ADSROW_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function PackageEnquirySection({
  name,
  dailyPrice,
  months,
  audience,
  children,
  className = "",
  style,
}) {
  return (
    <a
      className={className}
      style={style}
      href={packageWhatsappHref({ name, dailyPrice, months, audience })}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
