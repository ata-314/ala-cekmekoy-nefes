"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { form } from "@/content/project";
import LeadForm from "./LeadForm";

/**
 * Mobile lead capture: floating CTA opens a bottom sheet.
 * framer-motion owns the sheet's enter/exit (GSAP never touches it).
 */
export default function MobileLeadSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    sheetRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="cta fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold tracking-wide text-obsidian-950 shadow-xl"
      >
        {form.submit}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Formu kapat"
              className="fixed inset-0 z-40 bg-obsidian-950/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
            />
            <motion.div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label={form.title}
              tabIndex={-1}
              className="glass fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-obsidian-900/70 p-6 pb-10 outline-none"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
            >
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-snow/25" aria-hidden />
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className="font-display text-2xl text-snow">{form.title}</h2>
                  <p className="mt-0.5 text-sm text-snow/65">{form.sub}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Kapat"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-snow/20 text-snow/70"
                >
                  ✕
                </button>
              </div>
              <LeadForm idPrefix="mobile" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
