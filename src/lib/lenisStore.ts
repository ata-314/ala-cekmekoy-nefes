import type Lenis from "lenis";

/** Live Lenis instance (null when smooth scroll is off, e.g. reduced motion). */
export const lenisStore: { current: Lenis | null } = { current: null };

/** Smooth-scroll to a fraction of the page's scrollable height. */
export function scrollToProgress(p: number) {
  const max =
    document.documentElement.scrollHeight - window.innerHeight;
  const top = Math.max(0, Math.min(1, p)) * max;
  if (lenisStore.current) {
    lenisStore.current.scrollTo(top, {
      duration: 1.6,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }
}
