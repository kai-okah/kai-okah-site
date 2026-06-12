"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useOffice } from "@/office/store";
import { unlockAudio, startRain, click, typewriterTick } from "@/office/audio/sound";

const LINE = "This is a completely normal office.";

// The Henry-Heffernan-style entry (V2): dark screen → typewriter line →
// START. The START click is what unlocks audio (browser autoplay rules),
// so every sound in the experience descends from this one gesture.
// Visitors with prefers-reduced-motion get the finished line immediately.
export default function EntryOverlay() {
  const enter = useOffice((s) => s.enter);
  const [chars, setChars] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced.current) {
      setChars(LINE.length);
      return;
    }
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setChars(i);
      typewriterTick(); // silent until audio is unlocked — harmless no-op
      if (i >= LINE.length) clearInterval(timer);
    }, 55);
    return () => clearInterval(timer);
  }, []);

  const ready = chars >= LINE.length;

  const start = () => {
    unlockAudio();
    click();
    startRain();
    setLeaving(true);
    // Let the fade-out play before the mode flips and the HUD appears.
    setTimeout(enter, reduced.current ? 0 : 600);
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0a0908] px-6 text-center transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <p className="font-mono text-lg text-[#ece9e2] sm:text-2xl" aria-label={LINE}>
        <span aria-hidden="true">
          {LINE.slice(0, chars)}
          <span className="entry-caret" />
        </span>
      </p>

      <button
        onClick={start}
        disabled={!ready}
        className={`mt-12 rounded-md border border-amber-500 px-10 py-3 font-mono text-sm tracking-[0.3em] text-amber-500 transition-all duration-700 hover:bg-amber-500 hover:text-[#0a0908] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
          ready ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        START
      </button>

      <p
        className={`mt-10 text-xs text-[#6f6a60] transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        3D · sound on ·{" "}
        <Link href="/plain" className="underline hover:text-amber-500">
          prefer the plain version?
        </Link>
      </p>
    </div>
  );
}
