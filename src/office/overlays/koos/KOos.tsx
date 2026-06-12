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

// KO/OS (V4): the monitor's operating system. The camera flies to the
// screen, then this full-DOM overlay fades in over the canvas — the
// pragmatic Henry Heffernan trick: 3D sells the zoom, DOM renders the
// pixels. One hidden extra: the KO logo gives up a note after five
// clicks (V10's second secret).
export default function KOos() {
  const back = useOffice((s) => s.back);
  const flying = useOffice((s) => s.flying);
  const [app, setApp] = useState<AppId>("about");
  const [logoClicks, setLogoClicks] = useState(0);
  const secretFound = logoClicks >= 5;
  const [clock, setClock] = useState("");

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
      className={`fixed inset-0 z-20 flex items-center justify-center p-3 transition-opacity duration-500 sm:p-8 ${
        flying ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label="KO/OS — the monitor"
    >
      <div className="flex h-full max-h-[640px] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#2a2820] bg-[#0c0b09]/95 shadow-2xl shadow-black/60 backdrop-blur">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-[#1d1b15] px-4 py-2.5">
          <button
            onClick={onLogo}
            aria-label="KO/OS logo"
            title={secretFound ? "You already found it." : undefined}
            className="font-mono text-sm font-semibold tracking-tight text-[#ece9e2]"
          >
            K<span className="text-amber-500">O</span>
            <span className="text-[#6f6a60]">/OS</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#6f6a60]">{clock}</span>
            <button
              onClick={() => {
                click();
                back();
              }}
              className="rounded-md border border-[#2a2820] px-3 py-1 font-mono text-xs text-[#9b968a] transition-colors hover:border-amber-500 hover:text-amber-400"
            >
              log out ✕
            </button>
          </div>
        </div>

        {/* Dock + app area */}
        <div className="flex min-h-0 flex-1">
          <nav className="flex flex-col gap-1 border-r border-[#1d1b15] p-2" aria-label="KO/OS apps">
            {APPS.filter((a) => !a.hidden || secretFound).map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  click();
                  setApp(a.id);
                }}
                className={`rounded-md px-3 py-2 text-left font-mono text-xs transition-colors ${
                  app === a.id
                    ? "bg-[#1d1b15] text-amber-400"
                    : "text-[#9b968a] hover:bg-[#15130f] hover:text-[#ece9e2]"
                }`}
              >
                {a.title}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
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
    </div>
  );
}
