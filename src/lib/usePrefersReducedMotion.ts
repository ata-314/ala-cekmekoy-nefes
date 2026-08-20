"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe reduced-motion hook. Returns `null` until mounted so callers can
 * avoid hydration mismatches, then true/false and live-updates on change.
 */
export function usePrefersReducedMotion(): boolean | null {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
