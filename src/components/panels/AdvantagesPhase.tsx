import { advantages } from "@/content/project";
import AdvantageIcon from "./AdvantageIcon";

export default function AdvantagesPhase() {
  return (
    <div className="flex h-full items-center justify-center px-5 sm:px-8">
      <div className="w-full max-w-2xl">
        <div data-reveal className="mb-6 sm:mb-8">
          <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-sand-400">
            {advantages.eyebrow}
          </p>
          <h2 className="font-display text-3xl leading-tight text-cream sm:text-5xl">
            {advantages.heading.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {advantages.items.map((item) => (
            <li
              key={item.title}
              data-reveal
              className="glass flex items-start gap-4 rounded-2xl p-5"
            >
              <AdvantageIcon src={item.icon} alt="" />
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-cream">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[0.8rem] leading-relaxed text-cream/70">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
