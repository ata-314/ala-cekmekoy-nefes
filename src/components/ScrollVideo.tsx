"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { assets, identity } from "@/content/project";

/**
 * Background promo video, scrubbed frame-by-frame by scroll on fine-pointer
 * devices (dense-keyframe hero.mp4). Touch devices get a lighter ambient loop
 * (hero-mobile.mp4) instead. The source is chosen client-side so only one
 * file is ever downloaded. A missing/broken file degrades to the poster.
 *
 * On fine pointers the video layer also drifts subtly with the mouse
 * (GSAP quickTo on the wrapper transform — a different property than the
 * scroll-owned currentTime, so still one owner per animation).
 *
 * Deliberately a passive useEffect, not useGSAP: this component mounts inside
 * the track element, and child *layout* effects run before the parent ref is
 * attached — trackRef.current would still be null. Everything is killed
 * explicitly in the cleanup instead.
 */
export default function ScrollVideo({
  trackRef,
  endFraction = 1,
}: {
  trackRef: RefObject<HTMLDivElement | null>;
  /** Fraction of the track's scroll at which the video reaches its last
      frame — it then holds that frame for the remaining scroll (used by
      the hero→section hand-off, which owns the tail of the track). */
  endFraction?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tween: gsap.core.Tween | undefined;
    let onMove: ((e: PointerEvent) => void) | undefined;

    // Seek throttle: writing currentTime on every tick queues seeks faster
    // than the decoder can serve them — on Windows (DXVA pipelines,
    // weaker iGPUs) the backlog reads as heavy stutter. We tween a proxy
    // and only issue a new seek once the previous one has completed,
    // always targeting the latest desired time.
    const proxy = { t: 0 };
    let seekQueued = false;
    const issueSeek = () => {
      if (Math.abs(video.currentTime - proxy.t) < 1 / 50) return;
      video.currentTime = proxy.t;
    };
    const requestSeek = () => {
      if (video.seeking) {
        seekQueued = true;
        return;
      }
      issueSeek();
    };
    const onSeeked = () => {
      if (seekQueued) {
        seekQueued = false;
        issueSeek();
      }
    };
    video.addEventListener("seeked", onSeeked);

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
      // Scroll-scrubbed playback via the throttled proxy.
      tween = gsap.fromTo(
        proxy,
        { t: 0 },
        {
          t: video.duration || 1,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: () =>
              "+=" +
              (track.offsetHeight - window.innerHeight) * endFraction,
            scrub: 1.2, // lag smoothing → fluid, controlled frame advance
          },
          onUpdate: requestSeek,
        }
      );
    };

    video.addEventListener("loadedmetadata", onMeta, { once: true });
    video.src = isTouch ? assets.heroVideoMobile : assets.heroVideo;
    video.load();
    if (video.readyState >= 1) onMeta();

    // Mouse parallax: slight over-scale so the drift never exposes edges.
    if (!isTouch && !reduced) {
      gsap.set(wrap, { scale: 1.06 });
      const qx = gsap.quickTo(wrap, "xPercent", { duration: 0.9, ease: "power3.out" });
      const qy = gsap.quickTo(wrap, "yPercent", { duration: 0.9, ease: "power3.out" });
      onMove = (e) => {
        qx((e.clientX / window.innerWidth - 0.5) * -2.2);
        qy((e.clientY / window.innerHeight - 0.5) * -1.6);
      };
      window.addEventListener("pointermove", onMove);
    }

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("seeked", onSeeked);
      if (onMove) window.removeEventListener("pointermove", onMove);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      gsap.killTweensOf(wrap);
      gsap.set(wrap, { clearProps: "transform" });
    };
  }, [trackRef, endFraction]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Gradient ground: visible until video/poster paints, and if assets are missing */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-800 via-obsidian-900 to-obsidian-950" />
      <div ref={wrapRef} className="absolute inset-0 will-change-transform">
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
      </div>
    </div>
  );
}
