import { assets } from "@/content/project";
import IntroPhase from "@/components/panels/IntroPhase";
import InfoPhase from "@/components/panels/InfoPhase";
import AdvantagesPhase from "@/components/panels/AdvantagesPhase";
import GalleryPhase from "@/components/panels/GalleryPhase";
import ClosingPhase from "@/components/panels/ClosingPhase";

/**
 * prefers-reduced-motion layout: no smooth scroll, no scrubbing, no pinned
 * stage. The same content renders as normally flowing full-height sections
 * over a still poster — everything reachable with plain scrolling.
 */
export default function StaticExperience({
  onCtaClick,
}: {
  onCtaClick: () => void;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="fixed inset-0 bg-gradient-to-b from-obsidian-800 via-obsidian-900 to-obsidian-950 bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.heroPoster})` }}
      />
      <div aria-hidden className="fixed inset-0 bg-obsidian-950/60" />
      <div className="relative z-10 lg:pr-[420px] xl:pr-[450px]">
        <section className="min-h-svh">
          <IntroPhase />
        </section>
        <section className="min-h-svh">
          <InfoPhase />
        </section>
        <section className="min-h-svh">
          <AdvantagesPhase />
        </section>
        <section className="min-h-svh">
          <GalleryPhase />
        </section>
        <section className="min-h-svh">
          <ClosingPhase onCtaClick={onCtaClick} />
        </section>
      </div>
    </div>
  );
}
