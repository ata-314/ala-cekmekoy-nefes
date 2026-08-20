import Logo from "@/components/Logo";
import { identity } from "@/content/project";

export default function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
        <div className="pointer-events-auto">
          <Logo />
        </div>
        <a
          href={`tel:${identity.phone.replace(/\s/g, "")}`}
          className="cta glass-light pointer-events-auto rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-cream sm:px-5 sm:text-sm"
        >
          {identity.phoneDisplay}
        </a>
      </div>
    </header>
  );
}
