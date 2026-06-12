"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useOffice, type Mode } from "@/office/store";
import { flightEase } from "@/office/lib/easing";

// The camera is on rails, reference-style (Henry Heffernan / Jesse Zhou):
// each mode is a composed shot; changing mode is a timed flight on a
// bezier that launches fast and lands soft; between flights the camera
// is never frozen — it follows the pointer with a gentle parallax and
// breathes on a slow sine in idle. On top of the rails, idle and sitting
// allow press-and-drag to swing the view (a full 360° in idle — the
// camera stands mid-room, client request 2026-06-12) and the scroll
// wheel walks you closer to whatever you're looking at. Visitors with
// prefers-reduced-motion get hard cuts and a still camera (drag and
// scroll still work; they are user-initiated motion).

/** Did the last pointer interaction drag the camera? Scene checks this
 *  so releasing a drag doesn't count as a "click anywhere" name reveal. */
export const dragState = { moved: false };

type Pose = { pos: [number, number, number]; tar: [number, number, number] };

const POSES: Record<Mode, Pose> = {
  entry: { pos: [2.4, 2.3, 2.6], tar: [-0.1, 0.95, -1.7] },
  // Idle stands mid-room so a drag can sweep the entire office in one
  // continuous 360° turn (desk → shelf → door → corkboard → back).
  idle: { pos: [0.45, 1.58, 0.95], tar: [0.05, 1.18, -1.85] },
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

// Press-and-drag look-around limits per mode (radians around the pose).
// This is a first-person head-turn — the camera stays planted and the
// VIEW swings — so it can never collide with the furniture.
const ORBIT: Partial<Record<Mode, { yaw: number; pitchUp: number; pitchDown: number }>> = {
  idle: { yaw: Infinity, pitchUp: 0.5, pitchDown: 0.55 }, // full 360°
  sitting: { yaw: 2.4, pitchUp: 0.35, pitchDown: 0.4 },
};

// Scroll-wheel dolly range (metres along the view direction): how far
// you can walk toward / back away from what you're looking at.
const DOLLY: Partial<Record<Mode, { fwd: number; back: number }>> = {
  idle: { fwd: 2.3, back: 0.9 },
  sitting: { fwd: 0.5, back: 0.3 },
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
  // Drag look-around state: accumulated yaw/pitch around the pose.
  const orbit = useRef({ yaw: 0, pitch: 0 });
  // Wheel dolly: metres walked along the current view direction.
  const dolly = useRef(0);
  const spherical = useMemo(() => new THREE.Spherical(), []);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Press and hold on the room to swing the view (one finger on touch).
  useEffect(() => {
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const down = (e: PointerEvent) => {
      const { mode: m, flying } = useOffice.getState();
      if (!(m in ORBIT) || flying) return;
      // Drag can start anywhere on the scene — just not on real UI
      // (drei's invisible HTML portal divs sit over the canvas, so a
      // "target must be the canvas" check would never match).
      if (
        e.target instanceof Element &&
        e.target.closest("button, a, input, textarea, select, [role='dialog']")
      ) {
        return;
      }
      dragging = true;
      dragState.moved = false;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 1) dragState.moved = true;
      const limits = ORBIT[useOffice.getState().mode];
      if (!limits) return;
      orbit.current.yaw = THREE.MathUtils.clamp(
        orbit.current.yaw - dx * 0.0022,
        -limits.yaw,
        limits.yaw
      );
      orbit.current.pitch = THREE.MathUtils.clamp(
        orbit.current.pitch + dy * 0.0018,
        -limits.pitchDown,
        limits.pitchUp
      );
    };
    const up = () => {
      dragging = false;
      // Let the click that ends this drag be ignored, then reset.
      setTimeout(() => {
        dragState.moved = false;
      }, 0);
    };
    // Scroll to move closer / further (client request 2026-06-12).
    const wheel = (e: WheelEvent) => {
      const { mode: m, flying } = useOffice.getState();
      const range = DOLLY[m];
      if (!range || flying) return;
      // Overlays and KO/OS scroll their own content — leave them alone.
      if (
        e.target instanceof Element &&
        e.target.closest("[role='dialog'], button, input, textarea, select")
      ) {
        return;
      }
      dolly.current = THREE.MathUtils.clamp(
        dolly.current - e.deltaY * 0.0016,
        -range.back,
        range.fwd
      );
    };
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("wheel", wheel, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("wheel", wheel);
    };
  }, []);

  // A mode change is a flight (or a cut) — and the look-around resets,
  // so every destination is the composed shot.
  const firstRun = useRef(true);
  useEffect(() => {
    orbit.current.yaw = 0;
    orbit.current.pitch = 0;
    dolly.current = 0;
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

    // Tall (portrait) viewports: a fixed vertical FOV makes the
    // horizontal FOV collapse on phones — widen the lens as the screen
    // narrows, and pull the shot back a little besides (the
    // aspect-compensation idea from Henry's MonitorKeyframe).
    const aspect = size.height / size.width;
    const cam = camera as THREE.PerspectiveCamera;
    const targetFov = aspect > 1 ? Math.min(35 + (aspect - 1) * 22, 62) : 35;
    if (Math.abs(cam.fov - targetFov) > 0.1) {
      cam.fov = targetFov;
      cam.updateProjectionMatrix();
    }
    if (
      aspect > 1 &&
      (mode === "idle" || mode === "monitor" || mode === "dossier" || mode === "corkboard")
    ) {
      v.dir.copy(v.desiredPos).sub(v.desiredTar).normalize();
      v.desiredPos.addScaledVector(v.dir, (aspect - 1) * 0.9);
    }

    // Apply the drag look-around: turn the head, not the body — rotate
    // the view direction around the planted camera position.
    if ((mode === "idle" || mode === "sitting") && (orbit.current.yaw !== 0 || orbit.current.pitch !== 0)) {
      v.dir.copy(v.desiredTar).sub(v.desiredPos);
      spherical.setFromVector3(v.dir);
      spherical.theta += orbit.current.yaw;
      spherical.phi = THREE.MathUtils.clamp(spherical.phi - orbit.current.pitch, 0.35, 1.85);
      v.desiredTar.setFromSpherical(spherical).add(v.desiredPos);
    }
    // Apply the wheel dolly: step toward what you're looking at (and
    // never through a wall).
    if (dolly.current !== 0 && (mode === "idle" || mode === "sitting")) {
      v.dir.copy(v.desiredTar).sub(v.desiredPos).normalize();
      v.desiredPos.addScaledVector(v.dir, dolly.current);
      v.desiredPos.x = THREE.MathUtils.clamp(v.desiredPos.x, -2.7, 2.7);
      v.desiredPos.y = THREE.MathUtils.clamp(v.desiredPos.y, 0.35, 2.75);
      v.desiredPos.z = THREE.MathUtils.clamp(v.desiredPos.z, -2.25, 2.3);
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
