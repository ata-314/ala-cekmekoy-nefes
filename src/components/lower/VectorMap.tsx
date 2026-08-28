"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/* Turbopack resolves MapLibre's implicit worker URL to the page origin (the
   worker then "executes" the HTML document and dies silently — no tiles, no
   style-load, no errors). Point it at a self-hosted copy of the real worker
   bundle instead. Keep public/vendor/maplibre-gl-worker.mjs in sync when
   upgrading maplibre-gl. */
maplibregl.setWorkerUrl("/vendor/maplibre-gl-worker.mjs");

import {
  BRAND_ICONS,
  brandMapStyle,
  CAMERA_FLIGHT,
  FOREST_PATTERN_SVG,
  FOREST_TEXTURE_LAYER,
  POI_LAYER,
} from "@/content/mapStyle";
import { LANDMARKS, PROJECT_LOCATION } from "@/content/mapData";
import { assets, identity } from "@/content/project";

export type VectorMapHandle = {
  /** "Konuma Dön": short cinematic return to the project pin. */
  focus: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

/* Page-load-scoped guard, keyed per placement: re-renders and remounts never
   replay an intro flight, but the hero and the Konum section each get one. */
const flightsPlayed = new Set<string>();

const PROJECT_LNGLAT: [number, number] = [
  PROJECT_LOCATION.lng,
  PROJECT_LOCATION.lat,
];

/** Decode an inline SVG into an <img> usable by map.addImage(). */
function loadSvgImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
  });
}

/**
 * Fully self-controlled vector map (MapLibre GL on OpenFreeMap tiles — no API
 * key, production-allowed). Custom style: green forests with a woodland
 * texture, distinct urban fabric, readable majors, curated nearby places with
 * brand icons, and no pond/business clutter. Opens on a Türkiye overview and
 * dives to the project; any gesture cancels the flight and hands over control.
 *
 * Robustness (client: "bazı bilgisayarlarda çalışmıyor"): WebGL2 is checked up
 * front, transient tile errors never abort the map, a hard load timeout falls
 * back to the embed, and the render budget adapts to the machine.
 */
const VectorMap = forwardRef<
  VectorMapHandle,
  {
    onReady: () => void;
    onFail: () => void;
    onFocusStart?: () => void;
    /** "full": Türkiye overview → project. "compact": a short local ease-in
        for the hero, where the panel is only on screen for a moment. */
    variant?: "full" | "compact";
    /** The hero map is a showcase inside a scrubbed stage — gestures there
        would fight the scroll choreography. */
    interactive?: boolean;
    /** Separate guard per placement. */
    flightKey?: string;
    /** Gate the intro on the parent's signal instead of viewport geometry —
        required inside the pinned hero, where every phase is geometrically
        on screen the whole time (visibility:hidden still "intersects"). */
    revealGated?: boolean;
    /** Flips when the panel actually lands; fires the camera. */
    revealed?: boolean;
    /** Override the dive length (the hero phase has its own budget). */
    flightDurationMs?: number;
  }
>(function VectorMap(
  {
    onReady,
    onFail,
    onFocusStart,
    variant = "full",
    interactive = true,
    flightKey = "konum",
    revealGated = false,
    revealed = false,
    flightDurationMs,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const endPitchRef = useRef<number>(CAMERA_FLIGHT.end.pitch);
  const startIntroRef = useRef<(() => void) | null>(null);
  const revealedRef = useRef(false);

  /* Compact placements fly when the parent says the panel is on screen. */
  useEffect(() => {
    if (!revealed) return;
    revealedRef.current = true;
    startIntroRef.current?.();
  }, [revealed]);

  useImperativeHandle(ref, () => ({
    focus() {
      const map = mapRef.current;
      if (!map) return;
      onFocusStart?.();
      map.flyTo({
        center: PROJECT_LNGLAT,
        zoom: CAMERA_FLIGHT.end.zoom,
        pitch: endPitchRef.current,
        bearing: CAMERA_FLIGHT.end.bearing,
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

    let failed = false;
    let loaded = false;
    let disposed = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const fail = () => {
      if (failed || disposed) return;
      failed = true;
      onFail();
    };

    /* MapLibre 6 needs WebGL2. Machines with it disabled (old drivers, HW
       acceleration off) go straight to the embed fallback instead of showing
       a dead canvas. */
    try {
      const probe = document.createElement("canvas");
      if (!probe.getContext("webgl2")) {
        fail();
        return;
      }
    } catch {
      fail();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const cores =
      typeof navigator !== "undefined" ? (navigator.hardwareConcurrency ?? 4) : 4;
    /* Render budget: weaker machines and phones get a lighter canvas, a
       shallower camera and a shorter flight — the stutter reported on some
       desktops came from a full-DPR pitched canvas streaming tiles. */
    const lowEnd = cores <= 4 || coarse;
    const endPitch = lowEnd ? 34 : CAMERA_FLIGHT.end.pitch;
    const flightMs = lowEnd ? 5200 : CAMERA_FLIGHT.durationMs;
    endPitchRef.current = endPitch;

    const compact = variant === "compact";
    /* Compact: open just above the neighbourhood and ease down onto the
       project — a country-wide dive is far too long for a hero phase. */
    const startZoom = compact ? 12.9 : CAMERA_FLIGHT.start.zoom;
    const startCenter = compact ? PROJECT_LNGLAT : CAMERA_FLIGHT.start.center;
    const diveMs = flightDurationMs ?? (compact ? 3200 : flightMs);
    const skipFlight = flightsPlayed.has(flightKey) || reduced;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: structuredClone(brandMapStyle),
        center: skipFlight ? PROJECT_LNGLAT : startCenter,
        zoom: skipFlight ? CAMERA_FLIGHT.end.zoom : startZoom,
        pitch: skipFlight ? endPitch : CAMERA_FLIGHT.start.pitch,
        bearing: skipFlight ? CAMERA_FLIGHT.end.bearing : CAMERA_FLIGHT.start.bearing,
        /* OSM/ODbL requires credit; we render our own minimal line
           instead of MapLibre's boxed control with its "i" toggle. */
        attributionControl: false,
        interactive,
        cooperativeGestures: interactive,
        renderWorldCopies: false,
        maxTileCacheSize: 48,
        fadeDuration: 200,
        maxPitch: 60,
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

    /* Cap the drawing buffer: a 3× DPR pitched canvas is the single biggest
       cause of frame drops on integrated graphics. */
    const dpr = window.devicePixelRatio || 1;
    map.setPixelRatio(Math.min(dpr, lowEnd ? 1 : 1.6));

    /* Transient tile/glyph errors must NOT kill the map — earlier versions
       fell back to the iframe on a single 404 during load. */
    map.on("error", () => {});

    /* Hard timeout: if the style never finishes (blocked worker, offline
       tiles), show the working fallback instead of a blank frame. */
    timers.push(
      setTimeout(() => {
        if (!loaded) fail();
      }, 14000)
    );

    /* Project marker: exact-point core + pulse + the real brand logo card. */
    const pinEl = document.createElement("div");
    pinEl.className = "ala-pin";
    /* The reveal animates an INNER wrapper: MapLibre writes the marker's
       own opacity as an inline style (terrain occlusion support), which no
       stylesheet can override. */
    pinEl.innerHTML = `
      <span class="ala-pin-inner">
        <span class="ala-pin-card">
          <img src="${assets.logo}" alt="" />
        </span>
        <span class="ala-pin-stem" aria-hidden="true"></span>
        <span class="ala-pin-pulse" aria-hidden="true"></span>
        <span class="ala-pin-core" aria-hidden="true"></span>
      </span>`;
    pinEl.setAttribute("aria-label", identity.name);
    const marker = new maplibregl.Marker({
      element: pinEl,
      anchor: "center",
    }).setLngLat(PROJECT_LNGLAT);

    const pinInner = pinEl.querySelector<HTMLElement>(".ala-pin-inner");
    const showPin = () => {
      pinInner?.classList.add("is-shown");
      landmarkMarkers.forEach((lm) =>
        lm.getElement().querySelector(".ala-landmark-inner")?.classList.add("is-shown")
      );
    };

    /* Client-called-out landmarks the map data does not name. Rendered as
       prominent brand pills, clearly above the generic POI chips. */
    const landmarkMarkers = LANDMARKS.map((lm) => {
      const el = document.createElement("div");
      el.className = "ala-landmark";
      el.innerHTML = `
        <span class="ala-landmark-inner">
          <span class="ala-landmark-dot" aria-hidden="true"></span>
          <span class="ala-landmark-body">
            <strong>${lm.name}</strong>
            ${lm.detail ? `<em>${lm.detail}</em>` : ""}
          </span>
        </span>`;
      return new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([
        lm.position.lng,
        lm.position.lat,
      ]);
    });

    /* Clicking the logo flies straight back to the project. */
    const flyHome = () =>
      map.flyTo({
        center: PROJECT_LNGLAT,
        zoom: CAMERA_FLIGHT.end.zoom,
        pitch: endPitch,
        bearing: CAMERA_FLIGHT.end.bearing,
        duration: 1500,
        essential: true,
      });
    const card = pinEl.querySelector<HTMLElement>(".ala-pin-card");
    if (card) {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("title", `${identity.name} — konuma odaklan`);
      card.addEventListener("click", (e) => {
        e.stopPropagation();
        onFocusStart?.();
        flyHome();
      });
      card.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        onFocusStart?.();
        flyHome();
      });
    }

    /* Brand imagery: POI chips + woodland texture, then the layers that use
       them (added after the images exist so MapLibre never warns). */
    const addBrandImagery = async () => {
      try {
        const entries = await Promise.all(
          Object.entries(BRAND_ICONS).map(
            async ([id, svg]) => [id, await loadSvgImage(svg)] as const
          )
        );
        if (disposed || !map.getStyle()) return;
        entries.forEach(([id, img]) => {
          if (!map.hasImage(id)) map.addImage(id, img, { pixelRatio: 2 });
        });

        const forest = await loadSvgImage(FOREST_PATTERN_SVG);
        if (disposed || !map.getStyle()) return;
        if (!map.hasImage("ala-forest"))
          map.addImage("ala-forest", forest, { pixelRatio: 2 });

        if (!map.getLayer(FOREST_TEXTURE_LAYER.id))
          map.addLayer(FOREST_TEXTURE_LAYER, "landuse-urban");
        if (!map.getLayer(POI_LAYER.id)) map.addLayer(POI_LAYER);
      } catch {
        /* Imagery is decoration — the map stays usable without it. */
      }
    };

    map.on("load", () => {
      if (disposed) return;
      loaded = true;
      onReady();
      marker.addTo(map);
      landmarkMarkers.forEach((lm) => lm.addTo(map));
      void addBrandImagery();

      if (skipFlight) {
        flightsPlayed.add(flightKey);
        showPin();
        return;
      }

      let cancelled = false;
      const cancel = () => {
        if (cancelled) return;
        cancelled = true;
        map.stop();
        showPin();
        flightsPlayed.add(flightKey);
      };
      /* Only a REAL gesture hands control over. MapLibre tags user-driven
         camera events with `originalEvent`; our own flyTo has none. Listening
         to raw wheel/mousedown on the container used to cancel the flight
         before it started — in the hero the cursor sits over the map while
         the visitor is simply scrolling the page. */
      const onUserCamera = (e: { originalEvent?: unknown }) => {
        if (e.originalEvent) cancel();
      };

      let dived = false;
      const dive = () => {
        if (dived || cancelled || disposed) return;
        dived = true;

        /* Fly level (pitch 0) — a pitched camera streams far more tiles and
           is what made the dive stutter. The tilt eases in on arrival. */
        map.flyTo({
          center: PROJECT_LNGLAT,
          zoom: CAMERA_FLIGHT.end.zoom,
          bearing: CAMERA_FLIGHT.end.bearing,
          pitch: 0,
          duration: diveMs,
          curve: compact ? 1.1 : 1.45,
          essential: true,
        });

        const settle = () => {
          if (cancelled || disposed) return;
          flightsPlayed.add(flightKey);
          showPin();
          map.easeTo({ pitch: endPitch, duration: 1400, essential: true });
        };
        map.on("dragstart", onUserCamera);
        map.on("zoomstart", onUserCamera);
        map.on("rotatestart", onUserCamera);

        map.once("moveend", settle);
        /* Safety net: if moveend never arrives, the pin still appears. */
        timers.push(setTimeout(settle, diveMs + 2500));
      };
      startIntroRef.current = dive;

      if (revealGated || compact) {
        /* Mounted early to warm the tiles; the parent triggers the reveal. */
        if (revealedRef.current) dive();
      } else {
        const io = new IntersectionObserver(
          (entries) => {
            if (!entries.some((en) => en.isIntersecting) || cancelled) return;
            io.disconnect();
            dive();
          },
          { threshold: 0.25 }
        );
        io.observe(container);
        timers.push(setTimeout(() => io.disconnect(), 60000));
      }
    });

    return () => {
      disposed = true;
      startIntroRef.current = null;
      timers.forEach(clearTimeout);
      marker.remove();
      landmarkMarkers.forEach((lm) => lm.remove());
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="ala-vector-map"
        role="application"
        aria-label="A'lâ Çekmeköy Nefes etkileşimli konum haritası"
      />
      <p className="ala-map-credit">
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
        >
          © OpenStreetMap
        </a>
      </p>
    </>
  );
});

export default VectorMap;
