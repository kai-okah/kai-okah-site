"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
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
      camera={{ fov: 50, position: [3.2, 2.4, 3.4] }}
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
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
}
