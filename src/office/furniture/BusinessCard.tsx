"use client";

import { palette } from "@/office/palette";
import Hotspot from "@/office/Hotspot";

// The discreet business card stand on the desk (V11): the recruiter fast
// path. Clicking it leaves the office for /plain — the full v1 one-pager.
// A plain navigation on purpose: /plain must work with zero JavaScript
// state, that's its whole job.
export default function BusinessCard() {
  return (
    <group position={[0.82, 0.955, -1.95]} rotation={[0, -0.35, 0]}>
      {/* Stand + card */}
      <mesh castShadow>
        <boxGeometry args={[0.09, 0.015, 0.04]} />
        <meshStandardMaterial color={palette.metal} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.035, -0.005]} rotation={[-0.25, 0, 0]} castShadow>
        <boxGeometry args={[0.085, 0.05, 0.002]} />
        <meshStandardMaterial color={palette.paper} roughness={0.8} />
      </mesh>
      {/* The KO monogram dot — same brand as v1's hero */}
      <mesh position={[0, 0.04, 0.0065]} rotation={[-0.25, 0, 0]}>
        <planeGeometry args={[0.02, 0.02]} />
        <meshStandardMaterial color={palette.accent} roughness={0.6} />
      </mesh>

      <Hotspot
        position={[0, 0.05, 0]}
        size={[0.18, 0.14, 0.14]}
        label="Business card — the plain version of this site"
        onActivate={() => {
          window.location.href = "/plain";
        }}
      />
    </group>
  );
}
