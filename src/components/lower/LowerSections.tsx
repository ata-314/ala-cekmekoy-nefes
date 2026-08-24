"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  brand,
  whyCekmekoy,
  info,
  identity,
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

      /* Theme morph: wrapper bg follows the section occupying mid-viewport. */
      gsap.set(root, { backgroundColor: SNOW });
      gsap.utils.toArray<HTMLElement>("[data-theme-sec]").forEach((sec) => {
        gsap.set(sec, { backgroundColor: "transparent" });
        const color = sec.dataset.bg === "dark" ? OBSIDIAN : SNOW;
        ScrollTrigger.create({
          trigger: sec,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: (self) => {
            if (self.isActive)
              gsap.to(root, {
                backgroundColor: color,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto",
              });
          },
        });
      });

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
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: sec, start: "top 74%" },
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

      /* Brutalist stats: numerals punch up from their clip masks + marquee drift */
      gsap.fromTo(
        "[data-stat]",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-stats-sec]", start: "top 62%" },
        }
      );
      gsap.fromTo(
        "[data-marquee]",
        { xPercent: 4 },
        {
          xPercent: -22,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-stats-sec]",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

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
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
            <h2 data-lreveal className="font-display text-4xl leading-[1.12] sm:text-5xl lg:text-6xl">
              {brand.heading.split("\n").map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div className="flex flex-col gap-5 lg:pt-4">
              {brand.paragraphs.map((par) => (
                <p key={par.slice(0, 24)} data-lreveal className="text-[0.95rem] leading-relaxed text-obsidian-950/75">
                  {par}
                </p>
              ))}
            </div>
          </div>

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

      {/* ---- 02 · Rakamlar — brutalist (dark) ---- */}
      <section
        data-lsec
        data-theme-sec
        data-bg="dark"
        data-stats-sec
        className="overflow-hidden bg-obsidian-950 py-24 text-snow sm:py-32"
      >
        {/* Outlined marquee */}
        <div className="pointer-events-none select-none whitespace-nowrap" aria-hidden>
          <p
            data-marquee
            className="font-sans text-[16vw] font-black uppercase leading-none tracking-[-0.03em] text-transparent sm:text-[11vw] [-webkit-text-stroke:1.5px_rgba(246,247,252,0.22)]"
          >
            {`${identity.shortName} — A'LÂ ÇEKMEKÖY — ${identity.shortName} — A'LÂ ÇEKMEKÖY — ${identity.shortName}`}
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-7xl border-y-[3px] border-snow px-0 sm:mt-20">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {info.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`relative px-6 py-10 sm:px-8 sm:py-14 ${i > 0 ? "border-t-2 border-snow/25 sm:border-t-0 sm:border-l-2" : ""}`}
              >
                <span className="absolute right-4 top-4 text-[0.6rem] font-bold tracking-[0.25em] text-snow/35">
                  ({String(i + 1).padStart(2, "0")})
                </span>
                <div className="overflow-hidden">
                  <dd
                    data-stat
                    className="font-sans text-5xl font-black leading-none tracking-[-0.04em] text-snow sm:text-6xl xl:text-7xl"
                  >
                    {stat.value}
                  </dd>
                </div>
                <dt className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.35em] text-snow/55">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
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
      <section id="konum" data-lsec data-theme-sec data-bg="light" className="relative overflow-hidden bg-snow text-obsidian-950">
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
          {/* Corporate wash so the light map sits in the identity, not on top of it */}
          <div className="absolute inset-0 bg-obsidian-950/[0.06]" />
          <div className="absolute inset-0 bg-gradient-to-r from-snow/80 via-snow/20 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-snow to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-snow to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-center px-5 py-24 sm:px-8 sm:py-32">
          <div data-lreveal className="w-full max-w-md">
            <div className="bg-obsidian-950 p-7 text-snow shadow-[0_40px_90px_-30px_rgba(0,1,46,0.5)] sm:p-9">
              <div className="mb-6 flex items-center gap-4 text-[0.65rem] font-bold uppercase tracking-[0.4em] text-snow/45">
                <span className="border border-snow/30 px-2 py-1">04</span>
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
