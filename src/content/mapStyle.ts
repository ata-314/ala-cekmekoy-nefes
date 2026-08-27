/**
 * Apple-like brand map style for MapLibre GL, on OpenFreeMap's free vector
 * tiles (OpenMapTiles schema — keyless, production-allowed, OSM data).
 *
 * Design intent (client brief 2026-08-26):
 *  - forests/parks in natural greens, clearly readable
 *  - urbanized fabric as a distinct soft tint
 *  - main roads legible, minor roads whisper-quiet, POIs entirely OFF
 *  - only meaningful labels: districts/towns + major road names + water
 *  - soft paper ground in the site's snow tone
 */

const TILES_URL = "https://tiles.openfreemap.org/planet";
const GLYPHS_URL = "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf";

const FONT_REG = ["Noto Sans Regular"];
const FONT_MED = ["Noto Sans Bold"];

/* Palette anchored to the site tokens */
const GROUND = "#f2f3f7"; // snow-adjacent paper
const WATER = "#c9d7e4";
const FOREST = "#c4dcc0";
const GRASS = "#d9e8d4";
const URBAN = "#e7e6ee"; // built-up fabric — soft obsidian-tinted lilac grey
const ROAD_MAJOR = "#ffffff";
const ROAD_CASING = "#d3d2df";
const ROAD_MINOR = "#ecebf2";
const INK = "#00012e";

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
      paint: { "fill-color": FOREST, "fill-opacity": 0.85 },
    },
    {
      id: "landcover-grass",
      type: "fill",
      source: "omt",
      "source-layer": "landcover",
      filter: ["in", ["get", "class"], ["literal", ["grass", "scrub", "meadow", "park"]]],
      paint: { "fill-color": GRASS, "fill-opacity": 0.7 },
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
      paint: { "fill-color": GRASS, "fill-opacity": 0.8 },
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
      paint: { "fill-color": URBAN, "fill-opacity": 0.62 },
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
      paint: { "fill-color": "#dfdee8", "fill-opacity": 0.5 },
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
        "line-width": ["interpolate", ["linear"], ["zoom"], 12.5, 0.4, 16, 2.2],
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
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, 0.7, 15, 3.4],
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
        "line-width": ["interpolate", ["linear"], ["zoom"], 6, 1.2, 11, 3.4, 15, 8],
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
        "line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.7, 11, 2.2, 15, 5.5],
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
        "line-color": "rgba(0,1,46,0.24)",
        "line-width": 0.8,
        "line-dasharray": [2, 2],
      },
    },

    /* Labels — only what matters. No POIs anywhere. */
    {
      id: "label-water",
      type: "symbol",
      source: "omt",
      "source-layer": "water_name",
      layout: {
        "text-field": ["coalesce", ["get", "name:tr"], ["get", "name"]],
        "text-font": FONT_REG,
        "text-size": 11,
        "text-letter-spacing": 0.12,
      },
      paint: { "text-color": "rgba(0,1,46,0.4)" },
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
        "text-field": ["coalesce", ["get", "name:tr"], ["get", "name"]],
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
        "text-field": ["coalesce", ["get", "name:tr"], ["get", "name"]],
        "text-font": FONT_MED,
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
  ],
};

/** Camera choreography: Türkiye overview → cinematic dive to the project. */
export const CAMERA_FLIGHT = {
  start: { center: [35.0, 39.1] as [number, number], zoom: 4.6, pitch: 0, bearing: 0 },
  end: { zoom: 14.7, pitch: 42, bearing: -12 },
  durationMs: 7000,
} as const;
