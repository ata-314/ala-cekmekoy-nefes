"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  brand,
  whyCekmekoy,
  info,
  editorial,
  galleryBelow,
  location,
  finalCta,
} from "@/content/project";
import Gallery3D from "@/components/panels/Gallery3D";
import SmartImage from "@/components/SmartImage";
import Footer from "./Footer";

/**
 * Classic-flow sections below the pinned hero experience, in corporate
 * obsidian + white. Each `[data-lsec]` block reveals its `[data-lreveal]`
 * children as it scrolls in; editorial images drift in a slow parallax and
 * the location map settles from a gentle over-zoom. All ScrollTriggers are
 * skipped under prefers-reduced-motion (content simply renders visible).
 */
export default function LowerSections({ onContact }: { onContact: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

      gsap.fromTo(
        "[data-map]",
        { scale: 1.1 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-map-wrap]",
            start: "top bottom",
            end: "center 45%",
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
      {/* ---- Marka (light) ---- */}
      <section id="marka" data-lsec className="bg-snow px-5 py-24 text-obsidian-950 sm:px-8 sm:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p data-lreveal className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-obsidian-950/50">
              {brand.eyebrow}
            </p>
            <h2 data-lreveal className="font-display text-4xl leading-[1.12] sm:text-5xl lg:text-6xl">
              {brand.heading.split("\n").map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>
          <div className="flex flex-col gap-5 lg:pt-12">
            {brand.paragraphs.map((par) => (
              <p key={par.slice(0, 24)} data-lreveal className="text-[0.95rem] leading-relaxed text-obsidian-950/75">
                {par}
              </p>
            ))}
          </div>
        </div>

        {/* Neden Çekmeköy */}
        <div className="mx-auto mt-20 max-w-6xl sm:mt-28">
          <div data-lreveal className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-obsidian-950/10 pb-6">
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
                className="flex items-baseline gap-5 border-b border-obsidian-950/10 py-5"
              >
                <span className="font-display text-lg text-obsidian-950/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium sm:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Stats band (dark) ---- */}
      <section data-lsec className="bg-obsidian-950 px-5 py-20 text-snow sm:px-8 sm:py-24">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {info.stats.map((stat) => (
            <div key={stat.label} data-lreveal className="text-center">
              <dd className="font-display text-4xl text-snow sm:text-5xl lg:text-6xl">{stat.value}</dd>
              <dt className="mt-3 text-[0.65rem] uppercase tracking-[0.3em] text-snow/50">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ---- Yaşam / editorial (light) ---- */}
      <section id="yasam" data-lsec className="bg-snow px-5 py-24 text-obsidian-950 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <p data-lreveal className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-obsidian-950/50">
            {editorial.eyebrow}
          </p>
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
                  <span data-lreveal className="font-display text-xl text-obsidian-950/30">
                    {String(i + 1).padStart(2, "0")}
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

      {/* ---- Galeri (dark) ---- */}
      <section id="galeri" data-lsec className="overflow-hidden bg-obsidian-950 px-5 py-24 text-snow sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <p data-lreveal className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-snow/50">
            {galleryBelow.eyebrow}
          </p>
          <h2 data-lreveal className="font-display text-4xl leading-tight sm:text-5xl">
            {galleryBelow.heading}
          </h2>
        </div>
        <div data-lreveal className="mt-6">
          <Gallery3D />
        </div>
      </section>

      {/* ---- Konum (light, map) ---- */}
      <section id="konum" data-lsec className="bg-snow px-5 py-24 text-obsidian-950 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <p data-lreveal className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-obsidian-950/50">
                {location.eyebrow}
              </p>
              <h2 data-lreveal className="font-display text-4xl leading-[1.12] sm:text-5xl">
                {location.heading.split("\n").map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p data-lreveal className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-obsidian-950/75">
                {location.body}
              </p>
              <ul className="mt-10">
                {location.pois.map((poi) => (
                  <li
                    key={poi.name}
                    data-lreveal
                    className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-obsidian-950/10 py-3.5 transition-colors duration-300 hover:border-obsidian-950/40"
                  >
                    <span className="text-sm font-semibold sm:text-[0.95rem]">{poi.name}</span>
                    <span className="text-xs text-obsidian-950/55 sm:text-[0.8rem]">{poi.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-lreveal data-map-wrap className="self-center">
              <div className="card-light overflow-hidden rounded-3xl p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-map
                  src={location.mapImage}
                  alt={location.mapAlt}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-2xl will-change-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CTA band (dark) ---- */}
      <section data-lsec className="bg-obsidian-950 px-5 py-24 text-center text-snow sm:px-8 sm:py-32">
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
