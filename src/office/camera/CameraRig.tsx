"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useOffice, type Mode } from "@/office/store";
import { flightEase } from "@/office/lib/easing";

// The camera is on rails, reference-style (Henry Heffernan / Jesse Zhou):
// no free orbit, ever. Each mode is a composed shot; changing mode is a
// timed flight on a bezier that launches fast and lands soft; between
// flights the camera is never frozen — it follows the pointer with a
// gentle parallax and breathes on a slow sine in idle. Visitors with
// prefers-reduced-motion get hard cuts and a still camera.

type Pose = { pos: [number, number, number]; tar: [number, number, number] };

const POSES: Record<Mode, Pose> = {
  entry: { pos: [2.9, 2.35, 3.0], tar: [-0.4, 0.9, -1.5] },
  idle: { pos: [2.1, 1.75, 2.3], tar: [-0.25, 1.0, -1.35] },
  monitor: { pos: [0.15, 1.41, -1.12], tar: [0.15, 1.4, -1.98] },
  dossier: { pos: [-0.55, 1.72, -1.08], tar: [-0.55, 0.96, -1.62] },
  corkboard: { pos: [-1.6, 1.55, 0.1], tar: [-2.95, 1.55, 0.1] },
  sitting: { pos: [0.1, 1.33, -0.92], tar: [0.15, 1.16, -2.4] },
};

// Flight durations in seconds, by destination (going back is quicker).
const DURATION: Partial<Record<Mode, number>> = {
  idle: 1.2,
  monitor: 1.7,
  dossier: 1.5,
  corkboard: 1.6,
  sitting: 1.5,
};

// Pointer parallax amplitude per mode — strong in the room, nearly off
// when reading a screen.
const PARALLAX: Record<Mode, number> = {
  entry: 0.1,
  idle: 0.16,
  monitor: 0.012,
  dossier: 0.03,
  corkboard: 0.04,
  sitting: 0.05,
};

export default function CameraRig() {
  const camera = useThree((s) => s.camera);
  const mode = useOffice((s) => s.mode);
  const setFlying = useOffice((s) => s.setFlying);

  const v = useMemo(
    () => ({
      pos: new THREE.Vector3(...POSES.entry.pos),
      tar: new THREE.Vector3(...POSES.entry.tar),
      desiredPos: new THREE.Vector3(),
      desiredTar: new THREE.Vector3(),
      fromPos: new THREE.Vector3(),
      fromTar: new THREE.Vector3(),
      right: new THREE.Vector3(),
      dir: new THREE.Vector3(),
    }),
    []
  );
  const flight = useRef<{ to: Mode; start: number; duration: number } | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // A mode change is a flight (or a cut).
  const firstRun = useRef(true);
  useEffect(() => {
    const target = POSES[mode];
    if (firstRun.current || reduced.current) {
      firstRun.current = false;
      v.pos.set(...target.pos);
      v.tar.set(...target.tar);
      setFlying(false);
      return;
    }
    v.fromPos.copy(v.pos);
    v.fromTar.copy(v.tar);
    flight.current = {
      to: mode,
      start: performance.now(),
      duration: (DURATION[mode] ?? 1.4) * 1000,
    };
    setFlying(true);
  }, [mode, setFlying, v]);

  useFrame(({ pointer, clock, size }, delta) => {
    const base = POSES[mode];
    v.desiredPos.set(...base.pos);
    v.desiredTar.set(...base.tar);

    // Tall viewports need more distance to fit the same shot (the
    // aspect-compensation trick from Henry's MonitorKeyframe).
    const aspect = size.height / size.width;
    if (aspect > 1 && (mode === "monitor" || mode === "dossier" || mode === "corkboard")) {
      v.dir.copy(v.desiredPos).sub(v.desiredTar).normalize();
      v.desiredPos.addScaledVector(v.dir, (aspect - 1) * 0.9);
    }

    const f = flight.current;
    if (f) {
      const t = Math.min(1, (performance.now() - f.start) / f.duration);
      const e = flightEase(t);
      v.pos.lerpVectors(v.fromPos, v.desiredPos, e);
      v.tar.lerpVectors(v.fromTar, v.desiredTar, e);
      if (t >= 1) {
        flight.current = null;
        setFlying(false);
      }
    } else if (!reduced.current) {
      // Parallax in the camera's own right/up frame + the idle breath.
      v.dir.copy(v.desiredTar).sub(v.desiredPos).normalize();
      v.right.crossVectors(v.dir, camera.up).normalize();
      const amp = PARALLAX[mode];
      v.desiredPos.addScaledVector(v.right, pointer.x * amp);
      v.desiredPos.y += pointer.y * amp * 0.7;
      v.desiredTar.addScaledVector(v.right, pointer.x * amp * 2.2);
      v.desiredTar.y += pointer.y * amp * 1.6;
      if (mode === "idle" || mode === "entry") {
        v.desiredPos.y += Math.sin(clock.elapsedTime * 0.35) * 0.025;
        v.desiredPos.x += Math.sin(clock.elapsedTime * 0.22) * 0.02;
      }
      // Critically-damped chase so the parallax feels like weight,
      // not like the cursor dragging the room around.
      const k = 1 - Math.exp(-delta * 3.2);
      v.pos.lerp(v.desiredPos, k);
      v.tar.lerp(v.desiredTar, k);
    } else {
      v.pos.copy(v.desiredPos);
      v.tar.copy(v.desiredTar);
    }

    camera.position.copy(v.pos);
    camera.lookAt(v.tar);
  });

  return null;
}
