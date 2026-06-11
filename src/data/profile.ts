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
      "projects on this page are tools I built because I needed them — " +
      "and kept polishing because someone else might too.",
    "Right now I'm deepening my React and TypeScript work (this site is " +
      "part of that — the source is public below) and I'm always happy to " +
      "talk about code, tools, or a role where I can be useful.",
  ],

  email: "okahkaiatchem@gmail.com",
  github: "https://github.com/kai-okah",
  // TODO(kai): add your LinkedIn profile URL — the link renders only once set.
  linkedin: "",

  // TODO(kai): update if the Vercel project gets a different name or a
  // custom domain later.
  siteUrl: "https://kai-okah-site.vercel.app",
  repoUrl: "https://github.com/kai-okah/kai-okah-site",

  // TODO(kai): set to "/photo.jpg" after adding your photo to /public.
  // Until then the hero shows the designed monogram state instead.
  photo: "",
};
