"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useOffice } from "@/office/store";
import EntryOverlay from "@/office/overlays/EntryOverlay";
import Hud from "@/office/overlays/Hud";
import DossierOverlay from "@/office/overlays/DossierOverlay";
import LightboxOverlay from "@/office/overlays/LightboxOverlay";

// three.js can only run in the browser; ssr:false keeps the static export
// clean and the heavy chunk out of the first paint (the entry screen
// covers the load).
const Scene = dynamic(() => import("@/office/Scene"), { ssr: false });

type Capability = "checking" | "ok" | "none";

// The roof of v2: capability gate → entry → canvas + DOM overlays.
// The canvas and the overlays are siblings; the zustand store is the only
// bridge between them (the "Henry trick" — zoom the camera, then swap to
// crisp DOM for anything content-bearing).
export default function OfficeApp() {
  const mode = useOffice((s) => s.mode);
  const [capability, setCapability] = useState<Capability>("checking");

  useEffect(() => {
    // The whole office, drivable from the console — used by the QA
    // scripts, left in for the curious (this site IS the portfolio).
    (window as unknown as { koOffice: typeof useOffice }).koOffice = useOffice;
  }, []);

  useEffect(() => {
    // WebGL probe on a throwaway canvas. No context → no office; the
    // visitor is offered v1 instead of a broken page (V11, risk #1).
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      setCapability(gl ? "ok" : "none");
    } catch {
      setCapability("none");
    }
  }, []);

  if (capability === "checking") {
    return <div className="fixed inset-0 bg-[#0a0908]" aria-hidden="true" />;
  }

  if (capability === "none") {
    return (
      <main className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0908] px-6 text-center">
        <p className="font-mono text-lg text-[#ece9e2]">
          This is a completely normal office.
        </p>
        <p className="mt-4 max-w-md text-sm text-[#9b968a]">
          But it needs WebGL, and this browser or device doesn&apos;t offer
          it. The plain version has everything that matters — projects,
          story, contact.
        </p>
        <Link
          href="/plain"
          className="mt-8 rounded-md border border-amber-500 px-8 py-3 font-mono text-sm tracking-widest text-amber-500 hover:bg-amber-500 hover:text-[#0a0908]"
        >
          OPEN THE PLAIN VERSION
        </Link>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#0a0908]">
      <Scene />
      {mode === "entry" && <EntryOverlay />}
      {mode !== "entry" && <Hud />}
      {mode === "dossier" && <DossierOverlay />}
      {mode === "corkboard" && <LightboxOverlay />}
    </main>
  );
}
