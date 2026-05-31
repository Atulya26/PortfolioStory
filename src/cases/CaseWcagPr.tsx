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
  type ChartDef,
} from './shared';

// ---------------------------------------------------------------------------
// One chart from the source: a donut showing where the 44 PR/branch
// contributions landed. Re-themed to the shared light palette; data values
// kept identical to the source <script> (Focus 12, Targets 7, Clear actions 4,
// MetricInput 6, Color 6, Other 9).
// ---------------------------------------------------------------------------
const CHARTS: ChartDef[] = [
  {
    id: 'wcag-mix',
    option: {
      color: [P.blue, P.green, P.orange, P.yellow, P.red, P.slate],
      tooltip: {
        trigger: 'item',
        backgroundColor: P.tip,
        borderColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderRadius: 12,
        padding: [10, 12],
        textStyle: { color: P.white, fontSize: 13, fontFamily: FONT },
      },
      legend: {
        bottom: 8,
        left: 'center',
        textStyle: { color: P.body, fontSize: 12, fontFamily: FONT },
        itemWidth: 12,
        itemHeight: 12,
      },
      graphic: [
        { type: 'text', left: 'center', top: '38%', style: { text: '44', fill: P.ink, fontSize: 38, fontWeight: 700, textAlign: 'center', fontFamily: FONT } },
        { type: 'text', left: 'center', top: '50%', style: { text: 'PR / branches', fill: P.muted, fontSize: 13, textAlign: 'center', fontFamily: FONT } },
      ],
      series: [
        {
          type: 'pie',
          radius: ['54%', '76%'],
          center: ['50%', '43%'],
          padAngle: 2,
          itemStyle: { borderColor: P.surface, borderWidth: 4, borderRadius: 8 },
          label: { color: P.ink, fontFamily: FONT, formatter: '{b}\n{c}' },
          labelLine: { lineStyle: { color: P.slate } },
          data: [
            { name: 'Focus', value: 12 },
            { name: 'Targets', value: 7 },
            { name: 'Clear actions', value: 4 },
            { name: 'MetricInput', value: 6 },
            { name: 'Color', value: 6 },
            { name: 'Other', value: 9 },
          ],
        },
      ],
    },
  },
];

// Pillar data — preserved from the source accordion (problem, decision, PR
// evidence, key files, why). Reinterpreted into the cs- vocabulary below.
const PILLARS: Array<{
  id: string;
  label: string;
  heading: string;
  prCount: string;
  problem: string;
  decision: string;
  decisionList?: string[];
  cols: string;
  prHead: string[];
  prRows: string[][];
  filesHead: string[];
  fileRows: Array<[string, string]>;
  why: string;
}> = [
  {
    id: 'pillar-1',
    label: 'Pillar 1',
    heading: 'Focus visibility as a system rule',
    prCount: '12 PRs',
    problem:
      'Focus indicators were inconsistent across components. Some relied on low-contrast or fragile visual treatments, and some focused/error states created double rings or confusing halos.',
    decision:
      'Treat focus as a system primitive, not a component-by-component decoration. Focus needed to be visible, consistent, and independent from component state such as error or selected.',
    cols: '0.8fr 1.2fr 2fr',
    prHead: ['PR', 'Component area', 'What changed'],
    prRows: [
      ['#2802', 'AI Button, AI IconButton', 'Updated AI button focus styles'],
      ['#2804', 'LinkButton', 'Updated focus styles'],
      ['#2806', 'Link', 'Updated focus state'],
      ['#2811', 'Tabs', 'Updated focus and tab click handler'],
      ['#2814', 'HorizontalNav', 'Updated focus states'],
      ['#2824', 'Chip', 'Updated focus states and state colors'],
      ['#2825', 'MetricInput', 'Updated focus style'],
      ['#2826', 'AIChip', 'Updated focus ring to outline-based style'],
      ['#2828', 'Textarea', 'Updated focus states'],
      ['#2952', 'ChipInput', 'Outline + offset; removed error-focus halo'],
      ['#2955', 'ChatInput', 'Outline-based focus ring'],
      ['#2950', 'Button', 'Restored button focus outlines to primary focus token'],
    ],
    filesHead: ['Component', 'Files touched'],
    fileRows: [
      ['AI Button / AI IconButton', 'css/src/ai-components/button.module.css, css/src/ai-components/iconButton.module.css'],
      ['LinkButton', 'css/src/components/linkButton.module.css'],
      ['Link', 'css/src/components/link.module.css'],
      ['Tabs', 'core/components/molecules/tabs/Tabs.tsx, css/src/components/tabs.module.css'],
      ['HorizontalNav', 'css/src/components/horizontalNav.module.css'],
      ['Chip / ChipInput', 'css/src/components/chip.module.css, css/src/components/chipInput.module.css'],
      ['MetricInput', 'css/src/components/metricInput.module.css'],
      ['Textarea', 'css/src/components/textarea.module.css'],
      ['ChatInput', 'css/src/components/chatInput.module.css'],
      ['Button', 'css/src/components/button.module.css'],
    ],
    why:
      'This was a design-system scale fix. The contribution was not “make focus blue.” The real work was defining a repeatable focus rule that survived component variation: inputs, chips, tabs, AI controls, navigation, links, and text areas all needed the same accessibility affordance expressed through their own structure.',
  },
  {
    id: 'pillar-2',
    label: 'Pillar 2',
    heading: 'Action icon targets that are easy to hit',
    prCount: '7 PRs',
    problem:
      'Several components used small inline icons as actions: clear buttons, tab icons, select trigger icons, chip action icons, and MetricInput steppers. Visually these icons were correct, but the interactive target could be too small or inconsistent.',
    decision:
      'Separate the visible glyph from the interactive hit area. The icon can remain visually lightweight, but the click/tap target must satisfy accessibility expectations.',
    cols: '0.8fr 1.2fr 2fr',
    prHead: ['PR', 'Component area', 'What changed'],
    prRows: [
      ['#2831', 'Input', 'Updated touchpoint area for input icon'],
      ['#2830', 'Tabs', 'Updated touchpoint area for tab icon'],
      ['#2839', 'Select', 'Updated touchpoint of action icon button'],
      ['#2842', 'Chip', 'Updated action icon button in chip component'],
      ['#2829', 'Chip', 'Explored touchpoint area update for chip component'],
      ['#3085', 'MetricInput', 'Updated arrow button touchpoint for accessibility'],
      ['#2994', 'MetricInput', 'Updated target sizing, ARIA, and keyboard interaction direction'],
    ],
    filesHead: ['Component', 'Files touched'],
    fileRows: [
      ['Input action icon', 'core/components/atoms/input/Input.tsx, css/src/components/actionButton.module.css, css/src/components/input.module.css'],
      ['Tabs icon', 'core/components/molecules/tabs/Tabs.tsx, css/src/components/tabs.module.css'],
      ['Select trigger icon', 'core/components/organisms/select/SelectTrigger.tsx, css/src/components/select.module.css'],
      ['Chip action icon', 'core/components/atoms/_chip/index.tsx, css/src/components/chip.module.css'],
      ['MetricInput arrow buttons', 'core/components/atoms/metricInput/MetricInput.tsx, css/src/components/metricInput.module.css'],
    ],
    why:
      'The important design move was invisible: the UI did not become visually heavier, but the action surface became more forgiving. Product teams consuming the design system get better touch behavior without redesigning every product screen.',
  },
  {
    id: 'pillar-3',
    label: 'Pillar 3',
    heading: 'Clear actions became real controls',
    prCount: '4 PRs',
    problem:
      'Clear actions in compound inputs were visually present but not always consistent in structure, alignment, keyboard access, or accessible naming.',
    decision:
      'Clear actions should behave like real controls: predictable size, consistent hover/focus/active states, keyboard support, and meaningful accessible names.',
    cols: '0.8fr 1.4fr 1.8fr',
    prHead: ['PR', 'Component area', 'What changed'],
    prRows: [
      ['#2957', 'Combobox multiselect trigger', 'Matched multiselect clear icon with Input clear icon; added keyboard support and aria-label'],
      ['#2958', 'ChipInput', 'Replaced old icon wrapper pattern; added keyboard support and aria-label'],
      ['#2965', 'EditableChipInput / Input', 'Updated clear icon and removed error focus halo'],
      ['#3008', 'ChipInput / EditableChipInput', 'Aligned clear action button and updated tests'],
    ],
    filesHead: ['Area', 'Files touched'],
    fileRows: [
      ['Combobox clear action', 'core/components/organisms/combobox/trigger/MultiselectTrigger.tsx'],
      ['ChipInput clear action', 'core/components/molecules/chipInput/ChipInput.tsx, css/src/components/chipInput.module.css'],
      ['EditableChipInput tests', 'core/components/molecules/editableChipInput/__tests__/EditableChipInput.test.tsx'],
      ['Input clear icon styles', 'css/src/components/input.module.css'],
    ],
    why:
      'This contribution ties visual design to semantic behavior. The clear icon was not just aligned visually; it became a consistent interactive pattern across related components.',
  },
  {
    id: 'pillar-4',
    label: 'Pillar 4',
    heading: 'MetricInput as a focused accessibility repair',
    prCount: '6 PRs',
    problem:
      'MetricInput combines a numeric field with increment/decrement buttons. The value, min/max boundaries, disabled/read-only state, and stepper controls all need to tell the same story to keyboard and assistive-technology users.',
    decision: 'Design and code direction across native bounds, disabled steppers, boundary state, and target size:',
    decisionList: [
      'Numeric bounds should be exposed to the native input, not only enforced in JavaScript.',
      'Stepper buttons should stop being reachable when the field is disabled or read-only.',
      'Increment/decrement buttons should communicate boundary state at min/max.',
      'Arrow-button touch targets should be easier to hit while preserving the compact visual design.',
    ],
    cols: '0.7fr 2.3fr',
    prHead: ['PR', 'What changed'],
    prRows: [
      ['#2825', 'Updated MetricInput focus style'],
      ['#2994', 'Updated interaction metric buttons, ARIA, and keyboard interaction direction'],
      ['#3026', 'Documented WCAG AA remediation: disabled/read-only steppers, boundary-aware state, native min/max'],
      ['#3035', 'Refined remediation direction for native bounds and disabled boundary behavior'],
      ['#3044', 'Passed min/max to input; disabled steppers at boundaries; inherited disabled/readOnly state'],
      ['#3085', 'Updated MetricInput arrow-button touchpoint for accessibility'],
    ],
    filesHead: ['Area', 'Files touched'],
    fileRows: [
      ['MetricInput behavior', 'core/components/atoms/metricInput/MetricInput.tsx'],
      ['MetricInput tests', 'core/components/atoms/metricInput/__tests__/MetricInput.test.tsx'],
      ['MetricInput snapshots', 'core/components/atoms/metricInput/__tests__/__snapshots__/MetricInput.test.tsx.snap'],
      ['MetricInput styles', 'css/src/components/metricInput.module.css'],
    ],
    why:
      'MetricInput is a strong portfolio example because the accessibility problem is both visual and semantic. A designer could not solve it only in Figma, and the code could not be right without interaction intent. The final behavior needed design judgment, DOM semantics, keyboard behavior, and test coverage.',
  },
  {
    id: 'pillar-5',
    label: 'Pillar 5',
    heading: 'Color tokens and contrast repaired at scale',
    prCount: '6 PRs',
    problem:
      'Accessibility issues were not limited to individual components. Some came from the color system itself: semantic tokens, primitive ramps, focus color, selected states, disabled states, and component palettes.',
    decision:
      'Fix the system beneath the components. A token-level color repair changes every component that consumes that token.',
    cols: '0.7fr 1.3fr 2fr',
    prHead: ['PR', 'Component/system area', 'What changed'],
    prRows: [
      ['#2893', 'Tokens', 'Introduced primitive color scale and updated palette'],
      ['#2925', 'Colors and components', 'Enhanced accessibility styling across MultiSlider, Toast, Button, Badge, InlineMessage, variables'],
      ['#3075', 'Semantic colors and ramps', 'Updated semantic colors and ramps'],
      ['#2838', 'Calendar', 'Updated calendar colors'],
      ['#2835', 'Calendar', 'Explored WCAG 2.2 AA calendar color and stroke corrections'],
      ['#2910', 'Button', 'Removed blend mode from outlined variants'],
    ],
    filesHead: ['Area', 'Files touched'],
    fileRows: [
      ['Token source', 'css/src/tokens/index.css, css/src/variables/index.css'],
      ['Token docs/utilities', 'core/components/css-utilities/designTokens/Data.tsx'],
      ['Calendar', 'Calendar color work reflected through component styles and related variables'],
      ['Component styling', 'css/src/components/button.module.css, css/src/components/badge.module.css, css/src/components/toast.module.css, css/src/components/inlineMessage.module.css'],
    ],
    why:
      'If the system’s tokens are inaccessible, every component inherits the problem. The fix had to happen in the palette and semantic ramps, not only in isolated component CSS.',
  },
  {
    id: 'pillar-6',
    label: 'Pillar 6',
    heading: 'Native platform behavior where custom UI hurt',
    prCount: '1 PR',
    problem:
      'Custom UI treatments can make components look more branded, but they can also fight the platform. Scrollbars are a good example: custom skins can reduce discoverability, conflict with OS preferences, and create behavior differences across environments.',
    decision:
      'When native platform behavior is more accessible and predictable, the best design decision is to remove styling, not add more.',
    cols: '0.7fr 1.3fr 2fr',
    prHead: ['PR', 'Component/system area', 'What changed'],
    prRows: [
      ['#2990', 'Scrollbar / Grid', 'Removed global custom scrollbar skin; used browser/OS native scrollbar; changed grid body scrolling behavior'],
    ],
    filesHead: ['Area', 'Files touched'],
    fileRows: [
      ['Grid scrolling', 'css/src/components/grid.module.css'],
      ['Global utilities', 'css/src/core/utilities.css'],
    ],
    why: 'The design choice was restraint. Not every design-system surface should be custom.',
  },
  {
    id: 'pillar-7',
    label: 'Pillar 7',
    heading: 'Latest surgical accessibility fixes',
    prCount: '2 PRs',
    problem:
      'The remaining accessibility gaps were smaller but important: nested interactive semantics inside Chip, and a scrollable Grid header region that needed keyboard focus.',
    decision:
      'Treat these as component-contract fixes. A Chip without a wrapper action should not announce itself as a button or enter the tab order by default. A horizontally scrollable Grid header should be reachable by keyboard users.',
    cols: '0.7fr 1fr 2.3fr',
    prHead: ['PR', 'Component area', 'What changed'],
    prRows: [
      ['#3091', 'Chip', 'fix(chip): avoid nested interactive default — wrapper-action detection so the chip wrapper only receives role, tabIndex, keyboard handler, and click handler when it is actually interactive.'],
      ['#3092', 'Grid', 'fix(grid): make header scroll region focusable — added keyboard focusability to the horizontally scrollable Grid header region.'],
    ],
    filesHead: ['Area', 'Files touched'],
    fileRows: [
      ['Chip nested-interactive fix', 'core/components/atoms/_chip/index.tsx, core/components/atoms/chip/Chip.tsx, related tests'],
      ['Grid scrollable region fix', 'core/components/organisms/grid/GridHead.tsx, Grid tests and snapshots'],
    ],
    why:
      'These are the kinds of details that make design-system accessibility real. The visual UI barely changes, but the semantic contract improves: fewer false controls, fewer nested interactive issues, and better keyboard reach for scrollable data-grid regions.',
  },
];

// PR inventory rows (05) — preserved in full.
const INVENTORY: Array<[string, string, string]> = [
  ['#3075', 'style(tokens): update semantic colors and ramps', 'Token/color system'],
  ['#3091', 'fix(chip): avoid nested interactive default', 'Chip semantic accessibility'],
  ['#3092', 'fix(grid): make header scroll region focusable', 'Grid keyboard accessibility'],
  ['#3050', 'style(aicolor): update gradients and sara sparkle stroke', 'AI visual style'],
  ['#3008', 'fix(chip-input): align clear action button', 'Clear action consistency'],
  ['#3000', 'docs(contributors): add contributor entries', 'Repo contribution metadata'],
  ['#2994', 'fix(metric-input): update target sizing and focus behavior', 'MetricInput accessibility exploration'],
  ['#2990', 'fix(scrollbar): use native browser scrollbar', 'Native platform behavior'],
  ['#2965', 'style(editableChipInput): update clear icon and remove error focus halo', 'Clear icon and focus state'],
  ['#2958', 'fix(chipInput): update clear icon to match Input component pattern', 'Keyboard + aria clear action'],
  ['#2957', 'fix(combobox): update multiselect clear icon to match Input clear icon', 'Keyboard + aria clear action'],
  ['#2955', 'fix(chatInput): update focus state to outline-based ring', 'Focus visibility'],
  ['#2952', 'fix(chipInput): update focus ring to outline-based style', 'Focus visibility'],
  ['#2951', 'fix(chipInput): update focus ring to outline-based style', 'Focus-ring iteration'],
  ['#2950', 'feat(button): revert focus ring to primary-focus', 'Focus token correction'],
  ['#2925', 'fix(colorsfixes): enhance accessibility and styling', 'Color + component accessibility'],
  ['#2924', 'Feat colorsupdates', 'Color iteration'],
  ['#2912', 'feat(arialables)', 'ARIA label exploration'],
  ['#2911', 'Feat blendmode clean', 'Blend-mode iteration'],
  ['#2910', 'feat(buttonblendmode): remove blend mode from outlined variants', 'Button visual accessibility'],
  ['#2909', 'Feat blendmode', 'Blend-mode iteration'],
  ['#2893', 'feat(tokens): introduce primitive color scale and update palette', 'Primitive color scale'],
  ['#2889', 'feat(tokens): introduce primitive color scale and update palette', 'Token iteration'],
  ['#2888', 'Feat(colors update): updated colors, introduced 14 color palette with primitives', 'Token iteration'],
  ['#2838', 'feat(calendar): update calendar colors', 'Calendar contrast/color'],
  ['#2836', 'feat(calendar): update calendar colors', 'Calendar color iteration'],
  ['#2835', 'feat(calendarcolors): update colors and strokes for WCAG 2.2 AA compliance', 'WCAG calendar exploration'],
  ['#2833', 'feat(timePicker): replace Dropdown with Select component', 'Component behavior exploration'],
  ['#2828', 'feat(textarea): update focus states for text area', 'Focus visibility'],
  ['#2827', 'feat(textarea): update focus states for resizable textarea', 'Focus iteration'],
  ['#2826', 'feat(AIChip): update focus ring to outline-based style', 'Focus visibility'],
  ['#2825', 'feat(metricInput): update focus style for metricInput', 'Focus visibility'],
  ['#2824', 'feat(chipfocus): updated focus states for chips', 'Focus visibility and chip state'],
  ['#2814', 'feat(horizontalNav): update focus states for horizontal navigation', 'Focus visibility'],
  ['#2811', 'feat(tabs): updated focus and tab click handler', 'Focus + interaction'],
  ['#2810', 'fix(tabs): updated focus state and tab click handler', 'Tabs interaction iteration'],
  ['#2806', 'feat(link): updated focus state for Link', 'Focus visibility'],
  ['#2805', 'feat(link): update focus state for Link', 'Link focus iteration'],
  ['#2804', 'feat(linkButton): update focus styles for LinkButton', 'Focus visibility'],
  ['#2802', 'feat(ai button): updated focus styles for ai buttons', 'Focus visibility'],
  ['#2800', 'feat(ai button): updated focus styles for ai buttons', 'AI button focus iteration'],
  ['#2799', 'feat = updated focus states for ai buttons', 'AI button focus iteration'],
  ['#2796', 'feat: update focus styles for AI Buttons', 'AI button focus iteration'],
  ['#2795', 'feat: adjust icon button focus styles', 'Icon-button focus exploration'],
];

// Supporting evidence rows (06) — preserved in full.
const SUPPORTING: Array<[string, string, string]> = [
  ['#3085', 'feat(metricInput): update arrow buttons touchpoint for a11y', 'MetricInput arrow controls needed accessible target sizing.'],
  ['#3044', 'fix(MetricInput): resolve WCAG 2.2 AA a11y issues', 'Final MetricInput semantic remediation: min/max exposure and boundary-aware button state.'],
  ['#3035', 'fix(MetricInput): resolve WCAG 2.2 AA a11y issues', 'MetricInput remediation iteration.'],
  ['#3026', 'fix(MetricInput): resolve WCAG 2.2 AA a11y issues', 'Detailed issue breakdown for disabled/read-only steppers, boundary state, and native min/max attributes.'],
  ['#2839', 'feat(select): update touchpoint of action icon button', 'Select trigger action target update.'],
  ['#2842', 'feat(chip): update action icon button in chip component', 'Chip action icon target and structure update.'],
  ['#2831', 'feat(input): update touchpoint area for icon in input component', 'Input action icon target update.'],
  ['#2830', 'feat(tabs): update touchpoint area for icon in tabs component', 'Tab icon target update.'],
  ['#2829', 'feat(chip): update touchpoint area for chip component', 'Chip touchpoint exploration.'],
  ['#1890', 'fix(chipInput): update state for custom icon button', 'Older custom icon-button state reference.'],
];

export default function CaseWcagPr() {
  const rootRef = useRef<HTMLDivElement>(null);
  useCasePage('WCAG into component contracts');
  useCaseStudyMotion(rootRef);
  useECharts(rootRef, CHARTS);

  return (
    <div className="cs-root" ref={rootRef}>
      <CaseChrome tag="WCAG · PR Contributions" />

      <main>
        {/* HERO */}
        <section className="cs-section cs-hero" aria-labelledby="wp-hero">
          <span className="cs-ghost" data-parallax="1.6" aria-hidden="true">01</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>Case Study Extension · Personal Contribution Map</p>
            <H id="wp-hero" level={1}>WCAG into component contracts</H>
            <p className="cs-lede cs-hero-lede" data-rise>How I translated WCAG 2.2 accessibility requirements into design-system decisions, interaction specs, and production code across Innovaccer's Masala Design System.</p>
            <div className="cs-meta-grid" aria-label="Project metadata" data-stagger>
              <div className="cs-meta-item" data-rise><span className="cs-label">Role</span><span className="cs-meta-value">Product Designer — design, accessibility strategy, and code</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Product</span><span className="cs-meta-value">Innovaccer Masala Design System</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Project</span><span className="cs-meta-value">WCAG 2.2 AA + Section 508 remediation</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Period</span><span className="cs-meta-value">Feb 2026 – Apr 2026</span></div>
            </div>
            <div className="cs-stat-grid" data-stagger>
              <div className="cs-stat" data-rise><strong><span data-count="44">44</span></strong><span>PR / branch contributions — 42 public PRs plus 2 latest submitted PR branches.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="161">161</span></strong><span>public PR branch commits, from public PR metadata.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="435">435</span></strong><span>changed-file entries across public PR metadata.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="124">124</span></strong><span>unique files touched in local author history.</span></div>
            </div>
            <div className="cs-stat-grid" data-stagger>
              <div className="cs-stat" data-rise><strong><span data-count="86">86</span></strong><span>local author commits under atulya.v@innovaccer.com.</span></div>
              <div className="cs-stat" data-rise><strong>33,052</strong><span>lines added in local author history.</span></div>
              <div className="cs-stat" data-rise><strong>atulya-innovaccer</strong><span>public PR account in the Innovaccer Design System.</span></div>
              <div className="cs-stat" data-rise><strong>DS</strong><span>WCAG converted from a checklist into the component contract.</span></div>
            </div>
          </div>
        </section>

        {/* 02 WHY THIS MATTERED */}
        <section className="cs-section" aria-labelledby="wp-context">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">02</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>02 · Why this mattered</p>
            <H id="wp-context">A design-system accessibility issue does not stay local</H>
            <p className="cs-lede" data-rise>MDS is the foundation for 20+ Innovaccer products. One unclear focus ring, one unnamed icon button, or one tiny action target can repeat across product screens at scale.</p>
            <p data-rise>This case study adds the personal contribution proof behind the larger WCAG program: the PRs, component files, and design decisions I directly influenced.</p>
            <div className="cs-callout" data-rise><p>The portfolio one-liner: I helped move accessibility from a checklist into the component contract.</p></div>
            <div className="cs-stat-grid" data-stagger aria-label="Program scale metrics">
              <div className="cs-stat" data-rise><strong>27.6%</strong><span>Starting compliance — WCAG 2.2 AA baseline for MDS.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="100" data-suffix="%">100%</span></strong><span>Current compliance — target reached for the program.</span></div>
              <div className="cs-stat" data-rise><strong>520+</strong><span>Issues catalogued across the remediation effort.</span></div>
              <div className="cs-stat" data-rise><strong>99+</strong><span>Components rebuilt — design-system components brought to spec.</span></div>
            </div>
            <p className="cs-chart-summary" data-rise>These program-level figures frame the larger WCAG work; the sections that follow map personal PR and design contributions into that context.</p>
          </div>
        </section>

        {/* 03 CONTRIBUTION MODEL */}
        <section className="cs-section" aria-labelledby="wp-model">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">03</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>03 · My contribution model</p>
            <H id="wp-model">Design decisions, implemented where the system actually ships</H>
            <div className="cs-flow cs-flow-5" data-stagger>
              <div className="cs-flow-step" data-rise><i>01</i><b>Accessibility diagnosis</b><span>Identified invisible focus, small icon targets, color-only states, unclear disabled states, and interaction patterns that failed WCAG.</span></div>
              <div className="cs-flow-step" data-rise><i>02</i><b>Design remediation</b><span>Defined focus, hover, active, disabled, selected, error, and read-only behavior across reusable components.</span></div>
              <div className="cs-flow-step" data-rise><i>03</i><b>Code contribution</b><span>Contributed CSS modules, token changes, component behavior, tests, snapshots, and docs updates.</span></div>
              <div className="cs-flow-step" data-rise><i>04</i><b>Implementation direction</b><span>Drove decisions for MetricInput, action icons, clear buttons, focus rings, and accessible touch targets.</span></div>
              <div className="cs-flow-step" data-rise><i>05</i><b>Evidence building</b><span>Mapped PRs back to files and WCAG outcomes so the design impact is inspectable, not just claimed.</span></div>
            </div>
          </div>
        </section>

        {/* 04 CONTRIBUTION PILLARS */}
        <section className="cs-section" aria-labelledby="wp-pillars">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">04</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>04 · Contribution pillars</p>
            <H id="wp-pillars">Seven reusable accessibility patterns</H>
            <p className="cs-lede" data-rise>The story is not a pile of PRs. It is a set of component-contract rules that product teams inherit when they upgrade MDS.</p>
            <p data-rise>Each pattern carries the problem, design decision, full PR evidence table, key files, and why it mattered.</p>

            {PILLARS.map((pillar) => (
              <div key={pillar.id} data-rise>
                <div className="cs-chips" data-rise>
                  <span>{pillar.label}</span>
                  <span>{pillar.prCount}</span>
                </div>
                <h3 id={pillar.id} data-rise>{pillar.heading}</h3>
                <div className="cs-cards cs-cards-2" data-stagger>
                  <article className="cs-card" data-rise><span className="cs-label">Problem</span><p>{pillar.problem}</p></article>
                  <article className="cs-card cs-list-panel" data-rise>
                    <span className="cs-label">Design decision</span>
                    <p>{pillar.decision}</p>
                    {pillar.decisionList ? <ul>{pillar.decisionList.map((d) => <li key={d}>{d}</li>)}</ul> : null}
                  </article>
                </div>
                <h3 data-rise>PR evidence</h3>
                <div className="cs-table" role="table" aria-label={`${pillar.heading} — PR evidence`} data-rise style={{ ['--cols' as string]: pillar.cols }}>
                  <div className="cs-trow cs-thead" role="row">{pillar.prHead.map((h) => <span key={h}>{h}</span>)}</div>
                  {pillar.prRows.map((row) => (
                    <div className="cs-trow" role="row" key={row[0] + row[1]}>{row.map((cell, ci) => <span key={ci}>{cell}</span>)}</div>
                  ))}
                </div>
                <h3 data-rise>Key files</h3>
                <div className="cs-table" role="table" aria-label={`${pillar.heading} — key files`} data-rise style={{ ['--cols' as string]: '1fr 2fr' }}>
                  <div className="cs-trow cs-thead" role="row">{pillar.filesHead.map((h) => <span key={h}>{h}</span>)}</div>
                  {pillar.fileRows.map((row) => (
                    <div className="cs-trow" role="row" key={row[0]}><span>{row[0]}</span><span><code>{row[1]}</code></span></div>
                  ))}
                </div>
                <div className="cs-callout" data-rise><p>{pillar.why}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* FOCUSED EXAMPLE — MetricInput */}
        <section className="cs-section" aria-labelledby="wp-metric">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">★</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>Focused example</p>
            <H id="wp-metric">MetricInput shows why this was design-plus-code work</H>
            <p className="cs-lede" data-rise>MetricInput is a numeric field plus increment/decrement buttons. The value, min/max boundaries, disabled/read-only state, and stepper controls all needed to be coherent for keyboard and assistive-technology users.</p>
            <div className="cs-split" style={{ alignItems: 'start' }}>
              <div className="cs-panel" data-rise>
                <div className="cs-panel-header"><div className="cs-panel-title"><span className="cs-label">Interaction path · Input to boundary state</span></div></div>
                <div className="cs-flow" style={{ gridTemplateColumns: '1fr', margin: 0 }} data-stagger>
                  <div className="cs-flow-step" data-rise><i>01</i><span>Native input receives min and max instead of hiding bounds in JavaScript.</span></div>
                  <div className="cs-flow-step" data-rise><i>02</i><span>Stepper buttons inherit disabled and read-only state from the field.</span></div>
                  <div className="cs-flow-step" data-rise><i>03</i><span>Increment and decrement controls communicate unavailable boundary state.</span></div>
                  <div className="cs-flow-step" data-rise><i>04</i><span>Arrow button hit areas grow while the compact visual rhythm remains intact.</span></div>
                </div>
              </div>
              <div className="cs-panel" data-rise>
                <div className="cs-panel-header"><div className="cs-panel-title"><span className="cs-label">PR chain · Remediation moved from focus to semantics</span></div></div>
                <div className="cs-deflist" style={{ gridTemplateColumns: '1fr', margin: 0 }} data-stagger>
                  <div className="cs-def" data-rise><b>#2825</b><span>Focus style — visual affordance</span></div>
                  <div className="cs-def" data-rise><b>#2994</b><span>Target sizing + ARIA — interaction model</span></div>
                  <div className="cs-def" data-rise><b>#3026</b><span>WCAG remediation notes — decision trace</span></div>
                  <div className="cs-def" data-rise><b>#3035</b><span>Native bounds direction — semantic refinement</span></div>
                  <div className="cs-def" data-rise><b>#3044</b><span>Min/max + boundary state — programmatic state</span></div>
                  <div className="cs-def" data-rise><b>#3085</b><span>Arrow-button touchpoint — target size</span></div>
                </div>
                <p className="cs-chart-summary" data-rise>This example needed design judgement, DOM semantics, keyboard behavior, and test coverage.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 05 PR INVENTORY */}
        <section className="cs-section" aria-labelledby="wp-inventory">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">05</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>05 · PR inventory</p>
            <H id="wp-inventory">44 PR and branch contributions grouped by contribution type</H>
            <p className="cs-lede" data-rise>Public PR metadata under <code>atulya-innovaccer</code> shows 42 PRs and 161 commits across those PR branches. With two latest submitted PR branches, the contribution map covers 44 PR/branch contributions.</p>
            <div className="cs-table" role="table" aria-label="PR inventory" data-rise style={{ ['--cols' as string]: '0.5fr 1.7fr 0.9fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>PR</span><span>Title</span><span>Contribution type</span></div>
              {INVENTORY.map((row) => (
                <div className="cs-trow" role="row" key={row[0] + row[1]}><span>{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span></div>
              ))}
            </div>
            <p className="cs-chart-summary" data-rise>The table keeps the main public signal visible without making the entire page feel like raw GitHub metadata.</p>
          </div>
        </section>

        {/* 06 SUPPORTING EVIDENCE */}
        <section className="cs-section" aria-labelledby="wp-supporting">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">06</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>06 · Additional PR evidence</p>
            <H id="wp-supporting">Supporting proof for MetricInput and action-icon direction</H>
            <p className="cs-lede" data-rise>These PRs support the design decisions around MetricInput semantics, action-icon touch targets, and older custom icon-button state work. They belong in the case study because they show the decision path, not just the final PR.</p>
            <div className="cs-table" role="table" aria-label="Supporting PR evidence" data-rise style={{ ['--cols' as string]: '0.5fr 1.1fr 1.4fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>PR</span><span>Title</span><span>Why it belongs</span></div>
              {SUPPORTING.map((row) => (
                <div className="cs-trow" role="row" key={row[0] + row[1]}><span>{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span></div>
              ))}
            </div>
          </div>
        </section>

        {/* 07 PORTFOLIO FRAMING */}
        <section className="cs-section" aria-labelledby="wp-framing">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">07</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>07 · Portfolio framing</p>
            <H id="wp-framing">How this should be presented</H>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">01 · Blast radius</span><p>Start with the fact that MDS powers many products, so component-level accessibility work scales beyond one screen.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">02 · Designer leverage</span><p>The work was not limited to audit comments; it changed tokens, states, target areas, component APIs, and production behavior.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">03 · PR proof</span><p>Use actual PRs and affected files so the case study is inspectable and grounded in shipped design-system work.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">04 · Design plus code</span><p>The strongest angle is that accessible behavior was defined and then helped into the component layer.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">05 · Reusable patterns</span><p>Focus visibility, target size, clear action behavior, native controls, and color tokens became durable DS rules.</p></article>
            </div>
            <h3 data-rise>Assets to add per visual section</h3>
            <div className="cs-table" role="table" aria-label="Assets to add" data-rise style={{ ['--cols' as string]: '0.8fr 1.4fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Visual section</span><span>Asset to add</span></div>
              <div className="cs-trow" role="row"><span>Focus visibility</span><span>Before/after focus ring matrix across Button, Link, ChipInput, Tabs, and MetricInput.</span></div>
              <div className="cs-trow" role="row"><span>Target size</span><span>Overlay showing visible icon size versus invisible hit target for Input, Select, Tabs, Chip, and MetricInput.</span></div>
              <div className="cs-trow" role="row"><span>MetricInput</span><span>Keyboard path diagram: input to decrement to increment to boundary disabled state.</span></div>
              <div className="cs-trow" role="row"><span>Color tokens</span><span>Token-ramp before/after with contrast pass/fail markers.</span></div>
              <div className="cs-trow" role="row"><span>PR proof</span><span>Small GitHub PR collage with PR numbers, commit count, and component file snippets.</span></div>
            </div>
            <figure className="cs-figure" data-rise>
              <div className="cs-figure-ph"><span>Asset · Before/after focus-ring + target-size matrix and PR collage (not shipped).</span></div>
              <figcaption>Selected portfolio asset · Focus and target evidence matrix.</figcaption>
            </figure>
          </div>
        </section>

        {/* 08 COMPONENT-TO-WCAG MAPPING */}
        <section className="cs-section" aria-labelledby="wp-mapping">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">08</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>08 · Component-to-WCAG mapping</p>
            <H id="wp-mapping">Each contribution mapped to a reusable accessibility outcome</H>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">Focus ring updates</span><p>Focus became visible and consistent across common controls.</p><span className="cs-code-chip">2.4.7 + 1.4.11</span></article>
              <article className="cs-card" data-rise><span className="cs-label">Touchpoint updates</span><p>Small visual icons gained larger interactive areas.</p><span className="cs-code-chip">2.5.8 Target Size</span></article>
              <article className="cs-card" data-rise><span className="cs-label">Clear-action keyboard support</span><p>Clear controls became reachable and understandable.</p><span className="cs-code-chip">2.1.1 + 4.1.2</span></article>
              <article className="cs-card" data-rise><span className="cs-label">MetricInput bounds</span><p>Numeric limits and unavailable controls became programmatically exposed.</p><span className="cs-code-chip">4.1.2 + 3.3.2</span></article>
              <article className="cs-card" data-rise><span className="cs-label">Color/token updates</span><p>Palette and semantic tokens supported accessible component states.</p><span className="cs-code-chip">1.4.3 + 1.4.11</span></article>
              <article className="cs-card" data-rise><span className="cs-label">Native scrollbar</span><p>Scrolling behavior respected browser and OS affordances.</p><span className="cs-code-chip">platform compatibility</span></article>
              <article className="cs-card" data-rise><span className="cs-label">Chip nested-interactive fix</span><p>Non-action chips stopped announcing as controls by default.</p><span className="cs-code-chip">4.1.2 + 2.1.1</span></article>
              <article className="cs-card" data-rise><span className="cs-label">Grid scroll region focus</span><p>Keyboard users can focus the horizontally scrollable Grid header.</p><span className="cs-code-chip">2.1.1 + 2.4.3</span></article>
            </div>
          </div>
        </section>

        {/* 09 WHAT THIS PROVES */}
        <section className="cs-section cs-impact-band" aria-labelledby="wp-proof">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">09</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>09 · What this proves</p>
            <H id="wp-proof">Designer operating at design-system depth</H>
            <div className="cs-stat-grid" data-stagger>
              <div className="cs-stat" data-rise><strong>20+</strong><span>Components or system areas referenced in the case study.</span></div>
              <div className="cs-stat" data-rise><strong>231k</strong><span>Total line changes — insertions + deletions in local author history.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="2">2</span></strong><span>Latest branches — Chip semantic cleanup and Grid keyboard reach.</span></div>
              <div className="cs-stat" data-rise><strong>DS</strong><span>WCAG converted into scalable system behavior.</span></div>
            </div>
            <div className="cs-panel" data-rise>
              <div className="cs-panel-header"><div className="cs-panel-title"><span className="cs-label">Contribution mix · Where the work landed</span></div></div>
              <div className="cs-chart" data-chart="wcag-mix" role="img" aria-label="Donut chart showing contribution mix across focus (12), targets (7), clear actions (4), MetricInput (6), color (6), and other (9) — totalling 44 PR and branch contributions." />
              <p className="cs-chart-summary" data-rise>The strongest story is designer plus accessibility strategist plus contributor: audit findings became component behavior, tests, tokens, and docs.</p>
            </div>
          </div>
        </section>

        {/* 10 PORTFOLIO CARD VERSION */}
        <section className="cs-section" aria-labelledby="wp-short">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">10</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>10 · Portfolio card version</p>
            <H id="wp-short">WCAG 2.2 remediation for Innovaccer's Masala Design System</H>
            <p className="cs-lede" data-rise>I contributed design and code to a system-wide accessibility remediation effort for MDS, the design system powering 20+ Innovaccer products. My work focused on focus visibility, color contrast, target sizing, keyboard access, and action-icon behavior across core components including Button, Link, Tabs, ChipInput, MetricInput, Input, Select, Textarea, ChatInput, Calendar, and design tokens.</p>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">What I did</span><p>Identified accessibility gaps as reusable design problems, not isolated QA bugs.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">How I worked</span><p>Converted audit findings into component-level interaction decisions and production PRs.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">What shipped</span><p>Outline focus rings, accessible clear buttons, larger hit targets, MetricInput semantics, native scrollbars, Grid keyboard reach, Chip semantic cleanup, and semantic color ramps.</p></article>
            </div>
          </div>
        </section>

        {/* 11 REFERENCES */}
        <section className="cs-section" aria-labelledby="wp-references">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">11</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>11 · References</p>
            <H id="wp-references">Contribution evidence and key PR groups</H>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">Account</span><p><a href="https://github.com/innovaccer/design-system/pulls?q=is%3Apr+author%3Aatulya-innovaccer" target="_blank" rel="noreferrer">atulya-innovaccer PRs in Innovaccer Design System</a></p></article>
              <article className="cs-card" data-rise><span className="cs-label">Public PR metadata</span><p>42 PRs, 161 commits across those PR branches, and 435 changed-file entries reviewed.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">Latest branches</span><p><code>fix(nested-interactive)</code> and <code>fix(scrollable-region-focusable)</code>, adding 1,128 insertions and 27 deletions across 8 files.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">Local author stats</span><p><code>atulya.v@innovaccer.com</code>: 86 commits, 33,052 insertions, 198,313 deletions, 231,365 total line changes, and 124 unique files touched.</p></article>
            </div>
            <h3 data-rise>Key PR groups</h3>
            <div className="cs-deflist" data-stagger>
              <div className="cs-def" data-rise><b>Focus visible</b><span>#2802, #2804, #2806, #2811, #2814, #2824, #2825, #2826, #2828, #2952, #2955.</span></div>
              <div className="cs-def" data-rise><b>Clear-action</b><span>#2957, #2958, #2965, #3008.</span></div>
              <div className="cs-def" data-rise><b>Color/token</b><span>#2893, #2925, #3075, #2838, #2910.</span></div>
              <div className="cs-def" data-rise><b>Native behavior</b><span>#2990 removed the custom scrollbar skin and restored browser/OS-native scrolling behavior.</span></div>
            </div>
          </div>
        </section>
      </main>

      <CaseFooter>Innovaccer · Masala Design System · WCAG 2.2 AA · PR contribution map</CaseFooter>
    </div>
  );
}
