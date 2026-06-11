import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";

// The proof section: real tools with public source — for the developer
// audience (BRIEF R2), one click from card to code.
export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-24">
      <Reveal>
        <p className="font-mono text-sm text-accent">Projects</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Things I actually built
        </h2>
        <p className="mt-3 max-w-xl text-muted">
          Every card links to public source code — the repos are part of the
          portfolio.
        </p>
      </Reveal>
      <Reveal className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </Reveal>
    </section>
  );
}
