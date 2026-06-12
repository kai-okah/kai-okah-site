"use client";

import { palette } from "@/office/palette";
import { useOffice } from "@/office/store";
import Hotspot from "@/office/Hotspot";

// A plain folder on the desk (V5). It happens to contain every
// certificate Kai has earned — click it and it opens as a page-flipping
// dossier (DOM overlay).
export default function DossierProp() {
  const focus = useOffice((s) => s.focus);

  return (
    <group position={[-0.55, 0.958, -1.62]} rotation={[0, 0.22, 0]}>
      {/* Folder body — a few stacked sheets and a cover */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.012, 0.4]} />
        <meshStandardMaterial color={palette.accentDeep} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.009, 0]}>
        <boxGeometry args={[0.28, 0.006, 0.38]} />
        <meshStandardMaterial color={palette.paper} roughness={0.9} />
      </mesh>
      {/* Tab */}
      <mesh position={[0.16, 0, 0.1]}>
        <boxGeometry args={[0.04, 0.01, 0.1]} />
        <meshStandardMaterial color={palette.accent} roughness={0.6} />
      </mesh>

      <Hotspot
        position={[0, 0.05, 0]}
        size={[0.4, 0.15, 0.5]}
        label="A folder — the certificate dossier"
        onActivate={() => focus("dossier")}
      />
    </group>
  );
}
