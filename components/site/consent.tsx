"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EASE } from "@/lib/motion";

/* Consent gate. Choice persists in localStorage; nothing non-essential
   (map embed, any future analytics) loads before an explicit "accept". */

type ConsentValue = "accepted" | "rejected" | null;
const STORAGE_KEY = "ct-consent";

const ConsentContext = createContext<{
  consent: ConsentValue;
  setConsent: (v: Exclude<ConsentValue, null>) => void;
}>({ consent: null, setConsent: () => {} });

export function useConsent() {
  return useContext(ConsentContext);
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentValue>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "rejected") setConsentState(stored);
    setLoaded(true);
  }, []);

  const setConsent = useCallback((v: Exclude<ConsentValue, null>) => {
    localStorage.setItem(STORAGE_KEY, v);
    setConsentState(v);
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, setConsent }}>
      {children}
      {loaded && <ConsentBanner visible={consent === null} onChoice={setConsent} />}
    </ConsentContext.Provider>
  );
}

function ConsentBanner({
  visible,
  onChoice,
}: {
  visible: boolean;
  onChoice: (v: "accepted" | "rejected") => void;
}) {
  const reduced = useReducedMotion();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Cookie consent"
          initial={reduced ? { opacity: 0 } : { y: 120, rotate: 1.5 }}
          animate={reduced ? { opacity: 1 } : { y: 0, rotate: -0.6 }}
          exit={reduced ? { opacity: 0 } : { y: 160, rotate: 2 }}
          transition={{ duration: 0.5, ease: EASE.snap, delay: 1.2 }}
          className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-xl border-2 border-accent bg-bg-raised p-5 sm:bottom-6 sm:left-auto sm:right-6 sm:p-6"
        >
          <p className="label-mono mb-2 text-accent">COOKIES. THE BORING KIND.</p>
          <p className="mb-4 text-sm leading-relaxed text-fg">
            We use one strictly-necessary cookie to remember this choice, and — only if
            you say yes — a third-party map embed so you can find the shop. No trackers,
            no ad networks, no nonsense.{" "}
            <Link href="/privacy" className="underline decoration-accent decoration-2 underline-offset-2 hover:text-accent">
              Privacy policy
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => onChoice("accepted")}>Fine, accept</Button>
            <Button variant="ghost" onClick={() => onChoice("rejected")}>
              Reject non-essential
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
