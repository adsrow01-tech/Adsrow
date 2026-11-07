export const ADSROW_WHATSAPP_NUMBER = "918374622055";
export { campaignScreenPricing } from "./siteContent";

export const packageCommitments = [
  { months: 1, discount: 0, label: "1 month" },
  { months: 3, discount: 0.10, label: "3 months", save: "Save 10%" },
  { months: 6, discount: 0.15, label: "6 months", save: "Save 15%" },
];

export const packageAudienceFilters = [
  { label: "Restaurant", homeLabel: "Restaurant", slug: "restaurant", pack: "nbhd" },
  { label: "Real estate", homeLabel: "Real estate", slug: "real-estate", pack: "nbhd" },
  { label: "School or coaching", homeLabel: "School or coaching", slug: "school", pack: "nbhd" },
  { label: "Supplement or sportswear", homeLabel: "Supplement or sportswear", slug: "fitness-brand", pack: "fit" },
  { label: "Fashion, salon or events", homeLabel: "Fashion or salon", slug: "retail", pack: "dine" },
  { label: "Big brand or launch", homeLabel: "Big brand", slug: "brand", pack: "city" },
];

export const tryItAudience = "~650";

export const audiencePacks = [
  {
    id: "neighbourhood",
    key: "nbhd",
    name: "Neighbourhood Pack",
    icon: "🏢",
    who: "Families at home, every morning and evening",
    audience: "~3,500+",
    audienceDescription: "people a day · apartment communities in 2–3 areas you choose",
    where: "Apartment communities, 2–3 areas",
    bestFor: "Restaurants, real estate, schools",
    dailyPrice: 349,
    fit: ["nbhd"],
    greatFor: ["Restaurants & delivery", "Real estate", "Schools & coaching", "Local shops"],
    details: [
      "Lift-lobby screens in the communities around your business",
      "Weighted to 7–10 am and 5–9 pm, when residents are home",
      "QR scans reported by community",
    ],
  },
  {
    id: "dine-out",
    key: "dine",
    name: "Dine-Out Pack",
    icon: "🍔",
    who: "Young crowds and families eating out",
    audience: "~2,500+",
    audienceDescription: "people a day · screens in restaurants and cafés",
    where: "Restaurants & cafés",
    bestFor: "Events, fashion, mobiles, banks",
    dailyPrice: 399,
    fit: ["dine", "nbhd"],
    greatFor: ["Movies & events", "Fashion & salons", "Mobiles & bikes", "Banks & cards", "Colleges"],
    details: [
      "Screens where diners sit and wait for their order",
      "Peak plays at lunch, evenings and weekends",
      "No ads that compete with the host venue",
    ],
  },
  {
    id: "fitness",
    key: "fit",
    name: "Fitness Pack",
    icon: "🏋️",
    who: "Health-focused regulars, several times a week",
    audience: "~2,000+",
    audienceDescription: "people a day · screens in gyms",
    where: "Gyms",
    bestFor: "Nutrition, sportswear",
    dailyPrice: 399,
    fit: ["fit"],
    greatFor: ["Nutrition & supplements", "Sportswear", "Healthy food"],
    details: [
      "Screens where members rest between sets and check in",
      "Peak plays 6–9 am and 6–9 pm",
      "The same members see you several times a week",
    ],
  },
];

export const cityPack = {
  id: "city",
  key: "city",
  name: "City Pack",
  badge: "Best value",
  who: "Everyone, everywhere we are",
  audience: "20,000+",
  audienceDescription: "people a day · every community, restaurant and gym in our network",
  where: "Everywhere we are",
  bestFor: "Launches & big brands",
  dailyPrice: 2249,
  fit: ["city"],
  greatFor: ["Launches", "Real estate projects", "Auto dealers", "Regional brands", "Festive campaigns"],
};

export const packageInclusions = [
  "10-second ad, plays every 2 minutes",
  "Free design for your first ad",
  "Change your ad anytime",
  "Proof-of-play report",
  "QR scan tracking",
  "Family-friendly content check",
];
