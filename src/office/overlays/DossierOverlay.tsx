"use client";

import Image from "next/image";
import { useState } from "react";
import { useOffice } from "@/office/store";
import { certificates } from "@/data/certificates";
import { pageFlip, click } from "@/office/audio/sound";

// The certificate dossier (V5): the folder on the desk, opened. One page
// per certificate; pages flip with a CSS 3D turn. Entries without a scan
// render as designed placeholder pages — the dossier is built to grow,
// and an empty slot is a promise, not a hole.
export default function DossierOverlay() {
  const back = useOffice((s) => s.back);
  const flying = useOffice((s) => s.flying);
  const [page, setPage] = useState(0);
  const [turning, setTurning] = useState(false);

  const turnTo = (next: number) => {
    if (turning || next < 0 || next >= certificates.length) return;
    pageFlip();
    setTurning(true);
    setTimeout(() => {
      setPage(next);
      setTurning(false);
    }, 220);
  };

  const cert = certificates[page];

  return (
    <div
      className={`fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4 transition-opacity duration-500 ${
        flying ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label="Certificate dossier"
    >
      <div className="w-full max-w-lg">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-400">
            The dossier · {page + 1} / {certificates.length}
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

        {/* The page, in a perspective box so the turn reads as paper */}
        <div style={{ perspective: "1200px" }}>
          <div
            className={`dossier-page rounded-lg border border-[#d8d2c4] bg-[#f2ede2] p-8 shadow-2xl shadow-black/50 ${
              turning ? "dossier-page-turning" : ""
            }`}
          >
            {cert.image ? (
              <Image
                src={cert.image}
                alt={`Certificate: ${cert.title}`}
                width={640}
                height={452}
                className="w-full rounded border border-[#d8d2c4]"
              />
            ) : (
              <div className="flex aspect-[1.41] flex-col justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#9b968a]">
                    certificate of record
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#1a1916]">
                    {cert.title}
                  </h3>
                  {cert.issuer && <p className="mt-2 text-sm text-[#6f6a60]">{cert.issuer}</p>}
                  {cert.date && <p className="mt-1 font-mono text-xs text-[#9b968a]">{cert.date}</p>}
                </div>
                <div>
                  {cert.note && <p className="text-sm italic text-[#6f6a60]">{cert.note}</p>}
                  <p className="mt-4 inline-block -rotate-2 rounded border-2 border-dashed border-amber-600/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-amber-700/70">
                    scan arrives here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={() => turnTo(page - 1)}
            disabled={page === 0}
            className="rounded-md border border-[#3a3631] bg-black/60 px-4 py-2 font-mono text-xs text-[#ece9e2] transition-colors hover:border-amber-500 hover:text-amber-400 disabled:pointer-events-none disabled:opacity-30"
          >
            ← previous page
          </button>
          <button
            onClick={() => turnTo(page + 1)}
            disabled={page === certificates.length - 1}
            className="rounded-md border border-[#3a3631] bg-black/60 px-4 py-2 font-mono text-xs text-[#ece9e2] transition-colors hover:border-amber-500 hover:text-amber-400 disabled:pointer-events-none disabled:opacity-30"
          >
            next page →
          </button>
        </div>
      </div>
    </div>
  );
}
