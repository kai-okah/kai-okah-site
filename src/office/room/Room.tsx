"use client";

import { useOffice } from "@/office/store";
import { palette } from "@/office/palette";
import Hotspot from "@/office/Hotspot";
import { click } from "@/office/audio/sound";

// Room box: x ∈ [-3, 3], z ∈ [-2.5, 2.5], walls 3 m high. The back wall
// (z = -2.5) holds the window — it's built from four slabs around the
// opening because primitives don't do holes.
const WALL_T = 0.1;
const WIN = { cx: 0.15, w: 1.9, sill: 1.05, h: 1.5 }; // window opening

const SKY: Record<string, string> = {
  day: "#a9c2d6",
  evening: "#3b2a3a",
  midnight: "#070a12",
};

export default function Room() {
  const lightMode = useOffice((s) => s.lightMode);
  const cycleLight = useOffice((s) => s.cycleLight);

  return (
    <group>
      {/* Floor + rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color={palette.floor} roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -0.7]} receiveShadow>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color={palette.rug} roughness={1} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color={palette.ceiling} roughness={1} />
      </mesh>

      {/* Side and front walls */}
      <mesh position={[-3, 1.5, 0]} receiveShadow>
        <boxGeometry args={[WALL_T, 3, 5]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>
      <mesh position={[3, 1.5, 0]} receiveShadow>
        <boxGeometry args={[WALL_T, 3, 5]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.5, 2.5]}>
        <boxGeometry args={[6, 3, WALL_T]} />
        <meshStandardMaterial color={palette.wall} roughness={0.95} />
      </mesh>

      {/* Back wall — four slabs framing the window opening */}
      {(() => {
        const { cx, w, sill, h } = WIN;
        const left = cx - w / 2;
        const right = cx + w / 2;
        const mat = <meshStandardMaterial color={palette.wallBack} roughness={0.95} />;
        return (
          <group position={[0, 0, -2.5]}>
            <mesh position={[(-3 + left) / 2, 1.5, 0]} receiveShadow>
              <boxGeometry args={[left + 3, 3, WALL_T]} />
              {mat}
            </mesh>
            <mesh position={[(right + 3) / 2, 1.5, 0]} receiveShadow>
              <boxGeometry args={[3 - right, 3, WALL_T]} />
              {mat}
            </mesh>
            <mesh position={[cx, sill / 2, 0]} receiveShadow>
              <boxGeometry args={[w, sill, WALL_T]} />
              {mat}
            </mesh>
            <mesh position={[cx, (sill + h + 3) / 2, 0]} receiveShadow>
              <boxGeometry args={[w, 3 - sill - h, WALL_T]} />
              {mat}
            </mesh>

            {/* Window frame: four bars around the opening + a cross bar */}
            {(
              [
                [cx, sill + h + 0.02, w + 0.08, 0.08],
                [cx, sill - 0.02, w + 0.08, 0.08],
                [cx - w / 2 - 0.02, sill + h / 2, 0.08, h + 0.08],
                [cx + w / 2 + 0.02, sill + h / 2, 0.08, h + 0.08],
                [cx, sill + h / 2, 0.04, h], // vertical cross bar
              ] as const
            ).map(([x, y, bw, bh], i) => (
              <mesh key={i} position={[x, y, 0]}>
                <boxGeometry args={[bw, bh, 0.06]} />
                <meshStandardMaterial color={palette.metal} roughness={0.5} metalness={0.3} />
              </mesh>
            ))}
            {/* Sill */}
            <mesh position={[cx, sill - 0.02, 0.09]}>
              <boxGeometry args={[w + 0.16, 0.04, 0.18]} />
              <meshStandardMaterial color={palette.paper} roughness={0.8} />
            </mesh>

            {/* Glass */}
            <mesh position={[cx, sill + h / 2, -0.01]}>
              <planeGeometry args={[w, h]} />
              <meshStandardMaterial
                color="#bcd2e0"
                transparent
                opacity={0.12}
                roughness={0.1}
                metalness={0.2}
              />
            </mesh>

            {/* Sky outside — its color is half of what sells each light mode */}
            <mesh position={[cx, sill + h / 2, -1.4]}>
              <planeGeometry args={[8, 6]} />
              <meshBasicMaterial color={SKY[lightMode]} />
            </mesh>
          </group>
        );
      })()}

      {/* Light switch by the front-right corner (V9) — a completely
          normal light switch. That actually works. */}
      <group position={[2.94, 1.3, 1.9]}>
        <mesh>
          <boxGeometry args={[0.03, 0.12, 0.08]} />
          <meshStandardMaterial color={palette.paper} roughness={0.6} />
        </mesh>
        <mesh position={[-0.018, lightMode === "day" ? 0.015 : lightMode === "evening" ? 0 : -0.015, 0]}>
          <boxGeometry args={[0.015, 0.035, 0.03]} />
          <meshStandardMaterial color={palette.accent} roughness={0.5} />
        </mesh>
        <Hotspot
          id="lightswitch"
          position={[-0.05, 0, 0]}
          size={[0.15, 0.3, 0.3]}
          label="Light switch — day / evening / midnight"
          anyMode
          onActivate={() => {
            click();
            cycleLight();
          }}
        />
      </group>

      {/* Baseboard hint along the back wall */}
      <mesh position={[0, 0.05, -2.44]}>
        <boxGeometry args={[6, 0.1, 0.02]} />
        <meshStandardMaterial color={palette.woodDark} roughness={0.9} />
      </mesh>
    </group>
  );
}
