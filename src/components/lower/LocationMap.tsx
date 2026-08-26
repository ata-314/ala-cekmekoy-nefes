"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { assets } from "@/content/project";
import {
  CAMERA,
  DIRECTIONS_URL,
  mapCopy,
  MapRoute,
  POI_CATEGORIES,
  POIS,
  PoiCategory,
  PROJECT_LOCATION,
  ROUTES,
} from "@/content/mapData";
import { loadGoogleMaps, MAPS_API_KEY, MAPS_MAP_ID } from "@/lib/googleMaps";

type Status = "idle" | "loading" | "ready" | "fallback";

type RouteResult = {
  path: google.maps.LatLngLiteral[];
  distanceText: string;
  durationText: string;
};

/** Session-scoped cache so route requests never repeat per render/visit. */
const routeCache = new Map<string, RouteResult>();

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

async function computeRoute(
  origin: { lat: number; lng: number },
  key: string
): Promise<RouteResult | null> {
  const cached = routeCache.get(key);
  if (cached) return cached;
  try {
    // New Routes library (Route.computeRoutes) — not the legacy Directions
    // service. Cast: @types/google.maps may lag behind the routes library.
    const routesLib = (await google.maps.importLibrary("routes" as never)) as {
      Route?: {
        computeRoutes: (req: unknown) => Promise<{ routes: unknown[] }>;
      };
    };
    if (!routesLib.Route) return null;
    const { routes } = await routesLib.Route.computeRoutes({
      origin,
      destination: PROJECT_LOCATION,
      travelMode: "DRIVE",
      fields: ["path", "distanceMeters", "durationMillis"],
    });
    const first = routes?.[0] as
      | {
          path?: { lat: () => number; lng: () => number }[];
          distanceMeters?: number;
          durationMillis?: number;
        }
      | undefined;
    if (!first?.path?.length) return null;
    const km = (first.distanceMeters ?? 0) / 1000;
    const min = Math.round((first.durationMillis ?? 0) / 60000);
    const result: RouteResult = {
      path: first.path.map((p) => ({ lat: p.lat(), lng: p.lng() })),
      distanceText: `${km.toFixed(1).replace(".", ",")} km`,
      durationText: `~${min} dk`,
    };
    routeCache.set(key, result);
    return result;
  } catch {
    return null;
  }
}

export default function LocationMap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const rafsRef = useRef<number[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const poiMarkersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(
    new Map()
  );
  const introDoneRef = useRef(false);

  const [status, setStatus] = useState<Status>("idle");
  const [tilesReady, setTilesReady] = useState(false);
  const [markerCardOpen, setMarkerCardOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<PoiCategory | null>(null);
  const [poiInfo, setPoiInfo] = useState<{ name: string; duration?: string } | null>(null);

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const trackRaf = (id: number) => rafsRef.current.push(id);

  /* Lazy trigger: start loading only as the section approaches the viewport. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || status !== "idle") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStatus(MAPS_API_KEY ? "loading" : "fallback");
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [status]);

  /* Routes: real roads via the Routes library, drawn progressively with
     slow forward arrows. Dormant while ROUTES is empty (no invented data). */
  const drawRoutes = useCallback(async (map: google.maps.Map) => {
    if (!ROUTES.length) return;
    for (const route of ROUTES) {
      const result = await computeRoute(route.origin, `route:${route.id}`);
      if (!result || !mapRef.current) continue;
      const line = new google.maps.Polyline({
        map,
        path: [],
        strokeColor: "#f6f7fc",
        strokeOpacity: route.primary ? 0.95 : 0.45,
        strokeWeight: route.primary ? 4 : 2.5,
      });
      polylinesRef.current.push(line);

      /* Progressive draw from origin toward the project. */
      const full = result.path;
      const drawMs = reduced() ? 0 : 1400;
      if (!drawMs) {
        line.setPath(full);
      } else {
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - t0) / drawMs);
          line.setPath(full.slice(0, Math.max(2, Math.floor(full.length * easeInOutCubic(p)))));
          if (p < 1) trackRaf(requestAnimationFrame(step));
        };
        trackRaf(requestAnimationFrame(step));
      }

      /* Slow arrows drifting toward the project. */
      if (!reduced()) {
        const arrow: google.maps.IconSequence = {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 2.4,
            strokeColor: "#ffffff",
            strokeOpacity: route.primary ? 0.9 : 0.5,
          },
          offset: "0%",
          repeat: "96px",
        };
        line.set("icons", [arrow]);
        let offset = 0;
        const drift = () => {
          if (!polylinesRef.current.includes(line)) return;
          offset = (offset + 0.03) % 100;
          arrow.offset = `${offset}%`;
          line.set("icons", [arrow]);
          trackRaf(requestAnimationFrame(drift));
        };
        trackRaf(requestAnimationFrame(drift));
      }
    }
  }, []);

  /* Map boot */
  useEffect(() => {
    if (status !== "loading") return;
    let cancelled = false;

    (async () => {
      try {
        const maps = await loadGoogleMaps();
        const { Map: GMap } = (await maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = (await maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;
        if (cancelled || !mapElRef.current) return;

        const startAtTarget = reduced();
        const map = new GMap(mapElRef.current, {
          center: CAMERA.center,
          zoom: startAtTarget ? CAMERA.targetZoom : CAMERA.introZoom,
          mapId: MAPS_MAP_ID || undefined,
          gestureHandling: "cooperative",
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
        });
        mapRef.current = map;
        map.addListener("tilesloaded", () => setTilesReady(true));

        /* Project marker: brand dot + slow pulse + label (real logo). */
        const content = document.createElement("div");
        content.className = "ala-map-marker";
        content.innerHTML = `
          <span class="ala-map-pulse" aria-hidden="true"></span>
          <span class="ala-map-dot" aria-hidden="true"></span>
          <span class="ala-map-label">
            <img src="${assets.logo}" alt="" />
            <span>${mapCopy.projectLabel}</span>
          </span>`;
        const marker = new AdvancedMarkerElement({
          map,
          position: PROJECT_LOCATION,
          content,
          title: mapCopy.markerCard.title,
        });
        marker.addListener("click", () => setMarkerCardOpen((v) => !v));

        const revealMarker = () => {
          if (introDoneRef.current) return;
          introDoneRef.current = true;
          content.classList.add("is-visible");
          void drawRoutes(map);
        };

        if (startAtTarget) {
          revealMarker();
          return;
        }

        /* Camera flight: wide → project, rAF-driven, cancelled by any user
           gesture. Runs once per page load. */
        let flightCancelled = false;
        const cancelFlight = () => {
          flightCancelled = true;
          revealMarker();
        };
        const el = mapElRef.current;
        ["pointerdown", "wheel", "touchstart"].forEach((ev) =>
          el.addEventListener(ev, cancelFlight, { once: true, passive: true })
        );

        const waitForEnter = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            waitForEnter.disconnect();
            const t0 = performance.now();
            const step = (now: number) => {
              if (flightCancelled || cancelled) return;
              const p = Math.min(1, (now - t0) / CAMERA.flightMs);
              const z =
                CAMERA.introZoom +
                (CAMERA.targetZoom - CAMERA.introZoom) * easeInOutCubic(p);
              map.moveCamera({ center: CAMERA.center, zoom: z });
              if (p < 1) trackRaf(requestAnimationFrame(step));
              else revealMarker();
            };
            trackRaf(requestAnimationFrame(step));
          },
          { threshold: 0.35 }
        );
        if (sectionRef.current) waitForEnter.observe(sectionRef.current);

        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("fallback");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /* Route selection: highlight, fit camera, show real distance/duration. */
  const selectRoute = useCallback(async (route: MapRoute | null) => {
    const map = mapRef.current;
    if (!map) return;
    setActiveRoute(route?.id ?? null);
    setRouteInfo(null);
    if (!route) {
      map.moveCamera({ center: CAMERA.center, zoom: CAMERA.targetZoom });
      polylinesRef.current.forEach((l, i) =>
        l.setOptions({ strokeOpacity: ROUTES[i]?.primary ? 0.95 : 0.45 })
      );
      return;
    }
    const result = await computeRoute(route.origin, `route:${route.id}`);
    if (!result) return;
    polylinesRef.current.forEach((l, i) =>
      l.setOptions({ strokeOpacity: ROUTES[i]?.id === route.id ? 1 : 0.18 })
    );
    const bounds = new google.maps.LatLngBounds();
    result.path.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 80);
    setRouteInfo(result);
  }, []);

  /* POI category filter with staggered reveal; dormant while POIS is empty. */
  const showCategory = useCallback(async (category: PoiCategory | null) => {
    const map = mapRef.current;
    if (!map) return;
    setActiveCategory(category);
    setPoiInfo(null);
    poiMarkersRef.current.forEach((m) => (m.map = null));
    poiMarkersRef.current.clear();
    if (!category) return;
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      "marker"
    )) as google.maps.MarkerLibrary;
    POIS.filter((p) => p.category === category).forEach((poi, i) => {
      const el = document.createElement("div");
      el.className = "ala-poi-marker";
      el.textContent = poi.name;
      el.style.transitionDelay = reduced() ? "0ms" : `${i * 90}ms`;
      const m = new AdvancedMarkerElement({
        map,
        position: poi.position,
        content: el,
        title: poi.name,
      });
      m.addListener("click", async () => {
        const r = await computeRoute(poi.position, `poi:${poi.id}`);
        setPoiInfo({ name: poi.name, duration: r?.durationText });
      });
      requestAnimationFrame(() => el.classList.add("is-visible"));
      poiMarkersRef.current.set(poi.id, m);
    });
  }, []);

  /* Unmount: cancel every frame, drop overlays. */
  useEffect(
    () => () => {
      rafsRef.current.forEach(cancelAnimationFrame);
      polylinesRef.current.forEach((l) => l.setMap(null));
      polylinesRef.current = [];
      poiMarkersRef.current.forEach((m) => (m.map = null));
      poiMarkersRef.current.clear();
    },
    []
  );

  const visiblePois = activeCategory
    ? POIS.filter((p) => p.category === activeCategory)
    : [];

  return (
    <div ref={sectionRef} className="relative h-[80svh] overflow-hidden lg:h-[100svh]">
      {/* Map canvas */}
      <div ref={mapElRef} className="absolute inset-0" aria-label="Proje konum haritası" />

      {/* Skeleton until tiles paint */}
      {status !== "fallback" && !tilesReady && (
        <div className="ala-map-skeleton absolute inset-0" aria-hidden />
      )}

      {/* Fallback: never an empty section — static render + working CTA */}
      {status === "fallback" && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/map/konum.jpg"
            alt="A'lâ Çekmeköy Nefes konum haritası"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-obsidian-950/25" />
        </div>
      )}

      {/* Cinematic edge fades into the dark section frame */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-obsidian-950 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-obsidian-950 to-transparent" />

      {/* Heading panel — Apple glass, kept clear of the project pin */}
      <div className="pointer-events-none absolute inset-x-0 top-10 z-10 flex justify-center px-5 lg:inset-x-auto lg:left-10 lg:top-1/2 lg:-translate-y-1/2 lg:justify-start xl:left-16">
        <div className="glass pointer-events-auto max-w-md rounded-[28px] bg-obsidian-900/55 p-6 text-snow sm:p-8">
          <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.4em] text-snow/50">
            {mapCopy.eyebrow}
          </p>
          <h2 className="font-display text-3xl leading-[1.12] sm:text-4xl">
            {mapCopy.heading.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.35em] text-snow/60">
            {mapCopy.projectLabel}
          </p>
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta mt-6 inline-block rounded-full bg-accent px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-obsidian-950"
          >
            {mapCopy.cta}
          </a>

          {/* Route chips (render only when verified routes exist) */}
          {ROUTES.length > 0 && (
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
              {ROUTES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => void selectRoute(activeRoute === r.id ? null : r)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
                    activeRoute === r.id
                      ? "border-snow bg-snow text-obsidian-950"
                      : "border-snow/30 text-snow/75 hover:border-snow/60"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
          {routeInfo && (
            <p className="mt-3 text-xs text-snow/70">
              {routeInfo.distanceText} · {routeInfo.durationText} sürüş
            </p>
          )}

          {/* POI category chips (render only when verified POIs exist) */}
          {POIS.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {(Object.keys(POI_CATEGORIES) as PoiCategory[])
                .filter((c) => POIS.some((p) => p.category === c))
                .map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => void showCategory(activeCategory === c ? null : c)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-[0.68rem] font-semibold tracking-[0.1em] transition-colors duration-300 ${
                      activeCategory === c
                        ? "border-snow bg-snow text-obsidian-950"
                        : "border-snow/30 text-snow/75 hover:border-snow/60"
                    }`}
                  >
                    {POI_CATEGORIES[c].label}
                  </button>
                ))}
            </div>
          )}
          {poiInfo && (
            <p className="mt-3 text-xs text-snow/70">
              {poiInfo.name}
              {poiInfo.duration ? ` · projeye ${poiInfo.duration} sürüş` : ""}
            </p>
          )}
          {visiblePois.length === 0 && activeCategory && (
            <p className="mt-3 text-xs text-snow/50">Bu kategoride nokta yok.</p>
          )}
        </div>
      </div>

      {/* Project card on marker click */}
      {markerCardOpen && (
        <div className="absolute bottom-8 left-1/2 z-10 w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 lg:bottom-10 lg:left-auto lg:right-10 lg:translate-x-0">
          <div className="glass rounded-3xl bg-obsidian-900/60 p-6 text-snow">
            <button
              type="button"
              onClick={() => setMarkerCardOpen(false)}
              aria-label="Kartı kapat"
              className="cta absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-snow/20 text-snow/70"
            >
              ✕
            </button>
            <p className="font-display text-2xl">{mapCopy.markerCard.title}</p>
            <p className="mt-2 pr-8 text-sm leading-relaxed text-snow/70">
              {mapCopy.markerCard.body}
            </p>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta mt-5 inline-block rounded-full bg-accent px-5 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-obsidian-950"
            >
              {mapCopy.markerCard.cta}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
