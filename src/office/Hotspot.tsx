"use client";

import { useEffect } from "react";
import { useOffice } from "@/office/store";
import { click } from "@/office/audio/sound";
import { dragState } from "@/office/camera/CameraRig";

type Props = {
  /** Stable id — the owning object reads it back to glow on hover. */
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  label: string;
  onActivate: () => void;
  /** Some hotspots (coffee, light switch) also work while sitting etc. */
  anyMode?: boolean;
};

/**
 * The owning component calls this to know when its hotspot is hovered —
 * a soft emissive lift on the object is the hover affordance (the
 * "everything here is secretly alive" tell, without painting UI on it).
 */
export function useHovered(id: string): boolean {
  return useOffice((s) => s.hoverId === id);
}

// The secret-interactivity primitive (concept thesis: "Looks ordinary.
// Isn't."): an invisible box over a normal-looking object. Hovering makes
// the object glow softly, shows a label next to the cursor (HUD), and a
// pointer cursor; clicking flies the camera or triggers the object. Only
// legal in idle mode and never mid-flight.
export default function Hotspot({
  id,
  position,
  size,
  label,
  onActivate,
  anyMode = false,
}: Props) {
  const setHover = useOffice((s) => s.setHover);

  const isActive = () => {
    const { mode, flying } = useOffice.getState();
    return !flying && (anyMode ? mode !== "entry" : mode === "idle");
  };

  useEffect(
    () => () => {
      // Don't leave a stale label behind if we unmount mid-hover.
      useOffice.getState().setHover(null, null);
      document.body.style.cursor = "";
    },
    []
  );

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (dragState.moved) return; // end of a look-around drag
        if (!isActive()) return;
        setHover(null, null);
        document.body.style.cursor = "";
        click();
        onActivate();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!isActive()) return;
        setHover(id, label);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(null, null);
        document.body.style.cursor = "";
      }}
    >
      <boxGeometry args={size} />
      {/* Invisible but still raycastable: fully transparent material. */}
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
