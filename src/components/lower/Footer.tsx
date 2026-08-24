import Logo from "@/components/Logo";
import { identity, nav, form, footer } from "@/content/project";

/** Corporate footer — obsidian ground, white logotype, contact from the brand book. */
export default function Footer() {
  return (
    <footer className="border-t border-snow/10 bg-obsidian-950 px-5 pb-10 pt-16 text-snow sm:px-8 sm:pt-20">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo className="h-16" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-snow/60">
            {identity.tagline}
          </p>
        </div>

        <nav aria-label="Alt menü" className="flex flex-col items-start gap-3">
          <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-snow/40">
            Keşfet
          </p>
          {nav.items.map((item) => (
            <a
              key={item.anchor}
              href={`#${item.anchor}`}
              className="text-sm text-snow/75 transition-colors duration-300 hover:text-snow"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-snow/40">
            İletişim
          </p>
          <p className="max-w-xs text-sm leading-relaxed text-snow/75">{identity.address}</p>
          <a href={identity.phoneHref} className="text-sm font-semibold text-snow transition-colors hover:text-snow/80">
            T: {identity.phone}
          </a>
          <a href={`mailto:${identity.email}`} className="text-sm text-snow/75 transition-colors hover:text-snow">
            {identity.email}
          </a>
          <a
            href={`https://${identity.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-snow/75 transition-colors hover:text-snow"
          >
            {identity.website}
          </a>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-snow/10 pt-6">
        <p className="text-xs text-snow/45">{footer.legal}</p>
        <a href={form.kvkk.href} className="text-xs text-snow/45 underline-offset-2 transition-colors hover:text-snow/75 hover:underline">
          {footer.kvkkLabel}
        </a>
      </div>
    </footer>
  );
}
