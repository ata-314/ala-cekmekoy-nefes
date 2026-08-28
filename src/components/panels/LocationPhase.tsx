"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { mapCopy, PROJECT_LOCATION } from "@/content/mapData";

/* The MapLibre chunk only loads once the hero arms this phase. */
const VectorMap = dynamic(() => import("@/components/lower/VectorMap"), {
  ssr: false,
});

/**
 * Hero location phase: an Apple-style glass card that lands over the scrubbed
 * video and reveals the real project location. The card itself switches
 * instantly (glass never fades — it stutters); the arrival animation comes
 * from the map camera easing onto the project and the pin blooming in.
 *
 * The map here is deliberately non-interactive: gestures inside a pinned,
 * scroll-scrubbed stage would fight the choreography. Exploring happens in
 * the Konum section, one tap away via the CTA.
 */
export default function LocationPhase({
  armed,
  revealed,
  onExplore,
}: {
  armed: boolean;
  revealed: boolean;
  onExplore: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <div className="flex h-full items-center justify-center px-5 sm:px-8">
      <div className="glass w-full max-w-xl rounded-[28px] bg-obsidian-900/55 p-5 sm:p-7">
        <p className="mb-2.5 text-[0.62rem] font-bold uppercase tracking-[0.4em] text-snow/50">
          {mapCopy.heroPanel.eyebrow}
        </p>
        <h2 className="font-display text-2xl leading-[1.15] text-snow sm:text-[2rem]">
          {mapCopy.heroPanel.title.split("\n").map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <div className="ala-hero-map mt-5">
          {armed && !failed && (
            <VectorMap
              variant="compact"
              interactive={false}
              flightKey="hero"
              revealed={revealed}
              onReady={() => setReady(true)}
              onFail={() => setFailed(true)}
            />
          )}
          {(!armed || !ready) && !failed && (
            <div className="ala-hero-map-skeleton" aria-hidden />
          )}
          {failed && (
            <div className="ala-hero-map-fallback">
              {PROJECT_LOCATION.lat.toFixed(4)}° N · {PROJECT_LOCATION.lng.toFixed(4)}° E
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-[19rem] text-[0.7rem] leading-relaxed text-snow/60">
            {mapCopy.heroPanel.note}
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="cta shrink-0 rounded-full bg-accent px-5 py-2.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-obsidian-950"
          >
            {mapCopy.heroPanel.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
