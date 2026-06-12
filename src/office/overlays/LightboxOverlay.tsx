"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useOffice } from "@/office/store";
import { slots } from "@/data/corkboard";
import { click } from "@/office/audio/sound";

// The photo wall (V6) — stage two of the corkboard: the camera is
// already parked at the board (first click), and this overlay opened on
// the second click. A grid of six slots, each slot a scrollable
// collection of photos. Esc (or the backdrop) always steps back exactly
// ONE level: collection → grid → close (back to the 3D board) — the
// navigation contract from client feedback 2026-06-12.
export default function LightboxOverlay() {
  const flying = useOffice((s) => s.flying);
  const setCorkboardOpen = useOffice((s) => s.setCorkboardOpen);
  const [selected, setSelected] = useState<number | null>(null);
  const slot = selected === null ? null : slots[selected];
  const hasSelection = useRef(false);
  hasSelection.current = selected !== null;

  // Capture phase so this wins over the HUD's global Esc (which exits
  // to the office).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      if (hasSelection.current) setSelected(null);
      else useOffice.getState().setCorkboardOpen(false);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4 transition-opacity duration-500 ${
        flying ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label="Corkboard photo wall"
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        click();
        if (hasSelection.current) setSelected(null);
        else setCorkboardOpen(false);
      }}
    >
      {slot ? (
        // One collection, scrollable — a slot can hold any number of photos.
        <div className="flex max-h-[85vh] w-full max-w-lg flex-col">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
              {slot.label}
              {slot.photos.length > 0 && (
                <span className="text-[#9b968a]"> · {slot.photos.length} photo{slot.photos.length === 1 ? "" : "s"}</span>
              )}
            </p>
            <button
              onClick={() => {
                click();
                setSelected(null);
              }}
              className="rounded-md border border-[#3a3631] bg-black/60 px-3 py-1.5 font-mono text-xs text-[#9b968a] transition-colors hover:border-amber-500 hover:text-amber-400"
            >
              ← board <span className="text-[#6f6a60]">(Esc)</span>
            </button>
          </div>

          <div className="min-h-0 space-y-4 overflow-y-auto pr-1">
            {slot.photos.length === 0 ? (
              <div className="rounded-lg bg-[#f2ede2] p-4 shadow-2xl shadow-black/50">
                <div className="flex aspect-square flex-col items-center justify-center rounded border-2 border-dashed border-[#c9c0ad] text-center">
                  <p className="font-mono text-4xl text-[#c9c0ad]">＋</p>
                  <p className="mt-2 px-8 font-mono text-xs uppercase tracking-widest text-[#9b968a]">
                    photos reserved
                  </p>
                </div>
                {slot.caption && <p className="mt-3 text-sm text-[#6f6a60]">{slot.caption}</p>}
              </div>
            ) : (
              slot.photos.map((photo) => (
                <figure key={photo.image} className="rounded-lg bg-[#f2ede2] p-4 shadow-2xl shadow-black/50">
                  <Image
                    src={photo.image}
                    alt={photo.caption ?? slot.label}
                    width={760}
                    height={760}
                    className="w-full rounded"
                  />
                  {photo.caption && (
                    <figcaption className="mt-3 text-sm text-[#6f6a60]">{photo.caption}</figcaption>
                  )}
                </figure>
              ))
            )}
          </div>
        </div>
      ) : (
        // The wall: all six slots.
        <div className="w-full max-w-2xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
              The photo wall — filling in over the years
            </p>
            <button
              onClick={() => {
                click();
                setCorkboardOpen(false);
              }}
              className="rounded-md border border-[#3a3631] bg-black/60 px-3 py-1.5 font-mono text-xs text-[#9b968a] transition-colors hover:border-amber-500 hover:text-amber-400"
            >
              close ✕ <span className="text-[#6f6a60]">(Esc)</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {slots.map((s, i) => (
              <button
                key={s.label}
                onClick={() => {
                  click();
                  setSelected(i);
                }}
                className="group rounded-lg bg-[#f2ede2] p-2.5 pb-3 text-left shadow-lg shadow-black/40 transition-transform hover:-translate-y-1"
                style={{ rotate: `${((i * 7) % 5) - 2}deg` }}
              >
                {s.photos[0] ? (
                  <div className="relative">
                    <Image
                      src={s.photos[0].image}
                      alt={s.label}
                      width={320}
                      height={320}
                      className="aspect-square w-full rounded object-cover"
                    />
                    {s.photos.length > 1 && (
                      <span className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-[#ece9e2]">
                        +{s.photos.length - 1}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded border-2 border-dashed border-[#c9c0ad]">
                    <span className="font-mono text-2xl text-[#c9c0ad]">＋</span>
                  </div>
                )}
                <p className="mt-2 truncate font-mono text-[11px] text-[#1a1916]">{s.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
