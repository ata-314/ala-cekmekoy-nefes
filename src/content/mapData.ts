/**
 * Konum section — ALL map data lives here, nothing is hardcoded in components.
 *
 * Source of truth: the client's Google My Maps
 * (mid 1ld3GhIueG5k128cJMaxucgZXobNu57Q). Its KML export was fetched and
 * verified on 2026-08-26 — it contains exactly ONE placemark:
 *   "A'lâ Çekmeköy Nefes" @ 41.0378312, 29.1528651
 * That coordinate is used verbatim below.
 *
 * ROUTES AND POIS ARE INTENTIONALLY EMPTY: the My Maps document defines no
 * route origins and no surrounding places, and per project rules we never
 * invent geodata. Add entries here (or to the My Maps document) and the
 * section lights up automatically — route chips, animated polylines and
 * category filters are all driven from these arrays.
 */

export type LatLng = { lat: number; lng: number };

export type MapRoute = {
  id: string;
  /** Chip label, e.g. "Şile Otoyolu'ndan" */
  label: string;
  /** Verified starting coordinate of the drive. */
  origin: LatLng;
  /** Primary route renders stronger; others start dimmed. */
  primary?: boolean;
};

export type PoiCategory = "ulasim" | "egitim" | "saglik" | "alisveris" | "yasam";

export type MapPoi = {
  id: string;
  name: string;
  position: LatLng;
  category: PoiCategory;
};

/** Verified project location (My Maps KML, 2026-08-26). */
export const PROJECT_LOCATION: LatLng = { lat: 41.0378312, lng: 29.1528651 };

/** Camera: opens wide over the Çekmeköy area, settles on the project. */
export const CAMERA = {
  center: PROJECT_LOCATION,
  introZoom: 12.2,
  targetZoom: 15.4,
  /** Intro flight duration in ms (skipped under prefers-reduced-motion). */
  flightMs: 2600,
} as const;

/** Official directions deep-link to the verified coordinate. */
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${PROJECT_LOCATION.lat},${PROJECT_LOCATION.lng}`;

/** Route origins — EMPTY until verified coordinates are provided. */
export const ROUTES: MapRoute[] = [];

/** Surrounding places — EMPTY until verified coordinates are provided. */
export const POIS: MapPoi[] = [];

export const POI_CATEGORIES: Record<
  PoiCategory,
  { label: string; icon: string }
> = {
  ulasim: { label: "Ulaşım", icon: "/assets/icons/location.svg" },
  egitim: { label: "Eğitim", icon: "/assets/icons/plan.svg" },
  saglik: { label: "Sağlık", icon: "/assets/icons/comfort.svg" },
  alisveris: { label: "Alışveriş", icon: "/assets/icons/comfort.svg" },
  yasam: { label: "Doğa & Yaşam", icon: "/assets/icons/nature.svg" },
};

export const mapCopy = {
  eyebrow: "Konum",
  heading: "Şehrin içinde,\ndoğaya yakın.",
  projectLabel: "ALA ÇEKMEKÖY NEFES",
  cta: "Google Maps'te Yol Tarifi Al",
  markerCard: {
    title: "A'lâ Çekmeköy Nefes",
    body: "Çekmeköy'ün orman dokusunun yanı başında, Şile Otoyolu bağlantısının hemen üzerinde.",
    cta: "Yol Tarifi Al",
  },
} as const;
