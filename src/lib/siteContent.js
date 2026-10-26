import { Monitor, MapPin, Palette, ChartNoAxesCombined, CalendarDays } from "lucide-react";
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
