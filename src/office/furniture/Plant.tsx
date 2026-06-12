"use client";

import { palette } from "@/office/palette";

// A potted plant in the corner. It does nothing. Every office has one.
// (Not everything is secretly interactive — that's what makes the things
// that are feel like secrets.)
export default function Plant() {
  return (
    <group position={[-2.55, 0, -2.05]}>
      <mesh position={[0, 0.19, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.38, 14]} />
        <meshStandardMaterial color={palette.pot} roughness={0.85} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.08, 0.62, Math.sin(a) * 0.08]}
            rotation={[Math.cos(a) * 0.5, 0, Math.sin(a) * -0.5]}
            castShadow
          >
            <coneGeometry args={[0.06, 0.55, 6]} />
            <meshStandardMaterial color={palette.leaf} roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}
