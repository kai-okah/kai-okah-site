// One object per featured project — adding a project to the site means
// adding an entry here, nothing else (BRIEF growth path, no CMS).

export type Project = {
  name: string;
  // The one-line story: what it is and why it exists.
  line: string;
  description: string;
  stack: string[];
  // Omitted = private code: the card explains instead of linking
  // (privacy rule from the brief — job-radar knows too much about Kai).
  repo?: string;
};

export const projects: Project[] = [
  {
    // Privacy rule from the brief: the real repo stays private (it holds
    // CV, applications and rankings from the actual job hunt), so this
    // card deliberately has no repo link. Decided by Kai 2026-06-11.
    name: "job-radar",
    line: "A tool that watches the job market so I don't have to.",
    description:
      "Scans postings across platforms, scores them against what I'm " +
      "actually looking for, and tracks every application in one place " +
      "instead of seventeen browser tabs. Built for my real job hunt — " +
      "which is exactly why the code stays private: it knows too much " +
      "about me.",
    stack: ["Python", "LLM pipeline"],
  },
  {
    name: "E-Commerce System in C",
    line: "An online store that runs entirely in the terminal.",
    description:
      "Final project for Harvard's CS50x: user accounts, product " +
      "browsing, cart, checkout with loyalty points — written in C with " +
      "file-based persistence and a video demo in the README.",
    stack: ["C"],
    repo: "https://github.com/kai-okah/cs50xProject",
  },
  {
    name: "dsa-course-2026",
    line: "Making algorithms prove they work.",
    description:
      "Companion repo to my data-structures course: implementations " +
      "ship with test runners that print the condition, expected vs. " +
      "actual, and pass/fail — so edge cases in binary search, stacks, " +
      "queues and union-find have nowhere to hide.",
    stack: ["Python"],
    repo: "https://github.com/kai-okah/dsa-course-2026",
  },
];
