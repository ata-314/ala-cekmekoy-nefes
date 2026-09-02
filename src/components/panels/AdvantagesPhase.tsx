import { advantages } from "@/content/project";
import AdvantageIcon from "./AdvantageIcon";

export default function AdvantagesPhase() {
  return (
    // Mobile guard padding keeps the list clear of the fixed header above and
    // the "Bilgi Al" pill below — the stage never scrolls inside a phase.
    <div className="flex h-full items-center justify-center px-5 pb-16 pt-24 sm:px-8 sm:pb-0 sm:pt-0">
      <div className="w-full max-w-2xl">
        <div data-reveal className="mb-4 sm:mb-8">
          <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-mist-400 sm:mb-3">
            {advantages.eyebrow}
          </p>
          <h2 className="font-display text-[1.6rem] leading-tight text-snow sm:text-5xl">
            {advantages.heading.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-4">
          {advantages.items.map((item) => (
            <li
              key={item.title}
              data-reveal
              className="glass flex items-start gap-3.5 rounded-2xl p-3.5 sm:gap-4 sm:p-5"
            >
              <AdvantageIcon src={item.icon} alt="" />
              <div>
                <h3 className="text-[0.8rem] font-semibold tracking-wide text-snow sm:text-sm">
                  {item.title}
                </h3>
                <p className="mt-1 text-[0.72rem] leading-[1.4] text-snow/70 sm:mt-1.5 sm:text-[0.8rem] sm:leading-relaxed">
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
