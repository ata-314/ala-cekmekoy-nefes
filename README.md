# ALA Çekmeköy Nefes — Landing Page

Premium single-viewport landing page. The whole experience lives in one fixed hero: the promo video scrubs with scroll while project info, advantages and gallery appear as glass panels over it. A lead form is always reachable (fixed left panel on desktop, bottom sheet behind the "Bilgi Al" CTA on mobile).

**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · GSAP ScrollTrigger · Lenis · framer-motion (mobile sheet only)

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
```

## Where to drop your assets

The site runs today with graceful placeholders; drop the real files at these exact paths and refresh — no code changes needed.

| Asset | Path | Format / notes |
|---|---|---|
| Logo (on-dark) | `public/assets/logo/logo.svg` | SVG preferred (PNG works — then update `assets.logo` in `src/content/project.ts`). Shown top-left; a text wordmark renders until the file exists. |
| Promo video | `public/assets/video/hero.mp4` | H.264 MP4, ~10–30 s, 1080p+, **no audio needed** (always muted). See encoding note below. |
| Video poster | `public/assets/video/poster.jpg` | First frame of the video, ≥1920×1080. Shown before load, and as background in reduced-motion mode. |
| Gallery images | `public/assets/gallery/01.jpg` … `04.jpg` | 4:3, ≥1600px wide. Add/remove items in `gallery.items` in `src/content/project.ts`. |
| Advantage icons | `public/assets/icons/nature.svg`, `location.svg`, `family.svg`, `security.svg` | Monochrome SVG, ~24px grid. A gold diamond glyph renders until each file exists. |

### Video encoding for smooth scrubbing

Scroll-scrubbing seeks the video every frame, so it needs dense keyframes:

```bash
ffmpeg -i source.mp4 -an -vf scale=1920:-2 -c:v libx264 -g 1 -crf 22 -movflags +faststart public/assets/video/hero.mp4
```

`-g 1` makes every frame a keyframe (bigger file, perfectly smooth seeking). On touch devices the video plays as an ambient loop instead of scrubbing.

## Where to edit content

Everything editable lives in **`src/content/project.ts`** — one typed file: identity & phone, SEO meta, all panel copy, stats, advantages, gallery list, unit types, form labels and KVKK text. Values marked `[PLACEHOLDER]` are layout copy and must be replaced with real project facts before publishing.

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
