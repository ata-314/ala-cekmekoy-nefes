"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { GalleryItem } from "@/content/project";

/** Fullscreen image lightbox — render through a portal to <body> so ancestor transforms can't trap it. */
export default function Lightbox({
  item,
  onClose,
}: {
  item: GalleryItem | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian-950/85 p-4 backdrop-blur-md sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.figure
            className="relative max-h-full max-w-5xl"
            initial={{ scale: 0.88, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 12 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              className="max-h-[82dvh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-sm text-snow/70">
              {item.alt}
            </figcaption>
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="cta absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-obsidian-950 shadow-lg"
            >
              ✕
            </button>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
