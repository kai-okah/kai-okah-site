import { create } from "zustand";

// One store, one state machine — every layer (canvas, camera, DOM
// overlays, HUD, audio) reads and writes the same few fields instead of
// passing callbacks through the tree. This is the "mode state machine"
// pattern from the Jesse Zhou analysis: interactions are only legal in
// `idle`, and the camera locks input while it flies.

/** Where the visitor is. `entry` = dark intro screen, `idle` = free look. */
export type Mode =
  | "entry"
  | "idle"
  | "monitor"
  | "dossier"
  | "corkboard"
  | "sitting";

/** The wall-switch states (V9). */
export type LightMode = "day" | "evening" | "midnight";
export const LIGHT_MODES: LightMode[] = ["day", "evening", "midnight"];

type OfficeState = {
  mode: Mode;
  /** True while the camera is in flight — all hotspots ignore clicks. */
  flying: boolean;
  lightMode: LightMode;
  /** Audio is only allowed after the START click (browser autoplay rules). */
  audioOn: boolean;
  /** Hovered hotspot label, shown by the HUD next to the cursor. */
  hoverLabel: string | null;
  /** Hovered hotspot id — the object glows softly while it's hovered. */
  hoverId: string | null;
  /** Click-anywhere-while-idle name reveal (V3). */
  nameRevealed: boolean;
  /** Coffee easter egg: true while the machine brews (V10). */
  brewing: boolean;
  /**
   * The corkboard is two-stage (client feedback 2026-06-12): first click
   * flies to the board (mode = "corkboard"), a second click on the board
   * opens the photo-wall overlay. This is stage two.
   */
  corkboardOpen: boolean;
  /**
   * Performance ladder (risk #1): 0 = everything, 1 = no shadows + DPR 1,
   * 2 = additionally no rain/steam particles. Only ever steps up.
   */
  perfTier: number;

  enter: () => void;
  /** Fly to an object. Only honored from idle, never mid-flight. */
  focus: (target: Exclude<Mode, "entry" | "idle">) => void;
  /** Return to the idle overview from any focused mode. */
  back: () => void;
  setFlying: (flying: boolean) => void;
  cycleLight: () => void;
  setHover: (id: string | null, label: string | null) => void;
  revealName: () => void;
  hideName: () => void;
  setBrewing: (brewing: boolean) => void;
  setCorkboardOpen: (open: boolean) => void;
  degrade: () => void;
};

export const useOffice = create<OfficeState>((set, get) => ({
  mode: "entry",
  flying: false,
  lightMode: "day",
  audioOn: false,
  hoverLabel: null,
  hoverId: null,
  nameRevealed: false,
  brewing: false,
  corkboardOpen: false,
  perfTier: 0,

  enter: () => set({ mode: "idle", audioOn: true }),
  focus: (target) => {
    const { mode, flying } = get();
    if (mode !== "idle" || flying) return;
    set({ mode: target, hoverLabel: null, hoverId: null, nameRevealed: false });
  },
  back: () => {
    const { mode, flying } = get();
    if (mode === "entry" || mode === "idle" || flying) return;
    set({ mode: "idle", corkboardOpen: false });
  },
  setFlying: (flying) => set({ flying }),
  cycleLight: () =>
    set((s) => ({
      lightMode:
        LIGHT_MODES[(LIGHT_MODES.indexOf(s.lightMode) + 1) % LIGHT_MODES.length],
    })),
  setHover: (hoverId, hoverLabel) => set({ hoverId, hoverLabel }),
  revealName: () => set({ nameRevealed: true }),
  hideName: () => set({ nameRevealed: false }),
  setBrewing: (brewing) => set({ brewing }),
  setCorkboardOpen: (corkboardOpen) => set({ corkboardOpen }),
  degrade: () => set((s) => ({ perfTier: Math.min(s.perfTier + 1, 2) })),
}));
