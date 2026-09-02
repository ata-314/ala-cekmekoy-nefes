import { closing } from "@/content/project";

export default function ClosingPhase({
  onCtaClick,
}: {
  onCtaClick?: () => void;
}) {
  return (
    <div className="flex h-full items-center justify-center px-5 pb-20 pt-20 sm:px-8 sm:pb-0 sm:pt-0">
      <div
        data-reveal
        className="glass max-w-xl rounded-3xl p-8 text-center sm:p-12"
      >
        <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-mist-400">
          {closing.eyebrow}
        </p>
        <h2 className="font-display text-4xl leading-tight text-snow sm:text-6xl">
          {closing.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-snow/75 sm:text-base">
          {closing.body}
        </p>
        {onCtaClick && (
          <button
            type="button"
            onClick={onCtaClick}
            className="cta mt-8 rounded-full bg-accent px-8 py-3.5 text-sm font-bold tracking-wide text-obsidian-950 lg:hidden"
          >
            {closing.cta}
          </button>
        )}
        <p className="mt-8 hidden text-[0.7rem] uppercase tracking-[0.3em] text-snow/45 lg:block">
          Yandaki formu doldurun, sizi arayalım
        </p>
      </div>
    </div>
  );
}
