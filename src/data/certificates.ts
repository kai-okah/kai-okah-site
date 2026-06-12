// The certificate dossier on the desk (V5) — designed to grow with the
// career. Adding a certificate = adding an entry here and dropping the
// scan into public/certificates/. Entries without an image render as a
// designed placeholder page, so the dossier never looks broken while
// scans are on their way.

export type Certificate = {
  title: string;
  issuer: string;
  /** Display string, e.g. "2025". Free-form on purpose. */
  date?: string;
  /** Path under /public, e.g. "/certificates/cs50x.jpg". */
  image?: string;
  note?: string;
};

// TODO(kai): drop your scans into public/certificates/ and fill in the
// `image` (and exact dates) — the pages are already waiting for them.
export const certificates: Certificate[] = [
  {
    title: "CS50x — Introduction to Computer Science",
    issuer: "Harvard University / edX",
    note: "Final project: the E-Commerce System in C featured on this site.",
  },
  {
    title: "Abitur",
    issuer: "",
    note: "University entrance qualification.",
  },
  {
    title: "Reserved",
    issuer: "The next certificate goes here.",
    note: "This dossier grows with the career — that's the point of it.",
  },
];
