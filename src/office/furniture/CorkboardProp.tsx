"use client";

import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { palette } from "@/office/palette";
import { corkTexture, paperTexture, woodTexture } from "@/office/lib/textures";
import { useOffice } from "@/office/store";
import { slots } from "@/data/corkboard";
import Hotspot, { useHovered } from "@/office/Hotspot";

// The corkboard on the left wall (V6). Slots with photos show their
// first photo pinned; reserved slots are blank notes — visibly waiting,
// which is the growth design, not a bug. Two-stage (client feedback
// 2026-06-12): the first click flies the camera to the board, a second
// click on the board opens the photo wall.

// Stable, slightly irregular pin layout on the board (local x/y).
const SLOTS: [number, number, number][] = [
  [-0.42, 0.22, 0.03],
  [0.02, 0.28, -0.05],
  [0.44, 0.2, 0.06],
  [-0.38, -0.22, -0.04],
  [0.05, -0.26, 0.02],
  [0.45, -0.2, -0.06],
];

function PinnedPhoto({ image }: { image: string }) {
  const texture = useTexture(image);
  return (
    <mesh position={[0, -0.01, 0.012]}>
      <planeGeometry args={[0.21, 0.21]} />
      <meshStandardMaterial map={texture} roughness={0.7} />
    </mesh>
  );
}

export default function CorkboardProp() {
  const focus = useOffice((s) => s.focus);
  const mode = useOffice((s) => s.mode);
  const setCorkboardOpen = useOffice((s) => s.setCorkboardOpen);
  const hovered = useHovered("corkboard");
  const atBoard = mode === "corkboard";
  const tex = useMemo(
    () => ({
      cork: corkTexture([2, 1.4]),
      paper: paperTexture([1, 1]),
      frame: woodTexture("boardframe", palette.woodDark, "#2e2114", [2, 0.2], 2),
    }),
    []
  );

  return (
    <group position={[-2.94, 1.55, 0.1]} rotation={[0, Math.PI / 2, 0]}>
      {/* Frame + cork */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.0, 0.03]} />
        <meshStandardMaterial
          map={tex.frame}
          roughness={0.7}
          emissive={palette.accent}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      <mesh position={[0, 0, 0.018]}>
        <planeGeometry args={[1.4, 0.9]} />
        <meshStandardMaterial map={tex.cork} bumpMap={tex.cork} bumpScale={1.4} roughness={1} />
      </mesh>

      {slots.slice(0, SLOTS.length).map((slot, i) => {
        const [x, y, tilt] = SLOTS[i];
        return (
          <group key={slot.label} position={[x, y, 0.02]} rotation={[0, 0, tilt]}>
            {/* Paper (photo or blank reserved note) */}
            <mesh position={[0, -0.01, 0.005]}>
              <planeGeometry args={[0.24, 0.26]} />
              <meshStandardMaterial map={tex.paper} roughness={0.9} />
            </mesh>
            {slot.photos[0] && <PinnedPhoto image={slot.photos[0].image} />}
            {/* The pin itself — amber, of course */}
            <mesh position={[0, 0.11, 0.02]}>
              <sphereGeometry args={[0.013, 10, 10]} />
              <meshStandardMaterial color={palette.accent} roughness={0.3} />
            </mesh>
          </group>
        );
      })}

      <Hotspot
        id="corkboard"
        position={[0, 0, 0.15]}
        size={[1.6, 1.1, 0.3]}
        label={atBoard ? "Open the photo wall" : "The corkboard — a life, pinned up"}
        anyMode
        onActivate={() => {
          const m = useOffice.getState().mode;
          if (m === "idle") focus("corkboard");
          else if (m === "corkboard") setCorkboardOpen(true);
        }}
      />
    </group>
  );
}
