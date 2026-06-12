// The corkboard photo wall (V6) — six slots on the board, each one a
// COLLECTION of photos (client feedback 2026-06-12: "each photo slot
// should be able to have a lot of photos"). The pinned thumbnail on the
// 3D board is the collection's first photo; opening the wall and
// clicking a slot scrolls through everything in it.
//
// Growth path: drop images into public/corkboard/, then add them to a
// slot's `photos` array — or rearrange which collections own the six
// pins by reordering this list. Slots with no photos render as designed
// "reserved" placeholders, not as gaps.

export type Photo = {
  /** Path under /public, e.g. "/corkboard/hackathon-01.jpg". */
  image: string;
  caption?: string;
};

export type Slot = {
  label: string;
  /** Shown in the slot header and on reserved (empty) slots. */
  caption?: string;
  photos: Photo[];
};

export const slots: Slot[] = [
  {
    label: "The face behind the office",
    caption: "Kai Okah — Atchem-Kezih Kai Ndzoh Okah. Hello.",
    photos: [
      {
        image: "/photo.jpg",
        caption: "Kai Okah — Atchem-Kezih Kai Ndzoh Okah. Hello.",
      },
    ],
  },
  {
    label: "First hackathon",
    caption: "Reserved. It hasn't happened yet — it will.",
    photos: [],
  },
  { label: "UDE Essen", caption: "Reserved for campus shots.", photos: [] },
  {
    label: "First day, first job",
    caption: "Reserved. Watch this pin.",
    photos: [],
  },
  {
    label: "Somewhere far away",
    caption: "Reserved for the first real trip photos.",
    photos: [],
  },
  { label: "?", caption: "Reserved. Some pins earn their photos later.", photos: [] },
];
