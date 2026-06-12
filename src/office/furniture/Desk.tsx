"use client";

import { palette } from "@/office/palette";
import { useOffice } from "@/office/store";
import Steam from "@/office/Steam";

// The desk and its quiet props: lamp, keyboard, mouse, mug (with steam).
// Interactive things that LIVE on the desk (monitor, dossier, business
// card) are their own components so each owns its hotspot.
export default function Desk() {
  const lightMode = useOffice((s) => s.lightMode);

  return (
    <group position={[0, 0, -1.75]}>
      {/* Top */}
      <mesh position={[0, 0.93, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.05, 0.85]} />
        <meshStandardMaterial color={palette.woodLight} roughness={0.6} />
      </mesh>
      {/* Legs */}
      {(
        [
          [-0.88, -0.36],
          [0.88, -0.36],
          [-0.88, 0.36],
          [0.88, 0.36],
        ] as const
      ).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.455, z]} castShadow>
          <boxGeometry args={[0.05, 0.91, 0.05]} />
          <meshStandardMaterial color={palette.metal} roughness={0.5} metalness={0.4} />
        </mesh>
      ))}

      {/* Keyboard + mouse */}
      <mesh position={[0.15, 0.965, 0.18]} castShadow>
        <boxGeometry args={[0.42, 0.02, 0.15]} />
        <meshStandardMaterial color={palette.metal} roughness={0.7} />
      </mesh>
      <mesh position={[0.5, 0.965, 0.2]} castShadow>
        <boxGeometry args={[0.06, 0.022, 0.1]} />
        <meshStandardMaterial color={palette.metalLight} roughness={0.5} />
      </mesh>

      {/* Mug — accent red, always faintly steaming (someone works here) */}
      <group position={[0.72, 0, 0.05]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.1, 16]} />
          <meshStandardMaterial color={palette.mugRed} roughness={0.4} />
        </mesh>
        <Steam position={[0, 1.06, 0]} count={4} />
      </group>

      {/* Desk lamp — the evening rig's light source sits in its head */}
      <group position={[-0.72, 0, -0.15]}>
        <mesh position={[0, 0.97, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.025, 20]} />
          <meshStandardMaterial color={palette.metal} roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0.08, 1.2, 0]} rotation={[0, 0, -0.5]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
          <meshStandardMaterial color={palette.metal} roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0.16, 1.44, 0]} rotation={[0, 0, 1.1]} castShadow>
          <coneGeometry args={[0.08, 0.16, 20, 1, true]} />
          <meshStandardMaterial
            color={palette.metal}
            roughness={0.4}
            metalness={0.5}
            emissive={lightMode === "evening" ? "#ffb168" : "#000000"}
            emissiveIntensity={lightMode === "evening" ? 1.4 : 0}
          />
        </mesh>
      </group>
    </group>
  );
}
