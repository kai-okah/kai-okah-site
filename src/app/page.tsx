import Nav from "@/components/Nav";
import Hero from "@/components/Hero";

// The whole site is this one page: hero → projects → about → contact
// (BRIEF R13). Sections below the hero are filled in by their own
// components as they land.
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
        </section>
        <section id="about" className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="text-2xl font-semibold tracking-tight">About</h2>
        </section>
        <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
        </section>
      </main>
    </>
  );
}
