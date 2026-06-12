"use client";

import { useEffect, useState } from "react";
import { useOffice } from "@/office/store";
import { click, ding } from "@/office/audio/sound";
import {
  AboutApp,
  ProjectsApp,
  MediaApp,
  QrApp,
  UnitsApp,
  HashApp,
  SecretNote,
} from "@/office/overlays/koos/apps";

type AppId = "about" | "projects" | "media" | "qr" | "units" | "hash" | "secret";

const APPS: { id: AppId; title: string; hidden?: boolean }[] = [
  { id: "about", title: "About" },
  { id: "projects", title: "Projects" },
  { id: "media", title: "Media" },
  { id: "qr", title: "QR" },
  { id: "units", title: "Units" },
  { id: "hash", title: "Hash" },
  { id: "secret", title: "???", hidden: true },
];

/** CSS pixel size of the screen surface — MonitorProp scales it into
 *  the 3D panel, so this is the screen's native resolution. */
export const SCREEN_PX = { w: 1140, h: 660 };

// KO/OS (V4) — and this is the Henry Heffernan trick done properly: the
// OS isn't an overlay that pops over the page, it's a live DOM surface
// rendered INSIDE the 3D scene on the monitor (drei <Html transform>,
// the CSS3DRenderer technique from his MonitorScreen.ts). It runs the
// whole time — you can watch the clock tick from across the room — and
// clicking the monitor just flies you close enough to use it.
export default function KOos() {
  const mode = useOffice((s) => s.mode);
  const back = useOffice((s) => s.back);
  const [app, setApp] = useState<AppId>("about");
  const [logoClicks, setLogoClicks] = useState(0);
  const secretFound = logoClicks >= 5;
  const [clock, setClock] = useState("");

  const awake = mode === "monitor";

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      );
    tick();
    const timer = setInterval(tick, 10_000);
    return () => clearInterval(timer);
  }, []);

  const onLogo = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next === 5) {
      ding();
      setApp("secret");
    } else {
      click();
    }
  };

  return (
    <div
      style={{ width: SCREEN_PX.w, height: SCREEN_PX.h }}
      className="relative flex select-none flex-col overflow-hidden bg-[#0c0b09] font-sans"
    >
      {/* The OS, always running underneath */}
      <div
        aria-hidden={!awake}
        className={`flex h-full flex-col transition-opacity duration-500 ${
          awake ? "opacity-100" : "opacity-40"
        }`}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-[#1d1b15] px-5 py-3">
          <button
            onClick={onLogo}
            aria-label="KO/OS logo"
            title={secretFound ? "You already found it." : undefined}
            className="font-mono text-base font-semibold tracking-tight text-[#ece9e2]"
          >
            K<span className="text-amber-500">O</span>
            <span className="text-[#6f6a60]">/OS</span>
          </button>
          <div className="flex items-center gap-5">
            <span className="font-mono text-sm text-[#6f6a60]">{clock}</span>
            <button
              onClick={() => {
                click();
                back();
              }}
              className="rounded-md border border-[#2a2820] px-3.5 py-1.5 font-mono text-sm text-[#9b968a] transition-colors hover:border-amber-500 hover:text-amber-400"
            >
              log out ✕
            </button>
          </div>
        </div>

        {/* Dock + app area */}
        <div className="flex min-h-0 flex-1">
          <nav className="flex flex-col gap-1 border-r border-[#1d1b15] p-2.5" aria-label="KO/OS apps">
            {APPS.filter((a) => !a.hidden || secretFound).map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  click();
                  setApp(a.id);
                }}
                className={`rounded-md px-4 py-2.5 text-left font-mono text-sm transition-colors ${
                  app === a.id
                    ? "bg-[#1d1b15] text-amber-400"
                    : "text-[#9b968a] hover:bg-[#15130f] hover:text-[#ece9e2]"
                }`}
              >
                {a.title}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {app === "about" && <AboutApp />}
            {app === "projects" && <ProjectsApp />}
            {app === "media" && <MediaApp />}
            {app === "qr" && <QrApp />}
            {app === "units" && <UnitsApp />}
            {app === "hash" && <HashApp />}
            {app === "secret" && <SecretNote />}
          </div>
        </div>
      </div>

      {/* Lock veil from across the room: dimmed OS + the login line.
          It fades as you arrive — no popping, the screen was on all along. */}
      <div
        className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-[#0c0b09]/70 transition-opacity duration-700 ${
          awake ? "opacity-0" : "opacity-100"
        }`}
      >
        <p className="font-mono text-7xl font-bold tracking-tight text-amber-500">
          KO<span className="text-[#3a3631]">/</span>OS
        </p>
        <p className="mt-5 font-mono text-2xl text-[#7e8aa0]">click to log in</p>
        <p className="mt-2 font-mono text-lg text-[#3f3c33]">{clock}</p>
      </div>

      {/* Glass: inner shadow + a whisper of reflection + scanlines */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.55)",
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.012) 30%, transparent 50%)",
        }}
      />
      <div className="screen-scanlines pointer-events-none absolute inset-0" />
    </div>
  );
}
