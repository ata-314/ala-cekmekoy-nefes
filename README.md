# ALA Çekmeköy Nefes — Landing Page

Premium single-viewport landing page. The whole experience lives in one fixed hero: the promo video scrubs with scroll while project info, advantages and gallery appear as glass panels over it. A lead form is always reachable (fixed left panel on desktop, bottom sheet behind the "Bilgi Al" CTA on mobile).

**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · GSAP ScrollTrigger · Lenis · framer-motion (mobile sheet only)

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
```

## Assets (all in place, 2026-08-20)

| Asset | Path | Notes |
|---|---|---|
| Logo (white, on-dark) | `public/assets/logo/logo.png` | From client. A text wordmark renders automatically if the file is ever missing. |
| Scrub video | `public/assets/video/hero.mp4` | Full 1920w, CRF 21, no audio, dense keyframes (`-g 8`) for smooth scroll-seeking. ~28 MB. |
| Mobile loop video | `public/assets/video/hero-mobile.mp4` | 1280w ambient loop for touch devices (~10 MB); chosen client-side, only one file downloads. |
| Poster | `public/assets/video/poster.jpg` | First frame; shown before load and as reduced-motion background. |
| Gallery | `public/assets/gallery/01–09.jpg` | 1600w JPGs converted from client PNGs. Originals + content brief archived in the agent workspace (`projects/ala-cekmekoy-nefes/data/imports/`). |
| Advantage icons | `public/assets/icons/*.svg` | Hand-drawn line icons (nature / location / plan / comfort) in champagne. |

To replace the video, re-encode with dense keyframes so scrubbing stays smooth:

```bash
ffmpeg -i source.mp4 -an -vf "scale=1920:-2,eq=saturation=1.08" -c:v libx264 -preset slow -crf 21 -g 8 -movflags +faststart public/assets/video/hero.mp4
ffmpeg -i source.mp4 -an -vf "scale=1280:-2,eq=saturation=1.08" -c:v libx264 -preset slow -crf 24 -g 50 -movflags +faststart public/assets/video/hero-mobile.mp4
ffmpeg -i public/assets/video/hero.mp4 -frames:v 1 -q:v 2 public/assets/video/poster.jpg
```

## Where to edit content

Everything editable lives in **`src/content/project.ts`** — one typed file: identity, SEO meta, all panel copy, stats, advantages, gallery list, unit types, form labels and KVKK text. Copy is distilled from the client's content guide (PAS flow: Çekmeköy → micro-location → project → residence → value → launch); facts like 14.300 m² / 9 blocks / 72 units / 197–333 m² come straight from it. Still pending from the client: sales phone number and the real KVKK document link.

## Where does the form data go?

Nowhere yet — there is no backend. Validation is complete (Turkish messages, KVKK required) and submit shows a success state, but the `TODO(human)` in `src/components/form/LeadForm.tsx` marks where the real endpoint/CRM call goes once you provide a destination.

## Architecture

```
src/
  content/project.ts        ← all copy, data, asset paths (edit here)
  app/layout.tsx            ← fonts, SEO metadata, lang="tr"
  app/page.tsx              ← Header + Experience
  components/
    SmoothScroll.tsx        ← Lenis wired into GSAP ticker (single raf chain)
    Experience.tsx          ← 620vh scroll track + sticky stage + choreography
    ScrollVideo.tsx         ← scroll-scrubbed video, touch/missing-file fallbacks
    StaticExperience.tsx    ← prefers-reduced-motion layout (plain sections)
    panels/                 ← Intro / Info / Advantages / Gallery / Closing
    form/                   ← LeadForm + desktop panel + mobile bottom sheet
```

Accessibility: reduced-motion users get a fully static page; the form is labelled, keyboard-navigable and the sheet closes with Esc. Missing assets never break the page.
