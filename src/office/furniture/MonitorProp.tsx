"use client";

import { Html } from "@react-three/drei";
import { palette } from "@/office/palette";
import { useOffice } from "@/office/store";
import Hotspot, { useHovered } from "@/office/Hotspot";
import KOos, { SCREEN_PX } from "@/office/overlays/koos/KOos";

// The monitor (V4): a normal screen that is ALWAYS running KO/OS — the
// UI is a live DOM surface composited into the scene (drei <Html
// transform occlude>, the CSS3DRenderer technique from Henry Heffernan's
// portfolio). Clicking the monitor flies the camera in; nothing "opens",
// you just get close enough to a screen that was on the whole time.

const SCREEN_W = 0.76;
const SCREEN_H = 0.44;

export default function MonitorProp() {
  const focus = useOffice((s) => s.focus);
  const mode = useOffice((s) => s.mode);
  const hovered = useHovered("monitor");
  const interactive = mode === "monitor";

  return (
    <group position={[0.15, 0, -1.98]}>
      {/* Foot + neck */}
      <mesh position={[0, 0.975, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.02, 24]} />
        <meshStandardMaterial color={palette.metal} roughness={0.45} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.12, -0.02]} castShadow>
        <boxGeometry args={[0.05, 0.28, 0.025]} />
        <meshStandardMaterial color={palette.metal} roughness={0.45} metalness={0.5} />
      </mesh>
      {/* Panel — slim bezel; it glows faintly amber when hovered (the
          "secretly alive" affordance) */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[SCREEN_W + 0.04, SCREEN_H + 0.04, 0.028]} />
        <meshStandardMaterial
          color={palette.metal}
          roughness={0.4}
          metalness={0.35}
          emissive={palette.accent}
          emissiveIntensity={hovered ? 0.35 : 0}
        />
      </mesh>
      {/* Dark glass backing behind the DOM surface */}
      <mesh position={[0, 1.4, 0.0145]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshStandardMaterial color="#06070a" roughness={0.25} metalness={0.1} />
      </mesh>

      {/* The live screen. scale maps CSS pixels onto the panel width —
          drei's transform mode renders 1 css px as (distanceFactor||10)/400
          world units, hence the ×40. */}
      <Html
        transform
        occlude="blending"
        position={[0, 1.4, 0.016]}
        scale={(SCREEN_W / SCREEN_PX.w) * 40}
        zIndexRange={[10, 0]}
        // Pointer events pass through to the canvas (so the hotspot can
        // fly you in) until you've actually arrived at the screen.
        pointerEvents={interactive ? "auto" : "none"}
      >
        <KOos />
      </Html>

      <Hotspot
        id="monitor"
        position={[0, 1.4, 0.1]}
        size={[0.9, 0.6, 0.25]}
        label="The monitor — log in to KO/OS"
        onActivate={() => focus("monitor")}
      />
    </group>
  );
}
