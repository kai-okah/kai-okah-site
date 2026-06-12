// The corkboard photo wall (V6) — mostly reserved pins at launch, by
// design: trips, hackathons and milestones fill it in over the years.
// Adding a photo = dropping it into public/corkboard/ and filling in an
// entry. Reserved pins render as designed empty slots, not as gaps.

export type Pin = {
  label: string;
  /** Path under /public. Omitted = a reserved slot waiting for a photo. */
  image?: string;
  caption?: string;
};

export const pins: Pin[] = [
  {
    label: "The face behind the office",
    image: "/photo.jpg",
    caption: "Kai Okah — Atchem-Kezih Kai Ndzoh Okah. Hello.",
  },
  { label: "First hackathon", caption: "Reserved. It hasn't happened yet — it will." },
  { label: "UDE Essen", caption: "Reserved for a campus shot." },
  { label: "First day, first job", caption: "Reserved. Watch this pin." },
  { label: "Somewhere far away", caption: "Reserved for the first real trip photo." },
  { label: "?", caption: "Reserved. Some pins earn their photo later." },
];
