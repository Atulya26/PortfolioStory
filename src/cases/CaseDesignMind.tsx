import { useRef } from 'react';
import { H, CaseChrome, CaseFooter, useCaseStudyMotion, useCasePage } from './shared';

export default function CaseDesignMind() {
  const rootRef = useRef<HTMLDivElement>(null);
  useCasePage('Design Mind — AI-Native Design System');
  useCaseStudyMotion(rootRef);

  return (
    <div className="cs-root" ref={rootRef}>
      <CaseChrome tag="Design Mind · AI-Native DS" />

      <main>
        {/* HERO */}
        <section className="cs-section cs-hero" aria-labelledby="dm-hero">
          <span className="cs-ghost" data-parallax="1.6" aria-hidden="true">003</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>Case Study · 003 · Innovaccer · Design Platform</p>
            <H id="dm-hero" level={1}>Design Mind — AI-Native Design System</H>
            <p className="cs-lede cs-hero-lede" data-rise>A lightweight design system at Innovaccer, redesigned as a contract between a designer's intent and an AI model's output — so the model becomes a fluent collaborator, not a faulty one.</p>
            <div className="cs-meta-grid" aria-label="Project metadata" data-stagger>
              <div className="cs-meta-item" data-rise><span className="cs-label">Author</span><span className="cs-meta-value">Atulya · Product Designer</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Surface</span><span className="cs-meta-value">Components · Genome · Surfaces</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Stack</span><span className="cs-meta-value">React · Tailwind v4 · CSS vars · Markdown</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Status</span><span className="cs-meta-value">v1.0 · Internal pilot · 2026</span></div>
            </div>
          </div>
        </section>

        {/* 00 AT A GLANCE */}
        <section className="cs-section" aria-labelledby="dm-glance">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">00</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>00 · At a glance</p>
            <H id="dm-glance">The shape of the project, in one page</H>
            <p className="cs-lede" data-rise>Design Mind is an experiment: a design system rebuilt for a world where the most frequent reader is no longer a designer, but an AI model. It treats the system as a contract — one a model can read fluently and a designer can still trust.</p>
            <div className="cs-table" role="table" aria-label="Project summary" data-rise style={{ ['--cols' as string]: '1fr 2.4fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Field</span><span>Value</span></div>
              <div className="cs-trow" role="row"><span>What</span><span>An AI-native design system for clinical software at Innovaccer.</span></div>
              <div className="cs-trow" role="row"><span>Scope</span><span>Tokens · Genome · Components · Surfaces · Protocol.</span></div>
              <div className="cs-trow" role="row"><span>Format</span><span>Plain markdown, plain CSS, plain TSX. No registry. No build.</span></div>
              <div className="cs-trow" role="row"><span>Bet</span><span>If a model can read the system the way a designer thinks, AI-assisted prototyping becomes craft, not cleanup.</span></div>
            </div>
            <h3 data-rise>Contents</h3>
            <div className="cs-deflist" data-stagger>
              {[
                ['01', 'The question'],
                ['02', 'Why old systems fail an AI'],
                ['03', 'The existing system — MDS'],
                ['04', 'The brief'],
                ['05', 'The architecture'],
                ['06', 'Tokens — the material'],
                ['07', 'Genome — the DNA'],
                ['08', 'Manifest — the index of intent'],
                ['09', 'Components — small, self-aware'],
                ['10', 'Surfaces — composition'],
                ['11', 'Helpers — three small utilities'],
                ['12', 'The protocol — how it flows'],
                ['13', 'Restraint by design'],
                ['14', 'What changed'],
                ['15', 'What we learned'],
              ].map(([n, t]) => <div className="cs-def" data-rise key={n}><b>{n}</b><span>{t}</span></div>)}
            </div>
          </div>
        </section>

        {/* 01 THE QUESTION */}
        <section className="cs-section" aria-labelledby="dm-question">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">01</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>01 · The opening</p>
            <H id="dm-question">The question</H>
            <p data-rise>For most of the last decade, a design system was a thing built <em>for designers</em>. It assumed a human reader — long documentation pages, Figma libraries, Slack threads to clarify edge cases. The component sat at the centre and the rules orbited it as prose.</p>
            <p data-rise>Then the audience changed. Today, the most frequent user of a design system isn't a designer. <strong>It's a language model</strong> — asked to "build an interface," "wire up this dashboard," or "prototype this workflow."</p>
            <p data-rise>When we handed our existing system to a model, the output looked broadly right and quietly broke every rule we cared about. Wrong colors. Nested cards. Apologetic copy. The model wasn't failing us — <strong>our system, written for designers, simply wasn't saying enough.</strong></p>
            <div className="cs-outcome" data-rise>
              <h3>The bet</h3>
              <p>If a model can read the design system the way a designer thinks, then AI-assisted prototyping becomes craft — <em>and the designer's job moves from cleanup to direction.</em></p>
              <p>Design Mind is the experiment in making that real.</p>
            </div>
          </div>
        </section>

        {/* 02 DIAGNOSIS */}
        <section className="cs-section" aria-labelledby="dm-failure">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">02</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>02 · Diagnosis</p>
            <H id="dm-failure">Why old systems fail an AI</H>
            <p data-rise>Before designing anything, we audited why mature design systems break when handed to a model. Five patterns surfaced — not bugs in the model, but predictable consequences of a system that was never built to be read by one.</p>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">2.1 — Lore</span><h3>Rules live elsewhere</h3><p>The <em>why</em> sits in documentation pages and people's heads — not in files the model can read. So the model reproduces the shape of the system but not its reasoning.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">2.2 — Drift</span><h3>Naming drifts</h3><p><code>Button</code>, <code>CTA</code>, <code>ActionButton</code> for the same thing. Two tokens for one color. The model picks worst-fit by name and is confidently wrong.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">2.3 — Selection</span><h3>No signposts</h3><p>Nothing tells the model <em>which</em> component to pick. It picks by name resemblance — and resemblance lies.</p></article>
            </div>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">2.4 — Escape hatches</span><h3>Arbitrary values bypass the system</h3><p>Tailwind's <code>gap-[10px]</code> and arbitrary values give the model a quiet path around the tokens. Pixel values creep in. Hex codes appear. The system erodes from inside.</p></article>
              <article className="cs-card" data-rise><span className="cs-label">2.5 — Tone</span><h3>No voice</h3><p>Visual rules are documented; copy rules aren't. So the model defaults to friendly, marketing-y strings — exactly the wrong register for a clinical product.</p></article>
            </div>
          </div>
        </section>

        {/* 03 MDS */}
        <section className="cs-section" aria-labelledby="dm-mds">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">03</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>03 · The existing system</p>
            <H id="dm-mds">MDS — and why we didn't refactor it</H>
            <p data-rise>Innovaccer already has a design system: <strong>Masala Design System (MDS)</strong>. Open-sourced in 2020, currently v4.24.0, 111 React components, six years of production traffic.</p>
            <p data-rise>MDS is a serious system — for designers and engineers. The question was simple: can we retrofit it for AI-assisted prototyping, or do we need to start fresh?</p>
            <div className="cs-stat-grid" data-stagger>
              <div className="cs-stat" data-rise><strong><span data-count="787">787</span>MB</strong><span>Repo on disk. Working copies with <code>node_modules</code> exceed 2 GB.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="111">111</span></strong><span>Components in Atomic Design — atoms, molecules, organisms, patterns.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="8">8</span></strong><span>Build tools in the pipeline — Babel, Rollup, Gulp, PostCSS, Storybook, and more.</span></div>
              <div className="cs-stat" data-rise><strong><span data-count="133">133</span>KB</strong><span>CHANGELOG alone — larger than the entire Design Mind genome combined.</span></div>
            </div>
            <p data-rise>MDS is a production library. A language model can't reason over it in one pass — there's too much, spread too thin. And the model doesn't have what it needs most: <strong>rules of selection.</strong> Atomic Design tells a designer what something <em>is</em>; it tells a model nothing about which to <em>pick</em>. With 111 components, the name collisions stack up:</p>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><h3>Overlay surfaces · 5</h3><p><code>Modal</code> · <code>Dialog</code> · <code>FullscreenModal</code> · <code>Sidesheet</code> · <code>Popover</code> — no rule for which one to use.</p></article>
              <article className="cs-card" data-rise><h3>Text inputs · 5</h3><p><code>Input</code> · <code>TextField</code> · <code>EditableInput</code> · <code>InputMask</code> · <code>VerificationCodeInput</code></p></article>
              <article className="cs-card" data-rise><h3>Selection · 6</h3><p><code>Combobox</code> · <code>Dropdown</code> · <code>Select</code> · <code>EditableDropdown</code> · <code>ChipInput</code> · <code>EditableChipInput</code></p></article>
            </div>
            <p data-rise>A designer asks the team. A model picks by name — right about two-thirds of the time, wrong exactly when stakes are highest.</p>
            <p data-rise>We considered the retrofit seriously. It came out to a list of ten substantial items — authoring selection rules for 111 components, writing six rule documents, building composition contracts, trimming the build pipeline, renormalizing tokens. By the time we wrote the list, we weren't refactoring. <strong>We were rebuilding on top of six years of decisions.</strong></p>
            <div className="cs-outcome" data-rise>
              <h3>The split</h3>
              <p>MDS stays in production for <em>human-built</em> code. Design Mind ships separately for <em>AI-assisted</em> prototyping.</p>
              <p>Two systems, two readers, one organization. Coexistence — not replacement — is the operating model.</p>
            </div>
          </div>
        </section>

        {/* 04 THE BRIEF */}
        <section className="cs-section" aria-labelledby="dm-brief">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">04</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>04 · The brief</p>
            <H id="dm-brief">Five rules. The system follows.</H>
            <p data-rise>From the diagnosis we extracted five operating principles. Everything in Design Mind follows from these.</p>
            <div className="cs-flow cs-flow-5" data-stagger>
              <div className="cs-flow-step" data-rise><i>01</i><b>Machine-readable</b><span>Every rule machine-readable. No tribal knowledge. If a designer would need to ask, the system answers in a file.</span></div>
              <div className="cs-flow-step" data-rise><i>02</i><b>when / not_when</b><span>Every component declares <code>when</code> and <code>not_when</code>. Selection is the system's job — not the model's guesswork.</span></div>
              <div className="cs-flow-step" data-rise><i>03</i><b>One path</b><span>One path to every value. Primitives → semantics → utilities. No parallel naming, no synonyms.</span></div>
              <div className="cs-flow-step" data-rise><i>04</i><b>Voice in-system</b><span>Voice is part of the system. Tone, error messages, label grammar — codified with the same rigor as color tokens.</span></div>
              <div className="cs-flow-step" data-rise><i>05</i><b>Plain source</b><span>Plain markdown, CSS, TSX. The same source serves both readers. No runtime. No registry. No design-tool dependency.</span></div>
            </div>
          </div>
        </section>

        {/* 05 ARCHITECTURE */}
        <section className="cs-section" aria-labelledby="dm-shape">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">05</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>05 · The architecture</p>
            <H id="dm-shape">Three layers, one system</H>
            <p data-rise>The system is built as three layers, each with a single purpose. Together they describe everything the model needs to read — and nothing it doesn't.</p>
            <div className="cs-deflist" data-stagger>
              <div className="cs-def" data-rise><b>Layer 01 · Tokens</b><span><strong>The material.</strong> CSS variables for color, surface, type, and motion. Primitives feed semantic roles, which feed Tailwind utilities. One import, one source of truth.</span></div>
              <div className="cs-def" data-rise><b>Layer 02 · Genome</b><span><strong>The DNA.</strong> Six markdown files that codify design judgment — visual identity, principles, voice, density, iconography. This is the part most design systems don't write down.</span></div>
              <div className="cs-def" data-rise><b>Layer 03 · Components &amp; Surfaces</b><span><strong>The body.</strong> Components are the vocabulary. Surfaces are the grammar — composition rules that turn components into coherent interfaces. The manifest indexes them; the protocol orchestrates them.</span></div>
            </div>
            <h3 data-rise>The repository, on disk</h3>
            <div className="cs-code" data-rise><pre>{`design-mind/
├── SKILL.md            ← load protocol for an AI assistant
├── manifest.json       ← which component for which intent
├── primitives.css      ← raw color scales
├── semantics.css       ← role tokens
├── index.css           ← Tailwind bridge
├── components/         ← components — the vocabulary
├── genome/             ← 6 rule documents
├── blocks/             ← 2 surface templates
└── hooks/              ← 3 small helpers`}</pre></div>
            <p data-rise>A model reads every file with <code>cat</code>. A designer reads everything in an afternoon. <strong>The entire repo is smaller than MDS's <code>package-lock.json</code>.</strong></p>
          </div>
        </section>

        {/* 06 TOKENS */}
        <section className="cs-section" aria-labelledby="dm-tokens">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">06</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>06 · Tokens</p>
            <H id="dm-tokens">The material</H>
            <p data-rise>Three CSS files, three jobs. <code>primitives.css</code> holds the raw color and spacing values. <code>semantics.css</code> maps them to roles — <code>primary</code>, <code>destructive</code>, <code>warning</code>, <code>success</code>. <code>index.css</code> bridges those roles into Tailwind utilities and shadcn-compatible names. One import, and the consumer has tokens, utilities, and dark mode.</p>
            <p data-rise>The detail that matters most for the model: every status role ships with four variants — <code>fill</code>, <code>foreground</code>, <code>light</code>, <code>text</code>. Compose <code>bg-warning-light text-warning-text</code> and the result passes WCAG without anyone having to check. <strong>Contrast is a guarantee built into the naming convention.</strong></p>
            <div className="cs-palette" data-rise aria-label="The 14-step warm gray scale">
              <div className="cs-swatches" style={{ gridTemplateColumns: 'repeat(14, 1fr)' }}>
                {['#FBFAFB', '#F1EEEC', '#E3DEDA', '#D3CCC6', '#C2B8B0', '#B0A69F', '#968B84', '#7C7269', '#655C55', '#574E47', '#49413B', '#3C3430', '#2F2925', '#201C19'].map((c) => <span key={c} style={{ background: c }} />)}
              </div>
            </div>
            <div className="cs-callout" data-rise><p>Re-skinning the system means editing one file. A pediatric or payor-facing theme is a single CSS file away.</p></div>
          </div>
        </section>

        {/* 07 GENOME */}
        <section className="cs-section" aria-labelledby="dm-genome">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">07</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>07 · The genome</p>
            <H id="dm-genome">The DNA of the system</H>
            <p data-rise>If components are the body of the design system, the <strong>genome</strong> is its DNA. It's the layer that encodes the parts of design judgment that usually live in people's heads — <em>what does "polished" mean here, what voice does the product speak in, how dense should a list feel, what icon means "patient."</em></p>
            <p data-rise>Six markdown files. Each one teaches the model something a designer wouldn't normally write down.</p>
            <div className="cs-table" role="table" aria-label="Genome files" data-rise style={{ ['--cols' as string]: '1fr 2fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>File</span><span>What it codifies</span></div>
              <div className="cs-trow" role="row"><span>taste.md</span><span>Visual identity — the feel the system aims for</span></div>
              <div className="cs-trow" role="row"><span>principles.md</span><span>Eight operational principles for product decisions</span></div>
              <div className="cs-trow" role="row"><span>copy-voice.md</span><span>The clinical voice — tone, label grammar, error structure</span></div>
              <div className="cs-trow" role="row"><span>density.md</span><span>How tight or spacious a layout should be, by workflow</span></div>
              <div className="cs-trow" role="row"><span>tokens.md</span><span>Token reference, restated as Tailwind classes</span></div>
              <div className="cs-trow" role="row"><span>iconography.md</span><span>Concept-to-icon map — same icon for the same idea everywhere</span></div>
            </div>

            <h3 data-rise>7.1 · The most useful page — the dials</h3>
            <p data-rise>The page of the genome that gets used most is the one that turns subjective into tunable. We call them the <strong>design dials</strong> — three sliders that describe a screen's character.</p>
            <div className="cs-cards" data-stagger>
              <article className="cs-card" data-rise><span className="cs-label">Dial 01 · Baseline 6 / 10</span><h3>Variance</h3><p>How much the grid breathes. Low for data tables; high for onboarding moments. <code>1 · symmetry → 10 · art-directed</code></p></article>
              <article className="cs-card" data-rise><span className="cs-label">Dial 02 · Baseline 5 / 10</span><h3>Motion</h3><p>How much movement is allowed. Static for reading; guided when state changes. <code>1 · static → 10 · cinematic</code></p></article>
              <article className="cs-card" data-rise><span className="cs-label">Dial 03 · Baseline 6 / 10</span><h3>Density</h3><p>How much information fits in the viewport. High for monitoring; low for decisions. <code>1 · gallery → 10 · cockpit</code></p></article>
            </div>
            <p data-rise><em>"Build a dashboard"</em> becomes <em>"build a dashboard at variance 6, density 7."</em> The model now has a coordinate, not an adjective — and it produces something coherent on the first pass. The dials are how a designer briefs a model the way they'd brief a junior designer.</p>

            <h3 data-rise>7.2 · Voice — written down for the first time</h3>
            <p data-rise>The genome's other quiet contribution is <code>copy-voice.md</code>. Most design systems codify pixels but leave copy to vibes. In a clinical product that's a credibility problem — models default to apology (<em>"We're sorry, something went wrong"</em>) when the right register is direct and recoverable (<em>"The information couldn't be loaded. Try again."</em>).</p>
            <p data-rise>So we wrote down the voice the way we'd write down a color token. Banned phrases, replacement patterns, label grammar — all in one short markdown file the model loads before it writes a single string. The file opens with the line we kept coming back to:</p>
            <p className="cs-quote" data-rise>Good copy feels invisible; the user doesn't even notice the words.</p>

            <h3 data-rise>7.3 · Density is a workflow decision, not an aesthetic</h3>
            <p data-rise><code>density.md</code> codifies one rule the team had argued about for years: <strong>density follows workflow, not preference.</strong> Forms get space. Monitoring screens get cockpit-level information. Empty states are one line. Loading is a skeleton, never a page-wide spinner. The model applies it without judgment because the judgment is already in the file.</p>
          </div>
        </section>

        {/* 08 MANIFEST */}
        <section className="cs-section" aria-labelledby="dm-manifest">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">08</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>08 · The manifest</p>
            <H id="dm-manifest">The index of intent</H>
            <p data-rise>The genome teaches the model <em>how to think</em>. The <strong>manifest</strong> teaches it <em>where to look</em>. It's a single JSON file — an index of every component, with one job: answer the question the model can't otherwise answer, <em>which component, when?</em></p>
            <div className="cs-code" data-rise><pre>{`{
  "id":       "ChatReceipt",
  "when":     "a definitive outcome exists —
              success, failure, or partial",
  "not_when": "user is still choosing (use ChatBrief)",
  "file":     "components/ChatReceipt.tsx"
}`}</pre></div>
            <p data-rise>Two fields do the heavy lifting — <code>when</code> and <code>not_when</code>. With them, component selection becomes a near-deterministic lookup. The model reads the manifest, finds the entry whose intent matches the task, and opens the file. Without them, the model picks by name resemblance — and as the MDS comparison showed, resemblance lies.</p>
            <p data-rise><strong>This is the single highest-leverage file in Design Mind.</strong> Every other layer assumes the model has already routed to the right component. The manifest is what makes that routing work.</p>
          </div>
        </section>

        {/* 09 COMPONENTS */}
        <section className="cs-section" aria-labelledby="dm-components">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">09</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>09 · Components</p>
            <H id="dm-components">Small, self-aware, traceable</H>
            <p data-rise>Each component is a single TSX file with a fixed shape: a docblock that names its inspiration, a comment block that cites the genome rules it implements, the class composition, and a rules footer with <code>when</code> / <code>not_when</code>.</p>
            <p data-rise>Read any component file and the model knows three things — what it's <em>for</em>, what it must <em>never do</em>, and which genome rule it's serving. No external lookup. Every component carries its own provenance.</p>

            <h3 data-rise>The decision worth highlighting — chat cards</h3>
            <p data-rise>The clearest demonstration of the system's philosophy lives in three components for AI messages. They're not three styled cards — they're three <strong>stances an AI message can take</strong>, and the API enforces the stance.</p>
            <div className="cs-table" role="table" aria-label="Chat card components" data-rise style={{ ['--cols' as string]: '1fr 2.4fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Component</span><span>When</span></div>
              <div className="cs-trow" role="row"><span><code>ChatBrief</code></span><span>Framing a situation, presenting a prepared action, or offering choices.</span></div>
              <div className="cs-trow" role="row"><span><code>ChatReceipt</code></span><span>A definitive outcome — success, failure, or partial.</span></div>
              <div className="cs-trow" role="row"><span><code>ChatCollect</code></span><span>Asking for structured input — radio, checkbox, date.</span></div>
            </div>
            <p data-rise><code>ChatReceipt</code> <strong>refuses</strong> to render a primary-action button in any slot. A terminal card cannot ask for another action — the component literally won't let you build it wrong. This isn't a lint rule or a Storybook warning. It's the component's API.</p>
            <div className="cs-callout" data-rise><p>The wrong thing is harder to build than the right thing. The model can't accidentally bypass the rule, because the rule lives in the component's contract.</p></div>

            <h3 data-rise>A second category — help-article components</h3>
            <p data-rise>We added a small family of help-article components — <code>ArticleHeader</code>, <code>StepsBlock</code>, <code>CalloutBlock</code>, <code>CodeBlock</code>, <code>KeyCombo</code>, <code>LevelBadge</code>, <code>ScreenshotPreview</code>, and a few others — so product documentation could be built from the same system as the product itself. They live flat in <code>/components/</code> and are grouped by a <code>category</code> field in the manifest.</p>
            <p data-rise>They don't sit in a separate folder. They live flat in <code>/components/</code> alongside everything else and are grouped only by a <code>category</code> field in the manifest — the same routing mechanism the product surface uses. Each one carries a narrow job: <code>StepsBlock</code> for procedural sequences, <code>CalloutBlock</code> for warnings and notes, <code>KeyCombo</code> for shortcuts, <code>LevelBadge</code> for difficulty, <code>SeriesProgress</code> for multi-part guides.</p>
            <p data-rise>The point isn't the components themselves — most are routine. The point is the architecture held. We didn't need a second token set, a second voice file, or a second protocol. The genome that taught the model to write a clinical interface also teaches it how to write a clinical help article. <strong>A model writing documentation and a model building a screen are reading from one source.</strong></p>
          </div>
        </section>

        {/* 10 SURFACES — CLIMAX */}
        <section className="cs-section cs-impact-band" aria-labelledby="dm-surfaces">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">10</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>10 · Surfaces — composition</p>
            <H id="dm-surfaces">Where it all comes together</H>
            <p data-rise>Tokens are material. Genome is judgment. Components are vocabulary. <strong>Surfaces are grammar</strong> — the rules that turn components into a coherent interface. They're how Design Mind composes a dashboard, a workflow, a detail page — without the model having to guess the structure.</p>
            <p data-rise>Every clinical artifact in our product is one of two shapes. The <code>blocks/</code> folder describes them as written contracts.</p>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><h3>Envelope</h3><p><strong>One task, one entity, one job.</strong> A single card holds the whole artifact. Inner sections are flat — no nested elevation, no second card. Used for forms, detail views, single-task flows.</p></article>
              <article className="cs-card" data-rise><h3>LandingPage</h3><p><strong>A multi-panel home.</strong> Grey canvas with cards floating on top. Ambient content (greetings, page titles, inline stats) sits directly on grey; structured content (tables, lists, forms) earns a card. Used for dashboards and overviews.</p></article>
            </div>
            <p data-rise>These two contracts solve the most common failure in a model-built design — <strong>nested elevation</strong>. A card inside a card inside a card. The surface contract says where elevation is allowed to live; the result is that stacked cards become impossible. The model can't produce the wrong shape because the contract forbids it.</p>
            <p data-rise>This is the layer that makes Design Mind feel like a <em>system</em>, not a kit of parts. Anyone can ship components. The surface contracts are what let a model — or a designer — assemble a coherent screen from those parts without re-inventing the layout each time.</p>
            <div className="cs-outcome" data-rise>
              <h3>The composition layer</h3>
              <p>Components are <em>what</em> to use. Surfaces are <em>how to compose</em>. The same model that picks the right component now also picks the right shape.</p>
              <p>This is the layer most design systems leave to convention. We made it a contract.</p>
            </div>
          </div>
        </section>

        {/* 11 HELPERS */}
        <section className="cs-section" aria-labelledby="dm-helpers">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">11</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>11 · Helpers</p>
            <H id="dm-helpers">Three small utilities</H>
            <p data-rise>The <code>hooks/</code> folder is the smallest part of the system. It holds three React utilities — one for sorting a table, one for selecting rows, one for paginating. That's it. No toast manager. No disclosure controller. No state machine.</p>
            <p data-rise>The folder is small on purpose. Every helper we ship is a hidden opinion about how data flows through a product, and we didn't want to lock our consumers into one. Tables are the exception because rebuilding sortable, paginated grids in every consumer is the bigger cost. <strong>Everywhere else, state stays with the consumer.</strong></p>
          </div>
        </section>

        {/* 12 PROTOCOL */}
        <section className="cs-section" aria-labelledby="dm-protocol">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">12</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>12 · The protocol</p>
            <H id="dm-protocol">How the system flows</H>
            <p data-rise>The <code>SKILL.md</code> file at the root is the load protocol — the script an AI assistant follows before it generates a single line of UI. It's read once per session, in this order:</p>
            <div className="cs-flow" data-stagger>
              <div className="cs-flow-step" data-rise><i>01</i><b>Read the taste files</b><span><code>tokens.md</code> and <code>taste.md</code> — what the system looks like and feels like. Mandatory on every load.</span></div>
              <div className="cs-flow-step" data-rise><i>02</i><b>Scan the manifest</b><span>Find the right component by <code>when</code> / <code>not_when</code>. This is selection, not invention.</span></div>
              <div className="cs-flow-step" data-rise><i>03</i><b>Pick the surface</b><span>Envelope or LandingPage. The composition contract decides the shape.</span></div>
              <div className="cs-flow-step" data-rise><i>04</i><b>Read each component file</b><span>The model now knows the rules each component carries.</span></div>
              <div className="cs-flow-step" data-rise><i>05</i><b>Read additional genome files</b><span><code>copy-voice.md</code> for strings, <code>density.md</code> for lists, <code>iconography.md</code> for icons.</span></div>
              <div className="cs-flow-step" data-rise><i>06</i><b>Compose</b><span>Build the screen from vocabulary (components), grammar (surface), and judgment (genome).</span></div>
            </div>
            <div className="cs-callout" data-rise><p>Order matters. Read components before taste, and the model knows how to use them but not whether. Read taste without the manifest, and the model knows what we believe but not what we ship. The sequence is the discipline.</p></div>
          </div>
        </section>

        {/* 13 RESTRAINT */}
        <section className="cs-section" aria-labelledby="dm-restraint">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">13</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>13 · By design</p>
            <H id="dm-restraint">Restraint by design</H>
            <p data-rise>What Design Mind <em>doesn't</em> include is as deliberate as what it does. Every omission is one fewer thing for the model to disambiguate.</p>
            <div className="cs-deflist" data-stagger>
              <div className="cs-def" data-rise><b>No JSON tokens</b><span>CSS variables only. No transformation pipeline, no Style Dictionary.</span></div>
              <div className="cs-def" data-rise><b>No theming runtime</b><span>Dark mode is a <code>.dark</code> class on <code>&lt;html&gt;</code>. There's no <code>ThemeProvider</code>.</span></div>
              <div className="cs-def" data-rise><b>No animation library</b><span>All motion is CSS. No Framer Motion. No spring physics.</span></div>
              <div className="cs-def" data-rise><b>No Storybook</b><span>The component file <em>is</em> the documentation. The manifest <em>is</em> the index.</span></div>
              <div className="cs-def" data-rise><b>One icon family</b><span>No icon library beyond Lucide. One style. The map from concept to icon lives in <code>iconography.md</code>.</span></div>
              <div className="cs-def" data-rise><b>No experimental tier</b><span>No <code>preview-</code>, no <code>draft-</code>, no <code>legacy-</code>. The system is what it ships.</span></div>
            </div>
            <p data-rise>A smaller system produces more consistent output. The fewer choices a model has to disambiguate, the closer its first pass lands to its tenth.</p>
          </div>
        </section>

        {/* 14 IMPACT */}
        <section className="cs-section" aria-labelledby="dm-impact">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">14</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>14 · Impact</p>
            <H id="dm-impact">What changed</H>
            <p data-rise>We shipped Design Mind quietly to one product team. The numbers shifted — but the qualitative change mattered more.</p>
            <div className="cs-table" role="table" aria-label="Before and after" data-rise style={{ ['--cols' as string]: '1.2fr 1.4fr 1.4fr' }}>
              <div className="cs-trow cs-thead" role="row"><span>Dimension</span><span>Before</span><span>After</span></div>
              <div className="cs-trow" role="row"><span>Time to first prototype</span><span>Half a day to a day</span><span className="cs-cell-accent">10–20 minutes</span></div>
              <div className="cs-trow" role="row"><span>Cleanup work</span><span>Token swaps, layout rebuilds, copy rewrites</span><span>Content judgment only</span></div>
              <div className="cs-trow" role="row"><span>Visual coherence</span><span>Distinguishable per engineer</span><span className="cs-cell-accent">Indistinguishable</span></div>
              <div className="cs-trow" role="row"><span>Copy quality</span><span>Apologetic, marketing-shaped</span><span>Clinical, direct, right on first pass</span></div>
              <div className="cs-trow" role="row"><span>Designer–model conversation</span><span>"Fix this, fix that"</span><span>"Push variance to 7, dial density back to 5"</span></div>
            </div>
            <div className="cs-outcome" data-rise>
              <h3>The qualitative shift</h3>
              <p>The system stopped being something the model resisted — and became something the model <em>thinks with</em>.</p>
              <p>The designer's job moved from cleanup to direction. That was the whole bet.</p>
            </div>
          </div>
        </section>

        {/* 15 WHAT WE LEARNED */}
        <section className="cs-section cs-impact-band" aria-labelledby="dm-learned">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">15</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>15 · What we learned</p>
            <H id="dm-learned">Six things that only became obvious after building it</H>
            <div className="cs-cards cs-cards-2" data-stagger>
              <article className="cs-card" data-rise><h3>Two audiences</h3><p>Design systems now have two audiences. Build for both, in the same source. The moment you fork a designer version and an AI version, you have two systems and zero discipline.</p></article>
              <article className="cs-card" data-rise><h3>Rules need a home</h3><p>Components encode <em>shape</em>; rules encode <em>judgment</em>. The judgment has to live in machine-readable files next to the components — otherwise the model invents its own.</p></article>
              <article className="cs-card" data-rise><h3>Selection is half the job</h3><p>Without <code>when</code> and <code>not_when</code>, the model picks by name — and name resemblance is the most expensive lie in a mature design system.</p></article>
              <article className="cs-card" data-rise><h3>Composition is the other half</h3><p>Components alone produce kits. Surface contracts produce systems. The difference is whether a model can assemble a coherent screen without being told what shape it should take.</p></article>
              <article className="cs-card" data-rise><h3>Restraint is a feature</h3><p>Every abstraction we didn't ship is a decision the model doesn't have to disambiguate. Less surface area means more consistent output.</p></article>
              <article className="cs-card" data-rise><h3>Old systems are evidence</h3><p>MDS taught us what to build by showing us where its abstractions stopped serving the new reader. The constraints we now treat as obvious were obvious only after living with their absence.</p></article>
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="cs-section" aria-labelledby="dm-closing">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">16</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>Closing · In one paragraph</p>
            <H id="dm-closing">An AI-native design system is a new format, not a new aesthetic</H>
            <p data-rise>Design Mind isn't a new visual language. It's a new <strong>format</strong> — the same rigor, the same restraint, the same accessibility floor, encoded so a model reads the system as fluently as a designer reads it. MDS taught us the cost of optimizing for one reader. Design Mind is the experiment in optimizing for two.</p>
            <p className="cs-quote" data-rise>If the system is structured the way a model already thinks, the designer's job moves from cleanup to direction — and prototyping becomes craft.</p>
          </div>
        </section>
      </main>

      <CaseFooter>Case Study 003 · Atulya · Product Designer · Innovaccer · Design Mind v1.0 — written for two readers in the same source.</CaseFooter>
    </div>
  );
}
