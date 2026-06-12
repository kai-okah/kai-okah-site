"use client";

import { palette } from "@/office/palette";
import { useOffice } from "@/office/store";
import Hotspot from "@/office/Hotspot";

// A completely normal office chair (V8). Sitting down is just a camera
// pose — from Kai's side of the desk: monitor, keyboard, rain on the
// window.
export default function Chair() {
  const focus = useOffice((s) => s.focus);

  return (
    <group position={[0.1, 0, -1.0]} rotation={[0, Math.PI - 0.15, 0]}>
      {/* Seat + back */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[0.46, 0.07, 0.44]} />
        <meshStandardMaterial color={palette.fabric} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.88, -0.21]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[0.44, 0.6, 0.06]} />
        <meshStandardMaterial color={palette.fabric} roughness={0.9} />
      </mesh>
      {/* Gas lift + star base */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.45, 10]} />
        <meshStandardMaterial color={palette.metal} roughness={0.4} metalness={0.6} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.16, 0.05, 0]} rotation={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.3, 0.03, 0.04]} />
              <meshStandardMaterial color={palette.metal} roughness={0.4} metalness={0.6} />
            </mesh>
            <mesh position={[0.3, 0.035, 0]}>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshStandardMaterial color={palette.metal} roughness={0.4} metalness={0.4} />
            </mesh>
          </group>
        );
      })}

      <Hotspot
        position={[0, 0.7, 0]}
        size={[0.55, 1.0, 0.55]}
        label="The chair — take Kai's seat"
        onActivate={() => focus("sitting")}
      />
    </group>
  );
}
