"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/Logo";
import { nav } from "@/content/project";
import { scrollToAnchor, scrollToProgress } from "@/lib/lenisStore";

/**
 * Fixed menu bar: logo left, glass nav right. Items smooth-scroll to their
 * phase of the experience; "Bilgi Al" scrolls to the closing phase and asks
 * the parent to reveal the form (side panel on desktop, sheet on mobile).
 * On mobile the nav collapses into a hamburger + animated glass dropdown.
 */
export default function Header({ onContact }: { onContact: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (anchor: string) => {
    setMenuOpen(false);
    scrollToAnchor(anchor);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      {/* Legibility scrim: keeps the white logo and nav readable over light sections */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-obsidian-950/80 via-obsidian-950/35 to-transparent"
      />
      <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            scrollToProgress(0);
          }}
          aria-label="Başa dön"
          className="pointer-events-auto cursor-pointer"
        >
          <Logo />
        </button>

        {/* Desktop nav */}
        <nav
          aria-label="Site menüsü"
          className="glass-light pointer-events-auto hidden items-center gap-1 rounded-full p-1.5 pl-2 md:flex"
        >
          {nav.items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => go(item.anchor)}
              className="rounded-full px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-snow/75 transition-colors duration-300 hover:bg-snow/10 hover:text-snow"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onContact();
            }}
            className="cta rounded-full bg-accent px-5 py-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-obsidian-950"
          >
            {nav.contact}
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
          className="glass-light pointer-events-auto flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full md:hidden"
        >
          <span
            className={`h-[1.5px] w-4.5 bg-snow transition-transform duration-300 ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-[1.5px] w-4.5 bg-snow transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-[1.5px] w-4.5 bg-snow transition-transform duration-300 ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Site menüsü"
            className="glass pointer-events-auto mx-5 flex flex-col overflow-hidden rounded-2xl p-2 md:hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            {nav.items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => go(item.anchor)}
                className="rounded-xl px-4 py-3.5 text-left text-sm font-semibold uppercase tracking-[0.18em] text-snow/85 transition-colors hover:bg-snow/10"
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onContact();
              }}
              className="cta mt-1 rounded-xl bg-accent px-4 py-3.5 text-left text-sm font-bold uppercase tracking-[0.18em] text-obsidian-950"
            >
              {nav.contact}
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
