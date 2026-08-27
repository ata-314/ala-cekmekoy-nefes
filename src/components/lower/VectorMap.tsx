"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/* Turbopack resolves MapLibre's implicit worker URL to the page origin (the
   worker then "executes" the HTML document and dies silently — no tiles, no
   style-load, no errors). Point it at a self-hosted copy of the real worker
   bundle instead. Keep public/vendor/maplibre-gl-worker.mjs in sync when
   upgrading maplibre-gl. */
maplibregl.setWorkerUrl("/vendor/maplibre-gl-worker.mjs");
import { brandMapStyle, CAMERA_FLIGHT } from "@/content/mapStyle";
import { mapCopy, PROJECT_LOCATION } from "@/content/mapData";

export type VectorMapHandle = {
  /** "Konuma Dön": short cinematic return to the project pin. */
  focus: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

/* Page-load-scoped guards: re-renders and remounts never replay the long
   intro flight (client brief). */
let flightPlayed = false;

const PROJECT_LNGLAT: [number, number] = [
  PROJECT_LOCATION.lng,
  PROJECT_LOCATION.lat,
];

/**
 * Fully self-controlled vector map (MapLibre GL on OpenFreeMap tiles — no
 * API key, production-allowed). The custom style keeps forests green, urban
 * fabric distinct, majors readable and POIs off entirely. Opens on a Türkiye
 * overview and dives to the project in one continuous flight; any user
 * gesture cancels it and hands over control.
 */
const VectorMap = forwardRef<
  VectorMapHandle,
  { onReady: () => void; onFail: () => void; onFocusStart?: () => void }
>(function VectorMap({ onReady, onFail, onFocusStart }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      const map = mapRef.current;
      if (!map) return;
      onFocusStart?.();
      map.flyTo({
        center: PROJECT_LNGLAT,
        ...CAMERA_FLIGHT.end,
        duration: 1900,
        essential: true,
      });
    },
    zoomIn() {
      mapRef.current?.zoomIn({ duration: 350 });
    },
    zoomOut() {
      mapRef.current?.zoomOut({ duration: 350 });
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const skipFlight = flightPlayed || reduced;

    let map: maplibregl.Map;
    let io: IntersectionObserver | null = null;
    let failed = false;
    let loaded = false;

    const fail = () => {
      if (failed) return;
      failed = true;
      onFail();
    };

    try {
      map = new maplibregl.Map({
        container,
        style: structuredClone(brandMapStyle),
        center: skipFlight ? PROJECT_LNGLAT : CAMERA_FLIGHT.start.center,
        zoom: skipFlight ? CAMERA_FLIGHT.end.zoom : CAMERA_FLIGHT.start.zoom,
        pitch: skipFlight ? CAMERA_FLIGHT.end.pitch : CAMERA_FLIGHT.start.pitch,
        bearing: skipFlight
          ? CAMERA_FLIGHT.end.bearing
          : CAMERA_FLIGHT.start.bearing,
        attributionControl: { compact: true },
        cooperativeGestures: true,
        fadeDuration: 220,
        locale: {
          "CooperativeGesturesHandler.WindowsHelpText":
            "Haritayı yakınlaştırmak için Ctrl + kaydırın",
          "CooperativeGesturesHandler.MacHelpText":
            "Haritayı yakınlaştırmak için ⌘ + kaydırın",
          "CooperativeGesturesHandler.MobileHelpText":
            "Haritayı gezmek için iki parmağınızı kullanın",
        },
      });
    } catch {
      fail();
      return;
    }
    mapRef.current = map;

    /* Hard failures before first paint → fallback. Later tile hiccups are
       tolerated (map already useful). */
    map.on("error", (e: { error?: unknown }) => {
      if (!loaded && e.error) fail();
    });

    /* Project pin: glow core + soft pulse + label chip. */
    const pinEl = document.createElement("div");
    pinEl.className = "ala-pin";
    pinEl.innerHTML = `
      <span class="ala-pin-pulse" aria-hidden="true"></span>
      <span class="ala-pin-glow" aria-hidden="true"></span>
      <span class="ala-pin-core" aria-hidden="true"></span>
      <span class="ala-pin-label">${mapCopy.projectLabel}</span>`;
    const marker = new maplibregl.Marker({
      element: pinEl,
      anchor: "center",
    }).setLngLat(PROJECT_LNGLAT);

    const showPin = () => pinEl.classList.add("is-shown");

    map.on("load", () => {
      loaded = true;
      onReady();
      marker.addTo(map);
      if (skipFlight) {
        flightPlayed = true;
        showPin();
        return;
      }

      /* Cinematic dive once the section is actually on screen. */
      let cancelled = false;
      const cancel = () => {
        if (cancelled) return;
        cancelled = true;
        map.stop();
        showPin();
        flightPlayed = true;
      };
      ["mousedown", "wheel", "touchstart"].forEach((ev) =>
        container.addEventListener(ev, cancel, { once: true, passive: true })
      );

      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((en) => en.isIntersecting) || cancelled) return;
          io?.disconnect();
          map.flyTo({
            center: PROJECT_LNGLAT,
            ...CAMERA_FLIGHT.end,
            duration: CAMERA_FLIGHT.durationMs,
            curve: 1.42,
            essential: true,
          });
          map.once("moveend", () => {
            flightPlayed = true;
            showPin();
          });
        },
        { threshold: 0.3 }
      );
      io.observe(container);
    });

    return () => {
      io?.disconnect();
      marker.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="ala-vector-map"
      role="application"
      aria-label="A'lâ Çekmeköy Nefes etkileşimli konum haritası"
    />
  );
});

export default VectorMap;
