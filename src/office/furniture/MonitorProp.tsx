"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "@/office/palette";
import { useOffice } from "@/office/store";
import Hotspot from "@/office/Hotspot";

// The monitor (V4): a normal screen showing a sleepy KO/OS login. Click
// it and the camera flies in; the real KO/OS is a DOM overlay that fades
// in once the flight lands (OfficeApp) — crisp text, real React apps,
// nothing rendered as 3D texture except this idle screen.
export default function MonitorProp() {
  const focus = useOffice((s) => s.focus);
  const lightMode = useOffice((s) => s.lightMode);
  const screenRef = useRef<THREE.MeshStandardMaterial>(null);

  // The idle screen is a once-drawn canvas texture — no font assets.
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 300;
    const g = canvas.getContext("2d")!;
    g.fillStyle = palette.screenDark;
    g.fillRect(0, 0, 512, 300);
    g.fillStyle = palette.accent;
    g.font = "600 64px monospace";
    g.textAlign = "center";
    g.fillText("KO/OS", 256, 140);
    g.fillStyle = "#7e8aa0";
    g.font = "24px monospace";
    g.fillText("click to log in", 256, 195);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);

  // Midnight flicker: the screen breathes a little, like a real panel in
  // a dark room.
  useFrame(({ clock }) => {
    const mat = screenRef.current;
    if (!mat) return;
    const base = lightMode === "midnight" ? 1.5 : 1.0;
    mat.emissiveIntensity =
      base + Math.sin(clock.elapsedTime * 9) * Math.sin(clock.elapsedTime * 2.3) * 0.06;
  });

  return (
    <group position={[0.15, 0, -1.98]}>
      {/* Foot + neck */}
      <mesh position={[0, 0.975, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.02, 20]} />
        <meshStandardMaterial color={palette.metal} roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.12, -0.02]} castShadow>
        <boxGeometry args={[0.05, 0.28, 0.03]} />
        <meshStandardMaterial color={palette.metal} roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Panel */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.82, 0.5, 0.035]} />
        <meshStandardMaterial color={palette.metal} roughness={0.45} metalness={0.3} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 1.4, 0.019]}>
        <planeGeometry args={[0.76, 0.44]} />
        <meshStandardMaterial
          ref={screenRef}
          map={texture}
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      <Hotspot
        position={[0, 1.4, 0.1]}
        size={[0.9, 0.6, 0.25]}
        label="The monitor — log in to KO/OS"
        onActivate={() => focus("monitor")}
      />
    </group>
  );
}
