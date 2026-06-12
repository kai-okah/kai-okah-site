"use client";

import { palette } from "@/office/palette";
import { useOffice } from "@/office/store";
import Hotspot, { useHovered } from "@/office/Hotspot";

// A completely normal office chair (V8) — modeled, not boxed: curved
// seat and backrest (scaled/flattened cylinders read as cushions),
// armrests, gas lift, five-star base with casters. Sitting down is just
// a camera pose: Kai's side of the desk.
export default function Chair() {
  const focus = useOffice((s) => s.focus);
  const hovered = useHovered("chair");

  const fabric = (
    <meshStandardMaterial
      color={palette.fabric}
      roughness={0.95}
      emissive={palette.accent}
      emissiveIntensity={hovered ? 0.18 : 0}
    />
  );
  const metal = (
    <meshStandardMaterial color={palette.metal} roughness={0.4} metalness={0.6} />
  );

  return (
    <group position={[0.1, 0, -1.05]} rotation={[0, Math.PI - 0.12, 0]}>
      {/* Seat cushion — a flattened, rounded cylinder */}
      <mesh position={[0, 0.52, 0]} scale={[1, 0.16, 0.92]} castShadow>
        <cylinderGeometry args={[0.25, 0.27, 0.5, 24]} />
        {fabric}
      </mesh>
      {/* Backrest — a slice of a big cylinder so it wraps the back */}
      <mesh
        position={[0, 0.92, -0.26]}
        rotation={[0.1, Math.PI, 0]}
        scale={[1, 1, 0.45]}
        castShadow
      >
        <cylinderGeometry args={[0.24, 0.26, 0.62, 24, 1, false, -1.1, 2.2]} />
        {fabric}
      </mesh>
      {/* Lumbar gap bar connecting seat and back */}
      <mesh position={[0, 0.62, -0.27]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.06, 0.22, 0.02]} />
        {metal}
      </mesh>

      {/* Armrests */}
      {[-0.27, 0.27].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.665, 0.02]} castShadow>
            <boxGeometry args={[0.05, 0.025, 0.3]} />
            <meshStandardMaterial color="#23242a" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.59, 0.13]} castShadow>
            <boxGeometry args={[0.025, 0.13, 0.025]} />
            {metal}
          </mesh>
        </group>
      ))}

      {/* Gas lift */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.03, 0.42, 12]} />
        {metal}
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.04, 0.1, 12]} />
        <meshStandardMaterial color="#23242a" roughness={0.6} />
      </mesh>

      {/* Five-star base with casters */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.16, 0.055, 0]} rotation={[0, 0, -0.12]} castShadow>
              <boxGeometry args={[0.32, 0.035, 0.045]} />
              {metal}
            </mesh>
            <mesh position={[0.3, 0.032, 0]} castShadow>
              <sphereGeometry args={[0.032, 12, 12]} />
              <meshStandardMaterial color="#1c1d21" roughness={0.5} />
            </mesh>
          </group>
        );
      })}

      <Hotspot
        id="chair"
        position={[0, 0.7, 0]}
        size={[0.6, 1.1, 0.6]}
        label="The chair — take Kai's seat"
        onActivate={() => focus("sitting")}
      />
    </group>
  );
}
