"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOffice } from "@/office/store";

// A wisp of steam: a handful of translucent spheres drifting up and
// fading. Used over the coffee mug and the machine while it brews —
// the "ambient life" that makes a still room feel inhabited.
export default function Steam({
  position,
  count = 5,
}: {
  position: [number, number, number];
  count?: number;
}) {
  const perfTier = useOffice((s) => s.perfTier);
  const group = useRef<THREE.Group>(null);

  const wisps = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        phase: (i / count) * 1.2,
        drift: (Math.random() - 0.5) * 0.05,
      })),
    [count]
  );

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const t = (clock.elapsedTime * 0.4 + wisps[i].phase) % 1.2;
      child.position.set(
        Math.sin(t * 9 + i) * 0.02 + wisps[i].drift * t,
        t * 0.28,
        0
      );
      child.scale.setScalar(0.5 + t * 0.8);
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.22 * (1 - t / 1.2));
    });
  });

  if (perfTier >= 2) return null;

  return (
    <group ref={group} position={position}>
      {wisps.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshBasicMaterial color="#e8e4dc" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
