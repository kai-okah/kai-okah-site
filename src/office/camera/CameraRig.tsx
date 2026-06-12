"use client";

import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useOffice, type Mode } from "@/office/store";

// One named pose per mode: [camera x,y,z, target x,y,z]. The camera is
// always "on rails" — clicking an object flies between these poses, and
// input is locked while in flight (button-locking pattern from the Jesse
// Zhou analysis). Visitors with prefers-reduced-motion get hard cuts.
const POSES: Record<Mode, [number, number, number, number, number, number]> = {
  entry: [2.8, 2.3, 2.9, -0.1, 1.0, -1.3],
  idle: [1.9, 1.7, 2.1, -0.1, 1.0, -1.3],
  monitor: [0.15, 1.42, -1.05, 0.15, 1.4, -1.95],
  dossier: [-0.55, 1.75, -1.05, -0.55, 0.96, -1.62],
  corkboard: [-1.55, 1.55, 0.1, -2.95, 1.55, 0.1],
  // Kai's side of the desk (V8): sitting in the chair, monitor and rainy
  // window in front of you.
  sitting: [0.1, 1.28, -1.0, 0.15, 1.25, -2.4],
};

export default function CameraRig() {
  const controls = useRef<CameraControls>(null);
  const mode = useOffice((s) => s.mode);
  const setFlying = useOffice((s) => s.setFlying);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const pose = POSES[mode];
    let cancelled = false;
    setFlying(true);
    c.setLookAt(...pose, !reduced).then(() => {
      if (!cancelled) setFlying(false);
    });
    return () => {
      cancelled = true;
    };
  }, [mode, setFlying]);

  return (
    <CameraControls
      ref={controls}
      makeDefault
      smoothTime={0.45}
      // Free look stays inside the room and never under the floor or
      // through a wall; truck (panning) is disabled so the visitor can't
      // wander off the set.
      minDistance={1.2}
      maxDistance={5.2}
      minPolarAngle={0.35}
      maxPolarAngle={1.52}
      minAzimuthAngle={-0.35}
      maxAzimuthAngle={1.45}
      mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 8 }}
      touches={{ one: 32, two: 512, three: 0 }}
    />
  );
}
