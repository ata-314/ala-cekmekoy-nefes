"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/Logo";
import { nav } from "@/content/project";
import { scrollToAnchor, scrollToProgress } from "@/lib/lenisStore";

/**
 * Fixed menu bar with page-level wayfinding: a scroll progress hairline on
 * top, scrollspy highlighting of the section currently in view, smooth
 * anchor jumps, and a back-to-top control that appears once the visitor
 * leaves the opening screen. Mobile collapses into a hamburger dropdown
 * with the same affordances.
 */
export default function Header({ onContact }: { onContact: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  /* Progress hairline + back-to-top visibility (single rAF-throttled listener) */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${p})`;
      setShowTop(window.scrollY > window.innerHeight * 1.2);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Scrollspy: highlight the section crossing mid-viewport */
  useEffect(() => {
    const els = nav.items
      .map((i) => document.getElementById(i.anchor))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
          else
            setActive((cur) =>
              cur === e.target.id && e.boundingClientRect.top > 0 ? null : cur
            );
        });
      },
      { rootMargin: "-42% 0px -52% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (anchor: string) => {
    setMenuOpen(false);
    scrollToAnchor(anchor);
  };
  const goTop = () => {
    setMenuOpen(false);
    scrollToProgress(0);
  };

  const itemClass = (anchor: string) =>
    `rounded-full px-5 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
      active === anchor
        ? "bg-snow text-obsidian-950"
        : "text-snow/75 hover:bg-snow/10 hover:text-snow"
    }`;

  return (
    <>
      {/* Page progress hairline — pinned to the very top edge */}
      <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[2.5px] bg-snow/10">
        <div
          ref={progressRef}
          className="h-full origin-left bg-snow/80"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4 sm:top-5">
        {/* Apple-style floating pill: soft radius, centered, frosted */}
        <div className="glass flex w-full max-w-[46rem] items-center justify-between gap-3 rounded-full bg-obsidian-950/35 py-2.5 pl-6 pr-2.5 sm:gap-6 sm:pl-8 lg:max-w-[56rem]">
          <button
            type="button"
            onClick={goTop}
            aria-label="Başa dön"
            className="cursor-pointer"
          >
            <Logo className="h-11 sm:h-[3.25rem]" />
          </button>

          <span aria-hidden className="hidden h-6 w-px bg-snow/15 md:block" />

          {/* Desktop nav */}
          <nav aria-label="Site menüsü" className="hidden items-center gap-1.5 md:flex">
            {nav.items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => go(item.anchor)}
                aria-current={active === item.anchor ? "true" : undefined}
                className={itemClass(item.anchor)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onContact();
            }}
            className="cta hidden rounded-full bg-accent px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-obsidian-950 md:block"
          >
            {nav.contact}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-snow/15 md:hidden"
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
              className="absolute left-1/2 top-full mt-2 flex w-[calc(100vw-2.5rem)] max-w-sm -translate-x-1/2 flex-col overflow-hidden rounded-3xl border border-snow/15 bg-obsidian-900 p-2 shadow-[0_30px_70px_-20px_rgba(0,0,20,0.7)] md:hidden"
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
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-semibold uppercase tracking-[0.18em] transition-colors ${
                    active === item.anchor
                      ? "bg-snow/15 text-snow"
                      : "text-snow/85 hover:bg-snow/10"
                  }`}
                >
                  {item.label}
                  {active === item.anchor && (
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-snow" />
                  )}
                </button>
              ))}
              <button
                type="button"
                onClick={goTop}
                className="rounded-xl px-4 py-3.5 text-left text-sm font-semibold uppercase tracking-[0.18em] text-snow/60 transition-colors hover:bg-snow/10"
              >
                ↑ En Üste
              </button>
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

      {/* Back to top — appears after the opening screen */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={goTop}
            aria-label="Sayfanın başına dön"
            className="cta glass fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-obsidian-900/60 text-lg text-snow sm:bottom-7 sm:right-7"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
