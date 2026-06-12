"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useOffice } from "@/office/store";

const COUNT = 160;
// Rain falls in a slab just outside the window (z between -3.6 and -2.7),
// so it's only ever seen through the glass — cheap and convincing.
const AREA = { x: 2.6, yTop: 3.4, zNear: -2.7, zFar: -3.6 };

// Streaks of rain as one instanced mesh: one draw call, COUNT thin boxes.
// The perf ladder (tier 2) drops this whole component.
export default function WindowRain() {
  const perfTier = useOffice((s) => s.perfTier);
  const ref = useRef<THREE.InstancedMesh>(null);

  const drops = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: 0.15 + (Math.random() - 0.5) * AREA.x,
        y: Math.random() * AREA.yTop,
        z: AREA.zNear - Math.random() * (AREA.zNear - AREA.zFar),
        speed: 2.6 + Math.random() * 1.8,
      })),
    []
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < COUNT; i++) {
      const d = drops[i];
      d.y -= d.speed * delta;
      if (d.y < 0) d.y = AREA.yTop;
      dummy.position.set(d.x, d.y, d.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  if (perfTier >= 2) return null;

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry args={[0.006, 0.22, 0.006]} />
      <meshBasicMaterial color="#aebfd2" transparent opacity={0.35} />
    </instancedMesh>
  );
}
