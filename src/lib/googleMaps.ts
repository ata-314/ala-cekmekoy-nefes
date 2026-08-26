/**
 * Singleton loader for the Google Maps JS API using the official
 * importLibrary bootstrap. The script is injected at most once, only when
 * first requested (the Konum section triggers it as it nears the viewport).
 *
 * Env:
 *   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY  — required; without it we reject and the
 *                                      section renders its static fallback.
 *   NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID   — cloud Map ID (styled in the console).
 *                                      Falls back to Google's DEMO_MAP_ID in
 *                                      development so Advanced Markers work;
 *                                      production should always set the real
 *                                      one.
 */

let bootPromise: Promise<typeof google.maps> | null = null;

export const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export const MAPS_MAP_ID =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ??
  (process.env.NODE_ENV !== "production" ? "DEMO_MAP_ID" : "");

export function loadGoogleMaps(): Promise<typeof google.maps> {
  if (bootPromise) return bootPromise;

  bootPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("google-maps: no window"));
      return;
    }
    if (!MAPS_API_KEY) {
      reject(new Error("google-maps: missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"));
      return;
    }
    if (window.google?.maps && "importLibrary" in window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    // Official inline bootstrap (single script, importLibrary-based).
    const params = new URLSearchParams({
      key: MAPS_API_KEY,
      v: "weekly",
      language: "tr",
      region: "TR",
      loading: "async",
      callback: "__alaMapsReady",
    });
    (window as unknown as Record<string, unknown>).__alaMapsReady = () => {
      if (window.google?.maps) resolve(window.google.maps);
      else reject(new Error("google-maps: bootstrap callback without maps"));
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.onerror = () => reject(new Error("google-maps: script failed to load"));
    document.head.appendChild(script);
  });

  // Allow a retry after a transient failure instead of caching the rejection.
  bootPromise.catch(() => {
    bootPromise = null;
  });

  return bootPromise;
}
