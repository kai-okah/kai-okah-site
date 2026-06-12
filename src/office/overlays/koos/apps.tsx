"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { makeQR } from "@/office/lib/qr";
import { keyClack } from "@/office/audio/sound";

// The KO/OS apps (V4). Plain React components on purpose — they know
// nothing about three.js or the office, so they can be reused in any
// future version of the site. Content comes from src/data/, same files
// v1 reads (V11: one source of truth).

const inputClass =
  "w-full rounded-md border border-[#2a2820] bg-[#12110d] px-3 py-2 font-mono text-sm text-[#ece9e2] placeholder-[#6f6a60] focus:border-amber-500 focus:outline-none";

export function AboutApp() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-[#c9c4b8]">
      <p className="font-mono text-xs uppercase tracking-widest text-amber-500">
        {profile.role}
      </p>
      {profile.bio.map((paragraph) => (
        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
      ))}
      <p className="text-[#9b968a]">
        Full name: <span className="text-[#ece9e2]">{profile.fullName}</span>
      </p>
      <div className="flex flex-wrap gap-3 pt-2 font-mono text-xs">
        <a className="text-amber-400 underline hover:text-amber-300" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <a className="text-amber-400 underline hover:text-amber-300" href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className="text-amber-400 underline hover:text-amber-300" href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
    </div>
  );
}

export function ProjectsApp() {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <article key={project.name} className="rounded-lg border border-[#2a2820] bg-[#12110d] p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-mono text-sm font-semibold text-[#ece9e2]">{project.name}</h3>
            <div className="flex gap-1.5">
              {project.stack.map((tag) => (
                <span key={tag} className="rounded bg-[#1d1b15] px-1.5 py-0.5 font-mono text-[10px] text-[#9b968a]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-1 text-sm italic text-amber-400/90">{project.line}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#c9c4b8]">{project.description}</p>
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-mono text-xs text-amber-400 underline hover:text-amber-300"
            >
              source on GitHub →
            </a>
          ) : (
            <p className="mt-3 font-mono text-xs text-[#6f6a60]">private repository — by design</p>
          )}
        </article>
      ))}
    </div>
  );
}

export function MediaApp() {
  // Designed empty state (V7): demo videos land here as YouTube embeds —
  // the no-backend growth path from the brief. Until then the slot is
  // honest about being a slot.
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-[#2a2820] p-10 text-center">
      <p className="font-mono text-3xl text-[#3a3631]">▶</p>
      <p className="mt-3 text-sm text-[#9b968a]">
        Project demo videos play here — the screen is wired, the recordings
        are in production.
      </p>
    </div>
  );
}

export function QrApp() {
  const [text, setText] = useState(profile.siteUrl);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooLong, setTooLong] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const matrix = text ? makeQR(text) : null;
    setTooLong(Boolean(text) && !matrix);
    const g = canvas.getContext("2d")!;
    g.fillStyle = "#ece9e2";
    g.fillRect(0, 0, canvas.width, canvas.height);
    if (!matrix) return;
    const quiet = 4;
    const scale = Math.floor(canvas.width / (matrix.length + quiet * 2));
    const offset = Math.floor((canvas.width - matrix.length * scale) / 2);
    g.fillStyle = "#12110d";
    matrix.forEach((row, y) =>
      row.forEach((dark, x) => {
        if (dark) g.fillRect(offset + x * scale, offset + y * scale, scale, scale);
      })
    );
  }, [text]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#9b968a]">
        Text in, QR out. Encoded right here by ~300 lines of hand-written
        TypeScript — no library, no server, nothing leaves this page.
      </p>
      <input
        className={inputClass}
        value={text}
        onChange={(e) => {
          keyClack();
          setText(e.target.value);
        }}
        placeholder="Type anything…"
        aria-label="Text to encode as QR code"
      />
      {tooLong && (
        <p className="font-mono text-xs text-red-400">Too long — keep it under ~213 bytes.</p>
      )}
      <canvas ref={canvasRef} width={296} height={296} className="mx-auto rounded-md" />
    </div>
  );
}

const UNITS = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, ft: 0.3048, in: 0.0254 },
  mass: { kg: 1, g: 0.001, t: 1000, lb: 0.45359237, oz: 0.028349523125 },
  data: { MB: 1, KB: 0.001, GB: 1000, TB: 1e6, MiB: 1.048576, GiB: 1073.741824 },
} as const;

export function UnitsApp() {
  const [category, setCategory] = useState<keyof typeof UNITS | "temp">("length");
  const [value, setValue] = useState("1");
  const [unit, setUnit] = useState<string>("m");

  const number = parseFloat(value.replace(",", "."));
  const valid = Number.isFinite(number);

  const rows: [string, number][] = [];
  if (valid) {
    if (category === "temp") {
      const celsius = unit === "°C" ? number : unit === "°F" ? ((number - 32) * 5) / 9 : number - 273.15;
      rows.push(["°C", celsius], ["°F", (celsius * 9) / 5 + 32], ["K", celsius + 273.15]);
    } else {
      const table = UNITS[category];
      const base = number * table[unit as keyof typeof table];
      for (const [name, factor] of Object.entries(table)) rows.push([name, base / factor]);
    }
  }

  const unitsFor = (cat: typeof category) =>
    cat === "temp" ? ["°C", "°F", "K"] : Object.keys(UNITS[cat]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {(["length", "mass", "data", "temp"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setUnit(unitsFor(cat)[0]);
            }}
            className={`rounded-md border px-3 py-1.5 transition-colors ${
              category === cat
                ? "border-amber-500 text-amber-400"
                : "border-[#2a2820] text-[#9b968a] hover:border-[#3a3631]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={value}
          inputMode="decimal"
          onChange={(e) => {
            keyClack();
            setValue(e.target.value);
          }}
          aria-label="Value to convert"
        />
        <select
          className={`${inputClass} w-28`}
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          aria-label="Unit of the value"
        >
          {unitsFor(category).map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </div>
      {valid ? (
        <table className="w-full font-mono text-sm">
          <tbody>
            {rows.map(([name, result]) => (
              <tr key={name} className="border-b border-[#1d1b15]">
                <td className="py-1.5 text-[#9b968a]">{name}</td>
                <td className="py-1.5 text-right text-[#ece9e2]">
                  {result.toLocaleString("en-US", { maximumFractionDigits: 6 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="font-mono text-xs text-[#6f6a60]">Enter a number.</p>
      )}
    </div>
  );
}

export function HashApp() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<[string, string][]>([]);

  useEffect(() => {
    let stale = false;
    const algorithms = ["SHA-1", "SHA-256", "SHA-512"] as const;
    Promise.all(
      algorithms.map(async (algo) => {
        const digest = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
        const hex = Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        return [algo, hex] as [string, string];
      })
    ).then((result) => {
      if (!stale) setHashes(result);
    });
    return () => {
      stale = true;
    };
  }, [text]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#9b968a]">
        Live digests via the browser&apos;s own <span className="font-mono">crypto.subtle</span> —
        change one character, watch every hash change completely.
      </p>
      <textarea
        className={`${inputClass} h-24 resize-none`}
        value={text}
        onChange={(e) => {
          keyClack();
          setText(e.target.value);
        }}
        placeholder="Type something to hash…"
        aria-label="Text to hash"
      />
      <div className="space-y-3">
        {hashes.map(([algo, hex]) => (
          <div key={algo}>
            <p className="font-mono text-xs text-amber-500">{algo}</p>
            <p className="break-all font-mono text-xs leading-relaxed text-[#c9c4b8]">{hex}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SecretNote() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-[#c9c4b8]">
      <p className="font-mono text-xs uppercase tracking-widest text-amber-500">
        hidden note · you found it
      </p>
      <p>
        This office was built in eleven days with three.js, a strict
        dependency budget, and a lot of coffee from the machine by the wall
        (try it, it actually brews).
      </p>
      <p>
        Nothing in here is a template. The QR encoder is hand-written, the
        sounds are synthesized from raw math, the furniture is geometry, not
        downloads. The point of the whole room is the person who built it:
        <span className="text-[#ece9e2]"> looks ordinary — isn&apos;t.</span>
      </p>
      <p className="font-mono text-xs text-[#6f6a60]">
        Curious how it works? The source is public:{" "}
        <a className="text-amber-400 underline" href={profile.repoUrl} target="_blank" rel="noreferrer">
          {profile.repoUrl.replace("https://", "")}
        </a>
      </p>
    </div>
  );
}
