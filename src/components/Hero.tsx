import Image from "next/image";
import { profile } from "@/data/profile";

// Above-the-fold: name, pitch, and the two calls to action (BRIEF R3 —
// contact is always one click away). The portrait slot is designed to look
// intentional in BOTH states: with Kai's photo once it exists, and as a
// KO monogram card until then — so a missing photo can never block launch.
export default function Hero() {
  return (
    <section
      id="top"
      className="mx-auto grid max-w-5xl items-center gap-10 px-6 pb-24 pt-20 sm:pt-28 md:grid-cols-[1fr_auto]"
    >
      <div>
        <p className="font-mono text-sm text-accent">{profile.role}</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
          {profile.brand}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {profile.pitch}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contact"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Get in touch
          </a>
          <a
            href="#projects"
            className="rounded-md border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            See my work
          </a>
        </div>
      </div>

      {profile.photo ? (
        <Image
          src={profile.photo}
          alt={`Portrait of ${profile.brand}`}
          width={224}
          height={224}
          priority
          className="hidden rounded-2xl border border-line object-cover md:block"
        />
      ) : (
        <div
          aria-hidden="true"
          className="hidden h-56 w-56 select-none place-items-center rounded-2xl border border-line bg-card md:grid"
        >
          <span className="font-mono text-6xl font-semibold tracking-tight">
            K<span className="text-accent">O</span>
          </span>
        </div>
      )}
    </section>
  );
}
