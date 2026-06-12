"use client";

import { useEffect } from "react";
import { useOffice } from "@/office/store";
import { click } from "@/office/audio/sound";

type Props = {
  position: [number, number, number];
  size: [number, number, number];
  label: string;
  onActivate: () => void;
  /** Some hotspots (coffee, light switch) also work while sitting etc. */
  anyMode?: boolean;
};

// The secret-interactivity primitive (concept thesis: "Looks ordinary.
// Isn't."): an invisible box over a normal-looking object. Hovering shows
// a label next to the cursor (HUD) and a pointer cursor; clicking flies
// the camera or triggers the object. Only legal in idle mode and never
// mid-flight — the mode-machine discipline from the Jesse Zhou analysis.
export default function Hotspot({
  position,
  size,
  label,
  onActivate,
  anyMode = false,
}: Props) {
  const setHoverLabel = useOffice((s) => s.setHoverLabel);

  const isActive = () => {
    const { mode, flying } = useOffice.getState();
    return !flying && (anyMode ? mode !== "entry" : mode === "idle");
  };

  useEffect(
    () => () => {
      // Don't leave a stale label behind if we unmount mid-hover.
      useOffice.getState().setHoverLabel(null);
      document.body.style.cursor = "";
    },
    []
  );

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (!isActive()) return;
        setHoverLabel(null);
        document.body.style.cursor = "";
        click();
        onActivate();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!isActive()) return;
        setHoverLabel(label);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHoverLabel(null);
        document.body.style.cursor = "";
      }}
    >
      <boxGeometry args={size} />
      {/* Invisible but still raycastable: fully transparent material. */}
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
