"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/* Dot + trailing ring. Renders only on fine pointers; the native cursor is
   never hidden, so this is decoration, not a dependency. */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 250, damping: 25, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 250, damping: 25, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="cursor-dot"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden
        className="cursor-ring"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      />
    </>
  );
}
