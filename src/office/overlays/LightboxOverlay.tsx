"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useOffice } from "@/office/store";
import { pins } from "@/data/corkboard";
import { click } from "@/office/audio/sound";

// The corkboard, up close (V6). Pins with photos open large; reserved
// pins show what they're waiting for — the board is a growth design and
// says so with a straight face.
export default function LightboxOverlay() {
  const back = useOffice((s) => s.back);
  const flying = useOffice((s) => s.flying);
  const [selected, setSelected] = useState<number | null>(null);
  const pin = selected === null ? null : pins[selected];
  const hasSelection = useRef(false);
  hasSelection.current = selected !== null;

  // Esc steps back ONE level: photo -> board first, board -> office only
  // after that. Capture phase so it wins over the HUD's global Esc
  // (which would otherwise dump the visitor all the way out — the exact
  // trap from client feedback, 2026-06-12).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !hasSelection.current) return;
      e.stopPropagation();
      setSelected(null);
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
      // Clicking the dark backdrop also steps back one level.
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        click();
        if (hasSelection.current) setSelected(null);
        else back();
      }}
    >
      {pin ? (
        // Lightbox for one pin
        <div className="w-full max-w-md">
          <div className="max-h-[70vh] overflow-y-auto rounded-lg bg-[#f2ede2] p-4 shadow-2xl shadow-black/50">
            {pin.image ? (
              <Image
                src={pin.image}
                alt={pin.label}
                width={640}
                height={640}
                className="w-full rounded"
              />
            ) : (
              <div className="flex aspect-square flex-col items-center justify-center rounded border-2 border-dashed border-[#c9c0ad] text-center">
                <p className="font-mono text-4xl text-[#c9c0ad]">＋</p>
                <p className="mt-2 px-8 font-mono text-xs uppercase tracking-widest text-[#9b968a]">
                  photo reserved
                </p>
              </div>
            )}
            <p className="mt-3 font-medium text-[#1a1916]">{pin.label}</p>
            {pin.caption && <p className="mt-1 text-sm text-[#6f6a60]">{pin.caption}</p>}
          </div>
          <button
            onClick={() => {
              click();
              setSelected(null);
            }}
            className="mt-4 rounded-md border border-[#3a3631] bg-black/60 px-4 py-2 font-mono text-xs text-[#ece9e2] transition-colors hover:border-amber-500 hover:text-amber-400"
          >
            ← back to the board
          </button>
        </div>
      ) : (
        // The board: all pins
        <div className="w-full max-w-2xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
              The corkboard — filling in over the years
            </p>
            <button
              onClick={() => {
                click();
                back();
              }}
              className="rounded-md border border-[#3a3631] bg-black/60 px-3 py-1.5 font-mono text-xs text-[#9b968a] transition-colors hover:border-amber-500 hover:text-amber-400"
            >
              close ✕ <span className="text-[#6f6a60]">(Esc)</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pins.map((p, i) => (
              <button
                key={p.label}
                onClick={() => {
                  click();
                  setSelected(i);
                }}
                className="group rounded-lg bg-[#f2ede2] p-2.5 pb-3 text-left shadow-lg shadow-black/40 transition-transform hover:-translate-y-1"
                style={{ rotate: `${((i * 7) % 5) - 2}deg` }}
              >
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.label}
                    width={320}
                    height={320}
                    className="aspect-square w-full rounded object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded border-2 border-dashed border-[#c9c0ad]">
                    <span className="font-mono text-2xl text-[#c9c0ad]">＋</span>
                  </div>
                )}
                <p className="mt-2 truncate font-mono text-[11px] text-[#1a1916]">{p.label}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
