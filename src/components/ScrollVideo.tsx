"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { assets, identity } from "@/content/project";

/**
 * Background promo video, scrubbed frame-by-frame by scroll on fine-pointer
 * devices (dense-keyframe hero.mp4). Touch devices get a lightweight ambient
 * loop (hero-mobile.mp4) instead — currentTime-scrubbing is choppy and
 * battery-hungry there. The source is chosen client-side so only one file is
 * ever downloaded. A missing/broken file degrades to the poster/gradient.
 *
 * Deliberately a passive useEffect, not useGSAP: this component mounts inside
 * the track element, and child *layout* effects run before the parent ref is
 * attached — trackRef.current would still be null. The tween + ScrollTrigger
 * are killed explicitly in the cleanup instead.
 */
export default function ScrollVideo({
  trackRef,
}: {
  trackRef: RefObject<HTMLDivElement | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    let tween: gsap.core.Tween | undefined;

    const onMeta = () => {
      if (isTouch) {
        video.loop = true;
        video.play().catch(() => {
          /* autoplay blocked → poster stays visible, fine */
        });
        return;
      }
      const track = trackRef.current;
      if (!track) return;
      // Scroll-scrubbed playback: one owner (GSAP) for currentTime.
      tween = gsap.fromTo(
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
    };

    video.addEventListener("loadedmetadata", onMeta, { once: true });
    video.src = isTouch ? assets.heroVideoMobile : assets.heroVideo;
    video.load();
    if (video.readyState >= 1) onMeta();

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [trackRef]);

  return (
    <div className="absolute inset-0" aria-hidden>
      {/* Gradient ground: visible until video/poster paints, and if assets are missing */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-800 via-forest-900 to-forest-950" />
      {!failed && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
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
