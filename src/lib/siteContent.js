import {
  Monitor,
  MapPin,
  Palette,
  ChartNoAxesCombined,
  CalendarDays,
  Building2,
  Coffee,
  Dumbbell,
  HeartPulse,
  ShoppingBag,
  ShoppingBasket,
  BriefcaseBusiness,
} from "lucide-react";

export const targetAreas = [
  "Bhavanipuram",
  "Governorpet",
  "Labbipet",
  "Moghalrajpuram",
  "Benz Circle",
  "Patamata",
  "Gunadala",
  "Ajit Singh Nagar",
  "Kanuru",
  "Poranki",
];

export const venueCategories = [
  {
    icon: Building2,
    title: "Apartment lift lobbies",
    audience: "Families and homeowners, every morning and evening, inside their own community.",
    bestFor: "Real estate, schools, food delivery, home services, local shops.",
    summary: "Families, every morning and evening.",
  },
  {
    icon: Coffee,
    title: "Cafés & restaurants",
    audience: "Young professionals, students and families, relaxed and waiting for their order.",
    bestFor: "Events, entertainment, lifestyle brands, apps, education.",
    summary: "Diners with time on their hands.",
  },
  {
    icon: Dumbbell,
    title: "Gyms",
    audience: "Health-focused regulars who come back several times a week.",
    bestFor: "Nutrition, sportswear, diagnostics, insurance, healthy food.",
    summary: "Health-focused, high-routine regulars.",
  },
  {
    icon: HeartPulse,
    title: "Hospital reception areas",
    audience: "Patients and families, seated and attentive for long periods.",
    bestFor: "Pharmacies, labs, health insurance, wellness and specialist care.",
    summary: "Patients and families, waiting and attentive.",
  },
  {
    icon: ShoppingBag,
    title: "Shopping malls",
    audience: "Shoppers with time and money to spend, especially at weekends.",
    bestFor: "Fashion, electronics, auto, food courts, store launches.",
    summary: "Shoppers in buying mode.",
  },
  {
    icon: ShoppingBasket,
    title: "Supermarkets",
    audience: "Household decision-makers, right at the point of purchase.",
    bestFor: "FMCG, packaged food, home care, in-store offers.",
    summary: "Households at the point of purchase.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Offices & commercial spaces",
    audience: "Working professionals with steady incomes, five days a week.",
    bestFor: "Banks, real estate, auto, restaurants, B2B services.",
    summary: "Working professionals, five days a week.",
  },
];

export const audiencePacks = [
  {
    title: "Home Pack",
    category: "Families at home",
    description: "Apartment lift lobbies. Best for real estate, schools, food delivery and home services.",
  },
  {
    title: "Wellness Pack",
    category: "Health & wellness",
    description: "Hospital receptions and gyms. Best for clinics, labs, pharmacies, insurance and nutrition brands.",
  },
  {
    title: "Shopper Pack",
    category: "Shoppers",
    description: "Malls and supermarkets. Best for FMCG, retail, fashion and store openings.",
  },
  {
    title: "Work Pack",
    category: "Professionals",
    description: "Offices and commercial spaces. Best for banks, auto, real estate and B2B services.",
  },
  {
    title: "Café Pack",
    category: "Food & social",
    description: "Cafés and restaurants. Best for events, entertainment, lifestyle and youth brands.",
  },
  {
    title: "Full Network",
    category: "Everyone",
    description: "All 60 screens across 40 venues. Best for launches and city-wide takeovers.",
  },
];

export const includedServices = [
  {
    title: "A city-wide screen network",
    description: "Your ad runs across the venues you choose, all from one booking. We deal with every venue so you don't have to.",
  },
  {
    title: "Venue and area targeting",
    description: "Combine venue types and neighbourhoods. Reach gym-goers in Benz Circle or families in Patamata.",
  },
  {
    title: "Ad design and video",
    description: "Send your own image or video, or our creative team will build an ad made for the screen.",
  },
  {
    title: "Proof and lead tracking",
    description: "Review available proof of play by screen and date. Ask which QR and campaign-number tracking options are available for your campaign.",
  },
];

export const campaignPackages = [
  {
    name: "Starter",
    screens: "10",
    duration: "7 days",
    bestFor: "Testing an offer in one area or venue type",
    price: null,
  },
  {
    name: "Growth",
    screens: "20",
    duration: "15 days",
    bestFor: "Restaurants, clinics and coaching centres",
    price: null,
  },
  {
    name: "Impact",
    screens: "30",
    duration: "30 days",
    bestFor: "Launches and dealership drives",
    price: null,
  },
  {
    name: "Full Network",
    screens: "All 60",
    duration: "Custom",
    bestFor: "City-wide takeovers by regional and national brands",
    price: null,
    customQuote: true,
  },
];

export const campaignAddOns = [
  {
    title: "QR lead campaign",
    description: "Ask about tracking scans by venue and sending people to a landing page or WhatsApp.",
  },
  {
    title: "Tracked call number",
    description: "Ask about a campaign number to count calls attributed to your Adsrow campaign.",
  },
  {
    title: "Prime-time slots",
    description: "Discuss lunch hours in offices, evenings in gyms and weekends in malls.",
  },
  {
    title: "Venue takeover",
    description: "Ask about exclusive placements across a venue type or area.",
  },
  {
    title: "Creative production",
    description: "Static, motion or video ads, sized for each screen.",
  },
  {
    title: "Agency rates",
    description: "Ask about volume pricing for media buyers booking for several clients.",
  },
];

export const adSpecifications = [
  {
    format: "Portrait screen",
    size: "9:16 · resolution to confirm",
    length: "Confirm with Adsrow",
    fileTypes: "Confirm with Adsrow",
  },
];

export const adSpecsTip = "One message, one offer, one action. Short and bold beats long and clever.";
export const adStandards = "Every ad is reviewed before it goes live and matched to venues where it fits. We'll flag anything that needs changing.";
export const campaignPackageNote = "Every package includes scheduling, remote ad updates and a play report.";
export const addOnAvailabilityNote = "Add-on availability depends on the campaign and current network setup. Confirm details with the Adsrow team.";

export const advertiserFaqs = [
  {
    question: "Where are your screens?",
    answer: "60 screens across 40 venues in Vijayawada: apartment lift lobbies, cafés and restaurants, gyms, hospital receptions, malls, supermarkets, offices and commercial spaces.",
  },
  {
    question: "How much does a campaign cost?",
    answer: "Price on request for 10 screens over 7 days. Share your audience and dates and we'll send an exact price.",
    contactType: "advertiser",
    linkLabel: "Ask for a price",
  },
  {
    question: "Can I choose specific venues?",
    answer: "Yes. Pick venue types, areas or individual venues, or ask us to recommend the best mix for your goal.",
    contactType: "advertiser",
    linkLabel: "Ask about venues",
  },
  {
    question: "Can I mix venue types in one campaign?",
    answer: "Yes. For example, run in hospitals and gyms together to reach health-focused people across the city.",
  },
  {
    question: "What kind of ad do I need?",
    answer: "A short image or video in the screen's format. If you don't have one, our creative team can make it.",
  },
  {
    question: "How fast can I go live?",
    answer: "Contact our team to confirm the expected go-live timing for your venues and ad.",
    contactType: "advertiser",
    linkLabel: "Ask about timing",
  },
  {
    question: "Can I change my ad during the campaign?",
    answer: "Ads can be updated remotely. Contact our team to confirm the timing for your campaign.",
    contactType: "advertiser",
    linkLabel: "Ask about updates",
  },
  {
    question: "How do I know my ad played, and whether it worked?",
    answer: "You can request a proof-of-play report by screen and date. Ask us whether QR-code or tracked-call options are available for your campaign.",
    contactType: "advertiser",
    linkLabel: "Ask about tracking",
  },
  {
    question: "Is there a minimum spend or lock-in?",
    answer: "Contact our team to confirm minimum booking and cancellation terms.",
    contactType: "advertiser",
    linkLabel: "Ask about booking terms",
  },
  {
    question: "Are any ads not allowed?",
    answer: "Every ad is reviewed before it goes live. Some venues, such as hospitals, have stricter rules, and we'll tell you up front.",
  },
];

export const venuePartnerFaqs = [
  {
    question: "What does hosting a screen cost?",
    answer: "Contact our team to confirm any costs and discuss installation and maintenance terms.",
    contactType: "venue",
    linkLabel: "Ask about hosting terms",
  },
  {
    question: "Which venues can host?",
    answer: "Apartment communities, cafés, restaurants, gyms, hospitals, clinics, malls, supermarkets, offices and commercial buildings with regular footfall.",
  },
  {
    question: "How do we start?",
    answer: "Send us your venue name, area and a contact. We'll arrange a site visit.",
    contactType: "venue",
    linkLabel: "Start a venue enquiry",
  },
];

export const hostScreenBenefits = [
  {
    icon: Building2,
    title: "Apartment communities",
    description: "A digital notice board for maintenance alerts, events and meeting dates. No more paper notices nobody reads.",
  },
  {
    icon: Coffee,
    title: "Cafés & restaurants",
    description: "Promote today's specials, combos and events to guests already at your tables.",
  },
  {
    icon: Dumbbell,
    title: "Gyms",
    description: "Show class timetables, trainer offers and membership deals between workouts.",
  },
  {
    icon: HeartPulse,
    title: "Hospitals & clinics",
    description: "Share health tips, departments and visiting information. Waiting times feel shorter.",
  },
  {
    icon: ShoppingBag,
    title: "Malls & supermarkets",
    description: "Highlight in-store offers and new arrivals at the moment shoppers decide.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Offices & commercial spaces",
    description: "Post building notices, tenant updates and safety information in the lobby.",
  },
];

export const hostPartnerBenefits = [
  {
    title: "Installation and maintenance",
    description: "Adsrow handles installation and maintenance. Any costs and responsibilities are confirmed in the partner terms.",
  },
  {
    title: "Space for your content",
    description: "Discuss space for your own offers and notices between advertisements, including how content is supplied and scheduled.",
  },
  {
    title: "Reviewed, relevant ads",
    description: "Ads are reviewed before they play and matched to venues where they fit.",
  },
  {
    title: "Revenue-share terms",
    description: "Whether a monthly share applies, and how it is calculated, will be confirmed in writing before installation.",
  },
  {
    title: "Clear written terms",
    description: "Costs, responsibilities and agreed partnership terms are recorded before anything is installed.",
  },
];

export const hostScreenSteps = [
  {
    title: "Tell us about your venue",
    description: "Share the name, area, venue type and approximate daily footfall.",
  },
  {
    title: "We visit",
    description: "If the venue is suitable, we'll arrange an assessment of power, internet and the best screen location.",
  },
  {
    title: "Agree the terms",
    description: "Costs, responsibilities and partnership terms are confirmed in writing before installation.",
  },
  {
    title: "We install it",
    description: "Once the venue and terms are approved, the team will coordinate the installation plan with you.",
  },
];

export const hostScreenFaqs = [
  {
    question: "Who pays for installation and maintenance?",
    answer: "Adsrow handles installation and maintenance. Any costs, and who covers power and internet, will be confirmed during the venue assessment and recorded in the partner terms.",
  },
  {
    question: "Will ads compete with my business?",
    answer: "Ad categories and any placement restrictions can be discussed before signing. Competitor exclusion is not confirmed as a standard policy.",
  },
  {
    question: "Can I show my own content?",
    answer: "Yes. Space can be set aside for your offers and notices between ads. The team can confirm the content format and schedule with you.",
  },
  {
    question: "Can I remove the screen later?",
    answer: "The removal process and notice period will be documented in the partner agreement. Discuss these terms with the team before installation.",
  },
];

export const campaignSteps = [
  {
    icon: MapPin,
    title: "Choose locations",
    description: "Select communities and areas near your audience, or ask the Adsrow team to suggest a suitable mix.",
  },
  {
    icon: CalendarDays,
    title: "Pick your schedule",
    description: "Discuss campaign length and time slots, including the periods that best fit your audience.",
  },
  {
    icon: Palette,
    title: "Share your ad",
    description: "Send a screen-ready image or video, or ask about creative support from the Adsrow team.",
  },
  {
    icon: Monitor,
    title: "Coordinate the launch",
    description: "The Adsrow team coordinates playback across the selected screens and can discuss remote campaign updates.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Review your report",
    description: "Review available proof of play, QR scans by community, and calls made through a campaign number.",
  },
];
