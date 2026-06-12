"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { useOffice } from "@/office/store";
import CameraRig from "@/office/camera/CameraRig";
import Lights from "@/office/room/Lights";
import Room from "@/office/room/Room";
import WindowRain from "@/office/room/WindowRain";
import Desk from "@/office/furniture/Desk";
import MonitorProp from "@/office/furniture/MonitorProp";
import Chair from "@/office/furniture/Chair";
import Shelf from "@/office/furniture/Shelf";
import CoffeeMachine from "@/office/furniture/CoffeeMachine";
import CorkboardProp from "@/office/furniture/CorkboardProp";
import DossierProp from "@/office/furniture/DossierProp";
import BusinessCard from "@/office/furniture/BusinessCard";
import Plant from "@/office/furniture/Plant";

const FOG: Record<string, string> = {
  day: "#b9b2a4",
  evening: "#1d1410",
  midnight: "#05060a",
};

// The whole office in one canvas. The PerformanceMonitor implements the
// degradation ladder from the brief (risk #1): when FPS sags it steps
// perfTier up — first shadows and DPR go, then the particles — instead
// of letting the room turn into a slideshow.
export default function Scene() {
  const lightMode = useOffice((s) => s.lightMode);
  const perfTier = useOffice((s) => s.perfTier);
  const degrade = useOffice((s) => s.degrade);
  const revealName = useOffice((s) => s.revealName);

  // V3: a click on nothing in particular, while idle, reveals the name.
  const onPointerMissed = () => {
    const { mode, flying } = useOffice.getState();
    if (mode === "idle" && !flying) revealName();
  };

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nameRevealed = useOffice((s) => s.nameRevealed);
  useEffect(() => {
    if (!nameRevealed) return;
    hideTimer.current = setTimeout(() => useOffice.getState().hideName(), 4500);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [nameRevealed]);

  return (
    <Canvas
      shadows={perfTier === 0}
      dpr={perfTier === 0 ? [1, 2] : 1}
      // FOV 35: the reference-site lens — tighter, less wide-angle
      // distortion, more photograph (Henry uses exactly 35).
      camera={{ fov: 35, position: [2.9, 2.35, 3.0] }}
      onPointerMissed={onPointerMissed}
    >
      <color attach="background" args={[FOG[lightMode]]} />
      <fog attach="fog" args={[FOG[lightMode], 8, 16]} />
      <PerformanceMonitor onDecline={degrade} flipflops={2}>
        <Suspense fallback={null}>
          <CameraRig />
          <Lights />
          <Room />
          <WindowRain />
          <Desk />
          <MonitorProp />
          <Chair />
          <Shelf />
          <CoffeeMachine />
          <CorkboardProp />
          <DossierProp />
          <BusinessCard />
          <Plant />
          {/* Soft ground contact under the furniture — one baked frame,
              this is most of the difference between "placed" and
              "floating" */}
          <ContactShadows
            position={[0, 0.002, -0.9]}
            scale={6.5}
            far={1.6}
            blur={2.4}
            opacity={0.42}
            frames={1}
          />
          {/* An offline environment map (no HDRI downloads): a few soft
              area lights for the reflections on screen, metal and glass */}
          <Environment resolution={64} frames={1}>
            <Lightformer intensity={1.6} position={[0, 2.5, -4]} scale={[3, 2, 1]} color="#dfe8f0" />
            <Lightformer intensity={0.8} position={[3, 2, 2]} scale={[2, 2, 1]} color="#ffe2bd" />
            <Lightformer intensity={0.4} position={[-3, 1.5, 0]} rotation-y={Math.PI / 2} scale={[2, 1, 1]} color="#cfd8de" />
          </Environment>
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
}
