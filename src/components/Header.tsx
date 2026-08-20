import Logo from "@/components/Logo";
import { identity } from "@/content/project";

export default function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
        <div className="pointer-events-auto">
          <Logo />
        </div>
        <span className="glass-light rounded-full px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sand-300 sm:px-5 sm:text-xs">
          {identity.headerBadge}
        </span>
      </div>
    </header>
  );
}
