import { gallery } from "@/content/project";
import SmartImage from "@/components/SmartImage";

export default function GalleryPhase() {
  return (
    <div className="flex h-full flex-col justify-center px-5 sm:px-8">
      <div data-reveal className="mb-6 max-w-2xl sm:mb-8">
        <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-sand-400">
          {gallery.eyebrow}
        </p>
        <h2 className="font-display text-3xl leading-tight text-cream sm:text-5xl">
          {gallery.heading}
        </h2>
      </div>
      <div
        data-gallery-strip
        className="flex gap-4 overflow-x-auto pb-4 sm:gap-5 [scrollbar-width:thin]"
      >
        {gallery.items.map((item) => (
          <figure
            key={item.src}
            data-reveal
            className="glass-light w-[70vw] shrink-0 overflow-hidden rounded-2xl p-1.5 sm:w-[340px]"
          >
            <SmartImage
              src={item.src}
              alt={item.alt}
              className="aspect-[4/3] w-full rounded-xl"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
