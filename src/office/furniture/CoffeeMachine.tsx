"use client";

import { useRef, useState } from "react";
import { palette } from "@/office/palette";
import { useOffice } from "@/office/store";
import Hotspot from "@/office/Hotspot";
import Steam from "@/office/Steam";
import { brew, ding } from "@/office/audio/sound";

const BREW_SECONDS = 3;

// The coffee-machine easter egg (V10): a completely normal machine on a
// sideboard. Click it — it gurgles, steams for a few seconds, dings, and
// the cup under the spout fills.
export default function CoffeeMachine() {
  const brewing = useOffice((s) => s.brewing);
  const setBrewing = useOffice((s) => s.setBrewing);
  const [filled, setFilled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startBrew = () => {
    if (useOffice.getState().brewing) return;
    setBrewing(true);
    brew(BREW_SECONDS);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setBrewing(false);
      setFilled(true);
      ding();
    }, BREW_SECONDS * 1000);
  };

  return (
    <group position={[2.62, 0, 0.6]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Sideboard it stands on */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.84, 0.45]} />
        <meshStandardMaterial color={palette.wood} roughness={0.7} />
      </mesh>

      {/* Machine body + head + spout */}
      <group position={[-0.18, 0.84, 0]}>
        <mesh position={[0, 0.16, -0.06]} castShadow>
          <boxGeometry args={[0.26, 0.32, 0.18]} />
          <meshStandardMaterial color={palette.metal} roughness={0.35} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.34, 0.04]} castShadow>
          <boxGeometry args={[0.26, 0.1, 0.3]} />
          <meshStandardMaterial color={palette.metal} roughness={0.35} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.26, 0.07]}>
          <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
          <meshStandardMaterial color={palette.metalLight} roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Status light: amber while brewing */}
        <mesh position={[0.09, 0.36, 0.19]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial
            color={brewing ? palette.accent : "#444"}
            emissive={brewing ? palette.accent : "#000"}
            emissiveIntensity={brewing ? 2 : 0}
          />
        </mesh>
        {/* The cup under the spout */}
        <mesh position={[0, 0.045, 0.07]} castShadow>
          <cylinderGeometry args={[0.04, 0.034, 0.09, 14]} />
          <meshStandardMaterial color={palette.paper} roughness={0.5} />
        </mesh>
        {filled && (
          <mesh position={[0, 0.085, 0.07]}>
            <cylinderGeometry args={[0.034, 0.034, 0.005, 14]} />
            <meshStandardMaterial color="#3b2417" roughness={0.3} />
          </mesh>
        )}
        {(brewing || filled) && <Steam position={[0, 0.12, 0.07]} count={brewing ? 6 : 3} />}
      </group>

      <Hotspot
        position={[-0.18, 1.05, 0.05]}
        size={[0.4, 0.55, 0.5]}
        label={brewing ? "Brewing…" : "Coffee machine — needs no explanation"}
        anyMode
        onActivate={startBrew}
      />
    </group>
  );
}
