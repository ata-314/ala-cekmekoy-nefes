"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  assets,
  advantages,
  brand,
  whyCekmekoy,
  info,
  editorial,
  galleryBelow,
  location,
  finalCta,
} from "@/content/project";
import MosaicGallery from "./MosaicGallery";
import SmartImage from "@/components/SmartImage";
import Footer from "./Footer";

const SNOW = "#f6f7fc";
const OBSIDIAN = "#00012e";

/**
 * Classic-flow sections below the pinned hero. One wrapper owns the page
 * background and MORPHS between snow and obsidian as themed sections reach
 * mid-viewport ("o bölüme gelince teması koyulaşsın"). Sections keep their
 * static bg classes as the no-JS / reduced-motion fallback; with motion on,
 * those are cleared and the wrapper takes over. Reveals, column parallax,
 * the brutalist stat reveal, the marquee and the map drift all run on
 * ScrollTriggers and are skipped under prefers-reduced-motion.
 */
export default function LowerSections({ onContact }: { onContact: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const root = rootRef.current;
      if (!root) return;

      /* Proje Bilgileri: pinned horizontal scrub. The whole train (giant
         single-line title + stat cards) starts off-screen right and travels
         left; cards enter from the right as the title exits. Pure scrub —
         perfectly reversible — and the pin releases when the tail arrives. */
      const hsec = root.querySelector<HTMLElement>("[data-stats-sec]");
      const train = root.querySelector<HTMLElement>("[data-htrain]");
      if (hsec && train) {
        gsap.fromTo(
          train,
          { x: () => window.innerWidth },
          {
            // Release with the last card resting at the right edge — the pin
            // lets go on a full composition, not an emptied screen.
            x: () => -(train.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: hsec,
              start: "top top",
              end: () => "+=" + Math.round(train.scrollWidth),
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      /* Theme morph: wrapper bg follows the section occupying mid-viewport.
         Driven by IntersectionObserver, NOT ScrollTrigger positions — the
         pinned horizontal section inserts a large pin spacer, and IO reads
         the real layout (pin included) so the dark theme holds through the
         whole pin without recalculation headaches. */
      gsap.set(root, { backgroundColor: SNOW });
      const themeSecs = gsap.utils.toArray<HTMLElement>("[data-theme-sec]");
      themeSecs.forEach((sec) => gsap.set(sec, { backgroundColor: "transparent" }));
      const themeIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const color =
              (e.target as HTMLElement).dataset.bg === "dark" ? OBSIDIAN : SNOW;
            gsap.to(root, {
              backgroundColor: color,
              duration: 1.1,
              ease: "power1.inOut",
              overwrite: "auto",
            });
          });
        },
        // A thin band around the viewport's middle: exactly one section wins.
        { rootMargin: "-49% 0px -49% 0px" }
      );
      themeSecs.forEach((sec) => themeIO.observe(sec));

      /* Staggered reveals per section */
      gsap.utils.toArray<HTMLElement>("[data-lsec]").forEach((sec) => {
        const els = sec.querySelectorAll("[data-lreveal]");
        if (!els.length) return;
        gsap.fromTo(
          els,
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: sec,
              start: "top 80%",
              end: "bottom 22%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });

      /* Editorial image parallax */
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -9 },
          {
            yPercent: 9,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      /* Mosaic gallery: columns drift at different speeds */
      gsap.utils.toArray<HTMLElement>("[data-mcol]").forEach((col) => {
        const speed = parseFloat(col.dataset.speed || "0");
        gsap.fromTo(
          col,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: "none",
            scrollTrigger: {
              trigger: "#galeri",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });


      /* Full-bleed map: slow settle + vertical drift */
      gsap.fromTo(
        "[data-map]",
        { scale: 1.18, yPercent: -5 },
        {
          scale: 1.02,
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: "#konum",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      ScrollTrigger.refresh();

      return () => themeIO.disconnect();
    },
    { scope: rootRef }
  );

  return (
    <div id="lower" ref={rootRef} className="relative z-20">
      {/* ---- 01 · Marka (light) ---- */}
      <section id="marka" data-lsec data-theme-sec data-bg="light" className="bg-snow px-5 py-24 text-obsidian-950 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div data-lreveal className="mb-12 flex items-center gap-4 text-[0.65rem] font-bold uppercase tracking-[0.4em] text-obsidian-950/45">
            <span className="border border-obsidian-950/25 px-2 py-1">01</span>
            {brand.eyebrow}
            <span className="h-px flex-1 bg-obsidian-950/15" />
          </div>
          {/* Image LEFT (the hero video lands on this exact frame), text RIGHT */}
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div data-lreveal className="overflow-hidden rounded-[28px] shadow-[0_40px_90px_-30px_rgba(0,1,46,0.4)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-parallax
                src={assets.videoEndFrame}
                alt={brand.mediaAlt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full scale-[1.16] object-cover lg:aspect-[16/12]"
              />
            </div>
            <div>
              <h2 data-lreveal className="font-display text-4xl leading-[1.12] sm:text-5xl">
                {brand.heading.split("\n").map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <div className="mt-7 flex flex-col gap-5">
                {brand.paragraphs.map((par) => (
                  <p key={par.slice(0, 24)} data-lreveal className="text-[0.95rem] leading-relaxed text-obsidian-950/75">
                    {par}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Icon strip — the project's four pillars */}
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:mt-14 lg:grid-cols-4">
            {advantages.items.map((item) => (
              <li key={item.title} data-lreveal className="flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-obsidian-950/15 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.icon.replace(".svg", "-ink.svg")} alt="" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold leading-tight">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-obsidian-950/60">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Neden Çekmeköy */}
          <div className="mt-20 sm:mt-28">
            <div data-lreveal className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-obsidian-950 pb-6">
              <div>
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-obsidian-950/50">
                  {whyCekmekoy.eyebrow}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl">{whyCekmekoy.heading}</h3>
              </div>
            </div>
            <ul className="grid gap-x-12 sm:grid-cols-2">
              {whyCekmekoy.items.map((item, i) => (
                <li
                  key={item}
                  data-lreveal
                  className="group flex items-baseline gap-5 border-b border-obsidian-950/10 py-5 transition-colors duration-300 hover:border-obsidian-950/50"
                >
                  <span className="text-xs font-bold tracking-widest text-obsidian-950/35 transition-colors group-hover:text-obsidian-950">
                    ({String(i + 1).padStart(2, "0")})
                  </span>
                  <span className="text-sm font-medium sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---- 02 · Proje Bilgileri — pinned horizontal scrub (dark) ---- */}
      <section
        data-theme-sec
        data-bg="dark"
        data-stats-sec
        aria-label={info.eyebrow}
        className="overflow-hidden bg-obsidian-950 text-snow"
      >
        <div className="relative flex h-[100svh] items-center overflow-hidden motion-reduce:h-auto motion-reduce:py-24">
          <div className="absolute left-5 top-24 flex items-center gap-4 text-[0.65rem] font-bold uppercase tracking-[0.4em] text-snow/45 sm:left-8 sm:top-28">
            <span className="rounded-full border border-snow/25 px-2 py-1">02</span>
            {info.eyebrow}
            <span className="h-px w-16 bg-snow/20 sm:w-28" />
          </div>
          <div
            data-htrain
            className="flex items-center gap-[12vw] will-change-transform motion-reduce:flex-wrap motion-reduce:gap-8 motion-reduce:px-5"
          >
            <h2 className="whitespace-nowrap font-sans text-[15vw] font-black uppercase leading-none tracking-[-0.03em] text-snow sm:text-[11vw] motion-reduce:whitespace-normal motion-reduce:text-5xl">
              A&apos;LÂ ÇEKMEKÖY NEFES
            </h2>
            {info.stats.map((stat, i) => (
              <article
                key={stat.label}
                className="glass relative w-[80vw] max-w-[420px] shrink-0 overflow-hidden rounded-[26px] bg-obsidian-900/45 p-8 sm:w-[420px] sm:p-10"
              >
                {/* top hairline accent */}
                <span
                  aria-hidden
                  className="absolute inset-x-8 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-snow/70 to-transparent"
                />
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-snow/25 px-3 py-1 text-[0.6rem] font-bold tracking-[0.25em] text-snow/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.35em] text-snow/45">
                    {stat.label}
                  </span>
                </div>
                <p className="mt-10 bg-gradient-to-b from-white to-mist-400 bg-clip-text font-sans text-6xl font-black leading-none tracking-[-0.04em] text-transparent sm:text-7xl">
                  {stat.value}
                </p>
                <span aria-hidden className="mt-8 block h-px w-full bg-snow/12" />
                <p className="mt-5 text-sm leading-relaxed text-snow/65">{stat.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- 03 · Yaşam / editorial (light) ---- */}
      <section id="yasam" data-lsec data-theme-sec data-bg="light" className="bg-snow px-5 py-24 text-obsidian-950 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div data-lreveal className="mb-12 flex items-center gap-4 text-[0.65rem] font-bold uppercase tracking-[0.4em] text-obsidian-950/45">
            <span className="border border-obsidian-950/25 px-2 py-1">02</span>
            {editorial.eyebrow}
            <span className="h-px flex-1 bg-obsidian-950/15" />
          </div>
          <h2 data-lreveal className="mb-16 font-display text-4xl leading-[1.12] sm:mb-24 sm:text-5xl">
            {editorial.heading.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <div className="flex flex-col gap-20 sm:gap-28">
            {editorial.rows.map((row, i) => (
              <article
                key={row.title}
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}
              >
                <div data-lreveal className="overflow-hidden rounded-3xl">
                  <SmartImage
                    data-parallax
                    src={row.image.src}
                    alt={row.image.alt}
                    className="aspect-[4/3] w-full scale-[1.18]"
                  />
                </div>
                <div>
                  <span data-lreveal className="text-xs font-bold tracking-widest text-obsidian-950/35">
                    ({String(i + 1).padStart(2, "0")})
                  </span>
                  <h3 data-lreveal className="mt-2 font-display text-3xl leading-snug sm:text-4xl">
                    {row.title}
                  </h3>
                  <p data-lreveal className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-obsidian-950/75">
                    {row.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- 04 · Galeri — mosaic (dark) ---- */}
      <section id="galeri" data-lsec data-theme-sec data-bg="dark" className="overflow-hidden bg-obsidian-950 px-5 py-24 text-snow sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div data-lreveal className="mb-12 flex items-center gap-4 text-[0.65rem] font-bold uppercase tracking-[0.4em] text-snow/45">
            <span className="border border-snow/30 px-2 py-1">03</span>
            {galleryBelow.eyebrow}
            <span className="h-px flex-1 bg-snow/15" />
          </div>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <h2 data-lreveal className="font-display text-4xl leading-tight sm:text-5xl">
              {galleryBelow.heading}
            </h2>
            <p data-lreveal className="max-w-[220px] text-right text-xs leading-relaxed text-snow/50">
              Görsele tıklayın, büyütün — tüm kareler tanıtım görselleştirmeleridir.
            </p>
          </div>
          <div data-lreveal>
            <MosaicGallery />
          </div>
        </div>
      </section>

      {/* ---- 05 · Konum — full-bleed map (light) ---- */}
      <section id="konum" data-lsec data-theme-sec data-bg="dark" className="relative overflow-hidden bg-obsidian-950 text-snow">
        {/* Map covers the whole section background */}
        <div className="absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-map
            src={location.mapImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover will-change-transform"
          />
          {/* Cinematic obsidian edges: the light map fades from/to the dark
              neighbouring sections instead of cutting hard */}
          <div className="absolute inset-0 bg-obsidian-950/[0.14]" />
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-obsidian-950 via-obsidian-950/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-obsidian-950 via-obsidian-950/55 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-obsidian-950/70 to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-center px-5 py-24 sm:px-8 sm:py-32">
          <div data-lreveal className="w-full max-w-md">
            <div className="glass rounded-[28px] bg-obsidian-900/55 p-7 text-snow sm:p-9">
              <div className="mb-6 flex items-center gap-4 text-[0.65rem] font-bold uppercase tracking-[0.4em] text-snow/50">
                <span className="rounded-full border border-snow/30 px-2 py-1">04</span>
                {location.eyebrow}
              </div>
              <h2 className="font-display text-3xl leading-[1.15] sm:text-4xl">
                {location.heading.split("\n").map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-snow/70">{location.body}</p>
              <ul className="mt-7">
                {location.pois.map((poi) => (
                  <li
                    key={poi.name}
                    className="group flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-snow/12 py-3 transition-colors duration-300 hover:border-snow/45"
                  >
                    <span className="text-[0.85rem] font-semibold">{poi.name}</span>
                    <span className="text-[0.7rem] text-snow/55">{poi.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 06 · CTA band (dark) ---- */}
      <section data-lsec data-theme-sec data-bg="dark" className="bg-obsidian-950 px-5 py-24 text-center text-snow sm:px-8 sm:py-32">
        <p data-lreveal className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-snow/50">
          {finalCta.eyebrow}
        </p>
        <h2 data-lreveal className="mx-auto max-w-3xl font-display text-4xl leading-[1.12] sm:text-6xl">
          {finalCta.heading.split("\n").map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p data-lreveal className="mx-auto mt-6 max-w-xl text-[0.95rem] leading-relaxed text-snow/70">
          {finalCta.body}
        </p>
        <div data-lreveal className="mt-10">
          <button
            type="button"
            onClick={onContact}
            className="cta rounded-full bg-accent px-9 py-4 text-sm font-bold tracking-wide text-obsidian-950"
          >
            {finalCta.cta}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
