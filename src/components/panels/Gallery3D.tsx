"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { gallery, type GalleryItem } from "@/content/project";
import SmartImage from "@/components/SmartImage";

/**
 * 3D coverflow carousel: an endless, scrollbar-free strip that drifts on its
 * own (GSAP ticker), wraps seamlessly (items rendered twice), and angles each
 * card in perspective based on its distance from center. On fine pointers the
 * cursor steers the drift speed/direction; clicking a card opens a lightbox
 * (framer-motion, portaled to <body> so ancestor transforms can't trap it).
 * Card positions are computed mathematically — no per-frame rect reads.
 */
const subscribeNoop = () => () => {};
const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function Gallery3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  // Hydration-safe flags without effect-driven setState.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || reduced) return;

    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards.length) return;

    const BASE = 42; // px/s auto drift
    let x = 0;
    let speed = BASE;
    let target = BASE;
    let cardW = 0;
    let gap = 0;
    let halfW = 0;
    let wrapW = 0;

    const measure = () => {
      cardW = cards[0].offsetWidth;
      gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
      halfW = (cards.length / 2) * (cardW + gap);
      wrapW = wrap.offsetWidth;
    };
    measure();
    window.addEventListener("resize", measure);

    // Cursor steers the drift: left half slows/reverses, right half speeds up.
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const n = ((e.clientX - r.left) / r.width - 0.5) * 2; // -1..1
      target = BASE + n * 150;
    };
    const onLeave = () => {
      target = BASE;
    };
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) {
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
    }

    const tick = (_t: number, deltaMS: number) => {
      speed += (target - speed) * 0.06;
      x = (((x + (speed * deltaMS) / 1000) % halfW) + halfW) % halfW;
      track.style.transform = `translate3d(${-x}px,0,0)`;

      const mid = wrapW / 2;
      for (let i = 0; i < cards.length; i++) {
        let center = i * (cardW + gap) + cardW / 2 - x;
        // Bring the duplicate set's cards into the visible wrap window.
        if (center < -cardW) center += halfW * 2;
        const n = Math.max(-1.4, Math.min(1.4, (center - mid) / mid));
        const a = Math.min(Math.abs(n), 1);
        cards[i].style.transform =
          `rotateY(${(-n * 26).toFixed(2)}deg) translateZ(${((1 - a) * 110).toFixed(1)}px) scale(${(0.9 + (1 - a) * 0.12).toFixed(3)})`;
        cards[i].style.opacity = `${0.45 + (1 - a) * 0.55}`;
        cards[i].style.zIndex = `${100 - Math.round(a * 60)}`;
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
            <button key={item.src} type="button" onClick={() => setLightbox(item)} className="glass-light overflow-hidden rounded-2xl p-1.5">
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
        className="relative -mx-5 overflow-hidden py-6 sm:-mx-8 [perspective:1200px]"
      >
        <div
          ref={trackRef}
          className="flex w-max gap-5 [transform-style:preserve-3d] will-change-transform"
        >
          {[...gallery.items, ...gallery.items].map((item, i) => (
            <button
              key={`${item.src}-${i}`}
              type="button"
              onClick={() => setLightbox(item)}
              aria-label={`${item.alt} — büyüt`}
              tabIndex={i < gallery.items.length ? 0 : -1}
              className="glass-light w-[240px] shrink-0 cursor-zoom-in overflow-hidden rounded-2xl p-1.5 [transform-style:preserve-3d] sm:w-[320px]"
            >
              <SmartImage
                src={item.src}
                alt={item.alt}
                className="pointer-events-none aspect-[4/3] w-full rounded-xl"
              />
            </button>
          ))}
        </div>
        {/* Soft edge fades instead of scrollbars */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-forest-950/50 to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-forest-950/50 to-transparent sm:w-28" />
      </div>
      {mounted && createPortal(<Lightbox item={lightbox} onClose={() => setLightbox(null)} />, document.body)}
    </>
  );
}

function Lightbox({
  item,
  onClose,
}: {
  item: GalleryItem | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-950/85 p-4 backdrop-blur-md sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.figure
            className="relative max-h-full max-w-5xl"
            initial={{ scale: 0.88, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              className="max-h-[82dvh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-sm text-cream/70">
              {item.alt}
            </figcaption>
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="cta absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-champagne text-forest-950 shadow-lg"
            >
              ✕
            </button>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
