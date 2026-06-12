// One strict palette for every procedural object in the office — this is
// what keeps a scene built from primitives looking like one room instead
// of a pile of mismatched assets (risk #2 in the brief). The amber accent
// is the same family as v1's --accent, so /plain and the office feel like
// the same brand.

export const palette = {
  floor: "#6e5640",
  rug: "#3a3631",
  wall: "#cfc8bb",
  wallBack: "#c4bcae",
  ceiling: "#ded8cc",
  woodLight: "#a07a52",
  wood: "#8a6844",
  woodDark: "#5d452e",
  metal: "#33343a",
  metalLight: "#7a7d86",
  fabric: "#4a5360",
  paper: "#f2ede2",
  leaf: "#4f6b45",
  pot: "#9c4f33",
  accent: "#f59e0b",
  accentDeep: "#b45309",
  screenDark: "#0c0f14",
  screenGlow: "#8fb3ff",
  cork: "#b08d5e",
  mugRed: "#a33b2e",
} as const;
