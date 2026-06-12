"use client";

import { useMemo } from "react";
import { palette } from "@/office/palette";
import { woodTexture } from "@/office/lib/textures";

// A wall shelf with a row of books and a small plant — set dressing.
// Book sizes/colors are seeded-random but stable across renders.
const BOOK_COLORS = ["#7d5a3c", "#4a5360", "#9c4f33", "#5d6b50", "#3a3631", "#b08d5e"];

export default function Shelf() {
  const books = useMemo(() => {
    let x = -0.52;
    return Array.from({ length: 11 }, (_, i) => {
      const w = 0.035 + ((i * 7) % 5) * 0.006;
      const h = 0.2 + ((i * 13) % 7) * 0.012;
      const book = {
        x: x + w / 2,
        w,
        h,
        color: BOOK_COLORS[i % BOOK_COLORS.length],
        lean: i === 7 ? 0.18 : 0,
      };
      x += w + 0.006;
      return book;
    });
  }, []);

  return (
    <group position={[2.92, 1.75, -1.2]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Board + brackets */}
      <mesh castShadow>
        <boxGeometry args={[1.3, 0.035, 0.24]} />
        <meshStandardMaterial
          map={woodTexture("shelf", palette.wood, "#3f2f1e", [1.6, 0.3], 1)}
          roughness={0.7}
        />
      </mesh>
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, -0.06, -0.08]}>
          <boxGeometry args={[0.03, 0.09, 0.06]} />
          <meshStandardMaterial color={palette.metal} roughness={0.5} metalness={0.4} />
        </mesh>
      ))}
      {/* Books */}
      {books.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, 0.02 + b.h / 2, 0]}
          rotation={[0, 0, b.lean]}
          castShadow
        >
          <boxGeometry args={[b.w, b.h, 0.16]} />
          <meshStandardMaterial color={b.color} roughness={0.85} />
        </mesh>
      ))}
      {/* Tiny succulent on the end */}
      <group position={[0.55, 0.02, 0]}>
        <mesh position={[0, 0.035, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.07, 12]} />
          <meshStandardMaterial color={palette.pot} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color={palette.leaf} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
