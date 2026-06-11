"use client";

import { useReveal } from "@/hooks/useReveal";

// Small client wrapper so the (server-rendered) sections can opt into the
// reveal-on-scroll effect: <Reveal>…</Reveal>.
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
