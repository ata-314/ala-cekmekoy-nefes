import { info } from "@/content/project";

export default function InfoPhase() {
  return (
    <div className="flex h-full items-center justify-center px-5 sm:px-8">
      <div
        data-reveal
        className="glass w-full max-w-xl rounded-3xl p-7 sm:p-10"
      >
        <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-sand-400">
          {info.eyebrow}
        </p>
        <h2 className="font-display text-3xl leading-tight text-cream sm:text-5xl">
          {info.heading.split("\n").map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75 sm:text-base">
          {info.body}
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {info.stats.map((stat) => (
            <div key={stat.label} data-reveal>
              <dd className="font-display text-2xl text-champagne sm:text-3xl">
                {stat.value}
              </dd>
              <dt className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-cream/55">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
