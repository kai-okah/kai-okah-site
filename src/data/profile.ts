// All personal facts and site copy live in this one typed object —
// changing the site's words never means touching a component.
// Everything marked TODO(kai) needs Kai's confirmation before launch.

export const profile = {
  brand: "Kai Okah",
  fullName: "Atchem-Kezih Kai Ndzoh Okah",

  role: "Software engineering student · UDE Essen",

  // TODO(kai): confirm or rewrite the pitch — this is the first sentence
  // a visitor reads.
  pitch:
    "I build small, honest tools and put them on the internet. " +
    "Currently studying software engineering at the University of " +
    "Duisburg-Essen and looking for the next real-world problem to chew on.",

  // TODO(kai): confirm the bio (drafted from the project brief).
  bio: [
    "I'm a software engineering student at the University of " +
      "Duisburg-Essen in Essen, Germany. I like software the way I like " +
      "explanations: small, direct, and honest about what it does. The " +
      "projects on this page are tools I built because I needed them " +
      "and kept polishing because someone else might too.",
    "Right now I'm deepening my React and TypeScript work (this site is " +
      "part of that. The source is public below) and I'm always happy to " +
      "talk about code, tools, or a role where I can be useful.",
  ],

  email: "okahkaiatchem@gmail.com",
  github: "https://github.com/kai-okah",
  // Set by Kai 2026-06-11. Must include https:// — without the protocol
  // the browser treats it as a relative path on this site (→ 404).
  linkedin: "https://www.linkedin.com/in/kaiokah",

  // TODO(kai): update if the Vercel project gets a different name or a
  // custom domain later.
  siteUrl: "https://kai-okah-site.vercel.app",
  repoUrl: "https://github.com/kai-okah/kai-okah-site",

  // Kai's portrait (public/photo.jpg, added 2026-06-11). Clearing this
  // falls back to the designed monogram state in the hero.
  photo: "/photo.jpg",
};
