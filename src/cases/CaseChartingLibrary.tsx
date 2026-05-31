import { useRef } from 'react';
import { H, CaseChrome, CaseFooter, useCaseStudyMotion, useCasePage } from './shared';

export default function CaseChartingLibrary() {
  const rootRef = useRef<HTMLDivElement>(null);
  useCasePage('Charting Library for MDS');
  useCaseStudyMotion(rootRef);

  return (
    <div className="cs-root" ref={rootRef}>
      <CaseChrome tag="Charting Library · MDS" />

      <main>
        {/* HERO */}
        <section className="cs-section cs-hero" aria-labelledby="cl-hero">
          <span className="cs-ghost" data-parallax="1.6" aria-hidden="true">12</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>Graduation Project · Design Systems · Chart Components · Healthcare</p>
            <H id="cl-hero" level={1}>Designing a charting library for Masala Design System</H>
            <p className="cs-lede cs-hero-lede" data-rise>The missing charting layer for Innovaccer's design system — components, color, accessibility, and guidelines, so every chart in every product comes from one shared source.</p>
            <div className="cs-meta-grid" aria-label="Project metadata" data-stagger>
              <div className="cs-meta-item" data-rise><span className="cs-label">Author</span><span className="cs-meta-value">Atulya</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Program</span><span className="cs-meta-value">Master's, Interaction Design</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Output</span><span className="cs-meta-value">@atulya_26/charting-library</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Year</span><span className="cs-meta-value">2026</span></div>
            </div>
            <div className="cs-stat-grid" data-stagger>
              <div className="cs-stat" data-rise><strong><span data-count="12">12</span></strong><span>chart types live in Storybook.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="3">3</span></strong><span>color families: categorical, sequential, sentiment.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="11" data-suffix="+">11+</span></strong><span>guideline pages for chart usage patterns.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="1">1</span></strong><span>shared source for components, guidance, and AI-legible props.</span></div>
            </div>
          </div>
        </section>

        {/* 00 OVERVIEW */}
        <section className="cs-section" aria-labelledby="cl-overview">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">00</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>00 · At a glance</p>
            <H id="cl-overview">Designing and shipping a charting library inside MDS</H>
            <p className="cs-lede" data-rise>With components, color, accessibility, and guidelines — so every chart in every Innovaccer product can come from one shared system.</p>
            <div className="cs-cards cs-cards-4" data-stagger>
              <article className="cs-card" data-rise><h3>Components</h3><p>A working set of chart types covering common product needs.</p></article>
              <article className="cs-card" data-rise><h3>Color tokens</h3><p>Three families: categorical, sequential, sentiment.</p></article>
              <article className="cs-card" data-rise><h3>Accessibility</h3><p>Considerations the library and the products around it must meet.</p></article>
              <article className="cs-card" data-rise><h3>Guidelines</h3><p>Which chart to use, how to use it well, what to check when stuck.</p></article>
            </div>
            <figure className="cs-figure" data-rise>
              <div className="cs-figure-ph"><span>PPT asset · A double diamond, not a straight line — the process diagram.</span></div>
              <figcaption>Selected process asset · A double diamond, not a straight line.</figcaption>
            </figure>
          </div>
        </section>

        {/* 01 PROBLEM */}
        <section className="cs-section" aria-labelledby="cl-problem">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">01</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>01 · Problem</p>
            <H id="cl-problem">MDS covered the interface, but not the dominant content</H>
            <p data-rise>Innovaccer is a healthcare data platform. Its products help hospitals, care planners, and payers bring clinical, operational, and financial data together into a single workflow.</p>
            <p data-rise>Masala Design System (MDS) is Innovaccer's shared design system — components published at <a href="https://mds.innovaccer.com" target="_blank" rel="noreferrer">mds.innovaccer.com</a> and used across every product. A mature system with 60+ components and patterns: buttons, forms, tables, modals, dropdowns, navigation, layout primitives.</p>
            <div className="cs-callout" data-rise><p>What it doesn't cover is charts. Zero chart components.</p></div>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><h3>Power BI</h3><p>Convenient, but locked behind an iframe. Nothing inside uses MDS tokens. Typography is Segoe UI, not Nunito Sans.</p></article>
              <article className="cs-card" data-rise><h3>Ad-hoc libraries</h3><p>Teams have used Recharts, Chart.js, Victory, ECharts, D3. All good libraries. None ship with MDS styling built in.</p></article>
              <article className="cs-card" data-rise><h3>AI prototyping</h3><p>When AI tools hit a chart, they make one up. Same prompt on a different day → a different chart.</p></article>
            </div>
            <figure className="cs-figure" data-rise>
              <div className="cs-figure-ph"><span>PPT asset · One problem, four heads — the failure-modes diagram.</span></div>
              <figcaption>Selected process asset · One problem, four heads.</figcaption>
            </figure>
            <p className="cs-quote" data-rise>The most important content in the product is also the least consistent, least accessible, and least extensible part of the experience.</p>
          </div>
        </section>

        {/* 02 RESEARCH */}
        <section className="cs-section" aria-labelledby="cl-research">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">02</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>02 · Research</p>
            <H id="cl-research">Looking outward, then inward</H>
            <p data-rise>Five design systems that had already tried to solve charting. We weren't looking for one to copy — we were looking for what's shared, what's contextual, and what doesn't carry over at all.</p>
            <div className="cs-table" role="table" aria-label="External design system comparison" data-rise style={{ ['--cols' as string]: '1fr 1fr 1fr 1.3fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>System</span><span>Rendering engine</span><span>Chart inventory</span><span>What we adopted</span></div>
              <div className="cs-trow" role="row"><span>IBM Carbon</span><span>D3 wrapper</span><span>Wide and deep</span><span>Rigor + prop-naming discipline</span></div>
              <div className="cs-trow" role="row"><span>Adobe Spectrum</span><span>Vega</span><span>Smaller, focused</span><span>Deep step-scales, principles companion</span></div>
              <div className="cs-trow" role="row"><span>GitLab Pajamas</span><span>Apache ECharts</span><span>Small, focused</span><span>Engine choice + contrast testing</span></div>
              <div className="cs-trow" role="row"><span>Google Material</span><span>Google Charts (separate)</span><span>Wide but split</span><span>Negative lesson — don't split components from guidance</span></div>
              <div className="cs-trow" role="row"><span>Ant Design / AntV</span><span>G2 / G2Plot</span><span>Very wide (~40)</span><span>Coordinated design + engine release</span></div>
            </div>
            <H>How the internal audit ran</H>
            <p data-rise>Pulled chart screens from across Innovaccer's products into one Figma board. Grouped by chart type. Logged what we saw. Cross-checked against demo environments and each product's Figma files.</p>
            <div className="cs-flow" data-stagger>
              <div className="cs-flow-step" data-rise><b>Collect</b><span>Chart screens across products.</span></div>
              <div className="cs-flow-step" data-rise><b>Consolidate</b><span>Into a single Figma board.</span></div>
              <div className="cs-flow-step" data-rise><b>Group</b><span>By chart type.</span></div>
              <div className="cs-flow-step" data-rise><b>Log</b><span>Against a 9-point feature checklist.</span></div>
            </div>
            <h3 data-rise>What we captured for every chart</h3>
            <div className="cs-checks" data-stagger>
              {['Product', 'Chart type', 'Color treatment', 'Title', 'Axis labels', 'Tooltip', 'Legend', 'Empty / missing data', 'Responsive'].map((t) => <span data-rise key={t}>{t}</span>)}
            </div>
            <figure className="cs-figure" data-rise>
              <div className="cs-figure-ph"><span>PPT asset · The feature audit matrix across products.</span></div>
              <figcaption>Selected process asset · The feature audit matrix.</figcaption>
            </figure>
          </div>
        </section>

        {/* 03 DEFINE */}
        <section className="cs-section" aria-labelledby="cl-define">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">03</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>03 · Define</p>
            <H id="cl-define">The initial version covers the common product chart set</H>
            <div className="cs-chips" data-stagger>
              {['Bar chart', 'Clustered bar', 'Stacked bar', 'Histogram', 'Line chart', 'Sparkline', 'Donut chart', 'Half donut', 'Pointer scale', 'Map bubble', 'Combination', 'Sankey'].map((t) => <span data-rise key={t}>{t}</span>)}
            </div>
            <h3 data-rise>Structural requirements — the same shape, every chart</h3>
            <div className="cs-checks" data-stagger>
              {['Title slot', 'Optional subtitle', 'Legend', 'Axis', 'Tooltip', 'Data-table fallback', 'Loading state', 'Empty state', 'Error state'].map((t) => <span data-rise key={t}>{t}</span>)}
            </div>
            <h3 data-rise>Interactions — shared, consistent, predictable</h3>
            <div className="cs-flow" data-stagger>
              <div className="cs-flow-step" data-rise><b>Tab</b><span>focus into chart.</span></div>
              <div className="cs-flow-step" data-rise><b>Arrows</b><span>between data points.</span></div>
              <div className="cs-flow-step" data-rise><b>Enter / Space</b><span>activate.</span></div>
              <div className="cs-flow-step" data-rise><b>Escape</b><span>exit.</span></div>
            </div>
            <h3 data-rise>Three families — categorical, sequential, sentiment</h3>
            <div className="cs-palette" data-rise>
              <div className="cs-swatches">{['#394cc7', '#3bceff', '#1ea97c', '#8a5cf6', '#d75aa6', '#f28c28'].map((c) => <span key={c} style={{ background: c }} />)}</div>
              <div className="cs-swatches">{['#DBF8FF', '#ACEBFA', '#76D8EE', '#32BBD6', '#16849A', '#0E5362'].map((c) => <span key={c} style={{ background: c }} />)}</div>
              <div className="cs-sentiment"><span>positive</span><span>neutral</span><span>negative</span></div>
            </div>
            <h3 data-rise>Requirements that cut across every chart</h3>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><h3>Accessibility</h3><p>WCAG 2.1 AA minimum. Chart-color tokens meet 3:1 contrast against background. Text meets shared accessibility expectations.</p></article>
              <article className="cs-card" data-rise><h3>Responsive behaviour</h3><p>Charts adapt down to a minimum width without manual work — axis trimming, legend wrapping, title sizing, in-library.</p></article>
              <article className="cs-card" data-rise><h3>Typography</h3><p>Nunito Sans at MDS type scale. Titles, axis, ticks, tooltips, labels all from the MDS scale.</p></article>
              <article className="cs-card" data-rise><h3>Theming</h3><p>Token structure set up so future MDS theme work propagates into the chart layer without rewriting components.</p></article>
              <article className="cs-card" data-rise><h3>Semantic props</h3><p>Every chart exposes a semantic API, designed for LLM legibility.</p></article>
              <article className="cs-card" data-rise><h3>The rule</h3><p>These cut across every chart type — rules the system enforces, not rules each chart sets for itself.</p></article>
            </div>
          </div>
        </section>

        {/* 04 DEVELOP */}
        <section className="cs-section" aria-labelledby="cl-develop">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">04</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>04 · Develop</p>
            <H id="cl-develop">Combination chart was the seed</H>
            <p data-rise>Designed once in Figma at full fidelity — the decisions were the asset, not the artboard. The combination chart (bar + line) was picked first because it is the structurally hardest: two encodings, two axes, two tooltip behaviors, overlap rules, and color logic across types.</p>
            <figure className="cs-figure" data-rise>
              <div className="cs-figure-ph"><span>PPT asset · Combination chart as the parent design.</span></div>
              <figcaption>Selected process asset · Combination chart as parent.</figcaption>
            </figure>
            <div className="cs-checks" data-stagger>
              {['Color rule', 'Axis rule', 'Tooltip rule', 'Gridline weight', 'States', 'Density'].map((t) => <span data-rise key={t}>{t}</span>)}
            </div>
            <h3 data-rise>Why chart colors are not the same as UI colors</h3>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><h3>Different reading jobs</h3><p>A button uses color to draw attention. A chart uses color to encode information.</p></article>
              <article className="cs-card" data-rise><h3>Tones sit calmly</h3><p>Slightly muted, slightly cooler. Lightest tones support sequential gradients; mid tones support categorical distinction.</p></article>
              <article className="cs-card" data-rise><h3>Different evolution rates</h3><p>UI palette is calibrated for buttons and badges. Chart palette is calibrated for series count and gridlines.</p></article>
            </div>
            <h3 data-rise>Designing in the age of AI</h3>
            <div className="cs-flow cs-flow-5" data-stagger>
              <div className="cs-flow-step" data-rise><i>1</i><b>Audits</b><span>Requirements from internal + external audits.</span></div>
              <div className="cs-flow-step" data-rise><i>2</i><b>Figma deep design</b><span>One chart — the combo — designed in full. Look and feel locked.</span></div>
              <div className="cs-flow-step" data-rise><i>3</i><b>AI expansion</b><span>Prompted to apply foundational decisions to other charts.</span></div>
              <div className="cs-flow-step" data-rise><i>4</i><b>Review loop</b><span>Some charts went through two or three correction loops.</span></div>
              <div className="cs-flow-step" data-rise><i>5</i><b>Final review</b><span>Reviewed individually and as a complete set.</span></div>
            </div>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><h3>What AI did well</h3><p>Once the bar chart had its color, axis, gridline, label, and tooltip rules settled, applying them to a histogram wasn't a creative act — it was mechanical.</p></article>
              <article className="cs-card" data-rise><h3>What AI couldn't do</h3><p>The combination chart's design didn't come from a prompt. It came from audits, trade-offs, and calls about what chart language fits Innovaccer's products.</p></article>
              <article className="cs-card" data-rise><h3>What changed</h3><p>A month of solo work took weeks. Weeks of documentation took days. The catch: AI output couldn't go straight in — a person still had to review.</p></article>
            </div>
            <h3 data-rise>The prompt is the design system</h3>
            <div className="cs-split" style={{ margin: '24px 0' }}>
              <div className="cs-panel" data-rise>
                <h3>Prompt patterns that worked</h3>
                <div className="cs-chips">{['Constraint-first prompts', 'Same as X, but for Y', 'Reference-by-component', 'Small vertical slices', 'State-explicit prompts'].map((t) => <span key={t}>{t}</span>)}</div>
              </div>
              <div className="cs-panel" data-rise>
                <h3>What didn't work</h3>
                <p>"Make a nice chart library."</p>
                <p>Prompts without the existing rules attached.</p>
                <p>Long multi-chart prompts.</p>
              </div>
            </div>
            <p className="cs-quote" data-rise>AI didn't invent the design. It carried the foundational decisions forward.</p>
            <h3 data-rise>Git turned iteration into structure</h3>
            <div className="cs-flow" data-stagger>
              <div className="cs-flow-step" data-rise><b>Phase 1 · Foundation</b><span>feat: combo chart base + token registry</span></div>
              <div className="cs-flow-step" data-rise><b>Phase 2 · Per-chart</b><span>feat: bar, clustered, stacked variants</span></div>
              <div className="cs-flow-step" data-rise><b>Phase 3 · Hardening</b><span>fix: visual alignment across all charts</span></div>
              <div className="cs-flow-step" data-rise><b>Phase 4 · Release</b><span>release: @atulya_26/charting-library</span></div>
            </div>
          </div>
        </section>

        {/* 05 DELIVER */}
        <section className="cs-section" aria-labelledby="cl-deliver">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">05</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>05 · Deliver</p>
            <H id="cl-deliver">From prototype to @atulya_26/charting-library</H>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><h3>Stories for every chart</h3><p>In Storybook, deployed to GitHub Pages.</p></article>
              <article className="cs-card" data-rise><h3>First-class state variants</h3><p>Async, loading, empty, and error as chart variants.</p></article>
              <article className="cs-card" data-rise><h3>Quality gates</h3><p>Visual-alignment pass · performance baseline · accessibility checks.</p></article>
              <article className="cs-card" data-rise><h3>Guidelines site</h3><p>"Which chart, when, why" as a written reference, not just a Figma file.</p></article>
            </div>
            <h3 data-rise>Two audiences, two sets</h3>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card cs-list-panel" data-rise>
                <h3>For designers and developers using the library</h3>
                <ul><li>Which chart to pick.</li><li>How to use it properly.</li><li>What to avoid.</li><li>What to do when stuck between two options.</li></ul>
              </article>
              <article className="cs-card cs-list-panel" data-rise>
                <h3>For developers maintaining the library</h3>
                <ul><li>API conventions.</li><li>Prop naming rules.</li><li>State contract.</li><li>Rules for adding new chart types.</li><li>Testing conventions.</li></ul>
              </article>
            </div>
            <h3 data-rise>Install and ship a first chart</h3>
            <div className="cs-code" data-rise><pre>{`npm install @atulya_26/charting-library

import { BarChart } from '@atulya_26/charting-library';

<BarChart
  categories={['Jan', 'Feb', 'Mar']}
  series={[{ name: 'Admissions', data: [120, 180, 150] }]}
  showLegend
  showTooltip
/>`}</pre></div>
            <h3 data-rise>Every guideline page has the same shape</h3>
            <div className="cs-deflist" data-stagger>
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
              ].map(([b, s]) => <div className="cs-def" data-rise key={b}><b>{b}</b><span>{s}</span></div>)}
            </div>
            <h3 data-rise>The first test — does the package work?</h3>
            <div className="cs-flow cs-flow-5" data-stagger>
              <div className="cs-flow-step" data-rise><i>1</i><span>Designer</span></div>
              <div className="cs-flow-step" data-rise><i>2</i><span>npm install the package</span></div>
              <div className="cs-flow-step" data-rise><i>3</i><span>import BarChart</span></div>
              <div className="cs-flow-step" data-rise><i>4</i><span>AI prompt in Figma Make / Claude Code</span></div>
              <div className="cs-flow-step" data-rise><i>5</i><span>Chart renders with MDS tokens</span></div>
            </div>
          </div>
        </section>

        {/* 06 IMPACT */}
        <section className="cs-section cs-impact-band" aria-labelledby="cl-impact">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">06</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>06 · Impact & reflections</p>
            <H id="cl-impact">One library. One set of components. One set of decisions already made.</H>
            <h3 data-rise>What shipped with the initial version</h3>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><h3>A working set of chart types</h3><p>Bar, clustered, stacked, histogram, line, sparkline, donut, half donut, pointer scale, map bubble, combination, Sankey.</p></article>
              <article className="cs-card" data-rise><h3>Chartboard — internal dashboard</h3><p>An internal dashboard that lets a designer test any chart quickly.</p></article>
              <article className="cs-card" data-rise><h3>A guidelines set</h3><p>Each chart with when-to-use, anatomy, variants, color, states, interactions, do-and-don't.</p></article>
              <article className="cs-card" data-rise><h3>Published as an npm package</h3><p>Installable into any Innovaccer product on MDS. Typed, with semantic props.</p></article>
            </div>
            <div className="cs-outcome" data-rise>
              <h3>What changed for designers</h3>
              <p>Before this work, "Which chart should I use?" depended on which library the team had already adopted — a different answer for every team. Every chart decision started from zero.</p>
              <p>Now, designers using Figma Make or Claude Code with the library installed get charts that match the rest of the screen — because the library has names and props an AI tool can quote directly.</p>
            </div>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><h3>Framing compounds</h3><p>The hardest decisions came early. Spend more time on framing than on the visual.</p></article>
              <article className="cs-card" data-rise><h3>AI shifts the work</h3><p>The interesting work moved up a level — to framing decisions and system-level rules.</p></article>
              <article className="cs-card" data-rise><h3>Write guidelines in parallel</h3><p>Components are easier to design well when you're also writing down when to use them.</p></article>
            </div>
            <p className="cs-quote" data-rise>AI made first drafts cheap. Git is what made the drafts add up to a product.</p>
          </div>
        </section>
      </main>

      <CaseFooter>Storybook · Guidelines · GitHub · npm — @atulya_26/charting-library</CaseFooter>
    </div>
  );
}
