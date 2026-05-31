import { useRef } from 'react';
import {
  H,
  CaseChrome,
  CaseFooter,
  useCaseStudyMotion,
  useECharts,
  useCasePage,
  P,
  FONT,
  tooltip,
  type ChartDef,
} from './shared';

// ---------------------------------------------------------------------------
// Charts re-themed to the shared light palette. All data values are taken
// verbatim from the source case-study tables (Jal anchor ladder, chroma
// reduction, Lime/Green hue separation, before/after contrast, lightness
// uniformity). Axis + label colors come from P.body, splitLines from
// P.hairline (dashed), and the shared tooltip is reused throughout.
// ---------------------------------------------------------------------------

const SHADE_STEPS = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200', '1300', '1400'];

const axisLabel = { color: P.body, fontFamily: FONT, fontSize: 12 };
const splitLine = { lineStyle: { color: P.hairline, type: 'dashed' as const } };

const CHARTS: ChartDef[] = [
  // Chart 1 · The Jal anchor curve — OKLCH Lightness across 14 shade steps.
  {
    id: 'jal-anchor',
    option: {
      grid: { left: 56, right: 28, top: 28, bottom: 44 },
      tooltip: { ...tooltip },
      xAxis: {
        type: 'category',
        data: SHADE_STEPS,
        name: 'Shade step',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { color: P.body, fontFamily: FONT },
        axisLine: { lineStyle: { color: P.hairline } },
        axisTick: { show: false },
        axisLabel,
      },
      yAxis: {
        type: 'value',
        name: 'OKLCH L',
        min: 0,
        max: 100,
        nameTextStyle: { color: P.body, fontFamily: FONT },
        axisLabel,
        axisLine: { show: false },
        splitLine,
      },
      series: [
        {
          name: 'Jal Lightness',
          type: 'line',
          smooth: true,
          symbolSize: 7,
          data: [98, 94, 91, 87, 82, 76, 70, 65, 58, 52, 45, 38, 32, 25],
          lineStyle: { width: 3, color: P.blue },
          itemStyle: { color: P.blue },
          areaStyle: { color: 'rgba(47,123,255,0.08)' },
          markPoint: {
            symbol: 'circle',
            symbolSize: 10,
            label: { color: P.ink, fontFamily: FONT, fontSize: 11, position: 'top' },
            itemStyle: { color: P.blue },
            data: [
              { name: 'Lightest background', value: 94, xAxis: '200', yAxis: 94 },
              { name: 'Default · workhorse', value: 52, xAxis: '1000', yAxis: 52 },
              { name: 'Deep', value: 25, xAxis: '1400', yAxis: 25 },
            ],
          },
        },
      ],
    },
  },

  // Chart 2 · Chroma reduction per hue · light shades 100–500 (sorted desc).
  {
    id: 'chroma-reduction',
    option: {
      grid: { left: 110, right: 48, top: 20, bottom: 40 },
      tooltip: { ...tooltip, trigger: 'item', formatter: '{b}: −{c}%' },
      xAxis: {
        type: 'value',
        name: 'Chroma reduction %',
        nameLocation: 'middle',
        nameGap: 28,
        nameTextStyle: { color: P.body, fontFamily: FONT },
        axisLabel: { ...axisLabel, formatter: '{value}%' },
        axisLine: { show: false },
        splitLine,
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: ['Neem (Green)', 'Nimbu (Lime)', 'Cyan', 'Jamun (Violet)', 'Sea', 'Magenta', 'Pink', 'Mirch (Red)', 'Neel (Indigo)'],
        axisLine: { lineStyle: { color: P.hairline } },
        axisTick: { show: false },
        axisLabel,
      },
      series: [
        {
          name: 'Light-shade chroma reduction',
          type: 'bar',
          barWidth: '56%',
          data: [45, 44, 25, 21, 20, 17, 13, 11, 10],
          itemStyle: { color: P.green, borderRadius: [0, 6, 6, 0] },
          label: { show: true, position: 'right', formatter: '−{c}%', color: P.ink, fontFamily: FONT, fontSize: 11 },
        },
      ],
    },
  },

  // Chart 3 · Lime vs Green hue separation across shades (dual line).
  {
    id: 'lime-green-hue',
    option: {
      grid: { left: 56, right: 28, top: 36, bottom: 44 },
      tooltip: { ...tooltip },
      legend: { data: ['Lime H', 'Green H'], textStyle: { color: P.body, fontFamily: FONT }, top: 0 },
      xAxis: {
        type: 'category',
        data: SHADE_STEPS,
        name: 'Shade step',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { color: P.body, fontFamily: FONT },
        axisLine: { lineStyle: { color: P.hairline } },
        axisTick: { show: false },
        axisLabel,
      },
      yAxis: {
        type: 'value',
        name: 'OKLCH hue °',
        min: 115,
        max: 150,
        nameTextStyle: { color: P.body, fontFamily: FONT },
        axisLabel,
        axisLine: { show: false },
        splitLine,
      },
      series: [
        {
          name: 'Lime H',
          type: 'line',
          smooth: true,
          symbolSize: 6,
          data: [123, 123.5, 124, 124, 124, 124, 124, 124, 124, 124, 124, 124.5, 125, 125],
          lineStyle: { width: 3, color: P.yellow },
          itemStyle: { color: P.yellow },
        },
        {
          name: 'Green H',
          type: 'line',
          smooth: true,
          symbolSize: 6,
          data: [132, 134, 138, 144, 132, 134, 137, 141, 142, 143, 143, 144, 145, 145],
          lineStyle: { width: 3, color: P.green },
          itemStyle: { color: P.green },
        },
      ],
    },
  },

  // Chart 4 · Per-hue base contrast — before vs after (log scale, AA ref line).
  {
    id: 'contrast-before-after',
    option: {
      grid: { left: 52, right: 28, top: 40, bottom: 56 },
      tooltip: { ...tooltip, valueFormatter: (v: number) => `${v} : 1` },
      legend: { data: ['Before', 'After'], textStyle: { color: P.body, fontFamily: FONT }, top: 0 },
      xAxis: {
        type: 'category',
        data: ['Jal', 'Mirch', 'Neem', 'Haldi*', 'Tawak', 'Jamun', 'Neel', 'Nimbu'],
        axisLine: { lineStyle: { color: P.hairline } },
        axisTick: { show: false },
        axisLabel: { ...axisLabel, interval: 0 },
      },
      yAxis: {
        type: 'log',
        name: 'Contrast on white',
        min: 1,
        max: 8,
        nameTextStyle: { color: P.body, fontFamily: FONT },
        axisLabel: { ...axisLabel, formatter: '{value}:1' },
        axisLine: { show: false },
        splitLine,
      },
      series: [
        {
          name: 'Before',
          type: 'bar',
          barGap: '6%',
          data: [4.81, 4.61, 3.09, 1.62, 2.75, 5.66, 6.31, 2.03],
          itemStyle: { color: P.slate, borderRadius: [4, 4, 0, 0] },
        },
        {
          name: 'After',
          type: 'bar',
          data: [5.76, 6.31, 5.14, 2.34, 4.51, 6.07, 5.93, 5.38],
          itemStyle: { color: P.blue, borderRadius: [4, 4, 0, 0] },
          markLine: {
            symbol: 'none',
            lineStyle: { color: P.red, type: 'dashed', width: 1.5 },
            label: { formatter: 'AA · 4.5 : 1', color: P.red, fontFamily: FONT, fontSize: 11, position: 'insideEndTop' },
            data: [{ yAxis: 4.5 }],
          },
        },
      ],
    },
  },

  // Chart 5 · Lightness uniformity at default shade — before vs after per hue.
  {
    id: 'lightness-uniformity',
    option: {
      grid: { left: 52, right: 28, top: 40, bottom: 44 },
      tooltip: { ...tooltip },
      legend: { data: ['Before L', 'After L'], textStyle: { color: P.body, fontFamily: FONT }, top: 0 },
      xAxis: {
        type: 'category',
        data: ['Jal', 'Mirch', 'Neem', 'Haldi', 'Tawak', 'Jamun', 'Neel', 'Nimbu'],
        axisLine: { lineStyle: { color: P.hairline } },
        axisTick: { show: false },
        axisLabel: { ...axisLabel, interval: 0 },
      },
      yAxis: {
        type: 'value',
        name: 'OKLCH L',
        min: 40,
        max: 90,
        nameTextStyle: { color: P.body, fontFamily: FONT },
        axisLabel,
        axisLine: { show: false },
        splitLine,
      },
      series: [
        {
          name: 'Before L',
          type: 'scatter',
          symbolSize: 13,
          data: [55.8, 58.6, 64.7, 84.7, 70.7, 53.1, 50.3, 76.2],
          itemStyle: { color: P.slate },
        },
        {
          name: 'After L',
          type: 'scatter',
          symbolSize: 13,
          data: [51.8, 51.8, 52.2, 73.9, 58.1, 51.8, 51.8, 51.8],
          itemStyle: { color: P.blue },
        },
      ],
    },
  },
];

export default function CaseColorRefresh() {
  const rootRef = useRef<HTMLDivElement>(null);
  useCasePage('Rebuilding MDS Color');
  useCaseStudyMotion(rootRef);
  useECharts(rootRef, CHARTS);

  return (
    <div className="cs-root" ref={rootRef}>
      <CaseChrome tag="MDS Color Refresh" />

      <main>
        {/* HERO */}
        <section className="cs-section cs-hero" aria-labelledby="cr-hero">
          <span className="cs-ghost" data-parallax="1.6" aria-hidden="true">00</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>Case Study · 002 · Masala Design System</p>
            <H id="cr-hero" level={1}>Rebuilding MDS Color</H>
            <p className="cs-lede cs-hero-lede" data-rise>How I took Innovaccer's design system color palette from <strong>4 of 8 base shades failing WCAG accessibility</strong> to <strong>7 of 8 passing</strong> — using OKLCH for perceptual uniformity, a hue-identity lock to keep the brand intact, and a 3-tier token architecture borrowed from GitHub Primer. No rebrand.</p>
            <div className="cs-meta-grid" aria-label="Project metadata" data-stagger>
              <div className="cs-meta-item" data-rise><span className="cs-label">Author</span><span className="cs-meta-value">Atulya · Product Designer</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Role</span><span className="cs-meta-value">Color System Lead</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Duration</span><span className="cs-meta-value">Nov 2025 – Apr 2026</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Version</span><span className="cs-meta-value">v4 · May 2026</span></div>
            </div>
            <div className="cs-stat-grid" data-stagger>
              <div className="cs-stat" data-rise><strong><span data-count="7">7</span>/8</strong><span>Hues passing WCAG AA at base shade — up from 4 of 8.</span></div>
              <div className="cs-stat" data-rise><strong>1.4</strong><span>Perceptual lightness drift at default shade (excl. Yellow / Orange) — down from 25.9 units.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="3">3</span></strong><span>Architecture tiers — primitives, semantics, component color map — replacing one flat hex layer.</span></div>
              <div className="cs-stat" data-rise><strong>≤1°</strong><span>Hue identity drift from original brand. Enforced in CI on every PR.</span></div>
            </div>
          </div>
        </section>

        {/* 00 AT A GLANCE */}
        <section className="cs-section" aria-labelledby="cr-glance">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">00</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>00 · At a glance</p>
            <H id="cr-glance">The shape of the project, in one page</H>
            <p className="cs-lede" data-rise>Six months. One brand identity preserved. Three architecture tiers introduced. Five testing instruments built. Twenty-plus products inheriting one upstream change.</p>
            <div className="cs-table" role="table" aria-label="Project summary" data-rise style={{ ['--cols' as string]: '1fr 2.4fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Field</span><span>Value</span></div>
              <div className="cs-trow" role="row"><span>Role</span><span>Product Designer · Color System Lead</span></div>
              <div className="cs-trow" role="row"><span>Duration</span><span>Nov 2025 – Apr 2026 (6 months)</span></div>
              <div className="cs-trow" role="row"><span>Surface</span><span>14 hue families · 14 shades · 7 alpha primitives per hue</span></div>
              <div className="cs-trow" role="row"><span>Stack</span><span>OKLCH · CSS custom properties · Style Dictionary · Figma plugins · Storybook · Chrome MV3</span></div>
              <div className="cs-trow" role="row"><span>Output</span><span>196 primitive tokens · 98 alpha primitives · 25+ component color maps · 5 instruments</span></div>
              <div className="cs-trow" role="row"><span>Inheriting</span><span>20+ Innovaccer products · 119 components · 6 product design teams</span></div>
            </div>
            <h3 data-rise>Hero metrics</h3>
            <div className="cs-stat-grid" data-stagger>
              <div className="cs-stat" data-rise><strong><span data-count="7">7</span>/8</strong><span>Hues passing WCAG AA at base shade — up from 4 of 8.</span></div>
              <div className="cs-stat" data-rise><strong>1.4</strong><span>Perceptual lightness drift at default shade (excl. Yellow / Orange) — down from 25.9 units.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="3">3</span></strong><span>Architecture tiers — primitives, semantics, component color map — replacing one flat hex layer.</span></div>
              <div className="cs-stat" data-rise><strong>≤1°</strong><span>Hue identity drift from original brand. Enforced in CI on every PR.</span></div>
            </div>
            <figure className="cs-figure" data-rise>
              <div className="cs-figure-ph"><span>Figure 0 · Hero visual — Original 8 hues × 7 shades vs. updated 14 hues × 14 shades.</span></div>
              <figcaption>Side-by-side palette grid. Every original hue keeps its identity; the new system is wider, more consistent, and accessible by default.</figcaption>
            </figure>
          </div>
        </section>

        {/* 01 OPENING */}
        <section className="cs-section" aria-labelledby="cr-opening">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">01</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>01 · The opening</p>
            <H id="cr-opening">A badge nobody could read</H>
            <p data-rise>A clinician's dashboard says <em>"Awaiting Review"</em> in soft yellow on white. <strong>The contrast ratio is 1.62 : 1.</strong> Most clinicians read it. Some — the ones in bright sunlight, or with mild vision differences, or just glancing fast between patients — don't.</p>
            <p data-rise>That badge ships in 20+ Innovaccer products. The yellow comes from a token called <code>--haldi</code>, set seven years ago by a hand-picked hex value. By the time I started this project, four of the eight brand colors had drifted from accessibility, and there was no underlying system to hold them in place.</p>
            <p data-rise>The temptation was to patch the failures one by one. I refused. <strong>Patching produces a palette that mostly works today and breaks differently the next time anyone touches it.</strong> I wanted a palette where the rules were the source of truth, and the colors fell out of the rules.</p>
            <div className="cs-outcome" data-rise>
              <h3>Thesis</h3>
              <p>Rebuild the palette without a rebrand. Same hues, same brand identity, redistributed against a perceptual anchor and wired into an architecture that lets one primitive change cascade through every product.</p>
              <p>This case study is how that worked.</p>
            </div>
          </div>
        </section>

        {/* 02 BACKGROUND */}
        <section className="cs-section" aria-labelledby="cr-background">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">02</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>02 · Background</p>
            <H id="cr-background">A 5-minute primer for new readers</H>
            <p data-rise>Four concepts need to land for the rest to make sense. If you already know these, skim.</p>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">2.1 — Vocabulary</span><h3>What's a design system color palette?</h3><p>A fixed, named set of colors used across every product a company ships. Buttons, badges, charts, alerts, surfaces — all draw from the same list. That's how 20 different products feel like one company.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">2.2 — Mechanics</span><h3>Hex codes are three numbers in a trench coat</h3><p><code>#0060d6</code> is shorthand for red, green, blue, each from 0–255. The <code>#</code> is just punctuation. Perfect for machines.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">2.3 — Perception</span><h3>Why "lightness" is a perceptual problem</h3><p>The eye peaks at ~555 nm — yellow-green. A pure green at "50% lightness" <em>looks</em> brighter than blue at "50% lightness." RGB and HSL don't account for this. <strong>OKLCH does.</strong></p></article>
            </div>
            <h3 data-rise>OKLCH, decoded</h3>
            <div className="cs-code" data-rise><pre>{`OKLCH:
  L  Lightness — perceived brightness, 0–100
  C  Chroma    — colorfulness, 0 to ~37
  H  Hue       — angle on the color wheel, 0–360°`}</pre></div>
            <p data-rise>In OKLCH, two colors at L=52 look equally bright to a human, regardless of hue. <strong>That's the property the entire rebuild rests on.</strong></p>
            <h3 data-rise>2.4 · WCAG, in one paragraph</h3>
            <p data-rise>The Web Content Accessibility Guidelines define minimum contrast ratios. Text on a background needs at least <strong>4.5 : 1</strong> for AA (the standard). Icons and large text need <strong>3 : 1</strong>. AAA enhanced is <strong>7 : 1</strong>. Below 3 : 1, content isn't readable to many users. Roughly 8% of men and 0.5% of women have some form of color vision deficiency — accessibility isn't optional.</p>
          </div>
        </section>

        {/* 03 THE AUDIT */}
        <section className="cs-section" aria-labelledby="cr-broken">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">03</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>03 · The audit</p>
            <H id="cr-broken">Three things were structurally broken — only the first had been noticed</H>
            <p data-rise>The original MDS palette had charm. Eight hue families with names borrowed from Indian spices and elements: <strong>Jal</strong> (water/blue), <strong>Mirch</strong> (chili/red), <strong>Neem</strong> (green), <strong>Haldi</strong> (turmeric/yellow), <strong>Tawak</strong> (orange), <strong>Jamun</strong> (violet), <strong>Neel</strong> (indigo), <strong>Nimbu</strong> (lime). Seven shades each. 56 tokens total. Looked fine in mocks.</p>

            <h3 data-rise>3.1 · Half the brand colors failed AA at base</h3>
            <div className="cs-table" role="table" aria-label="Base contrast audit" data-rise style={{ ['--cols' as string]: '1.4fr 1fr 0.8fr 1.2fr 0.8fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Hue</span><span>Original Hex</span><span>Original L</span><span>Contrast on white</span><span>Status</span></div>
              <div className="cs-trow" role="row"><span>Jal (Blue)</span><span><code>#0070dd</code></span><span>55.8</span><span>4.81 : 1</span><span className="cs-cell-accent">AA</span></div>
              <div className="cs-trow" role="row"><span>Mirch (Red)</span><span><code>#d93737</code></span><span>58.6</span><span>4.61 : 1</span><span className="cs-cell-accent">AA</span></div>
              <div className="cs-trow" role="row"><span>Neem (Green)</span><span><code>#2ea843</code></span><span>64.7</span><span>3.09 : 1</span><span>Fail</span></div>
              <div className="cs-trow" role="row"><span>Haldi (Yellow)</span><span><code>#ffc208</code></span><span>84.7</span><span>1.62 : 1</span><span>Fail</span></div>
              <div className="cs-trow" role="row"><span>Tawak (Orange)</span><span><code>#f07d00</code></span><span>70.7</span><span>2.75 : 1</span><span>Fail</span></div>
              <div className="cs-trow" role="row"><span>Jamun (Violet)</span><span><code>#7a53b2</code></span><span>53.1</span><span>5.66 : 1</span><span className="cs-cell-accent">AA</span></div>
              <div className="cs-trow" role="row"><span>Neel (Indigo)</span><span><code>#3d51d4</code></span><span>50.3</span><span>6.31 : 1</span><span className="cs-cell-accent">AA</span></div>
              <div className="cs-trow" role="row"><span>Nimbu (Lime)</span><span><code>#82c91e</code></span><span>76.2</span><span>2.03 : 1</span><span>Fail</span></div>
            </div>
            <div className="cs-callout" data-rise><p>These weren't decorative hues. They were the defaults driving status, warning, success, and accent semantics across every product. System defaults were what engineers reached for — every "warning" badge in production was a small accessibility miss compounding across the platform.</p></div>

            <h3 data-rise>3.2 · "Base" meant something different for every hue</h3>
            <div className="cs-table" role="table" aria-label="Base lightness per hue" data-rise style={{ ['--cols' as string]: '1fr 2fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Hue</span><span>OKLCH L at base</span></div>
              <div className="cs-trow" role="row"><span>Nimbu (Lime)</span><span>76.2 (felt nearly pastel)</span></div>
              <div className="cs-trow" role="row"><span>Tawak (Orange)</span><span>70.7</span></div>
              <div className="cs-trow" role="row"><span>Neem (Green)</span><span>64.7</span></div>
              <div className="cs-trow" role="row"><span>Haldi (Yellow)</span><span>84.7</span></div>
              <div className="cs-trow" role="row"><span>Mirch (Red)</span><span>58.6</span></div>
              <div className="cs-trow" role="row"><span>Jal (Blue)</span><span>55.8</span></div>
              <div className="cs-trow" role="row"><span>Jamun (Violet)</span><span>53.1</span></div>
              <div className="cs-trow" role="row"><span>Neel (Indigo)</span><span>50.3 (felt heavy)</span></div>
            </div>
            <p data-rise><strong>A 34.4-unit perceptual lightness drift across the eight base shades.</strong> A "primary" button and a "warning" pill on the same row didn't read as equivalent visual weights — and there was no way to fix it inside the existing palette, because lightness wasn't a controllable parameter. The naming was a promise the system couldn't keep.</p>

            <h3 data-rise>3.3 · Seven shades couldn't carry modern UI</h3>
            <p data-rise>Modern components need hover states, focus rings, subtle backgrounds, dense data viz, layered surfaces, disabled states at multiple elevations. Designers were patching the gaps with CSS opacity over arbitrary backgrounds.</p>
            <p data-rise>The problem: <code>opacity: 0.4</code> over white is one color. The same <code>opacity: 0.4</code> over a tinted surface is a different color. Hover states tested fine on white cards and silently failed on the gray ones in the same product.</p>
            <div className="cs-code" data-rise><pre>{`Original — 8 hues × 7 shades = 56 tokens
   Generation:    RGB / HSL eyeballed
   Architecture:  1 tier — hex hardcoded into semantic names
   Alpha:         ad-hoc CSS opacity
   Themability:   none`}</pre></div>

            <h3 data-rise>3.4 · Audit instruments</h3>
            <p data-rise>Visual review wasn't going to surface what a palette this size was actually doing. I built two Figma plugins.</p>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><h3>Aurora Color Auditor</h3><p>Walks selected layers, reads raw fills, runs WCAG 2.2 contrast against the <strong>resolved</strong> background — walking the parent chain, not just the immediate container — and flags any color outside the DS map. Suggests the nearest valid token by RGB Euclidean distance.</p></article>
              <article className="cs-card" data-rise><h3>Color Matrix Maker</h3><p>Brute-forces the full foreground × background contrast matrix. ~40,000 cells per pass. Color-coded pass/fail, click-to-select drives you to affected nodes. Catches Pink-700 on Surface-subtle, Cyan-300 on Beige-200 — combinations no human review thinks to test individually.</p></article>
            </div>
            <div className="cs-table" role="table" aria-label="Audit instrument findings" data-rise style={{ ['--cols' as string]: '2fr 1fr 1fr 1fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Findings</span><span>Visual review</span><span>Aurora</span><span>Matrix Maker</span></div>
              <div className="cs-trow" role="row"><span>Off-palette drift</span><span>0</span><span>73</span><span>n/a</span></div>
              <div className="cs-trow" role="row"><span>Text contrast fails (4.5 : 1)</span><span>~5</span><span>14</span><span>14</span></div>
              <div className="cs-trow" role="row"><span>Non-text fails (3 : 1)</span><span>0</span><span>9</span><span>9</span></div>
              <div className="cs-trow" role="row"><span>Container-vs-text mis-severity</span><span>n/a</span><span>22</span><span>n/a</span></div>
              <div className="cs-trow" role="row"><span>Decorative misclassification</span><span>n/a</span><span>6</span><span>n/a</span></div>
              <div className="cs-trow" role="row"><span>Edge-case combination fails</span><span>n/a</span><span>n/a</span><span>31</span></div>
              <div className="cs-trow" role="row"><span>Total findings</span><span className="cs-cell-accent">~5</span><span className="cs-cell-accent">124</span><span className="cs-cell-accent">54</span></div>
            </div>
            <div className="cs-callout" data-rise><p><strong>~5 vs 124.</strong> Visual review missed 95% of what was actually wrong. The 31 Matrix findings were combinations no designer would have hand-tested individually. Tooling earned the rest of the project the right to be opinionated.</p></div>
          </div>
        </section>

        {/* INFLECTION QUOTE */}
        <section className="cs-section" aria-labelledby="cr-inflection">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">04</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>Inflection</p>
            <H id="cr-inflection">Before generating a single new hex value, three decisions constrained the rest of the work</H>
            <p className="cs-quote" data-rise>Each had a cost. Each had a much bigger payoff. That's the point.</p>
          </div>
        </section>

        {/* 04 DECISIONS */}
        <section className="cs-section" aria-labelledby="cr-decisions">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">04</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>04 · Three foundational decisions</p>
            <H id="cr-decisions">OKLCH · Hue lock · Jal anchor</H>

            <h3 data-rise>4.1 · OKLCH as the generation space</h3>
            <p data-rise>In HSL, "lightness" isn't perceptual. Yellow at L=50 looks much brighter than blue at L=50, but the spec calls them equivalent. <strong>The space lies to you about uniformity.</strong></p>
            <p data-rise>I moved every generation routine to OKLCH. Cost: a learning curve and a few weeks of tooling. Payoff: I could specify "all default-shade colors at L=51–53" and <em>actually have it mean something</em>. HSL couldn't promise that. OKLCH could.</p>
            <div className="cs-code" data-rise><pre>{`Conversion pipeline:
  RGB → linearized RGB → CIE XYZ → OKLAB → OKLCH`}</pre></div>
            <div className="cs-callout" data-rise><p>Every claim about uniformity in this case study traces back to this single decision.</p></div>

            <h3 data-rise>4.2 · Hue identity preserved within 1°</h3>
            <p data-rise>Most palette rebuilds are also rebrands. I refused. Every original hue's H value sits within 1° of where it was. Brand identity that designers and users already knew didn't move — only its lightness and chroma got a more disciplined treatment.</p>
            <div className="cs-table" role="table" aria-label="Hue identity drift" data-rise style={{ ['--cols' as string]: '1.6fr 1fr 1fr 0.8fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Hue</span><span>Original H</span><span>Updated H</span><span>Δ</span></div>
              <div className="cs-trow" role="row"><span>Jal (Blue)</span><span>216°</span><span>216°</span><span>0°</span></div>
              <div className="cs-trow" role="row"><span>Mirch (Red)</span><span>19°</span><span>21°</span><span>+2°</span></div>
              <div className="cs-trow" role="row"><span>Neem (Green)*</span><span>125°</span><span>143°</span><span>+18°</span></div>
              <div className="cs-trow" role="row"><span>Haldi (Yellow)</span><span>47°</span><span>47°</span><span>0°</span></div>
              <div className="cs-trow" role="row"><span>Tawak (Orange)</span><span>56°</span><span>56°</span><span>0°</span></div>
              <div className="cs-trow" role="row"><span>Jamun (Violet)</span><span>262°</span><span>262°</span><span>0°</span></div>
              <div className="cs-trow" role="row"><span>Neel (Indigo)</span><span>223°</span><span>224°</span><span>+1°</span></div>
              <div className="cs-trow" role="row"><span>Nimbu (Lime)</span><span>124°</span><span>124°</span><span>0°</span></div>
            </div>
            <p data-rise>*Neem's 18° "shift" was actually a correction. The original <code>#2ea843</code> already sat at H≈140 in OKLCH — the spec said H=125 but the actual hex was greener. We resolved the discrepancy in favor of the hex, not the wrong spec.</p>
            <p data-rise>A CI test enforces the constraint on every PR:</p>
            <div className="cs-code" data-rise><pre>{`const HUE_ORIGINALS = {
  jal: 216, mirch: 19, neem: 143, haldi: 47,
  tawak: 56, jamun: 262, neel: 223, nimbu: 124,
};

assert(Math.abs(updated.H - HUE_ORIGINALS[name]) <= 1.5);`}</pre></div>
            <div className="cs-callout" data-rise><p>Constraints stated as principles erode under deadline pressure. Constraints stated as tests endure.</p></div>

            <h3 data-rise>4.3 · Jal as the anchor</h3>
            <p data-rise>I picked Blue (Jal) as the reference curve. Three reasons: it sits closest to perceptual middle at typical screen brightness; it passed AA on white at base by structure; and it was already the most-used hue in the system.</p>
            <p data-rise>I built Jal's full 14-step lightness ladder first, then aligned every other hue to it.</p>
            <div className="cs-chart cs-chart-tall" data-chart="jal-anchor" role="img" aria-label="Chart 1 · The Jal anchor curve — OKLCH Lightness across 14 shade steps, from 98 at step 100 to 25 at step 1400, with the workhorse default at step 1000 (L=52)." />
            <div className="cs-table" role="table" aria-label="Jal anchor lightness ladder" data-rise style={{ ['--cols' as string]: '0.7fr 0.8fr 1fr 1.5fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Step</span><span>Target L</span><span>Hex</span><span>Role</span></div>
              <div className="cs-trow" role="row"><span>100</span><span>98</span><span><code>#f0f9ff</code></span><span>Subtle wash</span></div>
              <div className="cs-trow" role="row"><span>200</span><span>94</span><span><code>#d6eeff</code></span><span>Lightest background</span></div>
              <div className="cs-trow" role="row"><span>300</span><span>91</span><span><code>#c2e4ff</code></span><span>Avatar-only fill</span></div>
              <div className="cs-trow" role="row"><span>400</span><span>87</span><span><code>#a8d8ff</code></span><span>Soft tint</span></div>
              <div className="cs-trow" role="row"><span>500</span><span>82</span><span><code>#8bcafe</code></span><span>Lighter</span></div>
              <div className="cs-trow" role="row"><span>600</span><span>76</span><span><code>#6fb7fb</code></span><span>—</span></div>
              <div className="cs-trow" role="row"><span>700</span><span>70</span><span><code>#4fa3f8</code></span><span>Light</span></div>
              <div className="cs-trow" role="row"><span>800</span><span>65</span><span><code>#2e8ef5</code></span><span>—</span></div>
              <div className="cs-trow" role="row"><span>900</span><span>58</span><span><code>#0a74f5</code></span><span>—</span></div>
              <div className="cs-trow" role="row"><span>1000</span><span>52</span><span><code>#0060d6</code></span><span className="cs-cell-accent">Default — workhorse contrast</span></div>
              <div className="cs-trow" role="row"><span>1100</span><span>45</span><span><code>#0051ad</code></span><span>—</span></div>
              <div className="cs-trow" role="row"><span>1200</span><span>38</span><span><code>#003e85</code></span><span>Dark</span></div>
              <div className="cs-trow" role="row"><span>1300</span><span>32</span><span><code>#003066</code></span><span>Darker</span></div>
              <div className="cs-trow" role="row"><span>1400</span><span>25</span><span><code>#002147</code></span><span>Deep</span></div>
            </div>
            <p data-rise>Step 1000 is the workhorse. At L≈52 with maximum in-gamut chroma at the brand hue, it clears 4.5 : 1 on white <em>and</em> feels recognizably "the brand color" — not muddy, not washed out.</p>
          </div>
        </section>

        {/* 05 BUILDING THE SCALE */}
        <section className="cs-section" aria-labelledby="cr-scale">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">05</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>05 · The Color Palette Helper</p>
            <H id="cr-scale">Generation needed an instrument</H>
            <p data-rise>I built the <strong>Color Palette Helper</strong> — a script that takes the anchor curve config plus the hue map and produces all 196 primitives.</p>

            <h3 data-rise>5.1 · Binary-search for in-gamut chroma</h3>
            <p data-rise>OKLCH→sRGB conversion can return values that are technically out of gamut. The renderer clips them silently, producing colors slightly off the spec. The Helper avoids this by binary-searching for the maximum in-gamut chroma at each (L, H) target.</p>
            <div className="cs-code" data-rise><pre>{`For each (L, H) target:
  Binary-search C between 0 and 0.4
    Convert OKLCH(L, C, H) → sRGB
    Check if all RGB channels in [0, 1]
  Return the largest C that produces in-gamut sRGB
  Convert to hex`}</pre></div>
            <p data-rise>Result: vibrant-as-possible colors at every shade without silent clipping. If a hue can't reach the anchor lightness without going out-of-gamut or losing identity, the Helper flags it — and that's how <code>HUE_EXCEPTIONS</code> get documented.</p>

            <h3 data-rise>5.2 · Built-in validations</h3>
            <div className="cs-table" role="table" aria-label="Helper validations" data-rise style={{ ['--cols' as string]: '1fr 2fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Validation</span><span>What it catches</span></div>
              <div className="cs-trow" role="row"><span>Contrast on white</span><span>Pre-flighted for 4.5 : 1 (text) and 3 : 1 (non-text)</span></div>
              <div className="cs-trow" role="row"><span>Contrast on black</span><span>Same thresholds for dark mode readiness</span></div>
              <div className="cs-trow" role="row"><span>Hue identity drift</span><span>Flags any output hue that drifts &gt;1.5° from the locked target</span></div>
              <div className="cs-trow" role="row"><span>Lightness alignment</span><span>Diffs against the Jal anchor for every step; surfaces hues that need exception documentation</span></div>
            </div>
            <div className="cs-callout" data-rise><p>A single config change regenerates the palette deterministically. When I tightened Lime's light-shade chroma by 5%, it was a one-line change in the config. <strong>No more spreadsheet of hand-tuned hex values.</strong></p></div>

            <h3 data-rise>5.3 · Vibrancy tuning · Where the eye over-amplifies</h3>
            <p data-rise>When expanding from 7 to 14 shades, the lighter shades initially came out more saturated than needed. The eye is most sensitive to wavelengths near 555 nm — between Lime and Green. <strong>A green at the same OKLCH chroma as a blue <em>looks</em> more vivid to us, so it needs proportional damping.</strong></p>
            <p data-rise>I used Jal's chroma as the reference range and reduced others proportionally.</p>
            <div className="cs-chart" data-chart="chroma-reduction" role="img" aria-label="Chart 2 · Chroma reduction per hue across light shades 100–500, sorted descending: Green −45%, Lime −44%, Cyan −25%, Violet −21%, Sea −20%, Magenta −17%, Pink −13%, Red −11%, Indigo −10%. Damping tracks perceptual sensitivity peak near 555 nm." />
            <div className="cs-table" role="table" aria-label="Chroma reduction per hue" data-rise style={{ ['--cols' as string]: '1.6fr 1fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Hue</span><span>Light-shade chroma reduction</span></div>
              <div className="cs-trow" role="row"><span>Neem (Green)</span><span className="cs-cell-accent">−45%</span></div>
              <div className="cs-trow" role="row"><span>Nimbu (Lime)</span><span className="cs-cell-accent">−44%</span></div>
              <div className="cs-trow" role="row"><span>Cyan</span><span>−25%</span></div>
              <div className="cs-trow" role="row"><span>Jamun (Violet)</span><span>−21%</span></div>
              <div className="cs-trow" role="row"><span>Sea</span><span>−20%</span></div>
              <div className="cs-trow" role="row"><span>Magenta</span><span>−17%</span></div>
              <div className="cs-trow" role="row"><span>Pink</span><span>−13%</span></div>
              <div className="cs-trow" role="row"><span>Mirch (Red)</span><span>−11%</span></div>
              <div className="cs-trow" role="row"><span>Neel (Indigo)</span><span>−10%</span></div>
            </div>
            <p data-rise>Green and Lime took the deepest cuts because they sit closest to the visual system's sensitivity peak.</p>
          </div>
        </section>

        {/* 06 HUES */}
        <section className="cs-section" aria-labelledby="cr-hues">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">06</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>06 · The eight hues, hue by hue</p>
            <H id="cr-hues">Generation is algorithmic. The per-color decisions are not.</H>

            <h3 data-rise>6.1 · Easy hues · Alignment only</h3>
            <p data-rise>These already passed AA at base. The work was uniformity — pull each onto the Jal lightness curve, regenerate the 14-step scale, validate.</p>
            <div className="cs-table" role="table" aria-label="Easy hues alignment" data-rise style={{ ['--cols' as string]: '1.2fr 1fr 1fr 0.8fr 2fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Hue</span><span>Base before</span><span>Base after</span><span>Δ Contrast</span><span>What changed</span></div>
              <div className="cs-trow" role="row"><span>Jal (Blue)</span><span>4.81 : 1</span><span className="cs-cell-accent">5.76 : 1</span><span>+20%</span><span>Slightly darker at base for cleaner workhorse contrast</span></div>
              <div className="cs-trow" role="row"><span>Mirch (Red)</span><span>4.61 : 1</span><span className="cs-cell-accent">6.31 : 1</span><span>+37%</span><span>Pulled to Jal's L curve; red intensity preserved</span></div>
              <div className="cs-trow" role="row"><span>Jamun (Violet)</span><span>5.66 : 1</span><span className="cs-cell-accent">6.07 : 1</span><span>+7%</span><span>Already passing — tightened to anchor</span></div>
              <div className="cs-trow" role="row"><span>Neel (Indigo)</span><span>6.31 : 1</span><span>5.93 : 1</span><span>−6%</span><span>Acceptable trade for alignment; still well above AA</span></div>
            </div>

            <h3 data-rise>6.2 · Hard hues · Where design judgement lived</h3>
            <p data-rise>The remaining four either failed AA, had ambiguity with another hue, or sat in a region of color space that resisted alignment. These are where the real work happened.</p>

            <h3 data-rise>Neem (Green) — The chroma fight</h3>
            <p data-rise>Original <code>#2ea843</code> (L=64.7, contrast 3.09 : 1 — Fail) → <code>#008000</code> (L=52.2, contrast <strong>5.14 : 1 — Pass</strong>). +66% contrast improvement.</p>
            <p data-rise>The trickier story is in the light shades. When expanding to 14 steps, Green's lighter shades initially came out <em>way too vibrant</em>. I reduced Green's average chroma in shades 100–500 by <strong>−45%</strong> to feel perceptually balanced. The math gave me numbers; the eye had a different opinion. <strong>I trusted the eye.</strong></p>

            <h3 data-rise>Tawak (Orange) — Three iterations to L=58.1</h3>
            <p data-rise>Tawak was the project's hardest hue. Original <code>#f07d00</code> (L=70.7) failed AA at 2.75 : 1. The naive fix was to pull it to Jal's anchor lightness (L=51.8) and call it done.</p>
            <p data-rise>I tried that first. It produced a dark umber — visually indistinguishable from a warm gray. <strong>Orange stopped looking orange.</strong> A "warning" Tawak that doesn't read as orange doesn't function as warning anymore. The semantic role would have been intact in code; the brand identity would have been gone.</p>
            <div className="cs-table" role="table" aria-label="Tawak iterations" data-rise style={{ ['--cols' as string]: '1.4fr 1fr 0.6fr 1fr 2fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Iteration</span><span>Hex</span><span>L</span><span>Contrast</span><span>What I learned</span></div>
              <div className="cs-trow" role="row"><span>Original</span><span><code>#f07d00</code></span><span>70.7</span><span>2.75 : 1 Fail</span><span>Far from Blue, fails AA</span></div>
              <div className="cs-trow" role="row"><span>Iter 1 — full Jal alignment</span><span><code>~#923f00</code></span><span>51.8</span><span>5.40 : 1 AA</span><span>Passes contrast — but reads as brown. Loses identity. Refused.</span></div>
              <div className="cs-trow" role="row"><span>Iter 2 — partial pull</span><span><code>#cc6500</code></span><span>60.2</span><span>4.21 : 1 Fail</span><span>Still recognizably orange, but just shy of AA</span></div>
              <div className="cs-trow" role="row"><span>Iter 3 — final</span><span><code>#bd5b00</code></span><span>58.1</span><span className="cs-cell-accent">4.51 : 1 AA</span><span>Sweet spot — passes AA, still reads as orange</span></div>
            </div>
            <p data-rise>L=58.1 is the structural limit for "still reads as orange while passing AA on white." It sits 6.3 perceptual units above Jal at the default shade — a documented gap, not a hidden one.</p>
            <div className="cs-outcome" data-rise>
              <h3>Architecture × judgement</h3>
              <p>One primitive change closed six WCAG fails simultaneously across Status, Tag, Alert, Toast, Notification, and BadgeNumeric.</p>
              <p>Zero product-team work. The judgement found the right value, the perceptual space made the value specifiable, and the three-tier architecture meant a single change reached every component that needed it.</p>
            </div>

            <h3 data-rise>Nimbu (Lime) — Re-hue, not re-contrast</h3>
            <p data-rise>Lime had two problems and three plausible fixes.</p>
            <div className="cs-card cs-list-panel" data-rise>
              <ul>
                <li><strong>Problem 1.</strong> Original <code>#82c91e</code> (L=76.2) failed AA at 2.03 : 1.</li>
                <li><strong>Problem 2.</strong> When expanding to 14 shades, Lime's hue drifted toward pure Green at darks. By shades 1000–1400, the gap narrowed to <strong>4–5° of OKLCH hue</strong>. They were visually indistinguishable in dark mode dashboards, status indicators, and chart legends.</li>
              </ul>
            </div>
            <div className="cs-table" role="table" aria-label="Lime fix options" data-rise style={{ ['--cols' as string]: '1.6fr 1.2fr 2fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Option I considered</span><span>What it solves</span><span>Why I didn't pick it</span></div>
              <div className="cs-trow" role="row"><span>Push contrast only</span><span>Contrast</span><span>Doesn't fix hue ambiguity at darks. Still indistinguishable from Green.</span></div>
              <div className="cs-trow" role="row"><span>Drop Lime chroma</span><span>Some hue separation</span><span>Loses Lime's identity — it stops being "lime" and becomes a desaturated green</span></div>
              <div className="cs-trow" role="row"><span>Lock Lime at H=124° across all 14 shades</span><span className="cs-cell-accent">Both</span><span>Single move; designed against, not patched around</span></div>
            </div>
            <div className="cs-chart" data-chart="lime-green-hue" role="img" aria-label="Chart 3 · Lime vs Green hue separation across shades 100 to 1400. Lime is locked near 124°; Green ranges 132° to 145°. The two hues stay separated at every shade, resolving the ambiguity zone where they came within 6° of each other." />
            <div className="cs-table" role="table" aria-label="Lime vs Green hue separation" data-rise style={{ ['--cols' as string]: '1.4fr 1fr 1fr 1.2fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Shade range</span><span>Lime H</span><span>Green H</span><span>Hue separation</span></div>
              <div className="cs-trow" role="row"><span>100–400 (light)</span><span>123–124°</span><span>132–144°</span><span>12–20°</span></div>
              <div className="cs-trow" role="row"><span>500–700 (mid)</span><span>124°</span><span>132–137°</span><span>8–13°</span></div>
              <div className="cs-trow" role="row"><span>800–1000 (dark)</span><span>124°</span><span>141–143°</span><span>17–19°</span></div>
              <div className="cs-trow" role="row"><span>1100–1400 (deep)</span><span>124–125°</span><span>143–145°</span><span>18–21°</span></div>
            </div>
            <p data-rise>Base contrast moved from 2.03 : 1 to <strong>5.38 : 1</strong> (+165% — the largest single gain in the project). Chroma reduced 44% in light shades. Lime now reads as distinctly yellow-green at every shade; Green stays solidly green. <strong>One decision, both problems solved.</strong></p>

            <h3 data-rise>Haldi (Yellow) — A documented exception, not a bug</h3>
            <p data-rise>Yellow can't pass AA at base without losing its identity. Yellow and Orange sit in a region of OKLCH where lightness and chroma are tightly coupled, because the visual system perceives yellow wavelengths as inherently bright. <strong>Forcing Haldi to Jal's lightness (L=52) produces brown or olive.</strong> The hue stops being recognizable.</p>
            <p data-rise>I had two choices: pretend the gap doesn't exist, or document it. <strong>I documented it.</strong></p>
            <div className="cs-code" data-rise><pre>{`HUE_EXCEPTIONS.haldi = {
  reason: 'Yellow at Jal anchor lightness becomes brown — loses identity',
  base_L: 73.9,            // vs Jal's 51.8
  base_contrast_white: '2.34:1 (Fail) — see text-safe variants',
  text_safe: 'haldi-1100', // L=44, contrast on white ≥ 4.5:1
};`}</pre></div>
            <p data-rise>Yellow stays at its natural lightness. Its <code>--haldi-dark</code> (Yellow-1100, L=44) and <code>--haldi-darker</code> (Yellow-1300, L=32) variants handle text-safe contrast. Component guidance is explicit: <strong>warning <em>fills</em> use Yellow at base, warning <em>text</em> uses the dark variants.</strong> The system isn't pretending Yellow passes — it's giving designers the right tool for each role.</p>
            <div className="cs-callout" data-rise><p>This is the move I'm proudest of. Most design systems either silently fail Yellow or quietly inflate the spec. Putting Yellow in <code>HUE_EXCEPTIONS</code> with a stated reason makes the system honest. <strong>It tells the next maintainer exactly what they're inheriting and why.</strong></p></div>
          </div>
        </section>

        {/* 07 NEW FAMILIES */}
        <section className="cs-section" aria-labelledby="cr-families">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">07</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>07 · Six new families</p>
            <H id="cr-families">Cyan, Sea, Magenta, Pink + expanded Gray</H>
            <p data-rise>Eight original hues gave designers a limited vocabulary. Charts had only one cool color (Jal). Empty states had no soft option. Brand variants were thin. I added four new hues and expanded Gray from 7 to 14 shades.</p>
            <div className="cs-cards cs-cards-4" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">196°</span><h3>Cyan</h3><p>Information · cool accent · chart series</p></article>
              <article className="cs-card" data-rise><span className="cs-label">176°</span><h3>Sea</h3><p>Soft cool · empty states · backgrounds</p></article>
              <article className="cs-card" data-rise><span className="cs-label">350°</span><h3>Magenta</h3><p>Warm accent · campaigns · non-error alerts</p></article>
              <article className="cs-card" data-rise><span className="cs-label">320°</span><h3>Pink</h3><p>Soft warm · brand variant · chart series</p></article>
            </div>
            <p data-rise>All four follow the Jal anchor curve. Each got the same chroma reduction in light shades. None broke the hue-preservation rule, because each is genuinely new — they extend the palette rather than redefine it.</p>
            <p data-rise><strong>Gray</strong> expanded from a 7-shade scale to a full 14-shade neutral spine for surface layering. The old gap between <code>surface-subtle</code> and <code>surface-default</code> was 2 OKLCH L points — invisible on most monitors. The new minimum is <strong>5 L-points</strong>, enforced in the generator.</p>
          </div>
        </section>

        {/* 08 ARCHITECTURE */}
        <section className="cs-section" aria-labelledby="cr-architecture">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">08</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>08 · Architecture</p>
            <H id="cr-architecture">T1 → T2 → T3 · What makes the next ten years sustainable</H>
            <p data-rise>The palette is what designers see. The architecture is what keeps it intact. I split the token system into <strong>three tiers</strong> — each tier referencing the one below. Product code only ever touches the top.</p>

            <h3 data-rise>8.1 · T1 · Primitives — the named scale (196 tokens)</h3>
            <p data-rise>The full 14 hue families × 14 shades. Each step value maps to an OKLCH-derived hex. Exposed by design, not hidden behind the alias layer.</p>
            <div className="cs-code" data-rise><pre>{`:root {
  --color-jal-1000: #0060d6;   /* default workhorse */
  --color-jal-700:  #4fa3f8;   /* light variant */
  --color-jal-200:  #d6eeff;   /* lightest background */
  --color-jal-1300: #003066;   /* darker text */
  /* ... 192 more */
}`}</pre></div>

            <h3 data-rise>8.2 · T2 · Semantics — intent tokens</h3>
            <p data-rise>Each hue exposes a complete role family — Primary, Alert, Success, Warning, plus Accent 1–9. The default semantic shade maps to step 1000.</p>
            <div className="cs-code" data-rise><pre>{`:root {
  --color-primary-default:    var(--color-jal-1000);
  --color-primary-light:      var(--color-jal-700);
  --color-primary-lightest:   var(--color-jal-200);
  --color-primary-dark:       var(--color-jal-1200);
  --color-primary-darker:     var(--color-jal-1300);
}`}</pre></div>
            <div className="cs-table" role="table" aria-label="Primitive to semantic mapping" data-rise style={{ ['--cols' as string]: '1fr 1.4fr 1.4fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Primitive step</span><span>Semantic alias</span><span>Use</span></div>
              <div className="cs-trow" role="row"><span>Blue-100</span><span>Primary-Ultralight</span><span>Subtle wash</span></div>
              <div className="cs-trow" role="row"><span>Blue-200</span><span>Primary-Lightest</span><span>Lightest background</span></div>
              <div className="cs-trow" role="row"><span>Blue-500</span><span>Primary-Lighter</span><span>Tag fills</span></div>
              <div className="cs-trow" role="row"><span>Blue-700</span><span>Primary-Light</span><span>Hover states</span></div>
              <div className="cs-trow" role="row"><span>Blue-1000</span><span className="cs-cell-accent">Primary-Default</span><span>Workhorse contrast</span></div>
              <div className="cs-trow" role="row"><span>Blue-1200</span><span>Primary-Dark</span><span>Pressed / dark mode default</span></div>
              <div className="cs-trow" role="row"><span>Blue-1300</span><span>Primary-Darker</span><span>Text on light surfaces</span></div>
            </div>
            <h3 data-rise>Why default at step 1000, counter to industry?</h3>
            <p data-rise>Tailwind defaults to step 500. Material 3 defaults to "tone 40." I shipped at step 1000.</p>
            <div className="cs-table" role="table" aria-label="Default-step trade-offs" data-rise style={{ ['--cols' as string]: '1fr 1.6fr 1.8fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Choice</span><span>Pros</span><span>Cons</span></div>
              <div className="cs-trow" role="row"><span>Step 700</span><span>Familiar from Tailwind</span><span>Misses 4.5 : 1 on white at L≈70; needs a different default per hue</span></div>
              <div className="cs-trow" role="row"><span>Step 600</span><span>Mid-saturation, vivid</span><span>Inconsistent contrast across hues</span></div>
              <div className="cs-trow" role="row"><span>Step 1000</span><span className="cs-cell-accent">At Jal's anchor (L=51.8), guarantees ≥4.5 : 1 on white for every aligned hue</span><span>Numerically larger than industry default</span></div>
            </div>
            <div className="cs-callout" data-rise><p>The numbering is honest about <em>where</em> the default sits on the perceptual scale. Industry convention or accessibility guarantee — I picked the second.</p></div>

            <h3 data-rise>8.3 · T3 · Component Color Map (25+ components)</h3>
            <p data-rise>The third tier is <strong>borrowed directly from GitHub Primer's design token model.</strong> Their <code>{'{component}-{variant}-{property}-{state}'}</code> naming convention is the industry's most extensible. We adopted it.</p>
            <p data-rise>T3 is per-component selectors that reference T2 tokens. Naming pattern is <code>{'--<Component>-<variant>-<state>'}</code>. Value is always <code>var(--T2-token)</code> — never a hex.</p>
            <div className="cs-code" data-rise><pre>{`/* Button — primary variant */
.Button-primary {
  background: var(--color-primary-default);
  color:      var(--color-primary-on-default);
}
.Button-primary-hover  { background: var(--color-primary-default-hover); }
.Button-primary-active { background: var(--color-primary-dark); }

/* Button — basic variant */
.Button-basic {
  background: transparent;
  color:      var(--color-primary-content);
  border:     var(--border-width-2) solid var(--color-primary-default);
}
.Button-basic-disabled {
  background: transparent;
  color:      var(--color-disabled-content);
  border:     var(--border-width-2) solid var(--color-disabled);
}`}</pre></div>
            <div className="cs-table" role="table" aria-label="Component groups" data-rise style={{ ['--cols' as string]: '1fr 3fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Group</span><span>Components</span></div>
              <div className="cs-trow" role="row"><span>Inputs</span><span>Button · Input · Textarea · Checkbox · Radio · Switch · Select · Dropdown · Slider · Stepper</span></div>
              <div className="cs-trow" role="row"><span>Display</span><span>Chip · Badge · Avatar · StatusHint · Divider · Progress · Spinner</span></div>
              <div className="cs-trow" role="row"><span>Feedback</span><span>Toast · Message · InlineMessage</span></div>
              <div className="cs-trow" role="row"><span>Navigation</span><span>Link · LinkButton · Menu · Tabs · Navigation (Horizontal + Vertical)</span></div>
              <div className="cs-trow" role="row"><span>Surfaces</span><span>Card · Modal · Sidesheet · Popover · Tooltip · Backdrop</span></div>
              <div className="cs-trow" role="row"><span>Data</span><span>Calendar · DatePicker · Grid (Data Table) · Dropzone</span></div>
            </div>

            <h3 data-rise>8.4 · Why expose all 196 primitives?</h3>
            <p data-rise>T2 semantics cover the common cases. T1 primitives are exposed <em>by design</em>, not hidden. Material 3's hide-the-primitives model trades flexibility for governance; I made the opposite trade with a different governance mechanism.</p>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><h3>Custom component needs</h3><p>Products may need shades outside the 6–7 semantic variants.</p></article>
              <article className="cs-card" data-rise><h3>Product-level semantics</h3><p>Different apps build their own T2 layers from the primitives, keeping everything within the governed palette.</p></article>
              <article className="cs-card" data-rise><h3>DS governance</h3><p>When primitives are the source of truth, any future refinement propagates automatically.</p></article>
              <article className="cs-card" data-rise><h3>Consistency by default</h3><p>Even one-off usage stays inside the tested lightness and chroma range.</p></article>
            </div>
            <div className="cs-callout" data-rise><p>Expose all primitives, guide via semantics. Primitives are the building blocks; semantics are the recommended API. Documentation and Iris (the live token editor) make the recommended path obvious.</p></div>

            <h3 data-rise>8.5 · Alpha as a first-class primitive layer</h3>
            <p data-rise>Old MDS had no alpha tokens. I promoted alpha to a first-class primitive layer — <strong>14 hues × 7 alpha steps = 98 alpha tokens.</strong></p>
            <div className="cs-code" data-rise><pre>{`:root {
  --color-jal-alpha-100: rgb(0 96 214 / 4%);
  --color-jal-alpha-200: rgb(0 96 214 / 8%);
  --color-jal-alpha-300: rgb(0 96 214 / 12%);
  --color-jal-alpha-400: rgb(0 96 214 / 24%);
  --color-jal-alpha-500: rgb(0 96 214 / 40%);
  --color-jal-alpha-600: rgb(0 96 214 / 60%);
  --color-jal-alpha-700: rgb(0 96 214 / 80%);
}`}</pre></div>
            <p data-rise>Hover states, focus rings, scrim layers, tag fills — all standardized on alpha primitives. <strong>Removed 31 ad-hoc opacity declarations from product code.</strong> Transparency is now a named, testable token, bound to a hue at generation time rather than computed at render.</p>

            <h3 data-rise>8.6 · Token build pipeline</h3>
            <div className="cs-code" data-rise><pre>{`Figma Variables (Mode 1)
  ↓ exported as
W3C Design Tokens JSON (palette.tokens.json)
  ↓ Style Dictionary transform
CSS Custom Properties (primitives.css · semantics.css · alpha.css)
  ↓ consumed by
20+ Innovaccer products (React · Vue · native CSS)`}</pre></div>
            <p data-rise>The Color Palette Helper writes directly into the JSON layer, so generation and distribution share the same source of truth. <strong>Figma → product is one pipeline, one direction.</strong></p>
          </div>
        </section>

        {/* 09 INDUSTRY CONTEXT */}
        <section className="cs-section" aria-labelledby="cr-industry">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">09</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>09 · Industry context</p>
            <H id="cr-industry">Where MDS sits</H>
            <p data-rise>I disassembled six design systems before writing a single line of code. The benchmark wasn't to copy — it was to find gaps to exceed.</p>
            <div className="cs-table" role="table" aria-label="Design system comparison" data-rise style={{ ['--cols' as string]: '1.6fr 1fr 1fr 1fr 1fr 1fr 1fr 1.1fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Pattern</span><span>Tailwind v4</span><span>Radix</span><span>Material 3</span><span>Spectrum</span><span>Carbon</span><span>Primer</span><span>MDS now</span></div>
              <div className="cs-trow" role="row"><span>Perceptual color space</span><span>OKLCH</span><span>APCA-derived</span><span>HCT</span><span>partial</span><span>OKLCH-aligned</span><span>partial</span><span className="cs-cell-accent">OKLCH</span></div>
              <div className="cs-trow" role="row"><span>Anchored lightness curve</span><span>partial</span><span>✓</span><span>✓</span><span>✓</span><span>partial</span><span>partial</span><span className="cs-cell-accent">Jal-anchored</span></div>
              <div className="cs-trow" role="row"><span>Hue identity preserved (CI)</span><span>n/a</span><span>n/a</span><span>n/a</span><span>n/a</span><span>partial</span><span>partial</span><span className="cs-cell-accent">✓ all 8</span></div>
              <div className="cs-trow" role="row"><span>Architecture tiers</span><span>2</span><span>2</span><span>3</span><span>4</span><span>3</span><span>3</span><span className="cs-cell-accent">3</span></div>
              <div className="cs-trow" role="row"><span>All primitives exposed</span><span>✓</span><span>✓</span><span>semantics-only</span><span>semantics-only</span><span>✓</span><span>✓</span><span className="cs-cell-accent">✓</span></div>
              <div className="cs-trow" role="row"><span>Alpha as primitives</span><span>✗</span><span>✓</span><span>partial</span><span>✗</span><span>✗</span><span>✗</span><span className="cs-cell-accent">✓ 7 / hue</span></div>
              <div className="cs-trow" role="row"><span>Steps per hue</span><span>11</span><span>12</span><span>13</span><span>14</span><span>11</span><span>12</span><span className="cs-cell-accent">14</span></div>
              <div className="cs-trow" role="row"><span>Live token editor</span><span>✗</span><span>✗</span><span>✗</span><span>internal</span><span>✗</span><span>✗</span><span className="cs-cell-accent">✓ Iris</span></div>
              <div className="cs-trow" role="row"><span>Live product testing</span><span>✗</span><span>✗</span><span>✗</span><span>✗</span><span>✗</span><span>✗</span><span className="cs-cell-accent">✓ Chrome ext</span></div>
              <div className="cs-trow" role="row"><span>Source-aware Figma audit</span><span>✗</span><span>✗</span><span>✗</span><span>✗</span><span>✗</span><span>✗</span><span className="cs-cell-accent">✓ Aurora</span></div>
              <div className="cs-trow" role="row"><span>Documented hue exceptions</span><span>✗</span><span>partial</span><span>✗</span><span>partial</span><span>✓</span><span>✓</span><span className="cs-cell-accent">✓ Yellow + Orange</span></div>
            </div>
            <p data-rise>Reviewed against public source repos and design-system documentation · March 2026.</p>
            <div className="cs-callout" data-rise><p><strong>MDS adopts Primer's T3 token pattern</strong> — <code>{'{component}-{variant}-{property}-{state}'}</code> — because it's the most learnable and extensible naming convention in production. We built our T1 generation method (OKLCH + binary-search gamut mapping) and our testing infrastructure (Iris + Chrome extension) on top of that backbone.</p></div>
            <p data-rise>The two areas where MDS exceeds the field are <strong>testing infrastructure</strong> (no other public DS ships a live product-environment toggle) and <strong>hue identity preservation as a CI test</strong> (most rebuilds rebrand silently or by accident).</p>
          </div>
        </section>

        {/* 10 TESTING */}
        <section className="cs-section" aria-labelledby="cr-testing">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">10</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>10 · Testing</p>
            <H id="cr-testing">A review meeting produces polite opinions. Real testing produces friction.</H>
            <p data-rise>I chose friction. I built two testing instruments. They serve different questions.</p>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">10.1</span><h3>Iris — Live Storybook view</h3><p><strong>The question:</strong> does this token change look right across all components? A token editor where designers tweak L/C/H sliders and watch the entire MDS Storybook re-render in real time. <strong>119 components</strong> rendered live, deltas visible across all of them in &lt;100 ms, changesets exportable as PR-ready token diffs.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">10.2</span><h3>Chrome Extension — Live product</h3><p><strong>The question:</strong> does this palette work on the actual logged-in product? Manifest V3 extension scoped to <code>demo.innovaccer.com</code>. Injects T1 + T2 tokens at <code>document_start</code>. Survives SPA navigation through a MutationObserver. A floating "New Colors / Old Colors" toggle swaps the entire palette with no page reload.</p></article>
            </div>
            <div className="cs-code" data-rise><pre>{`function applyStyles() {
  const link = document.createElement("link");
  link.id = STYLE_ID;
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("tokens.css");
  document.head.appendChild(link);
}

// Survive SPA navigation
const observer = new MutationObserver(() => {
  if (!document.getElementById(STYLE_ID)) applyStyles();
});
observer.observe(document.documentElement, { childList: true, subtree: true });`}</pre></div>
            <div className="cs-callout" data-rise><p><strong>The two tools cover different surfaces.</strong> Iris = component-level. Chrome extension = product-level. Together they close the gap between "looks right in isolation" and "works in production."</p></div>

            <h3 data-rise>10.3 · Branch-based testing · 5-step pipeline</h3>
            <div className="cs-flow cs-flow-5" data-stagger>
              <div className="cs-flow-step" data-rise><i>01</i><b>Publish</b><span>Palette to <code>mds@color-refresh</code> branch + extension build. Preview build available.</span></div>
              <div className="cs-flow-step" data-rise><i>02</i><b>Pull</b><span>Six designers pulled the branch into actual product Figma + code files. Real product context.</span></div>
              <div className="cs-flow-step" data-rise><i>03</i><b>Use</b><span>Two weeks of real product work + extension on live demos. Friction surfaces in use.</span></div>
              <div className="cs-flow-step" data-rise><i>04</i><b>Log</b><span>Issues logged in a shared sheet as they came up. 14 friction points captured.</span></div>
              <div className="cs-flow-step" data-rise><i>05</i><b>Synthesize</b><span>Primitive-layer fixes · republished. Five rounds, all primitive-layer.</span></div>
            </div>
            <div className="cs-callout" data-rise><p><strong>Every fix was a primitive change.</strong> No semantic token had to be renamed or re-pointed. No T3 component selector touched. Every product on the branch inherited fixes for free. <em>This is the architecture paying off in practice.</em></p></div>

            <h3 data-rise>10.4 · CI guards that don't sleep</h3>
            <div className="cs-code" data-rise><pre>{`// Hue identity guard
test.each(HUE_ORIGINALS)('hue preserved · %s', (name, originalH) => {
  const updated = oklch(palette[name]['1000']);
  expect(Math.abs(updated.H - originalH)).toBeLessThanOrEqual(1.5);
});

// Contrast guard (jest-axe baseline from WCAG 2.2 project)
const _axe = configureAxe({
  rules: {
    'color-contrast':           { enabled: true },
    'color-contrast-enhanced':  { enabled: true },
    'link-in-text-block':       { enabled: true },
  },
});`}</pre></div>
            <p data-rise>The constraints I designed against aren't aspirational — they're enforced.</p>
          </div>
        </section>

        {/* 11 IN PRODUCT */}
        <section className="cs-section" aria-labelledby="cr-inproduct">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">11</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>11 · In product</p>
            <H id="cr-inproduct">Four scenarios where one primitive change cascaded</H>

            <h3 data-rise>11.1 · Patient Status Badge — Tawak</h3>
            <figure className="cs-figure" data-rise>
              <div className="cs-figure-ph"><span>Figure 11.1 · Before / after — Patient status badge "Awaiting Review," same surface, same text, restored legibility.</span></div>
            </figure>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">After</span><p>Tawak-1000 <code>#bd5b00</code>. Contrast 4.51 : 1. Same orange identity, now legible. Custom overrides removed across six products.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">Before</span><p>Original Tawak <code>#f07d00</code> on white. Contrast 2.75 : 1. Low-vision users miss the badge. Patient-facing teams applied custom darker fills per product, fragmenting the visual language.</p></article>
            </div>

            <h3 data-rise>11.2 · Warning Banner — Haldi</h3>
            <figure className="cs-figure" data-rise>
              <div className="cs-figure-ph"><span>Figure 11.2 · Before / after — Banner background stays Yellow; text routes through the dark Yellow variant.</span></div>
            </figure>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">After</span><p>Banner fill stays <code>--haldi</code>, but text routes through <code>--haldi-dark</code> (Yellow-1100, L=44, contrast 4.6 : 1). Warning still reads as warning; the text is reliable.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">Before</span><p>Warning text in <code>--haldi</code> (yellow base, L=82). Contrast 1.62 : 1. The most-trafficked warning in clinician workflows was the least readable.</p></article>
            </div>

            <h3 data-rise>11.3 · Chart Legend — Lime + Green pair</h3>
            <figure className="cs-figure" data-rise>
              <div className="cs-figure-ph"><span>Figure 11.3 · Before / after — In dark series, Lime and Green were nearly identical. Now they read as two distinct categories.</span></div>
            </figure>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">After</span><p>Lime locked at H=124°; Green sits at H=140–145°. <strong>A 16–21° gap at every shade.</strong> Identity holds in light, mid, and dark series. Categorical data reads as categorical.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">Before</span><p>In dark series (shades 800–1400), Lime and Green hues sat 4° apart in OKLCH. Two adjacent bars in a stacked chart were indistinguishable to users with color-vision differences and to anyone glancing.</p></article>
            </div>

            <h3 data-rise>11.4 · Button Hover — Alpha primitives</h3>
            <figure className="cs-figure" data-rise>
              <div className="cs-figure-ph"><span>Figure 11.4 · Before / after — Hover state, consistent across white and tinted surfaces.</span></div>
            </figure>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">After</span><p>Hover routes through <code>--color-jal-alpha-400</code> — a named alpha primitive bound to Jal at generation time. Same alpha math, but consistent on every surface.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">Before</span><p>Hover state was Jal-base + <code>opacity: 0.4</code>. On tinted surfaces, the same hover read as a different color. Inconsistent across surfaces.</p></article>
            </div>
          </div>
        </section>

        {/* 12 IMPACT */}
        <section className="cs-section cs-impact-band" aria-labelledby="cr-impact">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">12</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>12 · Impact</p>
            <H id="cr-impact">The numbers</H>

            <h3 data-rise>12.1 · Per-hue base contrast — before vs after</h3>
            <div className="cs-chart" data-chart="contrast-before-after" role="img" aria-label="Chart 4 · Per-hue base contrast on white, before vs after, with a 4.5:1 AA reference line. After-values clear AA for every hue except Haldi (Yellow), which remains a documented structural exception at 2.34:1." />
            <div className="cs-table" role="table" aria-label="Contrast before vs after" data-rise style={{ ['--cols' as string]: '1.4fr 1.2fr 1.2fr 1fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Hue</span><span>Before</span><span>After</span><span>Δ Contrast</span></div>
              <div className="cs-trow" role="row"><span>Jal (Blue)</span><span>4.81 : 1 ✓</span><span className="cs-cell-accent">5.76 : 1 ✓</span><span>+20%</span></div>
              <div className="cs-trow" role="row"><span>Mirch (Red)</span><span>4.61 : 1 ✓</span><span className="cs-cell-accent">6.31 : 1 ✓</span><span>+37%</span></div>
              <div className="cs-trow" role="row"><span>Neem (Green)</span><span>3.09 : 1 ✗</span><span className="cs-cell-accent">5.14 : 1 ✓</span><span>+66%</span></div>
              <div className="cs-trow" role="row"><span>Haldi (Yellow)*</span><span>1.62 : 1 ✗</span><span>2.34 : 1 ✗</span><span>+44% (structural)</span></div>
              <div className="cs-trow" role="row"><span>Tawak (Orange)</span><span>2.75 : 1 ✗</span><span className="cs-cell-accent">4.51 : 1 ✓</span><span>+64%</span></div>
              <div className="cs-trow" role="row"><span>Jamun (Violet)</span><span>5.66 : 1 ✓</span><span className="cs-cell-accent">6.07 : 1 ✓</span><span>+7%</span></div>
              <div className="cs-trow" role="row"><span>Neel (Indigo)</span><span>6.31 : 1 ✓</span><span>5.93 : 1 ✓</span><span>−6% (acceptable)</span></div>
              <div className="cs-trow" role="row"><span>Nimbu (Lime)</span><span>2.03 : 1 ✗</span><span className="cs-cell-accent">5.38 : 1 ✓</span><span>+165%</span></div>
            </div>
            <p data-rise>*Yellow uses <code>--haldi-dark</code> for text-safe contrast (4.6 : 1). See §6.2.</p>

            <h3 data-rise>12.2 · Lightness uniformity at default shade</h3>
            <div className="cs-chart" data-chart="lightness-uniformity" role="img" aria-label="Chart 5 · OKLCH Lightness at the default shade, before vs after per hue. After-values converge near L=52 for every aligned hue; Yellow and Orange sit higher as documented exceptions. Spread drops from 25.9 to 1.4 excluding Yellow and Orange." />
            <div className="cs-stat-grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }} data-stagger>
              <div className="cs-stat" data-rise><strong>34.4 → 22.7</strong><span>All 8 original hues — perceptual L spread.</span></div>
              <div className="cs-stat" data-rise><strong>25.9 → 1.4</strong><span>Excluding Yellow &amp; Orange — spread.</span></div>
              <div className="cs-stat" data-rise><strong>≤ 1.8</strong><span>Max spread across all 14 steps in the new system.</span></div>
            </div>
            <p data-rise>A 500 in any aligned hue now reads as the same visual weight as a 500 in any other. <strong>The shade number became a real signal across the whole palette.</strong></p>

            <h3 data-rise>12.3 · Architectural change</h3>
            <div className="cs-table" role="table" aria-label="Architectural change before vs after" data-rise style={{ ['--cols' as string]: '1.4fr 1fr 2fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Metric</span><span>Before</span><span>After</span></div>
              <div className="cs-trow" role="row"><span>Architecture tiers</span><span>1</span><span>3 (T1 → T2 → T3)</span></div>
              <div className="cs-trow" role="row"><span>Color tokens</span><span>56</span><span>196 primitives + 98 alpha + T3 component map</span></div>
              <div className="cs-trow" role="row"><span>Hue families</span><span>8</span><span>14 (8 original + 4 new + expanded Gray)</span></div>
              <div className="cs-trow" role="row"><span>Shades per hue</span><span>7 (named)</span><span>14 (numeric 100–1400)</span></div>
              <div className="cs-trow" role="row"><span>Color space for generation</span><span>RGB / HSL eyeballed</span><span>OKLCH with binary-search gamut mapping</span></div>
              <div className="cs-trow" role="row"><span>Themability</span><span>none</span><span>brand + dark mode possible at primitive level</span></div>
              <div className="cs-trow" role="row"><span>Hue identity drift</span><span>unmonitored</span><span>≤1° · CI-enforced</span></div>
              <div className="cs-trow" role="row"><span>Alpha handling</span><span>ad-hoc opacity</span><span>first-class primitive layer</span></div>
            </div>

            <h3 data-rise>12.4 · Cross-product impact</h3>
            <p data-rise>Aurora scanned 12 product Figma files in parallel with MDS — Case &amp; Care Management, Outreach, DAP &amp; Analytics, plus 9 others. <strong>287 of 412 product-level color findings (69.7%)</strong> trace to a root cause inside MDS and close automatically when a product upgrades.</p>
            <div className="cs-table" role="table" aria-label="Cross-product impact" data-rise style={{ ['--cols' as string]: '2fr 1fr 1fr 1.2fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Product</span><span>MDS-fixable</span><span>Total</span><span>% closed by MDS</span></div>
              <div className="cs-trow" role="row"><span>Case &amp; Care Management</span><span>78</span><span>112</span><span>69.6%</span></div>
              <div className="cs-trow" role="row"><span>Outreach Module</span><span>53</span><span>81</span><span>65.4%</span></div>
              <div className="cs-trow" role="row"><span>DAP &amp; Analytics</span><span>41</span><span>96</span><span>42.7%</span></div>
              <div className="cs-trow" role="row"><span>9 other products</span><span>115</span><span>123</span><span>93.5%</span></div>
            </div>

            <h3 data-rise>12.5 · Single decisions, multi-component reach</h3>
            <div className="cs-table" role="table" aria-label="Single decisions reach" data-rise style={{ ['--cols' as string]: '0.5fr 2.4fr 1fr 1.2fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>#</span><span>Decision</span><span>Layer</span><span>Product instances closed</span></div>
              <div className="cs-trow" role="row"><span>1</span><span>Off-palette colors → semantic mapping</span><span>Migration</span><span>73</span></div>
              <div className="cs-trow" role="row"><span>2</span><span>Tawak (Orange) base retune (L=70.7 → L=58.1)</span><span>Primitive</span><span>64</span></div>
              <div className="cs-trow" role="row"><span>3</span><span><code>--haldi-dark</code> introduced for text-safe Yellow</span><span>Semantic</span><span>47</span></div>
              <div className="cs-trow" role="row"><span>4</span><span>Alpha primitives replace ad-hoc opacity</span><span>Architecture</span><span>31</span></div>
              <div className="cs-trow" role="row"><span>5</span><span>Lime hue-lock at H=124°</span><span>Primitive</span><span>22</span></div>
            </div>
            <div className="cs-outcome" data-rise>
              <h3>Thesis paid out</h3>
              <p>Single primitive changes resolved tens of components at a time, because the architecture had separated the <em>what</em> from the <em>where</em>.</p>
              <p>The decision sat at the primitive layer; the consequence reached every product on the next build.</p>
            </div>
          </div>
        </section>

        {/* 13 LIMITS */}
        <section className="cs-section" aria-labelledby="cr-limits">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">13</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>13 · Honest limits</p>
            <H id="cr-limits">Three things I didn't fix and won't claim</H>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><h3>Yellow still fails AA at base</h3><p>Yellow's base shade still fails AA on white at 2.34 : 1. The <code>HUE_EXCEPTIONS</code> documentation makes the structural cost visible; the dark variants make text-safe usage available. AAA is not claimed across the board.</p></article>
              <article className="cs-card" data-rise><h3>Color-blindness simulation</h3><p>Protanopia · deuteranopia · tritanopia were not systematically tested during this project. Aurora is the right tool for it; that work is separate from this case study.</p></article>
              <article className="cs-card" data-rise><h3>APCA evaluated, not adopted</h3><p>I stayed with WCAG 2.2 contrast for tooling compatibility — jest-axe, Aurora, and Matrix Maker all work in WCAG-space. APCA is the candidate successor algorithm, but the ecosystem hasn't caught up yet.</p></article>
            </div>
            <p data-rise>Plus two architectural decisions worth naming as trade-offs:</p>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><h3>Yellow and Orange deviate from the anchor</h3><p>Documented as <code>HUE_EXCEPTIONS</code>, not hidden. Yellow's deviation is structural; Orange's is residual (4 L-units average across the scale).</p></article>
              <article className="cs-card" data-rise><h3>Hue identity is a constraint, not a wish</h3><p>Every original hue locked within ~1° of its old H value. The CI test catches future drift — but it also means any deliberate brand evolution requires updating the test alongside the palette.</p></article>
            </div>
          </div>
        </section>

        {/* 14 REFLECTIONS */}
        <section className="cs-section cs-impact-band" aria-labelledby="cr-reflections">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">14</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>14 · What I keep from this</p>
            <H id="cr-reflections">Five things I'll carry into the next system</H>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><h3>Pick the foundation, then defend it</h3><p>I could have stayed in HSL and patched what looked broken. OKLCH wasn't a polish move — it was the choice that made specifying lightness uniform across hues <em>possible</em>. The first decision in a project is usually the one with the highest cost of being wrong.</p></article>
              <article className="cs-card" data-rise><h3>Identity is a constraint, not a wish</h3><p>Locking every original hue within 1° meant designers and users got the same brand they recognized — but only because I built a CI test that <em>enforces</em> it on every future change. Constraints stated as principles erode under deadline pressure. Constraints stated as tests endure.</p></article>
              <article className="cs-card" data-rise><h3>Architecture beats aesthetics</h3><p>The new palette is decent. The three-tier architecture under it is what'll matter in 2030. Five rounds of testing fixes shipped via primitive changes only — semantics never moved, T3 selectors never touched.</p></article>
              <article className="cs-card" data-rise><h3>Test where users live</h3><p>Iris caught component issues. The Chrome extension caught product-environment issues. Both were necessary. A palette that works in Storybook but not on a real logged-in dashboard is a palette that doesn't work.</p></article>
              <article className="cs-card" data-rise><h3>Document what you couldn't fix</h3><p>Yellow can't pass AA at base without losing identity. Orange has a residual 6.3 L-unit gap from Blue. Putting them in <code>HUE_EXCEPTIONS</code> with stated reasons makes the next maintainer's life easier and the system honest.</p></article>
            </div>
            <p className="cs-quote" data-rise>A design system that pretends it's perfect tells you less about the work than one that names its compromises.</p>
          </div>
        </section>
      </main>

      <CaseFooter>MDS · OKLCH · WCAG 2.2 AA · 14 hues · 14 shades · 3 tiers · 5 instruments · 1 brand, redistributed.</CaseFooter>
    </div>
  );
}
