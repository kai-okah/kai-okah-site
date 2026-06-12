"use client";

import { useTexture } from "@react-three/drei";
import { palette } from "@/office/palette";
import { useOffice } from "@/office/store";
import { pins } from "@/data/corkboard";
import Hotspot from "@/office/Hotspot";

// The corkboard on the left wall (V6). Pins with a real image show a
// little photo; reserved pins are blank notes — visibly waiting, which
// is the growth design, not a bug. Clicking the board flies the camera
// over and opens the DOM lightbox.

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

  return (
    <group position={[-2.94, 1.55, 0.1]} rotation={[0, Math.PI / 2, 0]}>
      {/* Frame + cork */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.0, 0.03]} />
        <meshStandardMaterial color={palette.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.018]}>
        <planeGeometry args={[1.4, 0.9]} />
        <meshStandardMaterial color={palette.cork} roughness={1} />
      </mesh>

      {pins.slice(0, SLOTS.length).map((pin, i) => {
        const [x, y, tilt] = SLOTS[i];
        return (
          <group key={pin.label} position={[x, y, 0.02]} rotation={[0, 0, tilt]}>
            {/* Paper (photo or blank reserved note) */}
            <mesh position={[0, -0.01, 0.005]}>
              <planeGeometry args={[0.24, 0.26]} />
              <meshStandardMaterial color={palette.paper} roughness={0.9} />
            </mesh>
            {pin.image && <PinnedPhoto image={pin.image} />}
            {/* The pin itself — amber, of course */}
            <mesh position={[0, 0.11, 0.02]}>
              <sphereGeometry args={[0.013, 10, 10]} />
              <meshStandardMaterial color={palette.accent} roughness={0.3} />
            </mesh>
          </group>
        );
      })}

      <Hotspot
        position={[0, 0, 0.15]}
        size={[1.6, 1.1, 0.3]}
        label="The corkboard — a life, pinned up"
        onActivate={() => focus("corkboard")}
      />
    </group>
  );
}
