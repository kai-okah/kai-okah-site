import type { Project } from "@/data/projects";

// One card per project: name, one-line story, short description, stack
// tags, link to the source. In v2 a "details" link to a per-project page
// will join the source link at the bottom (BRIEF R13 growth path).
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-line bg-card p-6 transition-colors hover:border-accent">
      <h3 className="font-mono text-lg font-semibold tracking-tight">
        {project.name}
      </h3>
      <p className="text-sm font-medium">{project.line}</p>
      <p className="text-sm leading-relaxed text-muted">
        {project.description}
      </p>
      <ul aria-label="Built with" className="mt-1 flex flex-wrap gap-2">
        {project.stack.map((tag) => (
          <li
            key={tag}
            className="rounded border border-line px-2 py-0.5 font-mono text-xs text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto pt-2 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        View source <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}
