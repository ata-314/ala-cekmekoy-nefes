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
              <div className="glass relative max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl p-7 xl:p-8">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Formu kapat"
                  className="cta absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 hover:text-cream"
                >
                  ✕
                </button>
                <h2 className="font-display text-3xl text-cream">{form.title}</h2>
                <p className="mb-6 mt-1 pr-10 text-sm text-cream/65">{form.sub}</p>
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
              className="cta glass rounded-l-2xl border-r-0 px-3.5 py-6 text-sm font-bold tracking-[0.2em] text-champagne [writing-mode:vertical-rl]"
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
