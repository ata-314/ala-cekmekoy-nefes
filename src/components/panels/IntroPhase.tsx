import { intro, identity } from "@/content/project";

export default function IntroPhase() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <p
        data-reveal
        className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-sand-400"
      >
        {intro.eyebrow}
      </p>
      <h1
        data-reveal
        className="font-display text-[2.6rem] leading-[1.08] text-cream sm:text-7xl lg:text-8xl"
      >
        <span className="sr-only">{identity.name} — </span>
        {intro.heading.split("\n").map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <div
        data-reveal
        className="mt-12 flex flex-col items-center gap-3 text-cream/60"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.35em]">
          {intro.sub}
        </span>
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-cream/25 p-1.5">
          <span className="scroll-hint-dot block h-1.5 w-1.5 rounded-full bg-champagne" />
        </span>
      </div>
    </div>
  );
}
