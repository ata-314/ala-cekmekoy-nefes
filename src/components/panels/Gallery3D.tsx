"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { gallery, type GalleryItem } from "@/content/project";
import SmartImage from "@/components/SmartImage";
import Lightbox from "@/components/Lightbox";

const subscribeNoop = () => () => {};
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * True cylinder gallery: every card sits on a 3D ring
 * (rotateY(i·step) translateZ(radius)) and the whole ring spins in place —
 * nothing enters or exits. GSAP's ticker drives the rotation; on fine
 * pointers the cursor steers spin speed/direction. Cards facing away dim and
 * lose pointer events; clicking a front card opens a lightbox portaled to
 * <body> (ancestor GSAP transforms would trap `fixed` otherwise).
 */
export default function Gallery3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    if (!wrap || !ring || reduced) return;

    const cards = Array.from(ring.children) as HTMLElement[];
    const N = cards.length;
    if (!N) return;

    const step = 360 / N;
    const BASE = 11; // deg/s auto spin
    let angle = 0;
    let speed = -BASE;
    let target = -BASE;
    let radius = 0;

    const measure = () => {
      const cardW = cards[0].offsetWidth;
      // Ring radius so neighbouring cards sit edge-to-edge with a small gap.
      radius = (cardW / 2) / Math.tan(Math.PI / N) + 48;
      cards.forEach((card, i) => {
        card.style.transform = `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)`;
      });
    };
    measure();
    window.addEventListener("resize", measure);

    // Cursor steers the spin: left half reverses, right half accelerates.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const n = ((e.clientX - r.left) / r.width - 0.5) * 2; // -1..1
      target = -(BASE + Math.abs(n) * 26) * Math.sign(n || 1);
    };
    const onLeave = () => {
      target = -BASE;
    };
    if (fine) {
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
    }

    const tick = (_t: number, deltaMS: number) => {
      speed += (target - speed) * 0.05;
      angle = (angle + (speed * deltaMS) / 1000) % 360;
      ring.style.transform = `translateZ(${-radius}px) rotateX(-5deg) rotateY(${angle}deg)`;
      for (let i = 0; i < N; i++) {
        const theta = ((i * step + angle) * Math.PI) / 180;
        const facing = Math.cos(theta); // 1 = facing viewer
        cards[i].style.opacity = `${0.3 + 0.7 * ((facing + 1) / 2)}`;
        cards[i].style.pointerEvents = facing > 0.25 ? "auto" : "none";
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", measure);
      if (fine) {
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [reduced]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);

  // Reduced motion: calm static grid, still clickable.
  if (reduced) {
    return (
      <>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {gallery.items.map((item) => (
            <button key={item.src} type="button" onClick={() => setLightbox(item)} className="overflow-hidden rounded-2xl border border-snow/25 bg-obsidian-900/45 p-1.5">
              <SmartImage src={item.src} alt={item.alt} className="aspect-[4/3] w-full rounded-xl" />
            </button>
          ))}
        </div>
        {mounted && createPortal(<Lightbox item={lightbox} onClose={() => setLightbox(null)} />, document.body)}
      </>
    );
  }

  return (
    <>
      <div
        ref={wrapRef}
        className="relative -mx-5 flex h-[250px] items-center justify-center overflow-hidden sm:-mx-8 sm:h-[350px] lg:h-[400px] [perspective:1900px]"
      >
        <div
          ref={ringRef}
          className="relative h-0 w-0 [transform-style:preserve-3d] will-change-transform"
        >
          {gallery.items.map((item) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setLightbox(item)}
              aria-label={`${item.alt} — büyüt`}
              className="absolute left-0 top-0 w-[210px] cursor-zoom-in overflow-hidden rounded-2xl border border-snow/25 bg-obsidian-900/45 p-1.5 sm:w-[310px] lg:w-[350px]"
            >
              <SmartImage
                src={item.src}
                alt={item.alt}
                className="pointer-events-none aspect-[4/3] w-full rounded-xl"
              />
            </button>
          ))}
        </div>
      </div>
      {mounted && createPortal(<Lightbox item={lightbox} onClose={() => setLightbox(null)} />, document.body)}
    </>
  );
}

