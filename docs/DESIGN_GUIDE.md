# Atulya Portfolio — Design & Engineering Guide

> A single source of truth for the visual system, motion language, architecture, and **decisions** behind this site. Hand this file to any coding model (or new collaborator) and they should be able to continue work without losing the design intent.
>
> Last updated alongside the manifesto + spiral implementation. Project lives at `/Users/atulya/Desktop/Portfolio-1`.

---

## 0. The Mental Model

This site is a **senior UI/UX + design engineering portfolio**. The current scope is a four-act intro-to-home-canvas flow that earns attention before the work experience:

```
ACT 1 — Intro animation        (auto-play, GSAP timeline)
   ball + masked text + impacts → ball falls off-screen → blue gradient blooms

ACT 2 — Manifesto              (scroll-driven, scrubbed)
   text overlay on the same gradient → words flip-reveal in sequence
   "atulya — 2026 / product designer. / visual experience designer. / designer who codes."

ACT 3 — Spiral of work cards   (scroll-driven, scrubbed, pinned)
   gradient drains, grid emerges, 3D cylinder of cards rotates through the viewport
   → CTA draws in

ACT 4 — CTA portal             (scroll-driven, scrubbed, same pinned scene)
   the real CTA scales into the camera → off-white canvas fills the viewport
   → a canvas-displaced light grid ripples from the CTA center and settles
```

The whole flow lives in **two files**: `src/App.tsx` and `src/styles.css`. No router, no CMS, no animation library beyond GSAP. Everything else is deliberately not there yet.

### Reference points (and why)
- **pacomepertant.com** — the source inspiration. We're matching the *feel* (loading ball, scroll-driven spiral, deliberate motion) without copying compositions.
- **Apple keynote slides** — for centered manifesto typography and ambient radial gradients with grain dithering.
- Senior portfolios in general — restraint over flourish. Every motion has a reason.

---

## 1. Tech Stack & File Layout

### Stack
- **React 18+ / TypeScript / Vite** — single-page, no SSR.
- **GSAP 3** — `ScrollTrigger` for pinned scroll, `DrawSVGPlugin` for the CTA outline, and `ScrambleTextPlugin` for the CTA label.
- **Inter** (variable, weights 400–800) — loaded from Google Fonts. Stylistic sets `cv11`, `ss01`, `ss03` enabled.
- **No Tailwind, no shadcn, no styled-components.** Hand-written CSS in `src/styles.css`.
- **No icon library** in the intro flow. (The old `lucide-react` only existed in the abandoned `/CaseStudy` directory.)

### Files that matter
```
src/
├── App.tsx           ← entire intro flow (~520 lines). Three phases + lifecycle.
├── main.tsx          ← React root mount, nothing else.
├── styles.css        ← all CSS (~370 lines). No CSS modules.
└── vite-env.d.ts

docs/
└── DESIGN_GUIDE.md   ← this file.

index.html            ← title only. No meta yet.
vite.config.ts        ← default Vite + React plugin.
```

The `/CaseStudy` directory (sibling, at `Portfolio-1/CaseStudy/`) is the **old** Framer-template build. Already audited — see the audit at the top of this conversation thread. It is being replaced by the work in `/src`. Do not edit `/CaseStudy` unless explicitly asked.

---

## 2. Design Philosophy

Internalize these before writing code. Every motion decision below derives from them.

### 2.1 Principles
1. **Motion has weight.** A ball that doesn't squash on impact reads as arcade, not physical. Anticipate → travel-stretch → contact → recover. Always.
2. **Intent over flourish.** If a motion doesn't carry meaning (handoff, emphasis, state-change), it doesn't ship.
3. **Scrub gives agency.** Where scroll drives a reveal, the user is *pulling* the content into existence. Auto-play during a scroll moment is passive — use it only for the loader, never for manifesto/work.
4. **Mask reveals beat opacity fades.** Text that exits should slide *through* a mask boundary, not dissolve. The mask is the whole point — don't undermine it with `opacity: 0` on the way out.
5. **Continuity over chapters.** No section should *start* abruptly. Transitions overlap — gradient begins draining before the spiral pin engages; cards begin entering before the gradient is gone. The user never feels the page "switching modes".
6. **Restraint with color.** This is a **blue + black** site. One radial gradient family, one accent (soft sky for the italic line). No multi-hue palettes.
7. **Type system, not freestyle.** Inter only. ≤6 sizes on the page. Tracking and stylistic sets explicitly set, not browser defaults.

### 2.2 Decision rule (when in doubt)
> "Would a senior motion designer at a Pacome / a16z / Apple-keynote level ship this?" If no, simplify. The goal is *quiet confidence*, not look-what-I-can-do.

---

## 3. Visual System

### 3.1 Color tokens
Defined as CSS custom properties in `:root`. Everything else derives from these.

```css
--blue:        #087cff;   /* primary interactive / accent */
--blue-bright: #3895ff;   /* highlight (ball core, gradient center) */
--blue-deep:   #0a347f;   /* gradient mid-stop */
```

Hard-coded elsewhere:
- **Page base**: `#030303` — near-black, *not* pure black. Pure black on OLED creates visible band edges against the gradient.
- **Text primary**: `rgba(255, 255, 255, 0.97)` — never pure white. 97% knocks the harshness off the typographic edge.
- **Text muted**: `rgba(255, 255, 255, 0.6)` for subtitles.
- **Text eyebrow**: `rgba(255, 255, 255, 0.55)` with 0.34em letter-spacing.
- **Accent italic line**: `rgba(200, 222, 255, 0.95)` — soft sky, sits on the blue gradient without losing legibility.

### 3.2 The gradient
**Single radial ellipse** with seven evenly-spaced stops. *Do not* layer multiple radial-gradients — the stacking caused visible ring banding which took two passes to fix.

```css
background: radial-gradient(
  ellipse 130% 105% at var(--gradient-x) var(--gradient-y),
  #6daaff 0%,
  #3a85ec 18%,
  #1c63cf 36%,
  #0e3f99 54%,
  #06245e 72%,
  #020a26 88%,
  #000204 100%
);
```

Three CSS variables drive it:
- `--gradient-x` (px from viewport left) — usually `50vw`
- `--gradient-y` (px from viewport top) — animated; controls the bloom's vertical center
- `--gradient-radius` (px) — controls the mask radius

The visibility mask:
```css
mask-image: radial-gradient(
  circle var(--gradient-radius) at var(--gradient-x) var(--gradient-y),
  #000 0 60%,
  rgba(0, 0, 0, 0.6) 85%,
  transparent 100%
);
```

A soft 3-stop falloff. Two stops would show a visible mask edge; four causes new banding. Three is the sweet spot.

### 3.3 Dithering grain (banding fix)
Banding on smooth color ramps is a hardware limitation (8-bit displays). The fix is **noise dithering** layered with `mix-blend-mode: overlay`.

```css
.grain-layer {
  position: fixed; inset: 0; z-index: 2;
  opacity: 0.09;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(%23n)'/>
    </svg>");
  background-size: 220px 220px;
}
```

SVG `feTurbulence` is real fractal noise — DO NOT replace with `repeating-radial-gradient` (which reads as dots, not grain).

### 3.4 Typography

**Font**: Inter (variable). Imported once at the top of `styles.css`.

```css
:root {
  font-family: 'Inter', system-ui, sans-serif;
  font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1, 'ss01' 1, 'ss03' 1, 'cv11' 1;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
```

The OpenType features matter:
- `kern` + `liga` + `calt` — kerning, ligatures, contextual alternates
- `ss01` — Inter's open-digit set
- `ss03` — single-storey `a`, tighter `g` (the "Inter Display" feel without a separate file)
- `cv11` — alternate `i` (gives the lowercase `i` a tighter ascender)

**Type scale used in the site:**

| Role | Size | Weight | Tracking | Casing |
|---|---|---|---|---|
| Intro hero (`hey!`, `i'm atulya`) | `clamp(3rem, 6.4vw, 6.6rem)` | 600 | `-0.08em` | none |
| Manifesto display | `clamp(2.6rem, 7vw, 7.6rem)` | 500 | `-0.05em` | none |
| Manifesto accent (italic) | same as display | 500 | `-0.05em` | none + italic |
| Manifesto eyebrow | `11px` | 500 | `0.34em` | UPPERCASE |
| Manifesto subtitle | `clamp(0.95rem, 1.25vw, 1.3rem)` | 400 | `-0.005em` | none |
| Scroll cue | `11px` | regular | `0.22em` | UPPERCASE |
| Spiral card label | `10px` | regular | `0.28em` | UPPERCASE |

**Rules:**
- Tight tracking (negative letter-spacing) on display sizes. The `-0.05` to `-0.08em` range is calibrated to Inter at large sizes.
- Uppercase only as **eyebrows and meta-labels**, never on body or display.
- Line-height `1` on display, `1.45` on subtitle, `1.2` on UI.
- Italic reserved for the **single accent line**. Italic is *expensive* — overuse and it reads cheap.

### 3.5 Spacing & radii
Not formalized as tokens yet — values are inline with `clamp()` for responsive scaling. Common values:
- Section vertical: viewport-relative (`min-height: 100vh`).
- Section padding: `padding: 0 clamp(28px, 6vw, 120px)` for manifesto-style layouts.
- Card radius: `14px` on spiral cards.
- Button-like elements: `border-radius: 999px` (pill).
- Glow shadows: multi-stop (`0 0 24px ... / 0 0 80px ... / 0 0 160px ...`) for the ball.

When a spacing/radius token system is introduced, codify it in `:root` first.

### 3.6 Z-order (the stacking plan)
**Fixed background layers** sit behind all sections. Sections themselves stack vertically in document flow.

| Element | `z-index` | Position | Purpose |
|---|---|---|---|
| `.gradient-field` | 1 | fixed | Radial blue bloom (with mask) |
| `.grid-field` | 1 | fixed | Square grid lines (post-drain backdrop) |
| `.grain-layer` | 2 | fixed | SVG noise dither overlay |
| `.intro-shell` | 3 | relative | Section: intro + manifesto overlay |
| `.flash-layer` | 4 | fixed | White flash during intro's ball→gradient handoff |
| `.spiral-section` | 3 | relative | Section: 3D cylinder |
| `.manifesto-overlay` | 5 (local) | absolute (inside intro-shell) | Manifesto text on the gradient |
| `.scroll-cue` | 6 (local) | absolute (inside intro-shell) | "SCROLL" prompt |

`.intro-shell` has `isolation: isolate`, creating its own stacking context — so manifesto-overlay (`z:5`) and scroll-cue (`z:6`) are layered *inside* intro-shell, not against the global tree.

---

## 4. Motion Language

The vocabulary used everywhere. Internalize these so new sections feel native.

### 4.1 The physics primitive

Anything that moves like an object (ball, falling text, impact) uses this four-beat structure:

```
ANTICIPATE    → object compresses/loads before action  (scaleY ≈ 0.74, 0.1–0.2s, power2.out)
TRAVEL        → stretch in direction of motion        (scaleY > 1 on fast vertical, 0.4–0.7s)
CONTACT       → 1-frame hard squash                   (scaleY ≈ 0.5, scaleX ≈ 1.5, 0.06–0.08s, power3.out)
RECOVER       → elastic settle back to neutral        (0.22–0.35s, elastic.out(1, 0.48))
```

This is the difference between "arcade" and "alive".

### 4.2 Gravity easings
- **Rise**: `power2.out` (decelerates as it climbs).
- **Fall**: `power2.in` (accelerates as it drops).
- Symmetric. Anything else makes the motion float.

### 4.3 Text reveals
- **Reveal (entry)**: `expo.out` — snappy arrival.
- **Exit**: `power3.in` — accelerates away.
- *Never* the same ease for both. Asymmetry is what sells "appear → leave" as two distinct moments.

Reveal pattern:
```ts
gsap.set(chars, { yPercent: 115, rotationX: -55, opacity: 0 });
gsap.to(chars,   { yPercent: 0,   rotationX: 0,   opacity: 1, ease: 'expo.out', stagger: 0.04 });
```

Exit pattern:
```ts
gsap.to(chars, { yPercent: -115, rotationX: 55, opacity: 0, ease: 'power3.in', stagger: 0.025 });
```

For exits, `opacity: 0` is *acceptable* (chars are 3D-rotating away). For mask-reveal exits where the mask alone is supposed to clip, **do not** set `opacity: 0` — it defeats the mask.

### 4.4 Mask reveals
Every text line that animates is wrapped in a parent with `overflow: hidden`. The animated element translates inside that parent. No opacity needed; the mask boundary *is* the reveal.

```html
<div class="word-mask">           ← overflow: hidden, the mask
  <span class="char">A</span>      ← yPercent: 115 → 0
  <span class="char">t</span>
  ...
</div>
```

For per-char rotation flips, **do not** put each char in its own `overflow: hidden` wrapper — that broke kerning between characters (browsers can't kern across element boundaries). One mask per *line*, chars are bare `inline-block` inside it. Compensate the lost kerning with tighter `letter-spacing`.

### 4.5 Scrub vs auto-play

| Use scrub when... | Use auto-play when... |
|---|---|
| The user is reading or examining (manifesto, work) | First-load loader / brand moment (intro) |
| Content reveals belong to user agency | A self-contained moment with a clear end |
| Section is pinned and the scroll *is* the timeline | No scroll is happening yet (locked body) |

### 4.6 Camera shake & impact frames
- Stage shake on impact: `gsap.fromTo(stage, { y: -3 }, { y: 0, ease: 'elastic.out(1, 0.35)', duration: 0.32 })`. **Sub-pixel** values (-3, never -10) — visible but not jarring.
- Shockwave ring: bordered circle, scale `0.25 → 2.5` over `0.55s` with `power3.out` ease, opacity `0.78 → 0`.
- Soft bloom: filled radial-gradient circle, scale `0.65 → 2.1` over `0.5s`, opacity `0.55 → 0`.

### 4.7 The "ball becomes light becomes world" handoff
For any large state transition (intro → gradient, gradient → next section), use this three-element pattern:
1. **Anticipation hold** — the source element decelerates before transforming.
2. **Flash** — a white radial gradient blooms for ~0.12s at the moment of transformation.
3. **Cross-fade** — source fades/scales out while destination expands.

The flash is what sells "the ball became the gradient" instead of "the ball disappeared and a gradient appeared".

---

## 5. Architecture (`App.tsx`)

### 5.1 High-level structure

```tsx
export default function App() {
  // refs for every animated element
  const introRef        = useRef<HTMLElement>(null);
  const stageRef        = useRef<HTMLElement>(null);
  const ballRef         = useRef<HTMLDivElement>(null);
  const ballCoreRef     = useRef<HTMLSpanElement>(null);
  const heyMaskRef      = useRef<HTMLDivElement>(null);
  const nameMaskRef     = useRef<HTMLDivElement>(null);
  const gradientRef     = useRef<HTMLDivElement>(null);
  const gridRef         = useRef<HTMLDivElement>(null);
  const impactRef       = useRef<HTMLDivElement>(null);
  const ringRef         = useRef<HTMLDivElement>(null);
  const flashRef        = useRef<HTMLDivElement>(null);
  const spiralSectionRef = useRef<HTMLElement>(null);
  const spiralCardsRef  = useRef<HTMLDivElement>(null);

  // setup-once flags (prevent React StrictMode double-init)
  const runtimeRef         = useRef<Runtime | null>(null);
  const scrollSetupRef     = useRef<boolean>(false);
  const manifestoSetupRef  = useRef<boolean>(false);
  const scrollTriggersRef  = useRef<ScrollTrigger[]>([]);

  const runIntro          = useCallback(...);  // plays the GSAP timeline
  const setupManifestoPhase = useCallback(...); // pins intro, scrub words
  const setupScrollPhase  = useCallback(...);   // spiral + drain

  useEffect(() => {
    runIntro();
    setupManifestoPhase();
    setupScrollPhase();
    // resize handlers, cleanup
  }, [...]);

  return <div className="app-shell">...</div>;
}
```

### 5.2 The body scroll lock
The body locks during intro playback via a data attribute:

```css
body[data-intro='playing'] { overflow: hidden; }
```

Set in `runIntro` at start, switched to `'done'` in the timeline's `onComplete` (`finalize` callback). This also calls `ScrollTrigger.refresh()` so any pin positions reflect post-intro layout.

### 5.3 ScrollTrigger inventory
At any time, these triggers exist:

| Name | Trigger | Range | Behavior |
|---|---|---|---|
| Manifesto reveal | `intro-shell` | `top top → +=60%` | Pins intro-shell, scrubs word reveal tween |
| Scroll cue fade | `intro-shell` | `top top → +=12%` | Fades scroll-cue out on scroll start |
| Gradient drain | `spiral-section` | `top bottom → top top` | Drains gradient + emerges grid (not pinned) |
| Card spiral | `spiral-section` | `top top → +=420%` | Pins spiral, scrubs helix transform on cards, preserves old card timing via progress remap |
| CTA draw + portal | `spiral-section` | `top top → +=420%` | Draws the actual CTA, scales it into an off-white canvas, then redraws a displaced grid ripple on canvas |

The drain and card triggers **share the spiral section** but have non-overlapping scroll ranges, so they don't fight.

All triggers are pushed into `scrollTriggersRef.current` so cleanup can `.kill()` them on unmount.

### 5.4 React StrictMode
React 18+ runs effects twice in dev. Without guards, `setupScrollPhase` would create duplicate triggers. The `manifestoSetupRef`/`scrollSetupRef` flags prevent this; the cleanup function clears them so a real remount works.

---

## 6. Phase 1 — Intro Animation (Auto-play)

### 6.1 The story
1. Black screen. Ball below center.
2. Pre-launch squash (anticipation).
3. Ball rises with vertical stretch. `hey!` mask becomes visible, chars flip-reveal.
4. Ball arcs down, hits the top of `hey!`. Impact: squash + shockwave ring + soft bloom + stage shake + text recoil.
5. Ball rebounds. `hey!` flips out downward. `i'm atulya` flips in. **No pause** between these — the ball arc is continuous.
6. Ball arcs down, hits `i'm atulya`. Heavier impact.
7. Ball rebounds slightly, name flips out, ball falls off-screen below.
8. Brief white flash at the bottom edge → ball expands and fades → blue gradient blooms outward from where the ball left.

Total duration: **~4.9s**.

### 6.2 The full timeline (key positions)

| Time | Element | Action | Easing |
|---|---|---|---|
| `0.00` | `ballCore` | scaleX 1, scaleY 1 → 1.18 / 0.74 (anticipation) | `power2.out` |
| `0.18` | `ballCore` | scaleX/Y back to 1 | `power2.in` |
| `0.22` | `heyMask` | autoAlpha 1 (mask now clipping) | — |
| `0.22` | `ball` | y → `apexY` (rise) | `power2.out` |
| `0.30` | `heyChars` | flip reveal (yPercent: 115→0, rotationX: -55→0) | `expo.out`, stagger 0.04 |
| `0.82` | `ball` | y → `firstContactY` (fall) | `power2.in` |
| `1.26` | — | **IMPACT 1**: shockwave + bloom + stage shake (strength 0.85) | — |
| `1.25` | `ballCore` | scaleX 1.5 / scaleY 0.52 (catch frame) | `power3.out` |
| `1.26` | `heyChars` | yPercent: -4 micro-recoil | `power2.out`, stagger 0.005 |
| `1.32` | `ballCore` | back to 1/1 (elastic recovery) | `elastic.out(1, 0.48)` |
| `1.30` | `ball` | y → `reboundY` | `power2.out` |
| `1.34` | `heyChars` | flip exit (yPercent: 0→-115, rotationX: 0→55, opacity 1→0) | `power3.in`, stagger 0.025 |
| `1.62` | `nameMask` | autoAlpha 1 | — |
| `1.66` | `nameChars` | flip reveal | `expo.out`, stagger 0.035 |
| `1.78` | `ball` | y → `secondContactY` (continuous fall, **no pause**) | `power2.in` |
| `2.38` | — | **IMPACT 2** (strength 1.0, heavier) | — |
| `2.56` | `nameChars` | flip exit | `power3.in`, stagger 0.022 |
| `2.78` | `ball` | y → `finalY` (off-screen below) | `power2.in` |
| `3.70` | — | gradient origin re-anchored at finalY | — |
| `3.72` | `flash` | autoAlpha 0 → 0.85 | `power2.out` |
| `3.74` | `ball` | scale 1 → 5.6, opacity 1 → 0 | `power3.out` |
| `3.74` | `gradient` | opacity 0 → 1 | `power2.out` |
| `3.74` | gradient | mask radius 0 → maxRadius | `power3.out` (1.2s) |
| `~4.94` | — | timeline `onComplete` → `finalize()` | — |

### 6.3 Vertical anchors (responsive)
Computed from the stage's bounding rect at intro start, clamped for sanity.

```ts
const restY          = clamp(rect.height * 0.22, 140, 220);   // ball start position
const apexY          = clamp(rect.height * -0.2, -220, -130); // top of first arc
const firstContactY  = clamp(rect.height * -0.06, -64, -42);  // y of "hey!" line
const secondContactY = clamp(rect.height * -0.052, -56, -38); // y of "i'm atulya" line
const reboundY       = clamp(rect.height * -0.22, -240, -150);// apex after first impact
const finalY         = rect.height * 0.62;                    // off-screen below
```

### 6.4 The continuous-arc trick (no pause between impacts)
Originally the ball reached rebound apex and **held** for ~0.36s while the name revealed. Visible dead air. Fix:

- Rebound `power2.out` duration shortened to `0.48` so apex is reached at `1.78s`.
- Name reveal starts at `1.66s` (overlapping the rebound's tail).
- Ball descent into name starts **at the apex moment** (`1.78s`), not later.

Result: ball arc is continuous — up, peak frame, down — never stops moving between the two impacts.

### 6.5 Ball construction
```html
<div class="ball">                ← outer: holds the glow (box-shadow)
  <span class="ball-core" />      ← inner: handles squash transforms
</div>
```

**Important:** the box-shadow lives on the OUTER `.ball`, not on `.ball-core`. When the core squashes (scaleX 1.5 / scaleY 0.52), the glow would warp into an ellipse if it were on the same element. Separating them keeps the glow circular through impacts.

The core's background is a two-stop radial: specular highlight at 35%/30% + blue body. That's what makes it read as a 3D sphere rather than a flat disc.

### 6.6 Reduced motion
`prefersReducedMotion()` short-circuits the timeline to a final state — chars revealed, ball hidden, gradient at full bloom. The body still unlocks. Scroll phases still work normally.

---

## 7. Phase 2 — Manifesto (Scroll-driven Overlay)

### 7.1 The structural decision: overlay, not section
The manifesto **lives inside `.intro-shell`** as a `position: absolute` overlay, NOT as a separate section below it. Why:

> If the manifesto were a sibling section, you'd have to scroll 100vh to reach it after the intro. The text would arrive on a "new page." We want the text to appear on **the same viewport** as the bloomed gradient — same backdrop, no scroll-jump.

So:
```html
<main class="intro-shell">
  <section class="stage">...ball + intro text...</section>
  <div class="manifesto-overlay">           ← absolute, inset:0, z:5
    <div class="manifesto-inner">
      <div class="m-line m-eyebrow">...</div>
      <h2 class="m-line m-display">...</h2>
      <h2 class="m-line m-display">...</h2>
      <h2 class="m-line m-display m-display-accent">...</h2>
      <p class="m-line m-sub">...</p>
    </div>
  </div>
  <div class="scroll-cue">...</div>
</main>
```

During intro playback, words are `opacity: 0` and invisible. Once intro completes and the user scrolls, the manifesto reveals over a short scroll range *on the same viewport*.

### 7.2 The copy
```
ATULYA — 2026                                            (eyebrow, uppercase, tracked)
product designer.                                        (display)
visual experience designer.                              (display)
designer who codes.                                      (display, italic, soft-blue, glow)
building interfaces that feel considered, alive,         (subtitle)
and inevitable.
```

**Composition logic:** three display lines of different widths (short / long / medium) center-stacked form an organic shield-shape. The third line is the punch — italic + soft-blue (`rgba(200, 222, 255, 0.95)`) + 2-stop text-shadow glow.

The user can edit copy freely; the per-word reveal adapts to any word count (just change the JSX, the GSAP `.querySelectorAll('.m-word')` picks them up automatically).

### 7.3 Reveal motion
```ts
gsap.set(words, { yPercent: 115, rotationX: -28, opacity: 0 });

gsap.to(words, {
  yPercent: 0,
  rotationX: 0,
  opacity: 1,
  duration: 1,
  ease: 'expo.out',
  stagger: 0.18,
  scrollTrigger: {
    trigger: introRef.current,    // pins the INTRO SHELL, not the manifesto
    start: 'top top',
    end: '+=60%',                 // 60% of viewport scroll to fully reveal
    pin: introRef.current,
    pinSpacing: true,
    scrub: 0.6,
  },
});
```

`perspective: 1200px` on `.manifesto-overlay` makes the `rotationX: -28°` read as real 3D tilt.

### 7.4 Centered alignment
```css
.manifesto-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;       /* centers each .m-line horizontally */
  text-align: center;        /* centers inline content within each line */
}
```

The accent line gets a glow without resorting to a larger size or louder color:

```css
.m-display-accent {
  color: rgba(200, 222, 255, 0.95);
  font-weight: 500;
  font-style: italic;
  text-shadow:
    0 0 38px rgba(140, 200, 255, 0.32),
    0 0 96px rgba(80, 140, 230, 0.18);
}
```

### 7.5 Tight display-line stacking
Each `.m-line` has `overflow: hidden` + `padding: 0.16em 0` to give the `rotationX` overshoot space. With overflow:hidden, **margins don't collapse** (new block formatting context), so the padding adds visible space between display lines. Counteract with a negative top margin:

```css
.m-display + .m-display {
  margin-top: -0.14em;   /* pulls display lines tight against each other */
}
```

### 7.6 Scroll cue fade-out
The "SCROLL" prompt fades during the first 12% of the pin scroll, so it doesn't sit over the manifesto text:

```ts
gsap.to(cue, {
  autoAlpha: 0,
  scrollTrigger: {
    trigger: intro,
    start: 'top top',
    end: '+=12%',
    scrub: true,
  },
});
```

---

## 8. Phase 3 — Spiral (3D Cylinder of Cards)

### 8.1 The cylindrical model (and what it replaces)
Initial attempt gave each card its own helical path through the viewport. Result: cards at opposite phase offsets mirrored each other across center → looked like a **DNA double helix**, not a tower.

The fix: a **single shared vertical cylinder**. All cards live on it at fixed angular slots and fixed vertical positions. The cylinder rotates around its Y axis AND translates upward as scroll progresses. Cards always face *outward* from the axis (so the camera sees the front when a card is at θ = 0, an edge at θ = 90°, the back at θ = 180°).

### 8.2 The math
For each card `i` of `N` cards, at scroll progress `t` (0 → 1):

```ts
// Permanent properties (don't change with scroll)
baseAngle_i = (i / N) * 2π          // angular slot on the cylinder
baseY_i     = (N - 1 - i) * spacing  // card 0 lives at the BOTTOM of the cylinder

// Cylinder state (changes with scroll)
cylinderRotation    = t * 1.1 * 2π   // 1.1 turns through the full scroll
cylinderTranslateY  = entryBuffer - t * totalTravel
                    where totalTravel = entryBuffer + (N-1)*spacing + exitBuffer

// World position of card i
worldTheta = baseAngle_i + cylinderRotation
worldY     = baseY_i + cylinderTranslateY
x          = sin(worldTheta) * radius
z          = cos(worldTheta) * radius
rotationY  = worldTheta (in degrees)     ← key: card face always points outward

// Depth styling (z ∈ [-radius, +radius], where +radius = closest to camera)
depthFactor = (z + radius) / (2 * radius)   // 0 = back, 1 = front
scale       = 0.7  + depthFactor * 0.42
opacity     = 0.2  + depthFactor * 0.8
blur        = (1 - depthFactor) * 5         // px
```

### 8.3 Card 0 is at the bottom of the cylinder
This is counterintuitive but correct: in screen coords, **larger Y = lower position**. For card 0 to enter the viewport first as the cylinder rises, it must sit at the *bottom* of the stack initially (largest baseY). Hence `baseY_i = (N - 1 - i) * spacing` (card 0 → biggest baseY; card N-1 → 0, the top of the cylinder).

### 8.4 Parameters
```ts
const N             = 8;                                   // cards
const radius        = clamp(vw * 0.17, 200, 340);          // orbit radius
const spacing       = vh * 0.55;                           // vertical separation between cards
const rotations     = 1.1;                                 // turns through full scroll
const entryBuffer   = vh * 0.56;                           // first card sits just below viewport at t=0
const exitBuffer    = vh * 0.7;                            // last card just above viewport at t=1
```

Tune these to taste:
- Wider `radius` → bigger carousel arc.
- Smaller `spacing` → more cards visible in the viewport at once (denser).
- More `rotations` → swirlier; less = readable but less dynamic.

### 8.5 ScrollTrigger split
**Two** triggers on the spiral section, intentionally:

```ts
// A. Gradient drain + grid emerge — broader range, OVERLAPS the handoff
ScrollTrigger.create({
  trigger: spiralSectionRef.current,
  start: 'top bottom',    // fires when spiral starts entering from below
  end:   'top top',       // ends when spiral pin engages
  scrub: 0.7,
  onUpdate: (self) => {
    const t = self.progress;
    gradient.style.opacity = String(Math.max(0, 1 - t * t));     // t² curve
    gradient.style.setProperty('--gradient-y',
      `${window.innerHeight * (1.12 + t * 0.55)}px`);            // continues from intro's 1.12vh
    const gridT = clamp(t * 1.15, 0, 1);
    grid.style.opacity = String(gridT * 0.66);
    grid.style.transform = `translateY(${(1 - gridT) * 80}px)`;
  },
});

// B. Card placement — pinned, scrubbed
ScrollTrigger.create({
  trigger: spiralSectionRef.current,
  start: 'top top',
  end:   '+=300%',
  pin:    true,
  scrub:  0.5,
  onUpdate: (self) => placeCards(self.progress),
});
```

The drain (A) finishes exactly when the spiral pin (B) engages. No dead zone, no abrupt cut.

### 8.6 The gradient-continuity rule
**Critical:** the intro leaves `gradient-y = 1.12 × vh` (origin below the viewport). The drain MUST start from that same value, not from `0.62 × vh` (which would teleport the bloom up into view).

```ts
const drainY = window.innerHeight * (1.12 + t * 0.55);   // continues from intro
```

If you ever change the intro's `finalY`, update this offset to match. Continuity is everything.

### 8.7 Card screenshot visuals
Eight real screenshot `.spiral-card` elements served from `/public/cards/`. Keep each screenshot's native aspect ratio in `cardImages` so UI text is not cropped into a forced frame:

```tsx
<div className="spiral-card" style={{ aspectRatio: image.aspect }}>
  <img src={image.src} alt="" loading="eager" />
</div>
```

Card dimensions: `clamp(340px, 29vw, 520px)` wide. The GSAP scale is intentionally capped below `1` (`0.62 + depthFactor * 0.36`) so sharp UI screenshots are not compositor-upscaled. Border-radius `14px`, white `0.1` outline, and layered shadows.

---

## 9. Patterns to Follow (DO)

- **Use `gsap.context(() => { ... }, scope)` for all GSAP work inside React.** It scopes selectors and gives you `ctx.revert()` for cleanup.
- **One mask per text line, not per character.** Per-char `overflow:hidden` breaks cross-element kerning.
- **`box-shadow` on the parent, transforms on the child.** Squash a glowing element by transforming an inner element, not the one carrying the shadow.
- **Match start values across handoffs.** When animation A hands off to animation B, B's initial state must equal A's final state.
- **`will-change` only where you're actually transforming.** Don't decorate everything — the browser will run out of budget.
- **Tight letter-spacing to compensate for inline-block char splits.** Browsers can't kern across element boundaries; `letter-spacing: -0.08em` gets you close.
- **Sub-pixel shake values** (`-3px`, never `-10px`). Camera shake at >5px reads as a jolt, not weight.
- **Cleanup via `scrollTriggersRef.current.forEach(t => t.kill())` on unmount.** Otherwise StrictMode dev leaks triggers.
- **`ScrollTrigger.refresh()` after the intro completes** — pin positions calculated under `body[data-intro='playing']` (overflow:hidden) might be stale.
- **Italic only for the accent.** Italic styling is expensive; using it once gives it weight.

---

## 10. Anti-patterns (DON'T)

These were all real bugs in earlier iterations:

| Anti-pattern | Why it's wrong | What to do instead |
|---|---|---|
| Per-char `<span class="char-mask">` with `overflow: hidden` | Kerning breaks between adjacent `inline-block` chars (e.g., the "ey" gap in `hey!`) | One mask per LINE; chars are bare inline-block with tighter letter-spacing |
| `opacity: 0` on text exit through a mask | Defeats the entire point of the mask — the boundary stops being meaningful | Just translate yPercent; let the mask clip |
| Multiple stacked `radial-gradient`s | Color stops compound into visible rings | One ellipse with 7 evenly-spaced stops |
| Hard color stops (`#a 0%, #b 18%, #c 36%, ...` close-spaced) | Banding on smooth ramps | Wider stop spacing + grain noise overlay |
| Resetting `--gradient-y` to a different value on handoff | Bright bloom teleports → user notices the "switch" | Drain trigger continues from intro's final value |
| Each spiral card on its own helix | Cards at opposite phases mirror across center → DNA strand look | Shared cylinder model; all cards rotate together |
| `box-shadow` on the squashed element | Glow distorts to ellipse during squash | Shadow on outer, transform on inner |
| `text-transform: uppercase` globally | Constantly fighting it with `none` overrides; bad for readability | Uppercase only on eyebrows/labels |
| Pin range = 0 (pinning forever or too little) | Either traps the user or skips by too fast | Calibrate per content; manifesto = 60%, spiral = 300% |
| `transform: blur(...)` instead of `filter: blur(...)` | Not how blur works (transform doesn't blur) | Always `filter: blur(...px)` |
| Custom scroll smoothing (Lenis etc.) | Adds dependency, complicates ScrollTrigger math, fights system scroll on Mac | Native scroll + GSAP `scrub` with a small value (0.5–0.7) gives plenty of smoothness |

---

## 11. Tunable Knobs (Quick Reference)

When the user says "make it feel different", here's the dial set:

### Intro
| Knob | Where | Default | Effect of change |
|---|---|---|---|
| Total runtime | timeline positions in `runIntro` | ~4.9s | Multiply all positions by 0.85 → snappier |
| Squash intensity | impact tweens `scaleX: 1.5, scaleY: 0.52` | as listed | `1.35 / 0.6` for subtler |
| Stage shake amount | `fireImpact` `-3 * strength` | -3 | -2 for retina-friendly |
| Flash brightness | `flash autoAlpha: 0.85` | 0.85 | 0.6 for restraint |
| Apex height | `apexY = -0.2 * height` | -0.2 | -0.25 for higher arc |
| Off-screen final | `finalY = 0.62 * height` | 0.62 | 0.75 to send ball further out |

### Manifesto
| Knob | Where | Default | Effect |
|---|---|---|---|
| Reveal scroll length | `end: '+=60%'` | 60% | 45% snappier, 80% slower |
| Word stagger | `stagger: 0.18` | 0.18 | 0.10 faster cascade |
| Flip tilt | `rotationX: -28` | -28 | -15 subtler, -45 dramatic |
| Accent treatment | `.m-display-accent` | italic + glow | swap for outline-only via `-webkit-text-stroke` |

### Spiral
| Knob | Where | Default | Effect |
|---|---|---|---|
| Pin scroll length | `end: '+=300%'` | 300% | 200% snappier |
| Card count | `cardImages.length` | 8 | 6 sparse, 12 dense |
| Helix tightness | `rotations` | 1.1 | 0.6 = half turn, 2.0 = double swirl |
| Card spacing | `spacing = vh * 0.55` | 0.55 | 0.35 dense, 0.7 airy |
| Depth scale dramatics | `scale: 0.62 + depthFactor * 0.36` | max 0.98 | Keep below 1 for crisp screenshots |
| Card yaw wobble | `rotationZ = sin(...) * 2.25` | 2.25deg | Higher feels looser but softens UI text |

### Gradient
| Knob | Where | Default | Effect |
|---|---|---|---|
| Drain curve | `drainCurve = t * t` | t² | `t` linear, `t*t*t` slower start |
| Drain Y descent | `1.12 + t * 0.55` | 0.55 | Larger = origin moves further |
| Grain opacity | `.grain-layer { opacity: 0.09 }` | 0.09 | 0.05 subtle, 0.15 dirty |

---

## 12. Performance Notes

- **8 cards × `gsap.set` per frame** is fine. Tested on retina at 60fps.
- **No `filter: blur(...)` on cards.** With real screenshots it forces rerasterization and makes UI details look soft during scroll. Depth is carried by scale, opacity, z-order, and perspective.
- **Card scale stays below `1`.** The base CSS width is larger, then GSAP scales down. This avoids compositor upscaling blur on crisp UI screenshots.
- **`will-change`** declared on transformed elements (`.ball`, `.ball-core`, `.spiral-card`, `.m-word`). Don't extend it to unaffected elements — it's a budget.
- **`zIndex: Math.round((z + radius) * 10)`** on cards is a hint to the browser when sorting 3D-transformed siblings. Without it, occlusion can flicker.
- **Grain layer is a 220×220px tile** repeated. Total noise data is small. Don't move to a full-viewport SVG — it'll be repainted every frame.
- **No body scroll smoothing library.** Native + GSAP `scrub: 0.5–0.7` gives buttery feel without dependencies.
- The scrollbar is hidden cross-browser:
  ```css
  html, body { scrollbar-width: none; -ms-overflow-style: none; }
  html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; width: 0; height: 0; }
  ```

---

## 13. Accessibility

- **Reduced motion** is honored at the intro's GSAP level (skip to final state). It is NOT yet honored at the manifesto/spiral level — the scroll-driven reveals still apply. To improve: gate the ScrollTriggers behind `prefers-reduced-motion: no-preference`, or set them to `scrub: false` with simple opacity-only reveals.
- **ARIA**: `aria-label` on each section (`.manifesto-overlay` carries "Introduction"; `.spiral-section` carries "Selected work spiral"; `.intro-shell .stage` carries "Atulya animated intro"). The ball + ring + flash are `aria-hidden`.
- **Keyboard intro skip** is wired (`Escape` or `Space` advances timeline to end during playback). This is for development; user-facing buttons were removed.
- **Heading levels**: manifesto uses `<h2>` for display lines (intentional — the page has no `<h1>` yet because there's no real landing copy). When the real landing copy arrives, that gets `<h1>`.
- **Color contrast**: muted text at `rgba(255, 255, 255, 0.55–0.6)` against the blue gradient is intentionally restrained; verify with your contrast tool before locking copy.

---

## 14. Roadmap (what's next, in priority order)

1. **Real case-study content for the spiral cards** — replace gradient placeholders with screenshots from the user's actual work (ChartingLibrary, MDS Color Refresh, WCAG audit, etc.).
2. **Design the light home screen** — the CTA portal now lands on a blank off-white grid. Next task: decide the actual home/menu/work layout that appears after the ripple settles.
3. **Case-study page template** — long-form layout with anchors, images, metrics. Currently the markdown drafts exist in `/CaseStudy/*.md` but no template renders them.
4. **Routing** — once case studies exist, need a router. The existing `/CaseStudy/src/main.jsx` has a hand-rolled `useRoute()` hook; can be adapted or replaced with `react-router-dom`.
5. **Skill chips, tools, current role** — to be added on About / landing.
6. **Reduced-motion improvements** for spiral phase.
7. **Meta tags / favicon / Open Graph** — `index.html` has only a title.
8. **Mobile pass** — the cylinder works responsively but on phone-sized viewports the radius/spacing might need re-tuning.

---

## 15. How to Continue Work (Hand-off Checklist)

When a new coding model picks this up:

- [ ] Read this guide top to bottom.
- [ ] Check the running site at `localhost:5173` (Vite dev server already running on that port in this project).
- [ ] Identify which phase the user is asking about (Intro / Manifesto / Spiral / Next).
- [ ] Locate the relevant code: nearly everything is in `src/App.tsx` and `src/styles.css`.
- [ ] If changing motion: refer to §4 (Motion Language) before writing code. Decisions like easing direction, mask vs opacity, scrub vs auto-play are already made.
- [ ] If changing visuals: refer to §3 (Visual System) for tokens. Don't introduce new color hex values without updating the system here first.
- [ ] If adding a new scroll-driven section:
  1. Add a `*Ref` and a `*SetupRef` flag.
  2. Write a `setupNewPhase` callback that pushes its ScrollTriggers into `scrollTriggersRef.current` for cleanup.
  3. Call it from the main `useEffect`.
  4. Decide pin range and whether to scrub.
  5. Match the gradient state across the handoff (see §8.6).
- [ ] When in doubt: simplify. Refer to §2.2 (the senior-portfolio test).

---

## 16. File-Level Quick Reference

### `src/App.tsx`
- `SplitChars` — small component that splits a string into `<span class="intro-char">` elements, preserving spaces.
- `SpiralCards` — renders the 8 placeholder cards.
- `App` — the only default export; orchestrates all three phases.
- `runIntro` — the main GSAP timeline (Phase 1).
- `setupManifestoPhase` — Phase 2 ScrollTrigger.
- `setupScrollPhase` — Phase 3 ScrollTriggers (split: drain + cards).
- `setupExperienceCtaPhase` — Phase 4 CTA draw, scramble label, portal zoom, and light grid ripple.
- `skip` — internal helper, used by reduced-motion + keyboard handler.

### `src/styles.css`
Section markers in the file:
- `INTRO SECTION` — `.intro-shell`, `.stage`, `.copy-stage`, `.word-mask`, `.intro-word*`, `.intro-char*`, `.ball*`, `.text-impact`, `.shock-ring`
- `FIXED BACKGROUND LAYERS` — `.flash-layer`, `.gradient-field`, `.grid-field`, `.grain-layer`
- `SCROLL CUE` — `.scroll-cue` + keyframes
- `MANIFESTO OVERLAY` — `.manifesto-overlay`, `.manifesto-inner`, `.m-line`, `.m-eyebrow`, `.m-display*`, `.m-sub`, `.m-word`
- `SPIRAL SECTION` — `.spiral-section`, `.spiral-stage`, `.spiral-cards`, `.spiral-card`, `.card-chrome`, `.card-body`, `.card-line`, `.card-block`, `.card-row`, `.card-pill`, `.card-label`
- `LIGHT PORTAL` — `.light-portal`, `.light-portal-grid`, `.light-portal-ripple`
- `RESPONSIVE` — `@media (max-width: 700px)` overrides

---

**End of guide.** When in doubt, the working principle is: *senior calm over junior flash*. If a change tilts the site toward the latter, push back.
