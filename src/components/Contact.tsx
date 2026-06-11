"use client";

import { useState } from "react";
import { profile } from "@/data/profile";

// The conversion point (BRIEF R3: "I want to talk to him"). No backend:
// the email is visible, copyable in one click, and openable via mailto —
// whichever the visitor prefers.
export default function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the visible address and mailto remain.
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-5xl scroll-mt-16 px-6 py-24">
      <p className="font-mono text-sm text-accent">Contact</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">
        Say hello
      </h2>
      <p className="mt-3 max-w-xl text-muted">
        The fastest way to reach me is email — I read everything.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="rounded-md border border-line bg-card px-4 py-2.5 font-mono text-sm">
          {profile.email}
        </span>
        <button
          type="button"
          onClick={copyEmail}
          className="rounded-md border border-line px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {copied ? "Copied!" : "Copy address"}
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? "Email address copied to clipboard" : ""}
        </span>
        <a
          href={`mailto:${profile.email}`}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Write me an email
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted underline-offset-4 hover:text-accent hover:underline"
        >
          GitHub
        </a>
        {profile.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted underline-offset-4 hover:text-accent hover:underline"
          >
            LinkedIn
          </a>
        )}
      </div>
    </section>
  );
}
