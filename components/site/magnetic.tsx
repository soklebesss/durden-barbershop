"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/* Magnetic wrapper — pulls its child toward the cursor (max ~12px).
   Fine pointers only; no-op for touch and reduced motion. */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  function onMove(e: React.PointerEvent) {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-12, Math.min(12, dx * strength)));
    y.set(Math.max(-12, Math.min(12, dy * strength)));
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
