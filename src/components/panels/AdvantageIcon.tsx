"use client";

import { useImageFallback } from "@/lib/useImageFallback";

/** Advantage icon: real SVG from /assets/icons when present, elegant diamond glyph until then. */
export default function AdvantageIcon({ src, alt }: { src: string; alt: string }) {
  const { imgRef, missing, onError } = useImageFallback();

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 sm:h-11 sm:w-11 sm:rounded-2xl">
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
          className="h-4 w-4 sm:h-5 sm:w-5"
          onError={onError}
        />
      )}
    </span>
  );
}
