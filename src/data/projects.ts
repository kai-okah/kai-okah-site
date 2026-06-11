// One object per featured project — adding a project to the site means
// adding an entry here, nothing else (BRIEF growth path, no CMS).

export type Project = {
  name: string;
  // The one-line story: what it is and why it exists.
  line: string;
  description: string;
  stack: string[];
  repo: string;
};

export const projects: Project[] = [
  {
    // Privacy rule from the brief: this card links to the repo and stays
    // generic — no screenshots, no job-hunt data anywhere on the site.
    // TODO(kai): confirm the repo URL, description and stack, and that the
    // repo itself is sanitized (day-1 privacy check) before launch.
    name: "job-radar",
    line: "A tool that watches the job market so I don't have to.",
    description:
      "Keeps track of interesting postings and my own pipeline in one " +
      "place instead of seventeen browser tabs. Built for my real job " +
      "hunt, shared because the problem isn't unique to me.",
    stack: ["TypeScript"],
    repo: "https://github.com/kai-okah/job-radar",
  },
  {
    // TODO(kai): replace with a real repo — you owe the engineer the list
    // of 2–3 projects to feature (BRIEF day-1 deliverable).
    name: "second-project",
    line: "Placeholder — Kai picks the featured repos during PR review.",
    description:
      "This card shows the layout with three projects. Swap in a real " +
      "repository by editing src/data/projects.ts.",
    stack: ["TODO"],
    repo: "https://github.com/kai-okah",
  },
  {
    // TODO(kai): replace with a real repo, or delete — the grid looks
    // right with two cards as well.
    name: "third-project",
    line: "Placeholder — see the note on second-project.",
    description:
      "Same as above: replace or remove this entry in " +
      "src/data/projects.ts before launch.",
    stack: ["TODO"],
    repo: "https://github.com/kai-okah",
  },
];
