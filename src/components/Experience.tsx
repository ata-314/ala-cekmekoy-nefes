"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import Header from "@/components/Header";
import LowerSections from "@/components/lower/LowerSections";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollVideo from "@/components/ScrollVideo";
import StaticExperience from "@/components/StaticExperience";
import LeadPanel from "@/components/form/LeadPanel";
import MobileLeadSheet from "@/components/form/MobileLeadSheet";
import IntroPhase from "@/components/panels/IntroPhase";
import InfoPhase from "@/components/panels/InfoPhase";
import AdvantagesPhase from "@/components/panels/AdvantagesPhase";
import GalleryPhase from "@/components/panels/GalleryPhase";
import ClosingPhase from "@/components/panels/ClosingPhase";
import LocationPhase from "@/components/panels/LocationPhase";
import { assets, brand } from "@/content/project";
import { scrollToAnchor } from "@/lib/lenisStore";

/**
 * Chooses between the scroll-choreographed stage and the reduced-motion
 * static layout. The lead panel/sheet live here so both variants share them.
 */
export default function Experience() {
  const reduced = usePrefersReducedMotion();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  // The desktop panel belongs to the hero experience: when the classic
  // sections scroll into view it folds away to the edge tab so it never
  // covers content — the user can reopen it anywhere.
  useEffect(() => {
    const lower = document.getElementById("lower");
    if (!lower) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setPanelOpen(false);
      },
      { rootMargin: "0px 0px -35% 0px" }
    );
    io.observe(lower);
    return () => io.disconnect();
  }, []);

  // "Bilgi Al": the side panel is fixed and site-wide on desktop — just make
  // sure it's open; mobile opens the bottom sheet.
  const handleContact = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setPanelOpen(true);
    } else {
      setSheetOpen(true);
    }
  };

  return (
    <>
      <Header onContact={handleContact} />
      <SmoothScroll enabled={reduced === false} />
      <LeadPanel open={panelOpen} onOpenChange={setPanelOpen} />
      <MobileLeadSheet open={sheetOpen} onOpenChange={setSheetOpen} />
      {reduced ? (
        <StaticExperience onCtaClick={() => setSheetOpen(true)} />
      ) : (
        <AnimatedStage
          onCtaClick={() => setSheetOpen(true)}
          panelOpen={panelOpen}
        />
      )}
      {/* Classic-flow content continues after the hero experience ends */}
      <LowerSections onContact={handleContact} />
    </>
  );
}

/**
 * The single fixed hero stage. A 620vh scroll track drives one scrubbed
 * timeline: the background video advances frame-by-frame while content
 * phases fade/translate in and out in sequence. The page never "flows down" —
 * everything happens inside the sticky viewport.
 */
function AnimatedStage({
  onCtaClick,
  panelOpen,
}: {
  onCtaClick: () => void;
  panelOpen: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  /* The hero map mounts early (warm tiles) and only flies when its phase
     actually lands, so the reveal reads as one motion with the panel. */
  const [mapArmed, setMapArmed] = useState(false);
  const [mapRevealed, setMapRevealed] = useState(false);
  // Phases clear the fixed form on the right while it is open; the padding
  // eases away when the panel is dismissed so content re-centers.
  const phaseClass = `absolute inset-0 transition-[padding] duration-700 ease-out ${
    panelOpen ? "lg:pr-[420px] xl:pr-[450px]" : ""
  }`;

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      // Hidden until their scroll segment; intro is visible immediately.
      gsap.set('[data-phase]:not([data-phase="intro"])', { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
        },
      });

      // Glass panels never animate: fading/translating an element that owns
      // a backdrop-filter forces per-frame blur repaints — the stutter and
      // the "late" feel. Phases now switch instantly at their scrub marks,
      // arriving fully frosted; reversal is equally instant.
      const phaseIn = (name: string, at: number) => {
        tl.set(`[data-phase="${name}"]`, { autoAlpha: 1 }, at);
      };
      const phaseOut = (name: string, at: number) => {
        tl.set(`[data-phase="${name}"]`, { autoAlpha: 0 }, at);
      };

      // Choreography over a 100-unit scrubbed timeline (≈ scroll progress %).
      // The last ~15 units belong to the hero→section hand-off: the video
      // holds its final frame (ScrollVideo endFraction 0.85) while the
      // full-screen frame shrinks into a rounded card over the snow ground,
      // drifts up, and the page releases into the Marka section — one
      // continuous, fully reversible scrub.
      phaseOut("intro", 5);
      phaseIn("info", 11);
      phaseOut("info", 21);
      phaseIn("advantages", 27);
      phaseOut("advantages", 38);
      phaseIn("gallery", 43);
      // (The 3D carousel drives its own motion — no scroll pan here.)
      phaseOut("gallery", 55);
      /* The location panel holds the longest: its map flies in from a
         Türkiye-wide view and stays pannable while it is on stage. */
      phaseIn("location", 59);
      phaseOut("location", 78);
      phaseIn("closing", 80);
      phaseOut("closing", 84);

      /* Mount the hero map well before its phase (tiles need a head start),
         then trigger its camera exactly as the panel lands.

         These offsets are fractions of the SCRUBBED distance, matching the
         timeline's 0–100 units — a percentage start like "57% top" is a
         fraction of the track's full height instead and fires far too late. */
      const scrubbed = () => track.offsetHeight - window.innerHeight;
      ScrollTrigger.create({
        trigger: track,
        start: () => `top top-=${scrubbed() * 0.3}`,
        once: true,
        invalidateOnRefresh: true,
        onEnter: () => setMapArmed(true),
      });
      ScrollTrigger.create({
        trigger: track,
        start: () => `top top-=${scrubbed() * 0.575}`,
        once: true,
        invalidateOnRefresh: true,
        onEnter: () => setMapRevealed(true),
      });
      /* ---- Hand-off: the video's last frame TRANSFERS into the Marka
         section and becomes its image.

         Desktop (lg): at 85 the stage frame swaps to an identical
         viewport-FIXED clone (same pixels — the extracted last frame).
         Marka overlaps the hero's tail (motion-safe -100svh margin) and
         slides up underneath while the fixed clone shrinks straight into
         the measured rect of the section's image slot; at the release
         point the clone swaps into the real in-flow slot image. One
         continuous, scrub-reversible journey of a single visual.

         Mobile: single column — the stage frame simply shrinks and flows
         down; the slot image is always visible below. */
      const lgQ = () => window.innerWidth >= 1024;
      const marka = document.getElementById("marka");
      const slot = document.querySelector<HTMLElement>("[data-marka-slot]");
      const slotImg = document.querySelector<HTMLElement>("[data-marka-img]");
      const flip = document.querySelector<HTMLElement>("[data-flip-frame]");

      // The slot mirrors the viewport's aspect on lg so the frame's crop
      // matches pixel-for-pixel at the swap.
      const setRatio = () => {
        if (!slot) return;
        if (lgQ())
          slot.style.aspectRatio = `${window.innerWidth} / ${window.innerHeight}`;
        else slot.style.removeProperty("aspect-ratio");
      };
      setRatio();
      ScrollTrigger.addEventListener("refreshInit", () => {
        if (slotImg && !lgQ()) gsap.set(slotImg, { autoAlpha: 1 });
      });
      ScrollTrigger.addEventListener("refreshInit", setRatio);

      const slotTarget = () => {
        if (!lgQ() || !marka || !slot) return null;
        const m = marka.getBoundingClientRect();
        const sl = slot.getBoundingClientRect();
        // At the release point Marka's top sits exactly at the viewport top,
        // so the slot's layout offset inside Marka IS its viewport rect then.
        return {
          scale: sl.width / window.innerWidth,
          cx: sl.left + sl.width / 2,
          cy: sl.top - m.top + sl.height / 2,
        };
      };

      // Visibility of clone vs slot image is owned by the TIMELINE alone —
      // a separate ScrollTrigger swap raced the lagging scrub on fast jumps
      // (menu anchors) and left the clone stranded over later sections.
      const applyInit = () => {
        if (slotImg) gsap.set(slotImg, { autoAlpha: lgQ() ? 0 : 1 });
        if (slot) gsap.set(slot, { boxShadow: lgQ() ? "none" : "" });
      };
      applyInit();

      // Mobile: stage frame shrinks in place and flows down (no swap).
      tl.to(
        "[data-video-frame]",
        {
          scale: () => (lgQ() ? 1 : 0.86),
          y: () => (lgQ() ? 0 : window.innerHeight * 0.1),
          borderRadius: () => (lgQ() ? 0 : 28),
          duration: 14,
          ease: "power1.inOut",
        },
        85
      );
      // Desktop: swap stage frame → fixed clone, then fly the clone into
      // the slot rect (scale/x/y/borderRadius all measured, so it lands
      // exactly where the section image lives).
      if (flip) {
        tl.set("[data-video-frame]", { autoAlpha: () => (lgQ() ? 0 : 1) }, 85)
          .set(flip, { autoAlpha: () => (lgQ() ? 1 : 0) }, 85)
          .fromTo(
            flip,
            { scale: 1, x: 0, y: 0, borderRadius: 0 },
            {
              scale: () => slotTarget()?.scale ?? 0.4,
              x: () => {
                const t = slotTarget();
                return t ? t.cx - window.innerWidth / 2 : 0;
              },
              y: () => {
                const t = slotTarget();
                return t ? t.cy - window.innerHeight / 2 : 0;
              },
              borderRadius: () => {
                const t = slotTarget();
                return t ? 28 / t.scale : 28;
              },
              boxShadow: "0 40px 90px -30px rgba(0,1,46,0.4)",
              duration: 14,
              ease: "power1.inOut",
            },
            85
          );
      }
      tl.to("[data-progress-bar]", { autoAlpha: 0, duration: 3 }, 85);
      // Land: clone hands over to the in-flow slot image (and its shadow)
      // right at the end of the scrub — fully reversible, race-free.
      if (flip) {
        tl.set(flip, { autoAlpha: 0 }, 99.6)
          .set(slotImg, { autoAlpha: () => (lgQ() ? 1 : 1) }, 99.6)
          .set(
            slot,
            {
              boxShadow: () =>
                lgQ() ? "0 40px 90px -30px rgba(0,1,46,0.4)" : "",
            },
            99.6
          );
      }
      tl.to({}, { duration: 1 }, 99); // pin timeline length to 100 units

      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: track,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      }

      return () => ScrollTrigger.removeEventListener("refreshInit", setRatio);
    },
    { scope: trackRef }
  );

  return (
    <div ref={trackRef} className="relative h-[780vh]">
      {/* Viewport-fixed clone of the video's last frame — carries the visual
          from the hero into the Marka slot on desktop. Hidden until 85%. */}
      <div
        data-flip-frame
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[25] overflow-hidden opacity-0 will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assets.videoEndFrame}
          alt={brand.mediaAlt}
          className="h-full w-full object-cover"
        />
      </div>
      {/* Snow ground shows around the video frame as it shrinks into a card.
          dvh: mobile URL bars shrink the visible viewport — 100vh would push
          the phase content and progress bar behind the browser chrome. */}
      <div className="sticky top-0 h-dvh overflow-hidden bg-snow">
        <div
          data-video-frame
          className="absolute inset-0 overflow-hidden will-change-transform"
        >
          <ScrollVideo trackRef={trackRef} endFraction={0.85} />
        </div>

        {/* Each phase clears the fixed form on desktop (absolute children ignore parent padding) */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <section data-phase="intro" className={phaseClass}>
            <IntroPhase />
          </section>
          <section data-phase="info" className={phaseClass}>
            <InfoPhase />
          </section>
          <section data-phase="advantages" className={phaseClass}>
            <AdvantagesPhase />
          </section>
          {/* Gallery ignores the form clearance: the cylinder spans the full
              stage width and simply passes behind the glass panel. */}
          <section data-phase="gallery" className="pointer-events-auto absolute inset-0">
            <GalleryPhase />
          </section>
          <section data-phase="location" className={`pointer-events-auto ${phaseClass}`}>
            <LocationPhase
              armed={mapArmed}
              revealed={mapRevealed}
              onExplore={() => scrollToAnchor("konum")}
            />
          </section>
          <section data-phase="closing" className={`pointer-events-auto ${phaseClass}`}>
            <ClosingPhase onCtaClick={onCtaClick} />
          </section>
        </div>

        {/* Scroll progress hairline */}
        <div data-progress-bar className="absolute inset-x-0 bottom-0 z-20 h-[2px] bg-snow/10">
          <div
            ref={progressRef}
            className="h-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
