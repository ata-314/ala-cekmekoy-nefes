/**
 * Keyless location experience.
 *
 * The public Google My Maps document is the map source. Its verified KML
 * contains one placemark: A'lâ Çekmeköy Nefes at the coordinate below.
 * Embedding that public map does not use the billable Maps JavaScript API and
 * needs neither a Google Cloud project nor an API key.
 */

export type LatLng = { lat: number; lng: number };

export const MY_MAPS_ID = "1ld3GhIueG5k128cJMaxucgZXobNu57Q";

/** Verified from the client's public My Maps KML on 2026-08-26. */
export const PROJECT_LOCATION: LatLng = { lat: 41.0378312, lng: 29.1528651 };

const focus = `${PROJECT_LOCATION.lat},${PROJECT_LOCATION.lng}`;

/** Public, interactive and keyless. `ll` + `z` open directly on the project. */
export const MY_MAPS_EMBED_URL =
  `https://www.google.com/maps/d/embed?mid=${MY_MAPS_ID}` +
  `&ehbc=2E312F&noprof=1&ll=${focus}&z=15`;

export const MY_MAPS_VIEW_URL =
  `https://www.google.com/maps/d/viewer?mid=${MY_MAPS_ID}&ll=${focus}&z=15`;

export const DIRECTIONS_URL =
  `https://www.google.com/maps/dir/?api=1&destination=${focus}`;

/**
 * Named landmarks drawn on top of the map with a prominent brand pill —
 * for places the client wants called out that the map data does not name.
 *
 * "Lens Çekmeköy" is absent from the OpenMapTiles/OSM data the map renders,
 * from OSM Nominatim and from the client's My Maps document, so its
 * coordinate came directly from the client (2026-08-26). It sits ~77 m
 * south-west of the project, matching the content guide's "projenin hemen
 * arkasında". Nothing here is inferred from artwork.
 */
export type Landmark = {
  name: string;
  position: LatLng;
  /** Optional second line, e.g. "Market · Kafe · Restoran". */
  detail?: string;
};

export const LANDMARKS: Landmark[] = [
  {
    name: "Lens Çekmeköy",
    detail: "Market · Kafe · Restoran",
    position: { lat: 41.03724616012578, lng: 29.152377925946414 },
  },
];

export const mapCopy = {
  eyebrow: "Konum",
  heading: "Şehrin içinde,\ndoğaya yakın.",
  projectLabel: "A'LÂ ÇEKMEKÖY NEFES",
  location: "Çekmeköy · İstanbul",
  cta: "Yol Tarifi Al",
  focus: "Konuma Odaklan",
  expand: "Haritayı Büyüt",
  explore: "Etkileşimli Harita",
  poster: "Poster Görünümü",
  hint: "Haritayı sürükleyin · Yakınlaştırmak için kaydırın",
  autoReturn: "Gezintiden 8 sn sonra proje konumuna döner",
  roadLabel: "Şile Otoyolu bağlantısı",
  coordinateLabel: "Proje koordinatı",
  posterSeries: "A'LÂ · LOCATION SERIES 01",
  /* Hero phase — facts straight from the client's content guide. */
  heroPanel: {
    eyebrow: "Konum",
    title: "Ormana komşu,\nana yola birkaç adım.",
    note: "Lens Çekmeköy'ün hemen arkasında · Şile Otoyolu bağlantısına yaklaşık 15–20 m",
    cta: "Konumu Keşfet",
  },
} as const;
