"use client";

import { AnimatePresence, motion } from "framer-motion";
import { form } from "@/content/project";
import LeadForm from "./LeadForm";

/**
 * Desktop lead panel — fixed on the RIGHT edge, dismissible via the close
 * icon and re-openable from an edge tab. framer-motion owns the enter/exit
 * (GSAP never touches these transforms). Positioning lives on plain wrapper
 * divs so motion's inline transform can't fight Tailwind translate classes.
 */
export default function LeadPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <div className="hidden lg:block">
      <AnimatePresence>
        {open && (
          <div className="pointer-events-none fixed inset-y-0 right-6 z-30 flex items-center xl:right-10">
            <motion.aside
              aria-label={form.title}
              className="pointer-events-auto w-[350px] xl:w-[380px]"
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
            >
              <div className="relative max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[28px] border border-snow/14 bg-obsidian-900/95 p-7 shadow-[0_30px_80px_-24px_rgba(0,0,20,0.7)] xl:p-8">
                {/* Champagne accent hairline */}
                <div
                  aria-hidden
                  className="absolute inset-x-8 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-accent/80 to-transparent"
                />
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Formu kapat"
                  className="cta absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-snow/20 text-snow/70 hover:text-snow"
                >
                  ✕
                </button>
                <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-mist-400">
                  ALA Çekmeköy Nefes
                </p>
                <h2 className="font-display text-3xl text-snow">{form.title}</h2>
                <p className="mb-6 mt-1.5 pr-10 text-sm leading-relaxed text-snow/65">
                  {form.sub}
                </p>
                <LeadForm idPrefix="desktop" />
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && (
          <div className="fixed right-0 top-1/2 z-30 -translate-y-1/2">
            <motion.button
              type="button"
              onClick={() => onOpenChange(true)}
              aria-label={`${form.title} panelini aç`}
              className="cta rounded-l-2xl border border-r-0 border-snow/15 bg-obsidian-900/95 px-3.5 py-6 text-sm font-bold tracking-[0.2em] text-accent [writing-mode:vertical-rl]"
              initial={{ x: 64, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 64, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
            >
              {form.submit}
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
