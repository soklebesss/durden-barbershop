"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/lib/motion";

/* Page-load intro: wordmark stamps down, then the whole plate wipes away.
   Shown once per browser session; skipped entirely under reduced motion
   (checked via matchMedia directly — useReducedMotion is null on the first
   render, which would let the intro flash for reduced-motion users). */
export function IntroStamp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("ct-intro-done")) return;
    sessionStorage.setItem("ct-intro-done", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-bg"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.6, ease: EASE.blade }}
          aria-hidden
        >
          <motion.div
            initial={{ scale: 1.6, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: -3 }}
            transition={{ duration: 0.45, ease: EASE.blade, delay: 0.15 }}
            className="border-4 border-accent px-6 py-3 text-accent"
          >
            <span className="font-display text-display-md leading-none">
              DURDEN
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
