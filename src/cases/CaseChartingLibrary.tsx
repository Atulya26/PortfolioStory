import { useRef } from 'react';
import {
  H,
  Eyebrow,
  Marquee,
  ExperienceChrome,
  ExperienceFooter,
  useExperience,
  type Chapter,
} from './experience';

const CHAPTERS: Chapter[] = [
  { id: 'overview', num: '01', label: 'Overview' },
  { id: 'problem', num: '02', label: 'Problem' },
  { id: 'research', num: '03', label: 'Research' },
  { id: 'define', num: '04', label: 'Define' },
  { id: 'develop', num: '05', label: 'Develop' },
  { id: 'deliver', num: '06', label: 'Deliver' },
  { id: 'impact', num: '07', label: 'Impact' },
];

// Requirements that cut across every chart — the horizontal gallery payload.
const REQ_CARDS: Array<[string, string, string, string]> = [
  ['01', 'Accessibility', 'WCAG 2.1 AA minimum. Chart-color tokens meet 3:1 contrast against background. Text meets shared accessibility expectations.', 'WCAG 2.1 AA'],
  ['02', 'Responsive behaviour', 'Charts adapt down to a minimum width without manual work — axis trimming, legend wrapping, title sizing, in-library.', 'Min-width adaptive'],
  ['03', 'Typography', 'Nunito Sans at MDS type scale. Titles, axis, ticks, tooltips, labels all from the MDS scale.', 'Nunito Sans'],
  ['04', 'Theming', 'Token structure set up so future MDS theme work propagates into the chart layer without rewriting components.', 'Token-driven'],
  ['05', 'Semantic props', 'Every chart exposes a semantic API, designed for LLM legibility.', 'LLM-legible'],
  ['06', 'The rule', 'These cut across every chart type — rules the system enforces, not rules each chart sets for itself.', 'System-enforced'],
];

export default function CaseChartingLibrary() {
  const rootRef = useRef<HTMLDivElement>(null);
  useExperience(rootRef, { chapters: CHAPTERS, title: 'A Charting Library for MDS' });

  return (
    <div className="csx-root" ref={rootRef}>
      <ExperienceChrome chapters={CHAPTERS} tag="Charting Library · MDS" />

      <main className="csx-main">
        {/* ================= HERO ================= */}
        <section className="csx-hero" aria-labelledby="cl-hero-title">
          <span className="csx-hero-ghost" aria-hidden="true">12</span>
          <div className="csx-hero-inner">
            <Eyebrow>Graduation Project · Design Systems · Charts · Healthcare</Eyebrow>
            <H id="cl-hero-title" level={1} className="csx-hero-h">A charting library for Masala Design System</H>
            <p className="csx-hero-lede" data-rise>
              The missing charting layer for Innovaccer's design system — components, color, accessibility, and guidelines, so every chart in every product comes from
              <strong className="csx-blue"> one shared source</strong>.
            </p>
            <div className="csx-hero-meta" data-stagger>
              {[['Author', 'Atulya'], ['Program', "Master's, Interaction Design"], ['Output', '@atulya_26/charting-library'], ['Year', '2026']].map(([k, v]) => (
                <div className="csx-meta-pill" data-rise key={k}><span>{k}</span><strong>{v}</strong></div>
              ))}
            </div>
          </div>
          <div className="csx-scrollcue" aria-hidden="true"><span /><p>Scroll</p></div>
        </section>

        <Marquee items={['12 CHART TYPES', '3 COLOR FAMILIES', '11+ GUIDELINE PAGES', 'ONE SHARED SOURCE', 'AI-LEGIBLE PROPS']} />

        {/* ================= 01 OVERVIEW ================= */}
        <section className="csx-section" id="overview" aria-labelledby="cl-overview-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">01</span>
          <div className="csx-inner">
            <Eyebrow>01 · At a glance</Eyebrow>
            <H id="cl-overview-title">Designing and shipping a charting library inside MDS</H>
            <p className="csx-lede" data-rise>With components, color, accessibility, and guidelines — so every chart in every Innovaccer product can come from one shared system.</p>
            <div className="csx-stat-grid" data-stagger>
              <div className="csx-stat" data-rise><strong>12</strong><span>chart types live in Storybook.</span></div>
              <div className="csx-stat" data-rise><strong>3</strong><span>color families: categorical, sequential, sentiment.</span></div>
              <div className="csx-stat" data-rise><strong>11+</strong><span>guideline pages for chart usage patterns.</span></div>
              <div className="csx-stat" data-rise><strong>1</strong><span>shared source for components, guidance, and AI-legible props.</span></div>
            </div>
            <div className="csx-grid-4" data-stagger>
              <article className="csx-card" data-rise><div><h3>Components</h3><p>A working set of chart types covering common product needs.</p></div></article>
              <article className="csx-card" data-rise><div><h3>Color tokens</h3><p>Three families: categorical, sequential, sentiment.</p></div></article>
              <article className="csx-card" data-rise><div><h3>Accessibility</h3><p>Considerations the library and the products around it must meet.</p></div></article>
              <article className="csx-card" data-rise><div><h3>Guidelines</h3><p>Which chart to use, how to use it well, what to check when stuck.</p></div></article>
            </div>
            <figure className="csx-figure" data-rise>
              <div className="csx-figure-ph"><span>PPT asset · A double diamond, not a straight line — the process diagram.</span></div>
              <figcaption>Selected process asset · A double diamond, not a straight line.</figcaption>
            </figure>
          </div>
        </section>

        {/* ================= 02 PROBLEM ================= */}
        <section className="csx-section" id="problem" aria-labelledby="cl-problem-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">02</span>
          <div className="csx-inner">
            <Eyebrow>02 · Problem</Eyebrow>
            <H id="cl-problem-title">MDS covered the interface, but not the dominant content</H>
            <p data-rise>Innovaccer is a healthcare data platform. Its products help hospitals, care planners, and payers bring clinical, operational, and financial data together into a single workflow.</p>
            <p data-rise>Masala Design System (MDS) is Innovaccer's shared design system — components published at <a href="https://mds.innovaccer.com" target="_blank" rel="noreferrer">mds.innovaccer.com</a> and used across every product. A mature system with 60+ components and patterns: buttons, forms, tables, modals, dropdowns, navigation, layout primitives.</p>
            <div className="csx-callout" data-rise><p>What it doesn't cover is charts. <strong>Zero chart components.</strong></p></div>
            <div className="csx-grid-3" data-stagger>
              <article className="csx-card" data-rise><div><h3>Power BI</h3><p>Convenient, but locked behind an iframe. Nothing inside uses MDS tokens. Typography is Segoe UI, not Nunito Sans.</p></div></article>
              <article className="csx-card" data-rise><div><h3>Ad-hoc libraries</h3><p>Teams have used Recharts, Chart.js, Victory, ECharts, D3. All good libraries. None ship with MDS styling built in.</p></div></article>
              <article className="csx-card" data-rise><div><h3>AI prototyping</h3><p>When AI tools hit a chart, they make one up. Same prompt on a different day → a different chart.</p></div></article>
            </div>
            <figure className="csx-figure" data-rise>
              <div className="csx-figure-ph"><span>PPT asset · One problem, four heads — the failure-modes diagram.</span></div>
              <figcaption>Selected process asset · One problem, four heads.</figcaption>
            </figure>
            <p className="csx-quote" data-rise>The most important content in the product is also the least consistent, least accessible, and least extensible part of the experience.</p>
          </div>
        </section>

        {/* ================= 03 RESEARCH ================= */}
        <section className="csx-section" id="research" aria-labelledby="cl-research-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">03</span>
          <div className="csx-inner">
            <Eyebrow>03 · Research</Eyebrow>
            <H id="cl-research-title">Looking outward, then inward</H>
            <p data-rise>Five design systems that had already tried to solve charting. We weren't looking for one to copy — we were looking for what's shared, what's contextual, and what doesn't carry over at all.</p>
            <div className="csx-table" role="table" aria-label="External design system comparison" data-rise style={{ ['--cols' as string]: '1fr 1fr 1fr 1.3fr' }}>
              <div className="csx-trow csx-thead" role="row"><span>System</span><span>Rendering engine</span><span>Chart inventory</span><span>What we adopted</span></div>
              <div className="csx-trow" role="row"><span>IBM Carbon</span><span>D3 wrapper</span><span>Wide and deep</span><span>Rigor + prop-naming discipline</span></div>
              <div className="csx-trow" role="row"><span>Adobe Spectrum</span><span>Vega</span><span>Smaller, focused</span><span>Deep step-scales, principles companion</span></div>
              <div className="csx-trow" role="row"><span>GitLab Pajamas</span><span>Apache ECharts</span><span>Small, focused</span><span>Engine choice + contrast testing</span></div>
              <div className="csx-trow" role="row"><span>Google Material</span><span>Google Charts (separate)</span><span>Wide but split</span><span>Negative lesson — don't split components from guidance</span></div>
              <div className="csx-trow" role="row"><span>Ant Design / AntV</span><span>G2 / G2Plot</span><span>Very wide (~40)</span><span>Coordinated design + engine release</span></div>
            </div>
            <H>How the internal audit ran</H>
            <p data-rise>Pulled chart screens from across Innovaccer's products into one Figma board. Grouped by chart type. Logged what we saw. Cross-checked against demo environments and each product's Figma files.</p>
            <div className="csx-flow" data-stagger>
              <div className="csx-flow-step" data-rise><b>Collect</b><span>Chart screens across products.</span></div>
              <div className="csx-flow-step" data-rise><b>Consolidate</b><span>Into a single Figma board.</span></div>
              <div className="csx-flow-step" data-rise><b>Group</b><span>By chart type.</span></div>
              <div className="csx-flow-step" data-rise><b>Log</b><span>Against a 9-point feature checklist.</span></div>
            </div>
            <h3 data-rise>What we captured for every chart</h3>
            <div className="csx-checks" data-stagger>
              {['Product', 'Chart type', 'Color treatment', 'Title', 'Axis labels', 'Tooltip', 'Legend', 'Empty / missing data', 'Responsive'].map((t) => <span data-rise key={t}>{t}</span>)}
            </div>
            <figure className="csx-figure" data-rise>
              <div className="csx-figure-ph"><span>PPT asset · The feature audit matrix across products.</span></div>
              <figcaption>Selected process asset · The feature audit matrix.</figcaption>
            </figure>
          </div>
        </section>

        {/* ================= 04 DEFINE ================= */}
        <section className="csx-section" id="define" aria-labelledby="cl-define-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">04</span>
          <div className="csx-inner">
            <Eyebrow>04 · Define</Eyebrow>
            <H id="cl-define-title">The initial version covers the common product chart set</H>
            <div className="csx-chips" data-stagger>
              {['Bar chart', 'Clustered bar', 'Stacked bar', 'Histogram', 'Line chart', 'Sparkline', 'Donut chart', 'Half donut', 'Pointer scale', 'Map bubble', 'Combination', 'Sankey'].map((t) => <span data-rise key={t}>{t}</span>)}
            </div>
            <h3 data-rise>Structural requirements — the same shape, every chart</h3>
            <div className="csx-checks" data-stagger>
              {['Title slot', 'Optional subtitle', 'Legend', 'Axis', 'Tooltip', 'Data-table fallback', 'Loading state', 'Empty state', 'Error state'].map((t) => <span data-rise key={t}>{t}</span>)}
            </div>
            <h3 data-rise>Interactions — shared, consistent, predictable</h3>
            <div className="csx-flow" data-stagger>
              <div className="csx-flow-step" data-rise><b>Tab</b><span>focus into chart.</span></div>
              <div className="csx-flow-step" data-rise><b>Arrows</b><span>between data points.</span></div>
              <div className="csx-flow-step" data-rise><b>Enter / Space</b><span>activate.</span></div>
              <div className="csx-flow-step" data-rise><b>Escape</b><span>exit.</span></div>
            </div>
            <h3 data-rise>Three families — categorical, sequential, sentiment</h3>
            <div className="csx-palette" data-rise>
              <div className="csx-swatches">{['#394cc7', '#3bceff', '#1ea97c', '#8a5cf6', '#d75aa6', '#f28c28'].map((c) => <span key={c} style={{ background: c }} />)}</div>
              <div className="csx-swatches">{['#DBF8FF', '#ACEBFA', '#76D8EE', '#32BBD6', '#16849A', '#0E5362'].map((c) => <span key={c} style={{ background: c }} />)}</div>
              <div className="csx-sentiment"><span>positive</span><span>neutral</span><span>negative</span></div>
            </div>
          </div>
        </section>

        {/* ================= 04· REQUIREMENTS — vertical card stack ================= */}
        <section className="csx-arch csx-arch--static" aria-labelledby="cl-req-title">
          <div className="csx-arch-head">
            <div className="csx-inner">
              <Eyebrow>04 · Cross-cutting requirements</Eyebrow>
              <H id="cl-req-title">Rules that cut across every chart type</H>
            </div>
            <span className="csx-arch-count" aria-hidden="true"><span>01</span>/06</span>
          </div>
          <div className="csx-arch-track">
            {REQ_CARDS.map(([idx, title, body, chip]) => (
              <article className="csx-arch-card" key={idx}>
                <span className="csx-arch-num">{idx}</span>
                <div><h3>{title}</h3><p>{body}</p></div>
                <span className="csx-chip">{chip}</span>
              </article>
            ))}
          </div>
        </section>

        {/* ================= 05 DEVELOP ================= */}
        <section className="csx-section" id="develop" aria-labelledby="cl-develop-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">05</span>
          <div className="csx-inner">
            <Eyebrow>05 · Develop</Eyebrow>
            <H id="cl-develop-title">Combination chart was the seed</H>
            <p data-rise>Designed once in Figma at full fidelity — the decisions were the asset, not the artboard. The combination chart (bar + line) was picked first because it is the structurally hardest: two encodings, two axes, two tooltip behaviors, overlap rules, and color logic across types.</p>
            <figure className="csx-figure" data-rise>
              <div className="csx-figure-ph"><span>PPT asset · Combination chart as the parent design.</span></div>
              <figcaption>Selected process asset · Combination chart as parent.</figcaption>
            </figure>
            <div className="csx-checks" data-stagger>
              {['Color rule', 'Axis rule', 'Tooltip rule', 'Gridline weight', 'States', 'Density'].map((t) => <span data-rise key={t}>{t}</span>)}
            </div>
            <h3 data-rise>Why chart colors are not the same as UI colors</h3>
            <div className="csx-grid-3" data-stagger>
              <article className="csx-card" data-rise><div><h3>Different reading jobs</h3><p>A button uses color to draw attention. A chart uses color to encode information.</p></div></article>
              <article className="csx-card" data-rise><div><h3>Tones sit calmly</h3><p>Slightly muted, slightly cooler. Lightest tones support sequential gradients; mid tones support categorical distinction.</p></div></article>
              <article className="csx-card" data-rise><div><h3>Different evolution rates</h3><p>UI palette is calibrated for buttons and badges. Chart palette is calibrated for series count and gridlines.</p></div></article>
            </div>
            <h3 data-rise>Designing in the age of AI</h3>
            <div className="csx-flow csx-flow-5" data-stagger>
              <div className="csx-flow-step" data-rise><i>1</i><b>Audits</b><span>Requirements from internal + external audits.</span></div>
              <div className="csx-flow-step" data-rise><i>2</i><b>Figma deep design</b><span>One chart — the combo — designed in full. Look and feel locked.</span></div>
              <div className="csx-flow-step" data-rise><i>3</i><b>AI expansion</b><span>Prompted to apply foundational decisions to other charts.</span></div>
              <div className="csx-flow-step" data-rise><i>4</i><b>Review loop</b><span>Some charts went through two or three correction loops.</span></div>
              <div className="csx-flow-step" data-rise><i>5</i><b>Final review</b><span>Reviewed individually and as a complete set.</span></div>
            </div>
            <div className="csx-grid-3" data-stagger>
              <article className="csx-card" data-rise><div><h3>What AI did well</h3><p>Once the bar chart had its color, axis, gridline, label, and tooltip rules settled, applying them to a histogram wasn't a creative act — it was mechanical.</p></div></article>
              <article className="csx-card" data-rise><div><h3>What AI couldn't do</h3><p>The combination chart's design didn't come from a prompt. It came from audits, trade-offs, and calls about what chart language fits Innovaccer's products.</p></div></article>
              <article className="csx-card" data-rise><div><h3>What changed</h3><p>A month of solo work took weeks. Weeks of documentation took days. The catch: AI output couldn't go straight in — a person still had to review.</p></div></article>
            </div>
            <h3 data-rise>The prompt is the design system</h3>
            <div className="csx-split">
              <div className="csx-panel" data-rise>
                <div className="csx-panel-title"><span className="csx-label">Worked</span><h3>Prompt patterns that worked</h3></div>
                <div className="csx-chips">{['Constraint-first prompts', 'Same as X, but for Y', 'Reference-by-component', 'Small vertical slices', 'State-explicit prompts'].map((t) => <span key={t}>{t}</span>)}</div>
              </div>
              <div className="csx-panel" data-rise>
                <div className="csx-panel-title"><span className="csx-label">Didn't work</span><h3>What didn't work</h3></div>
                <p>"Make a nice chart library."</p>
                <p>Prompts without the existing rules attached.</p>
                <p>Long multi-chart prompts.</p>
              </div>
            </div>
            <p className="csx-quote" data-rise>AI didn't invent the design. It carried the foundational decisions forward.</p>
            <h3 data-rise>Git turned iteration into structure</h3>
            <div className="csx-flow" data-stagger>
              <div className="csx-flow-step" data-rise><b>Phase 1 · Foundation</b><span>feat: combo chart base + token registry</span></div>
              <div className="csx-flow-step" data-rise><b>Phase 2 · Per-chart</b><span>feat: bar, clustered, stacked variants</span></div>
              <div className="csx-flow-step" data-rise><b>Phase 3 · Hardening</b><span>fix: visual alignment across all charts</span></div>
              <div className="csx-flow-step" data-rise><b>Phase 4 · Release</b><span>release: @atulya_26/charting-library</span></div>
            </div>
          </div>
        </section>

        {/* ================= 06 DELIVER ================= */}
        <section className="csx-section" id="deliver" aria-labelledby="cl-deliver-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">06</span>
          <div className="csx-inner">
            <Eyebrow>06 · Deliver</Eyebrow>
            <H id="cl-deliver-title">From prototype to @atulya_26/charting-library</H>
            <div className="csx-grid-2" data-stagger>
              <article className="csx-card" data-rise><div><h3>Stories for every chart</h3><p>In Storybook, deployed to GitHub Pages.</p></div></article>
              <article className="csx-card" data-rise><div><h3>First-class state variants</h3><p>Async, loading, empty, and error as chart variants.</p></div></article>
              <article className="csx-card" data-rise><div><h3>Quality gates</h3><p>Visual-alignment pass · performance baseline · accessibility checks.</p></div></article>
              <article className="csx-card" data-rise><div><h3>Guidelines site</h3><p>"Which chart, when, why" as a written reference, not just a Figma file.</p></div></article>
            </div>
            <h3 data-rise>Two audiences, two sets</h3>
            <div className="csx-grid-2" data-stagger>
              <article className="csx-card csx-list-panel" data-rise>
                <div><h3>For designers and developers using the library</h3>
                <ul><li>Which chart to pick.</li><li>How to use it properly.</li><li>What to avoid.</li><li>What to do when stuck between two options.</li></ul></div>
              </article>
              <article className="csx-card csx-list-panel" data-rise>
                <div><h3>For developers maintaining the library</h3>
                <ul><li>API conventions.</li><li>Prop naming rules.</li><li>State contract.</li><li>Rules for adding new chart types.</li><li>Testing conventions.</li></ul></div>
              </article>
            </div>
            <h3 data-rise>Install and ship a first chart</h3>
            <div className="csx-code" data-rise><pre>{`npm install @atulya_26/charting-library

import { BarChart } from '@atulya_26/charting-library';

<BarChart
  categories={['Jan', 'Feb', 'Mar']}
  series={[{ name: 'Admissions', data: [120, 180, 150] }]}
  showLegend
  showTooltip
/>`}</pre></div>
            <h3 data-rise>Every guideline page has the same shape</h3>
            <div className="csx-deflist" data-stagger>
              {[
                ['Introduction', 'What the chart is, what it communicates.'],
                ['When to use', '"Use this chart when…" statements.'],
                ['When not to use', 'Wrong choices + pointers to alternatives.'],
                ['Anatomy', 'Diagram with every part marked. Shared vocabulary.'],
                ['Variants', 'Horizontal vs vertical, single vs multi-series.'],
                ['Color', 'Family + tokens, with rationale.'],
                ['States', 'Six states with visual examples.'],
                ['Interaction', 'Interaction set + keyboard keymap.'],
                ['Accessibility', 'Considerations relevant to the chart.'],
                ['Do & don\'t', 'Visual examples — phrased as do/don\'t, not rules.'],
              ].map(([b, s]) => <div className="csx-def" data-rise key={b}><b>{b}</b><span>{s}</span></div>)}
            </div>
            <h3 data-rise>The first test — does the package work?</h3>
            <div className="csx-flow csx-flow-5" data-stagger>
              <div className="csx-flow-step" data-rise><i>1</i><span>Designer</span></div>
              <div className="csx-flow-step" data-rise><i>2</i><span>npm install the package</span></div>
              <div className="csx-flow-step" data-rise><i>3</i><span>import BarChart</span></div>
              <div className="csx-flow-step" data-rise><i>4</i><span>AI prompt in Figma Make / Claude Code</span></div>
              <div className="csx-flow-step" data-rise><i>5</i><span>Chart renders with MDS tokens</span></div>
            </div>
            <div className="csx-outcome" data-rise>
              <h3>What changed for designers</h3>
              <p>Before this work, "Which chart should I use?" depended on which library the team had already adopted — a different answer for every team. Every chart decision started from zero.</p>
              <p>Now, designers using Figma Make or Claude Code with the library installed get charts that match the rest of the screen — because the library has names and props an AI tool can quote directly.</p>
            </div>
          </div>
        </section>

        {/* ================= 07 IMPACT — editorial closing ================= */}
        <section className="csx-closing-band" id="impact" aria-labelledby="cl-impact-title">
          <div className="csx-inner">
            <Eyebrow>07 · Impact</Eyebrow>
            <H id="cl-impact-title">From zero chart components to a shippable library</H>
            <div className="csx-closing-versus" data-stagger>
              <article className="csx-closing-card" data-rise>
                <span className="csx-label">Before</span>
                <strong>0</strong>
                <p>MDS chart components — every product chose its own library.</p>
              </article>
              <span className="csx-closing-arrow" aria-hidden="true">→</span>
              <article className="csx-closing-card csx-closing-card--accent" data-rise>
                <span className="csx-label">After</span>
                <strong>12</strong>
                <p>Chart types in Storybook, guidelines, and @atulya_26/charting-library.</p>
              </article>
            </div>
            <div className="csx-closing-stats" data-stagger>
              {[
                ['3 color families', 'Categorical, sequential, and sentiment — separate from UI tokens.'],
                ['11+ guideline pages', 'When-to-use, anatomy, states, and do/don\'t for every chart.'],
                ['1 shared source', 'Components, guidance, and AI-legible props in one package.'],
              ].map(([title, body]) => (
                <div className="csx-closing-stat" data-rise key={title}><strong>{title}</strong><span>{body}</span></div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= REFLECTIONS ================= */}
        <section className="csx-section csx-impact-after" aria-labelledby="cl-reflect-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">↺</span>
          <div className="csx-inner">
            <Eyebrow>Reflections</Eyebrow>
            <H id="cl-reflect-title">One library. One set of components. One set of decisions already made.</H>
            <h3 data-rise>What shipped with the initial version</h3>
            <div className="csx-grid-2" data-stagger>
              <article className="csx-card" data-rise><div><h3>A working set of chart types</h3><p>Bar, clustered, stacked, histogram, line, sparkline, donut, half donut, pointer scale, map bubble, combination, Sankey.</p></div></article>
              <article className="csx-card" data-rise><div><h3>Chartboard — internal dashboard</h3><p>An internal dashboard that lets a designer test any chart quickly.</p></div></article>
              <article className="csx-card" data-rise><div><h3>A guidelines set</h3><p>Each chart with when-to-use, anatomy, variants, color, states, interactions, do-and-don't.</p></div></article>
              <article className="csx-card" data-rise><div><h3>Published as an npm package</h3><p>Installable into any Innovaccer product on MDS. Typed, with semantic props.</p></div></article>
            </div>
            <div className="csx-grid-3" data-stagger>
              <article className="csx-card" data-rise><div><h3>Framing compounds</h3><p>The hardest decisions came early. Spend more time on framing than on the visual.</p></div></article>
              <article className="csx-card" data-rise><div><h3>AI shifts the work</h3><p>The interesting work moved up a level — to framing decisions and system-level rules.</p></div></article>
              <article className="csx-card" data-rise><div><h3>Write guidelines in parallel</h3><p>Components are easier to design well when you're also writing down when to use them.</p></div></article>
            </div>
            <p className="csx-quote" data-rise>AI made first drafts cheap. Git is what made the drafts add up to a product.</p>
          </div>
        </section>

        <Marquee items={['12 CHART TYPES', '3 COLOR FAMILIES', 'ONE SHARED SOURCE', '@ATULYA_26/CHARTING-LIBRARY']} />
      </main>

      <ExperienceFooter>Storybook · Guidelines · GitHub · npm — @atulya_26/charting-library</ExperienceFooter>
    </div>
  );
}
