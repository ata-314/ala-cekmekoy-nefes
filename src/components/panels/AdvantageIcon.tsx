"use client";

import { useImageFallback } from "@/lib/useImageFallback";

/** Advantage icon: real SVG from /assets/icons when present, elegant diamond glyph until then. */
export default function AdvantageIcon({ src, alt }: { src: string; alt: string }) {
  const { imgRef, missing, onError } = useImageFallback();

  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10">
      {missing ? (
        <span
          aria-hidden
          className="block h-2.5 w-2.5 rotate-45 rounded-[2px] bg-accent"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="h-5 w-5"
          onError={onError}
        />
      )}
    </span>
  );
}
