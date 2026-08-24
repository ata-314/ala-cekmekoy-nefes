"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
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

      // --frost rides along with the fade: backdrop blur ignores ancestor
      // opacity, so without this the glass "pops" in at full strength.
      const phaseIn = (name: string, at: number) => {
        tl.fromTo(
          `[data-phase="${name}"]`,
          { autoAlpha: 0, y: 70, "--frost": 0 },
          { autoAlpha: 1, y: 0, "--frost": 1, duration: 6 },
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
          { autoAlpha: 0, y: -60, "--frost": 0, duration: 5, ease: "power2.in" },
          at
        );
      };

      // Choreography over a 100-unit scrubbed timeline (≈ scroll progress %).
      // The last ~15 units belong to the hero→section hand-off: the video
      // holds its final frame (ScrollVideo endFraction 0.85) while the
      // full-screen frame shrinks into a rounded card over the snow ground,
      // drifts up, and the page releases into the Marka section — one
      // continuous, fully reversible scrub.
      phaseOut("intro", 5);
      phaseIn("info", 13);
      phaseOut("info", 26);
      phaseIn("advantages", 34);
      phaseOut("advantages", 47);
      phaseIn("gallery", 54);
      // (The 3D carousel drives its own motion — no scroll pan here.)
      phaseOut("gallery", 65);
      phaseIn("closing", 71);
      phaseOut("closing", 81);
      // The frame shrinks in place, then FLOWS DOWNWARD into section two:
      // by the release point it sits low in the viewport at the size/x of the
      // Marka section's opening image (the same final video frame), so the
      // natural scroll carries it out while the identical section image
      // follows it in — the card reads as passing into the section.
      tl.to(
        "[data-video-frame]",
        {
          scale: () => (window.innerWidth < 1024 ? 0.86 : 0.42),
          borderRadius: 28,
          boxShadow: "0 40px 90px -30px rgba(0,1,46,0.4)",
          duration: 9,
          ease: "power1.inOut",
        },
        85
      )
        .to(
          "[data-video-frame]",
          {
            x: () => (window.innerWidth < 1024 ? 0 : -window.innerWidth * 0.19),
            y: () => window.innerHeight * (window.innerWidth < 1024 ? 0.1 : 0.16),
            duration: 7,
            ease: "power1.inOut",
          },
          93
        )
        .to("[data-progress-bar]", { autoAlpha: 0, duration: 3 }, 85);
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
    <div ref={trackRef} className="relative h-[780vh]">
      {/* Snow ground shows around the video frame as it shrinks into a card */}
      <div className="sticky top-0 h-screen overflow-hidden bg-snow">
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
