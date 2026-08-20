"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Missing-asset detection that survives SSR: an <img> can fire its error
 * event before React hydrates and attaches onError, so on mount we also
 * inspect img.complete/naturalWidth to catch already-failed loads.
 */
export function useImageFallback() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setMissing(true);
  }, []);

  return { imgRef, missing, onError: () => setMissing(true) };
}
