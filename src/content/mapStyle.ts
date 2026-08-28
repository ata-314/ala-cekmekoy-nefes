/**
 * Apple-like brand map style for MapLibre GL, on OpenFreeMap's free vector
 * tiles (OpenMapTiles schema — keyless, production-allowed, OSM data).
 *
 * Design intent (client brief 2026-08-26):
 *  - forests/parks in natural greens, with a subtle woodland texture
 *  - urbanized fabric as a distinct soft tint
 *  - main roads legible, minor roads whisper-quiet
 *  - only meaningful labels: districts/towns, major roads, park names and a
 *    curated set of nearby places (schools, health, transit, shopping, parks)
 *  - no pond/lake naming, no business clutter
 *
 * Layers that depend on runtime-generated images (POI chips, forest texture)
 * are declared here but ADDED by the component once those images exist —
 * otherwise MapLibre floods the console with missing-image warnings.
 */

const TILES_URL = "https://tiles.openfreemap.org/planet";
const GLYPHS_URL = "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf";

const FONT_REG = ["Noto Sans Regular"];
const FONT_BOLD = ["Noto Sans Bold"];

/* Palette anchored to the site tokens */
const GROUND = "#f2f3f7";
const WATER = "#c9d7e4";
const FOREST = "#c2dbbd";
const GRASS = "#dcead6";
const URBAN = "#e2e0ee";
const URBAN_DENSE = "#dcd9ea";
const ROAD_MAJOR = "#ffffff";
const ROAD_CASING = "#bfbdd2";
const ROAD_MINOR = "#ffffff";
const INK = "#00012e";

/** Turkish-first name expression used by every label layer. */
const NAME = ["coalesce", ["get", "name:tr"], ["get", "name"]];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyLayer = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const brandMapStyle: any = {
  version: 8,
  name: "ala-cekmekoy-nefes",
  glyphs: GLYPHS_URL,
  sources: {
    omt: { type: "vector", url: TILES_URL },
  },
  layers: [
    { id: "bg", type: "background", paint: { "background-color": GROUND } },

    /* Nature */
    {
      id: "landcover-wood",
      type: "fill",
      source: "omt",
      "source-layer": "landcover",
      filter: ["in", ["get", "class"], ["literal", ["wood", "forest"]]],
      paint: { "fill-color": FOREST, "fill-opacity": 0.9 },
    },
    {
      id: "landcover-grass",
      type: "fill",
      source: "omt",
      "source-layer": "landcover",
      filter: [
        "in",
        ["get", "class"],
        ["literal", ["grass", "scrub", "meadow", "park"]],
      ],
      paint: { "fill-color": GRASS, "fill-opacity": 0.75 },
    },
    {
      id: "landuse-green",
      type: "fill",
      source: "omt",
      "source-layer": "landuse",
      filter: [
        "in",
        ["get", "class"],
        ["literal", ["park", "grass", "recreation_ground", "cemetery", "garden", "golf_course"]],
      ],
      paint: { "fill-color": GRASS, "fill-opacity": 0.85 },
    },
    {
      id: "park-fill",
      type: "fill",
      source: "omt",
      "source-layer": "park",
      paint: { "fill-color": GRASS, "fill-opacity": 0.55 },
    },

    /* Urban fabric — distinct from nature */
    {
      id: "landuse-urban",
      type: "fill",
      source: "omt",
      "source-layer": "landuse",
      filter: [
        "in",
        ["get", "class"],
        ["literal", ["residential", "suburb", "neighbourhood"]],
      ],
      paint: { "fill-color": URBAN, "fill-opacity": 0.95 },
    },
    {
      id: "landuse-urban-dense",
      type: "fill",
      source: "omt",
      "source-layer": "landuse",
      filter: [
        "in",
        ["get", "class"],
        ["literal", ["commercial", "industrial", "retail"]],
      ],
      paint: { "fill-color": URBAN_DENSE, "fill-opacity": 0.95 },
    },

    /* Water */
    {
      id: "water",
      type: "fill",
      source: "omt",
      "source-layer": "water",
      paint: { "fill-color": WATER },
    },
    {
      id: "waterway",
      type: "line",
      source: "omt",
      "source-layer": "waterway",
      minzoom: 9,
      paint: { "line-color": WATER, "line-width": 1.1 },
    },

    /* Buildings: whisper, only when close */
    {
      id: "buildings",
      type: "fill",
      source: "omt",
      "source-layer": "building",
      minzoom: 13,
      paint: {
        "fill-color": "#cdcadd",
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0.45, 16, 0.85],
      },
    },

    /* Roads — minor first, majors on top */
    {
      id: "road-minor-casing",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 13,
      filter: ["in", ["get", "class"], ["literal", ["minor", "service", "tertiary"]]],
      paint: {
        "line-color": ROAD_CASING,
        "line-opacity": 0.55,
        "line-width": ["interpolate", ["linear"], ["zoom"], 13, 1.4, 16, 4.4],
      },
    },
    {
      id: "road-minor",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 12.5,
      filter: ["in", ["get", "class"], ["literal", ["minor", "service", "tertiary"]]],
      paint: {
        "line-color": ROAD_MINOR,
        "line-width": ["interpolate", ["linear"], ["zoom"], 12.5, 0.6, 16, 3],
      },
    },
    {
      id: "road-secondary-casing",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 10,
      filter: ["in", ["get", "class"], ["literal", ["secondary"]]],
      paint: {
        "line-color": ROAD_CASING,
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1.6, 15, 6.4],
      },
    },
    {
      id: "road-secondary",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 10,
      filter: ["in", ["get", "class"], ["literal", ["secondary"]]],
      paint: {
        "line-color": ROAD_MAJOR,
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.9, 15, 4.4],
      },
    },
    {
      id: "road-major-casing",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary"]]],
      paint: {
        "line-color": ROAD_CASING,
        "line-width": ["interpolate", ["linear"], ["zoom"], 6, 1.4, 11, 4.4, 15, 11.5],
      },
    },
    {
      id: "road-major",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary"]]],
      paint: {
        "line-color": ROAD_MAJOR,
        "line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.9, 11, 3, 15, 8.5],
      },
    },

    /* Boundaries: country + province, quiet */
    {
      id: "boundary",
      type: "line",
      source: "omt",
      "source-layer": "boundary",
      filter: ["<=", ["get", "admin_level"], 4],
      paint: {
        "line-color": "rgba(0,1,46,0.22)",
        "line-width": 0.8,
        "line-dasharray": [2, 2],
      },
    },

    /* Labels — no water/pond names anywhere (client directive). */
    {
      id: "label-park",
      type: "symbol",
      source: "omt",
      "source-layer": "park",
      minzoom: 12,
      layout: {
        "text-field": NAME,
        "text-font": FONT_REG,
        "text-size": 10.5,
        "text-letter-spacing": 0.12,
        "text-max-width": 8,
        "symbol-placement": "point",
      },
      paint: {
        "text-color": "#3f6b46",
        "text-halo-color": "rgba(246,247,252,0.9)",
        "text-halo-width": 1.3,
      },
    },
    {
      id: "label-road-major",
      type: "symbol",
      source: "omt",
      "source-layer": "transportation_name",
      minzoom: 11,
      filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk", "primary"]]],
      layout: {
        "symbol-placement": "line",
        "text-field": NAME,
        "text-font": FONT_BOLD,
        "text-size": ["interpolate", ["linear"], ["zoom"], 11, 10, 16, 12.5],
        "text-letter-spacing": 0.04,
      },
      paint: {
        "text-color": "rgba(0,1,46,0.8)",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1.8,
      },
    },
    {
      id: "label-place",
      type: "symbol",
      source: "omt",
      "source-layer": "place",
      filter: ["in", ["get", "class"], ["literal", ["city", "town", "suburb"]]],
      layout: {
        "text-field": NAME,
        "text-font": FONT_BOLD,
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5,
          ["match", ["get", "class"], "city", 12, 9],
          12,
          ["match", ["get", "class"], "city", 15, 12],
        ],
        "text-letter-spacing": 0.14,
        "text-transform": "uppercase",
      },
      paint: {
        "text-color": "rgba(0,1,46,0.78)",
        "text-halo-color": "rgba(246,247,252,0.92)",
        "text-halo-width": 1.4,
      },
    },
  ] as AnyLayer[],
};

/* ---------------------------------------------------------------------------
   Runtime images: brand POI chips + woodland texture.
   Rendered from inline SVG (no sprite dependency, no extra requests).
--------------------------------------------------------------------------- */

/**
 * Map chip: a white disc with a soft drop shadow and a filled glyph — filled
 * shapes stay legible at map scale where hairline strokes disappear.
 */
const chip = (glyph: string, tint: string = INK) => `
<svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 84 84">
  <defs>
    <filter id="d" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.6"
        flood-color="#00012e" flood-opacity="0.28"/>
    </filter>
  </defs>
  <circle cx="42" cy="42" r="27" fill="#ffffff"
    stroke="rgba(0,1,46,0.16)" stroke-width="1.6" filter="url(#d)"/>
  <g transform="translate(30 30)" fill="${tint}">${glyph}</g>
</svg>`;

/** Curated POI icon set — one filled chip per meaningful category. */
export const BRAND_ICONS: Record<string, string> = {
  "ala-education": chip(`
    <path d="M12 2.9 1.4 8.2 12 13.5l10.6-5.3L12 2.9Z"/>
    <path d="M5.9 11.3v3.6c0 1.9 2.9 3.3 6.1 3.3s6.1-1.4 6.1-3.3v-3.6L12 14.6l-6.1-3.3Z"/>
    <path d="M21.1 9.2h1.3v5.2h-1.3z"/>`),
  "ala-health": chip(`
    <rect x="9.9" y="3.6" width="4.2" height="16.8" rx="1.7"/>
    <rect x="3.6" y="9.9" width="16.8" height="4.2" rx="1.7"/>`),
  "ala-transit": chip(`
    <path d="M8.4 2.8h7.2A3.6 3.6 0 0 1 19.2 6.4v6.4a3.6 3.6 0 0 1-3.6 3.6H8.4a3.6 3.6 0 0 1-3.6-3.6V6.4A3.6 3.6 0 0 1 8.4 2.8Z"/>
    <rect x="7.2" y="5.6" width="9.6" height="4.4" rx="1.2" fill="#ffffff"/>
    <circle cx="9.2" cy="12.9" r="1.25" fill="#ffffff"/>
    <circle cx="14.8" cy="12.9" r="1.25" fill="#ffffff"/>
    <path d="M8.9 17.4 6.6 21h1.9l1.9-3.6H8.9Zm6.2 0 2.3 3.6h-1.9l-1.9-3.6h1.5Z"/>`),
  "ala-shopping": chip(`
    <path d="M5.4 7.2h13.2l-1.15 11.6a2.2 2.2 0 0 1-2.2 2H8.75a2.2 2.2 0 0 1-2.2-2L5.4 7.2Z"/>
    <path d="M9.2 8.6V6.1a2.8 2.8 0 0 1 5.6 0v2.5" fill="none"
      stroke="#ffffff" stroke-width="1.9" stroke-linecap="round"/>`),
  "ala-park": chip(`
    <path d="M12 2.6 17.9 11h-3.3l4.2 6.6H12.75V21h-1.5v-3.4H5.2L9.4 11H6.1L12 2.6Z"/>`,
    "#2f6b41"),
  "ala-worship": chip(`
    <path d="M12 3.6c3.1 1.7 5 4.1 5 6.8v8.2H7v-8.2c0-2.7 1.9-5.1 5-6.8Z"/>
    <rect x="4.4" y="18" width="15.2" height="2.4" rx="1.2"/>
    <circle cx="12" cy="2.4" r="1.1"/>`),
};

/** Repeating woodland texture painted over forest polygons. */
export const FOREST_PATTERN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112">
  <g fill="none" stroke="#6f9a72" stroke-opacity="0.5" stroke-width="1.5"
     stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(16 18)">
      <path d="M8 20v-6"/><path d="M8 14c0-4.4 2.8-7.2 7.2-7.2C15.2 11.2 12.4 14 8 14Z"/>
      <path d="M8 15.4C8 10.6 4.8 7.4 0 7.4c0 4.8 3.2 8 8 8Z"/>
    </g>
    <g transform="translate(66 44)">
      <path d="M8 20v-6"/><path d="M8 14c0-4.4 2.8-7.2 7.2-7.2C15.2 11.2 12.4 14 8 14Z"/>
      <path d="M8 15.4C8 10.6 4.8 7.4 0 7.4c0 4.8 3.2 8 8 8Z"/>
    </g>
    <g transform="translate(34 76)">
      <path d="M8 20v-6"/><path d="M8 14c0-4.4 2.8-7.2 7.2-7.2C15.2 11.2 12.4 14 8 14Z"/>
      <path d="M8 15.4C8 10.6 4.8 7.4 0 7.4c0 4.8 3.2 8 8 8Z"/>
    </g>
  </g>
</svg>`;

/** Forest texture layer — inserted above the wood fill once its image exists. */
export const FOREST_TEXTURE_LAYER: AnyLayer = {
  id: "forest-texture",
  type: "fill",
  source: "omt",
  "source-layer": "landcover",
  minzoom: 10,
  filter: ["in", ["get", "class"], ["literal", ["wood", "forest"]]],
  paint: {
    "fill-pattern": "ala-forest",
    "fill-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0, 12, 0.5, 16, 0.85],
  },
};

/**
 * Nearby places: only categories a home buyer cares about, each mapped to a
 * brand chip. Real OSM data from the tiles — nothing invented.
 */
export const POI_LAYER: AnyLayer = {
  id: "poi-brand",
  type: "symbol",
  source: "omt",
  "source-layer": "poi",
  minzoom: 13,
  filter: [
    "all",
    ["has", "name"],
    ["<=", ["get", "rank"], 22],
    [
      "in",
      ["get", "class"],
      ["literal", [
        "school", "college", "university", "library",
        "hospital", "pharmacy", "doctors",
        "bus", "railway",
        "grocery", "shop", "town_hall",
        "park", "garden", "playground", "stadium", "swimming_pool",
        "place_of_worship",
      ]],
    ],
  ],
  layout: {
    "icon-image": [
      "match",
      ["get", "class"],
      ["school", "college", "university", "library"], "ala-education",
      ["hospital", "pharmacy", "doctors"], "ala-health",
      ["bus", "railway"], "ala-transit",
      ["grocery", "shop", "town_hall"], "ala-shopping",
      ["place_of_worship"], "ala-worship",
      "ala-park",
    ],
    "icon-size": ["interpolate", ["linear"], ["zoom"], 13, 0.55, 16.5, 0.92],
    "icon-allow-overlap": false,
    "text-optional": true,
    "text-field": NAME,
    "text-font": FONT_BOLD,
    "text-size": ["interpolate", ["linear"], ["zoom"], 13, 10.5, 16.5, 13],
    "text-anchor": "top",
    "text-offset": [0, 1.15],
    "text-max-width": 9,
    "symbol-sort-key": ["get", "rank"],
  },
  paint: {
    "text-color": "rgba(0,1,46,0.88)",
    "text-halo-color": "#ffffff",
    "text-halo-width": 2,
    "icon-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0, 13.8, 1],
    "text-opacity": ["interpolate", ["linear"], ["zoom"], 13.4, 0, 14.2, 1],
  },
};

/**
 * Camera choreography: Türkiye overview → cinematic dive that lands close
 * enough to read the streets around the project.
 */
export const CAMERA_FLIGHT = {
  start: { center: [35.2, 39.0] as [number, number], zoom: 4.5, pitch: 0, bearing: 0 },
  end: { zoom: 15.6, pitch: 50, bearing: -14 },
  /** Trimmed on low-end machines by the component. */
  durationMs: 7600,
} as const;
