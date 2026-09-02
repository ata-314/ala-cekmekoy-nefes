import { gallery } from "@/content/project";
import Gallery3D from "./Gallery3D";

export default function GalleryPhase() {
  return (
    <div className="flex h-full flex-col justify-center px-5 pb-16 pt-20 sm:px-8 sm:pb-0 sm:pt-0">
      <div data-reveal className="mb-4 max-w-2xl sm:mb-6">
        <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-mist-400">
          {gallery.eyebrow}
        </p>
        <h2 className="font-display text-3xl leading-tight text-snow sm:text-5xl">
          {gallery.heading}
        </h2>
      </div>
      <div data-reveal>
        <Gallery3D />
      </div>
    </div>
  );
}
