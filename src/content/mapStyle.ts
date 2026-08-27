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
const URBAN = "#e7e6ee";
const ROAD_MAJOR = "#ffffff";
const ROAD_CASING = "#d3d2df";
const ROAD_MINOR = "#eceaf2";
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
        ["literal", ["residential", "suburb", "neighbourhood", "commercial", "industrial", "retail"]],
      ],
      paint: { "fill-color": URBAN, "fill-opacity": 0.6 },
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
      minzoom: 14,
      paint: { "fill-color": "#dedde8", "fill-opacity": 0.55 },
    },

    /* Roads — minor first, majors on top */
    {
      id: "road-minor",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 12.5,
      filter: ["in", ["get", "class"], ["literal", ["minor", "service", "tertiary"]]],
      paint: {
        "line-color": ROAD_MINOR,
        "line-width": ["interpolate", ["linear"], ["zoom"], 12.5, 0.4, 16, 2.4],
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
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.7, 15, 3.6],
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
        "line-width": ["interpolate", ["linear"], ["zoom"], 6, 1.2, 11, 3.4, 15, 8.5],
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
        "line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.7, 11, 2.2, 15, 6],
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
        "text-font": FONT_REG,
        "text-size": 10.5,
      },
      paint: {
        "text-color": "rgba(0,1,46,0.62)",
        "text-halo-color": "rgba(246,247,252,0.9)",
        "text-halo-width": 1.2,
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

const chip = (glyph: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 66 66">
  <circle cx="33" cy="33" r="24" fill="#ffffff" stroke="rgba(0,1,46,0.16)" stroke-width="1.6"/>
  <g transform="translate(21 21) scale(1)" fill="none" stroke="${INK}"
     stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${glyph}</g>
</svg>`;

/** Curated POI icon set — one chip per meaningful category. */
export const BRAND_ICONS: Record<string, string> = {
  "ala-education": chip(
    `<path d="M2 8.4 12 3.6l10 4.8-10 4.8L2 8.4Z"/><path d="M6.6 10.6v4.6c0 1.5 2.4 2.6 5.4 2.6s5.4-1.1 5.4-2.6v-4.6"/>`
  ),
  "ala-health": chip(
    `<path d="M9.6 3.6h4.8v6h6v4.8h-6v6H9.6v-6h-6V9.6h6v-6Z"/>`
  ),
  "ala-transit": chip(
    `<rect x="5.4" y="3.2" width="13.2" height="13.2" rx="3.4"/><path d="M5.4 10.4h13.2"/><path d="M9 20.4l-1.8 1.8M15 20.4l1.8 1.8"/><circle cx="9.2" cy="13.4" r=".9" fill="${INK}" stroke="none"/><circle cx="14.8" cy="13.4" r=".9" fill="${INK}" stroke="none"/>`
  ),
  "ala-shopping": chip(
    `<path d="M5 7.8h14l-1.3 12.4H6.3L5 7.8Z"/><path d="M9.2 7.8V6a2.8 2.8 0 0 1 5.6 0v1.8"/>`
  ),
  "ala-park": chip(
    `<path d="M12 20.4v-6.2"/><path d="M12 14.2c0-4 2.8-6.6 7-6.6 0 4-2.6 6.6-7 6.6Z"/><path d="M12 15.4c0-4.4-3-7.2-7.4-7.2 0 4.4 2.8 7.2 7.4 7.2Z"/>`
  ),
  "ala-worship": chip(
    `<path d="M6 20.4v-8.2a6 6 0 0 1 12 0v8.2"/><path d="M4.4 20.4h15.2"/><path d="M12 6.2V3.4"/>`
  ),
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
    "icon-size": ["interpolate", ["linear"], ["zoom"], 13, 0.5, 16.5, 0.72],
    "icon-allow-overlap": false,
    "text-optional": true,
    "text-field": NAME,
    "text-font": FONT_REG,
    "text-size": ["interpolate", ["linear"], ["zoom"], 13, 10, 16.5, 12],
    "text-anchor": "top",
    "text-offset": [0, 1.05],
    "text-max-width": 9,
    "symbol-sort-key": ["get", "rank"],
  },
  paint: {
    "text-color": "rgba(0,1,46,0.74)",
    "text-halo-color": "rgba(246,247,252,0.94)",
    "text-halo-width": 1.5,
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
  end: { zoom: 16.0, pitch: 50, bearing: -14 },
  /** Trimmed on low-end machines by the component. */
  durationMs: 7600,
} as const;
