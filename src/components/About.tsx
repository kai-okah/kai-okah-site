import { profile } from "@/data/profile";
import Reveal from "@/components/Reveal";

// The human layer for the HR audience (BRIEF R2): short bio plus the
// full-name line required by R14.
export default function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-24">
      <Reveal>
        <p className="font-mono text-sm text-accent">About</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          The person behind the commits
        </h2>
        <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-muted">
          {profile.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <p className="border-l-2 border-accent pl-4 text-sm">
            Kai is the everyday short form of my full name,{" "}
            <span className="font-medium text-fg">{profile.fullName}</span>.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
