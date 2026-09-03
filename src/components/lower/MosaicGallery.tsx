"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { gallery, type GalleryItem } from "@/content/project";
import SmartImage from "@/components/SmartImage";
import Lightbox from "@/components/Lightbox";

const subscribeNoop = () => () => {};

/**
 * Editorial mosaic for the lower gallery section: three columns that drift at
 * different speeds while scrolling (parallax handled by LowerSections via
 * [data-mcol]/[data-speed]), varied aspect ratios for rhythm, index tags,
 * hover zoom + caption, click → lightbox.
 */
export default function MosaicGallery() {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const columns: { items: { item: GalleryItem; index: number }[]; speed: number }[] = [
    { items: [], speed: -7 },
    { items: [], speed: 9 },
    { items: [], speed: -12 },
  ];
  gallery.items.forEach((item, i) => {
    columns[i % 3].items.push({ item, index: i });
  });

  /* Desktop rhythm: varied ratios per column. Mobile: the columns dissolve
     (display: contents) into one ordered 2-up grid — 01 as a full-width
     opener, then four tidy pairs — so no image is ever orphaned by the
     column split or drifted apart by the column parallax (md+ only). */
  const mdRatios = ["md:aspect-[3/4]", "md:aspect-[4/3]", "md:aspect-square"];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
        {columns.map((col, c) => (
          <div
            key={c}
            data-mcol
            data-speed={col.speed}
            className={`contents md:flex md:flex-col md:gap-6 ${c === 1 ? "md:mt-16" : ""} ${c === 2 ? "md:mt-32" : ""}`}
          >
            {col.items.map(({ item, index }) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setLightbox(item)}
                aria-label={`${item.alt} — büyüt`}
                style={{ order: index }}
                className={`group relative block cursor-zoom-in overflow-hidden rounded-xl text-left md:order-none ${
                  index === 0 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  className={`w-full ${index === 0 ? "aspect-[16/10]" : "aspect-square"} ${mdRatios[(index + c) % 3]} transition-transform duration-700 ease-out group-hover:scale-[1.06]`}
                />
                {/* Index tag — brutalist corner marker */}
                <span className="absolute left-3 top-3 border border-snow/40 bg-obsidian-950/45 px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.2em] text-snow backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* Caption reveal */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-obsidian-950/85 to-transparent px-4 pb-3.5 pt-10 text-xs font-medium leading-snug text-snow opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.alt}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
      {mounted && createPortal(<Lightbox item={lightbox} onClose={() => setLightbox(null)} />, document.body)}
    </>
  );
}
