"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { VectorMapHandle } from "./VectorMap";
import {
  DIRECTIONS_URL,
  mapCopy,
  MY_MAPS_EMBED_URL,
  MY_MAPS_VIEW_URL,
  PROJECT_LOCATION,
} from "@/content/mapData";

/* MapLibre chunk loads only when the section is near the viewport. */
const VectorMap = dynamic(() => import("./VectorMap"), { ssr: false });

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4 10h11M11 5l5 5-5 5" />
  </svg>
);

const FocusIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M7 3H3v4M13 3h4v4M17 13v4h-4M7 17H3v-4" />
    <circle cx="10" cy="10" r="2.3" />
  </svg>
);

const ExpandIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <path d="M8 4H4v4M12 4h4v4M16 12v4h-4M8 16H4v-4" />
  </svg>
);

export default function LocationMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const vectorRef = useRef<VectorMapHandle | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const returnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  /* "vector": self-controlled MapLibre scene (primary). "embed": the keyless
     My Maps iframe kept as the working fallback. */
  const [mode, setMode] = useState<"vector" | "embed">("vector");
  const [focusRun, setFocusRun] = useState(0);
  const [showFocus, setShowFocus] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [returning, setReturning] = useState(false);

  const startFocus = useCallback(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setShowFocus(true);
    if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
    focusTimerRef.current = setTimeout(
      () => setShowFocus(false),
      reducedMotion ? 900 : 5600
    );
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setShouldLoad(true);
        startFocus();
        observer.disconnect();
      },
      { rootMargin: "500px 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [startFocus]);

  useEffect(
    () => () => {
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      if (returnTimerRef.current) clearTimeout(returnTimerRef.current);
    },
    []
  );

  const handleMapLoad = useCallback(() => {
    setLoaded(true);
    setNavigating(false);
    setReturning(false);
  }, []);

  const scheduleReturn = useCallback(() => {
    setNavigating(true);
    if (returnTimerRef.current) clearTimeout(returnTimerRef.current);
    returnTimerRef.current = setTimeout(() => {
      setReturning(true);
      setLoaded(false);
      setFocusRun((run) => run + 1);
      startFocus();
    }, 8000);
  }, [startFocus]);

  useEffect(() => {
    const detectIframeFocus = () => {
      setTimeout(() => {
        if (document.activeElement === iframeRef.current) scheduleReturn();
      }, 0);
    };
    window.addEventListener("blur", detectIframeFocus);
    return () => window.removeEventListener("blur", detectIframeFocus);
  }, [scheduleReturn]);

  const focusProject = useCallback(() => {
    if (vectorRef.current) {
      vectorRef.current.focus();
      startFocus();
      return;
    }
    setFailed(false);
    setReturning(true);
    setLoaded(false);
    setFocusRun((run) => run + 1);
    startFocus();
  }, [startFocus]);

  const vectorFailed = useCallback(() => {
    setMode("embed");
    setLoaded(false);
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`ala-location-map ${shouldLoad ? "is-presented" : ""} ${
        loaded ? "is-loaded" : ""
      } ${showFocus ? "is-focusing" : ""} ${
        navigating ? "is-navigating" : ""
      } ${returning ? "is-returning" : ""}`}
      aria-busy={shouldLoad && (!loaded || returning) && !failed}
    >
      <div className="ala-map-story">
        <div className="ala-map-kicker">
          <span>05</span>
          <span>{mapCopy.eyebrow}</span>
          <i />
        </div>
        <p className="ala-map-series">{mapCopy.posterSeries}</p>
        <h2>
          {mapCopy.heading.split("\n").map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="ala-map-location">{mapCopy.location}</p>
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
          {mapCopy.cta}
          <ArrowIcon />
        </a>
      </div>

      <div className="ala-map-frame">
        {mode === "vector" && shouldLoad && (
          <VectorMap
            ref={vectorRef}
            onReady={() => setLoaded(true)}
            onFail={vectorFailed}
            onFocusStart={startFocus}
          />
        )}

        {mode === "embed" && shouldLoad && !failed && (
          <iframe
            key={focusRun}
            ref={iframeRef}
            src={MY_MAPS_EMBED_URL}
            title="A'lâ Çekmeköy Nefes etkileşimli Google haritası"
            className="ala-map-embed"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={handleMapLoad}
            onFocus={scheduleReturn}
            onError={() => setFailed(true)}
          />
        )}

        {mode === "embed" && (
        <svg
          className="ala-map-zones"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="ala-map-zone-forest"
            d="M0 0H1000V292C915 318 836 278 752 301C664 325 613 382 524 348C439 315 366 296 286 337C198 382 101 345 0 316Z"
          />
          <path
            className="ala-map-zone-city"
            d="M0 392C124 359 215 393 318 374C433 352 501 372 596 337C706 297 800 350 1000 319V700H0Z"
          />
          <path
            className="ala-map-zone-forest ala-map-zone-forest-secondary"
            d="M0 448C94 414 162 432 227 472C174 530 96 558 0 536Z"
          />
          <text className="ala-map-zone-label ala-map-zone-label-forest" x="745" y="82">
            ÇEKMEKÖY ORMANLARI
          </text>
          <text className="ala-map-zone-label ala-map-zone-label-city" x="775" y="620">
            ŞEHİR DOKUSU
          </text>
        </svg>
        )}

        {shouldLoad && !loaded && !failed && (
          <div className="ala-map-loader" aria-live="polite">
            <span className="ala-map-loader-ring" />
            <span>
              {returning ? "A'lâ konumuna dönülüyor" : "Canlı harita hazırlanıyor"}
            </span>
          </div>
        )}

        {failed && (
          <div className="ala-map-fallback">
            Canlı harita şu anda yüklenemedi — konumu Google Maps&apos;te açmak
            için &quot;{mapCopy.cta}&quot; bağlantısını kullanın.
          </div>
        )}

        {/* Label wash: white radial veil, transparent over the project —
            peripheral street/business labels dissolve into the canvas */}
        {mode === "embed" && <div className="ala-map-wash" aria-hidden="true" />}
        <div className="ala-map-vignette" aria-hidden="true" />
        <div className="ala-map-grain" aria-hidden="true" />

        <div className="ala-map-caption" aria-hidden="true">
          <strong>Ç E K M E K Ö Y</strong>
          <span>İSTANBUL · TÜRKİYE</span>
          <small>
            {PROJECT_LOCATION.lat.toFixed(4)}° N&nbsp;&nbsp;/&nbsp;&nbsp;
            {PROJECT_LOCATION.lng.toFixed(4)}° E
          </small>
        </div>

        <svg
          className="ala-approach-lines"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="ala-route-arrow"
              markerWidth="12"
              markerHeight="12"
              refX="10"
              refY="6"
              orient="auto"
            >
              <path d="M1 1 10 6 1 11" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </marker>
          </defs>
          <path className="ala-route-base" d="M-20 560C180 500 320 520 482 362" />
          <path className="ala-route-flow ala-route-flow-one" d="M-20 560C180 500 320 520 482 362" />
          <path className="ala-route-base ala-route-secondary" d="M1020 190C830 210 690 250 520 338" />
          <path className="ala-route-flow ala-route-flow-two" d="M1020 190C830 210 690 250 520 338" />
          <path className="ala-route-base ala-route-secondary" d="M700 730C665 590 600 450 515 362" />
          <path className="ala-route-flow ala-route-flow-three" d="M700 730C665 590 600 450 515 362" />
        </svg>

        <div className="ala-map-road-tag" aria-hidden="true">
          <span />
          {mapCopy.roadLabel}
        </div>

        {mode === "embed" && (
          <div className="ala-map-focus" aria-hidden="true">
            <span className="ala-map-focus-orbit ala-map-focus-orbit-one" />
            <span className="ala-map-focus-orbit ala-map-focus-orbit-two" />
            <span className="ala-map-focus-dot" />
            <strong>
              <span>PROJE KONUMU</span>
              {mapCopy.projectLabel}
            </strong>
          </div>
        )}

        {mode === "embed" && loaded && (
          <div className="ala-map-return-status" aria-live="polite">
            <span />
            {mapCopy.autoReturn}
          </div>
        )}
      </div>

      <div className="ala-map-actions" aria-label="Harita kontrolleri">
        {mode === "vector" && (
          <>
            <button
              type="button"
              onClick={() => vectorRef.current?.zoomIn()}
              title="Yakınlaştır"
              aria-label="Yakınlaştır"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 4v12M4 10h12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => vectorRef.current?.zoomOut()}
              title="Uzaklaştır"
              aria-label="Uzaklaştır"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h12" />
              </svg>
            </button>
          </>
        )}
        <button type="button" onClick={focusProject} title={mapCopy.focus}>
          <FocusIcon />
          <span>{mapCopy.focus}</span>
        </button>
        <a
          href={MY_MAPS_VIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={mapCopy.expand}
        >
          <ExpandIcon />
          <span>{mapCopy.expand}</span>
        </a>
      </div>

      <div className="ala-map-meta">
        <div>
          <span>{mapCopy.coordinateLabel}</span>
          <strong>
            {PROJECT_LOCATION.lat.toFixed(4)}° N&nbsp;&nbsp;·&nbsp;&nbsp;
            {PROJECT_LOCATION.lng.toFixed(4)}° E
          </strong>
        </div>
        <p>{mapCopy.hint}</p>
      </div>
    </div>
  );
}
