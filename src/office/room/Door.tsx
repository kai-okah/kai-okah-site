"use client";

import { useMemo } from "react";
import { palette } from "@/office/palette";
import Hotspot, { useHovered } from "@/office/Hotspot";
import { woodTexture } from "@/office/lib/textures";

// The office door (client request 2026-06-12): swing the view around —
// press and drag — and there it is, on the left wall past the corkboard
// (the front wall would show it edge-on from the camera corner). It's
// the way out: clicking it leaves for /plain, same destination as the
// business card, because leaving the office should land somewhere useful.
export default function Door() {
  const hovered = useHovered("door");
  const wood = useMemo(() => woodTexture("door", "#7a5c3e", "#4a3520", [1, 1], 2), []);

  return (
    <group position={[-2.91, 0, 1.55]} rotation={[0, Math.PI / 2, 0]}>
      {/* Frame */}
      <mesh position={[0, 1.06, -0.01]}>
        <boxGeometry args={[1.04, 2.16, 0.06]} />
        <meshStandardMaterial color={palette.woodDark} roughness={0.75} />
      </mesh>
      {/* Door panel */}
      <mesh position={[0, 1.04, 0.025]} castShadow>
        <boxGeometry args={[0.92, 2.04, 0.05]} />
        <meshStandardMaterial
          map={wood}
          roughness={0.65}
          emissive={palette.accent}
          emissiveIntensity={hovered ? 0.18 : 0}
        />
      </mesh>
      {/* Inset panels — two routed rectangles so it reads "door" */}
      {[1.5, 0.55].map((y) => (
        <mesh key={y} position={[0, y, 0.052]}>
          <planeGeometry args={[0.62, 0.7]} />
          <meshStandardMaterial color="#6b4f34" roughness={0.7} />
        </mesh>
      ))}
      {/* Handle */}
      <mesh position={[0.36, 1.02, 0.07]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[0.012, 0.09, 4, 8]} />
        <meshStandardMaterial color={palette.metalLight} roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0.36, 1.02, 0.055]}>
        <cylinderGeometry args={[0.02, 0.02, 0.02, 12]} />
        <meshStandardMaterial color={palette.metalLight} roughness={0.3} metalness={0.7} />
      </mesh>

      <Hotspot
        id="door"
        position={[0, 1.05, 0.15]}
        size={[1.1, 2.2, 0.3]}
        label="The door — step out to the plain version"
        onActivate={() => {
          window.location.href = "/plain";
        }}
      />
    </group>
  );
}
