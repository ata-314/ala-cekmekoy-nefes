"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
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

/**
 * Chooses between the scroll-choreographed stage and the reduced-motion
 * static layout. The lead panel/sheet live here so both variants share them.
 */
export default function Experience() {
  const reduced = usePrefersReducedMotion();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <SmoothScroll enabled={reduced === false} />
      <LeadPanel />
      <MobileLeadSheet open={sheetOpen} onOpenChange={setSheetOpen} />
      {reduced ? (
        <StaticExperience onCtaClick={() => setSheetOpen(true)} />
      ) : (
        <AnimatedStage onCtaClick={() => setSheetOpen(true)} />
      )}
    </>
  );
}

/**
 * The single fixed hero stage. A 620vh scroll track drives one scrubbed
 * timeline: the background video advances frame-by-frame while content
 * phases fade/translate in and out in sequence. The page never "flows down" —
 * everything happens inside the sticky viewport.
 */
function AnimatedStage({ onCtaClick }: { onCtaClick: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

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

      const phaseIn = (name: string, at: number) => {
        tl.fromTo(
          `[data-phase="${name}"]`,
          { autoAlpha: 0, y: 70 },
          { autoAlpha: 1, y: 0, duration: 6 },
          at
        ).fromTo(
          `[data-phase="${name}"] [data-reveal]`,
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 5, stagger: 0.9 },
          at + 1
        );
      };
      const phaseOut = (name: string, at: number) => {
        tl.to(
          `[data-phase="${name}"]`,
          { autoAlpha: 0, y: -60, duration: 5, ease: "power2.in" },
          at
        );
      };

      // Choreography over a 100-unit scrubbed timeline (≈ scroll progress %).
      phaseOut("intro", 6);
      phaseIn("info", 16);
      phaseOut("info", 34);
      phaseIn("advantages", 44);
      phaseOut("advantages", 62);
      phaseIn("gallery", 71);
      // Slow cinematic pan across the gallery strip while it is on stage.
      tl.fromTo(
        "[data-gallery-strip]",
        { x: 60 },
        { x: -80, duration: 16, ease: "none" },
        72
      );
      phaseOut("gallery", 84);
      phaseIn("closing", 92);
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
    },
    { scope: trackRef }
  );

  return (
    <div ref={trackRef} className="relative h-[620vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <ScrollVideo trackRef={trackRef} />

        {/* Each phase clears the fixed form on desktop (absolute children ignore parent padding) */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <section data-phase="intro" className="absolute inset-0 lg:pl-[420px] xl:pl-[450px]">
            <IntroPhase />
          </section>
          <section data-phase="info" className="absolute inset-0 lg:pl-[420px] xl:pl-[450px]">
            <InfoPhase />
          </section>
          <section data-phase="advantages" className="absolute inset-0 lg:pl-[420px] xl:pl-[450px]">
            <AdvantagesPhase />
          </section>
          <section data-phase="gallery" className="pointer-events-auto absolute inset-0 lg:pl-[420px] xl:pl-[450px]">
            <GalleryPhase />
          </section>
          <section data-phase="closing" className="pointer-events-auto absolute inset-0 lg:pl-[420px] xl:pl-[450px]">
            <ClosingPhase onCtaClick={onCtaClick} />
          </section>
        </div>

        {/* Scroll progress hairline */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-[2px] bg-cream/10">
          <div
            ref={progressRef}
            className="h-full origin-left bg-champagne"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
