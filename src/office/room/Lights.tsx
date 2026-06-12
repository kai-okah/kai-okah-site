"use client";

import { useOffice } from "@/office/store";

// Three real-time rigs, switched by the wall switch (V9). Real-time
// lights are exactly why the brief chose "no Blender, no baking": the
// whole room re-lights for the cost of a few uniforms.
//   day      — soft sky light through the window
//   evening  — warm desk lamp, room falls back
//   midnight — monitor-glow grind mode
export default function Lights() {
  const lightMode = useOffice((s) => s.lightMode);
  const perfTier = useOffice((s) => s.perfTier);
  const shadows = perfTier === 0;

  if (lightMode === "day") {
    return (
      <>
        <hemisphereLight args={["#cdd9e4", "#5b4a38", 1.05]} />
        <directionalLight
          position={[0.6, 2.6, -4]}
          intensity={1.7}
          color="#fff1da"
          castShadow={shadows}
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-camera-left={-3.5}
          shadow-camera-right={3.5}
          shadow-camera-top={3.5}
          shadow-camera-bottom={-3.5}
        />
        <pointLight position={[0, 2.7, 0.4]} intensity={8} color="#fff6e8" />
        <pointLight position={[-1.5, 1.8, 1.8]} intensity={3} color="#e8e2d4" />
      </>
    );
  }

  if (lightMode === "evening") {
    return (
      <>
        <hemisphereLight args={["#5a4a44", "#352a20", 0.35]} />
        {/* The desk lamp head — the room's only honest light source now. */}
        <pointLight
          position={[-0.72, 1.45, -1.85]}
          intensity={9}
          color="#ffb168"
          distance={6}
          castShadow={shadows}
          shadow-mapSize={[512, 512]}
          shadow-bias={-0.0005}
        />
        <pointLight position={[2.7, 1.2, 0.6]} intensity={1.6} color="#ff9c50" distance={3} />
      </>
    );
  }

  // midnight
  return (
    <>
      <hemisphereLight args={["#27304a", "#0a0c12", 0.14]} />
      {/* The monitor is the sun now. */}
      <pointLight
        position={[0.15, 1.45, -1.6]}
        intensity={5}
        color="#9bb8ff"
        distance={5}
        castShadow={shadows}
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0005}
      />
      <pointLight position={[-0.72, 1.45, -1.85]} intensity={0.8} color="#ffb168" distance={2} />
    </>
  );
}
