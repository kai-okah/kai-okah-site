"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const sections = [
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// Sticky top bar. The IntersectionObserver watches the three sections and
// highlights the link for whichever one currently fills the middle of the
// viewport ("scroll-spy").
export default function Nav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A narrow band around the viewport's middle decides what's "active".
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3"
      >
        <a
          href="#top"
          className="font-mono text-sm font-semibold tracking-wider"
          aria-label="Back to top"
        >
          K<span className="text-accent">O</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              className={`rounded-md px-2 py-1.5 text-sm transition-colors sm:px-3 ${
                active === id ? "text-accent" : "text-muted hover:text-fg"
              }`}
            >
              {label}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
