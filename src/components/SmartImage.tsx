"use client";

import { useImageFallback } from "@/lib/useImageFallback";

/**
 * Gallery image that degrades to a styled placeholder while the real
 * asset has not been dropped into /public/assets/gallery yet.
 */
export default function SmartImage({
  src,
  alt,
  className = "",
  ...rest
}: {
  src: string;
  alt: string;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  const { imgRef, missing, onError } = useImageFallback();

  if (missing) {
    return (
      <div
        role="img"
        aria-label={`${alt} (görsel bekleniyor)`}
        className={`flex items-center justify-center bg-gradient-to-br from-obsidian-800 to-obsidian-950 ${className}`}
      >
        <span className="px-4 text-center text-[0.65rem] uppercase tracking-[0.3em] text-snow/35">
          Görsel bekleniyor
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`object-cover ${className}`}
      onError={onError}
      {...rest}
    />
  );
}
