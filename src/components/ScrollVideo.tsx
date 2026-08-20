"use client";

import { useRef, useState, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { assets, identity } from "@/content/project";

/**
 * Background promo video, scrubbed frame-by-frame by scroll on fine-pointer
 * devices. On touch devices currentTime-scrubbing is choppy and battery-hungry,
 * so the video plays as a muted ambient loop instead (mobile fallback).
 * A missing/broken file degrades to the poster/gradient — the page never breaks.
 */
export default function ScrollVideo({
  trackRef,
}: {
  trackRef: RefObject<HTMLDivElement | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useGSAP(
    (context, contextSafe) => {
      const video = videoRef.current;
      const track = trackRef.current;
      if (!video || !track || !contextSafe) return;

      const isTouch = window.matchMedia("(pointer: coarse)").matches;

      const onMeta = contextSafe(() => {
        if (isTouch) {
          video.loop = true;
          video.play().catch(() => {
            /* autoplay blocked → poster stays visible, fine */
          });
          return;
        }
        // Scroll-scrubbed playback: one owner (GSAP) for currentTime.
        gsap.fromTo(
          video,
          { currentTime: 0 },
          {
            currentTime: video.duration || 1,
            ease: "none",
            scrollTrigger: {
              trigger: track,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.2, // lag smoothing → fluid, controlled frame advance
            },
          }
        );
      });

      if (video.readyState >= 1) onMeta();
      else video.addEventListener("loadedmetadata", onMeta, { once: true });

      return () => video.removeEventListener("loadedmetadata", onMeta);
    },
    { scope: trackRef }
  );

  return (
    <div className="absolute inset-0" aria-hidden>
      {/* Gradient ground: visible until video/poster paints, and if assets are missing */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-800 via-forest-900 to-forest-950" />
      {!failed && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={assets.heroVideo}
          poster={assets.heroPoster}
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          tabIndex={-1}
          onError={() => setFailed(true)}
          aria-label={`${identity.name} tanıtım videosu`}
        />
      )}
      {/* Legibility scrim over the video */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/55 via-forest-950/20 to-forest-950/70" />
    </div>
  );
}
