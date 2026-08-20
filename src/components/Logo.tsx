"use client";

import { assets, identity } from "@/content/project";
import { useImageFallback } from "@/lib/useImageFallback";

/**
 * Renders the real logo from /assets/logo/logo.svg when present.
 * Until the file is dropped in, falls back to an elegant text wordmark —
 * the project identity itself is never altered, only awaited.
 */
export default function Logo({
  className = "h-14 sm:h-16",
}: {
  className?: string;
}) {
  const { imgRef, missing, onError } = useImageFallback();

  if (missing) {
    return (
      <span className="flex flex-col leading-none" aria-label={identity.name}>
        <span className="font-display text-xl tracking-[0.18em] text-cream">
          ALA
        </span>
        <span className="text-[0.6rem] font-medium tracking-[0.42em] text-sand-400">
          ÇEKMEKÖY NEFES
        </span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={assets.logo}
      alt={identity.name}
      className={`${className} w-auto`}
      onError={onError}
    />
  );
}
