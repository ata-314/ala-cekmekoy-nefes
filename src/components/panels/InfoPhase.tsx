import { info } from "@/content/project";

export default function InfoPhase() {
  return (
    <div className="flex h-full items-center justify-center px-5 pb-20 pt-20 sm:px-8 sm:pb-0 sm:pt-0">
      <div
        data-reveal
        className="glass w-full max-w-xl rounded-3xl p-6 sm:p-10"
      >
        <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-mist-400">
          {info.eyebrow}
        </p>
        <h2 className="font-display text-3xl leading-tight text-snow sm:text-5xl">
          {info.heading.split("\n").map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-snow/75 sm:text-base">
          {info.body}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:mt-8 sm:grid-cols-4 sm:gap-y-5">
          {info.stats.map((stat) => (
            <div key={stat.label} data-reveal>
              <dd className="font-display text-2xl text-accent sm:text-3xl">
                {stat.value}
              </dd>
              <dt className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-snow/55">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
