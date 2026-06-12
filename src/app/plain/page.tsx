import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Plain version",
  description:
    "The fast, plain-HTML version of Kai Okah's portfolio — same projects, " +
    "same contact, no WebGL required.",
};

// v1 of the site, preserved in full (BRIEF V11): hero → projects → about
// → contact. This is the recruiter fast path and the no-WebGL/a11y
// fallback for the 3D office at `/`. Each section is its own small
// component; all words and facts live in src/data/.
export default function Plain() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
