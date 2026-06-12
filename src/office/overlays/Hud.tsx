"use client";

import { useEffect, useState } from "react";
import { useOffice } from "@/office/store";
import { profile } from "@/data/profile";
import { click } from "@/office/audio/sound";

// The thin DOM layer over the canvas: hover labels next to the cursor,
// the click-anywhere name reveal (V3), a back control whenever the
// camera is parked somewhere, the light switch shortcut, and — R3 from
// v1 carries into the office — contact always one click away.
export default function Hud() {
  const mode = useOffice((s) => s.mode);
  // One-time gesture hint, fading out after a few seconds in the room.
  const [hintGone, setHintGone] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHintGone(true), 7000);
    return () => clearTimeout(timer);
  }, []);
  const flying = useOffice((s) => s.flying);
  const hoverLabel = useOffice((s) => s.hoverLabel);
  const nameRevealed = useOffice((s) => s.nameRevealed);
  const lightMode = useOffice((s) => s.lightMode);
  const cycleLight = useOffice((s) => s.cycleLight);
  const back = useOffice((s) => s.back);

  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // Esc always means "step back" — same muscle memory as the overlays.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [back]);

  const focused = mode !== "idle" && mode !== "entry";

  return (
    <>
      {/* Hover label, riding next to the cursor */}
      {hoverLabel && (
        <div
          className="pointer-events-none fixed z-30 max-w-xs rounded-md border border-amber-500/40 bg-black/80 px-3 py-1.5 font-mono text-xs text-amber-400"
          style={{ left: cursor.x + 16, top: cursor.y + 16 }}
        >
          {hoverLabel}
        </div>
      )}

      {/* V3: name + profession on an idle click */}
      <div
        aria-hidden={!nameRevealed}
        className={`pointer-events-none fixed inset-x-0 top-14 z-30 flex justify-center transition-opacity duration-700 ${
          nameRevealed ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-center">
          <p className="font-mono text-2xl font-semibold tracking-tight text-[#ece9e2] sm:text-3xl">
            Kai <span className="text-amber-500">Okah</span>
          </p>
          <p className="mt-1 font-mono text-xs tracking-[0.25em] text-[#9b968a]">
            SOFTWARE ENGINEER (IN TRAINING)
          </p>
        </div>
      </div>

      {/* One-time hint: how to move (drag + scroll) */}
      {mode === "idle" && (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-x-0 top-5 z-30 flex justify-center transition-opacity duration-1000 ${
            hintGone ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="rounded-md bg-black/50 px-4 py-2 font-mono text-xs text-[#9b968a] backdrop-blur">
            drag to look around · scroll to walk closer · click what interests you
          </p>
        </div>
      )}

      {/* Bottom bar: back · light mode · email */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-end justify-between p-4">
        <div className="flex gap-2">
          {focused && !flying && (
            <button
              onClick={() => {
                click();
                back();
              }}
              className="rounded-md border border-[#3a3631] bg-black/60 px-4 py-2 font-mono text-xs text-[#ece9e2] backdrop-blur transition-colors hover:border-amber-500 hover:text-amber-400"
            >
              ← back to the office <span className="text-[#6f6a60]">(Esc)</span>
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              click();
              cycleLight();
            }}
            aria-label={`Lighting: ${lightMode}. Click to change.`}
            className="rounded-md border border-[#3a3631] bg-black/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-[#9b968a] backdrop-blur transition-colors hover:border-amber-500 hover:text-amber-400"
          >
            {lightMode === "day" ? "☀ day" : lightMode === "evening" ? "◐ evening" : "☾ midnight"}
          </button>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-md border border-amber-500/60 bg-black/60 px-4 py-2 font-mono text-xs text-amber-400 backdrop-blur transition-colors hover:bg-amber-500 hover:text-black"
          >
            {profile.email}
          </a>
        </div>
      </div>
    </>
  );
}
