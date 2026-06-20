import { useRef, useState, type ReactNode } from 'react';
import {
  H,
  Eyebrow,
  Marquee,
  ExperienceChrome,
  ExperienceFooter,
  useExperience,
  type Chapter,
} from './experience';

import productOverview from '../assets/data-model/01-product-overview.png';
import abortModal from '../assets/data-model/07-abort-modal.png';
import fieldDetail from '../assets/data-model/12-field-detail.png';
import domainTableView from '../assets/data-model/13-domain-table-view.png';
import attributeExplorer from '../assets/data-model/14-attribute-explorer.png';
import entityDiagramOverview from '../assets/data-model/15-entity-diagram-overview.png';
import erdCardInteractions from '../assets/data-model/16-erd-card-interactions.png';
import extendModelMenu from '../assets/data-model/17-extend-model-menu.png';
import addTableUpload from '../assets/data-model/18-add-table-upload.png';
import addTableFileSelected from '../assets/data-model/19-add-table-file-selected.png';
import addTableParseError from '../assets/data-model/20-add-table-parse-error.png';
import addTableManualPanel from '../assets/data-model/21-add-table-manual-side-panel.png';
import parsedTableReview from '../assets/data-model/22-new-parsed-table-review.png';
import procedureWarning from '../assets/data-model/23-procedure-warning.png';
import addAttributeEmptyModal from '../assets/data-model/24-add-attribute-empty-modal.png';
import addAttributeTypeDropdown from '../assets/data-model/25-add-attribute-type-dropdown.png';
import addAttributeInvalidDisabled from '../assets/data-model/26-add-attribute-invalid-disabled.png';
import addAttributeReady from '../assets/data-model/27-add-attribute-ready.png';
import addAttributeValidation from '../assets/data-model/28-add-attribute-validation.png';
import inReviewTableExtension from '../assets/data-model/29-in-review-table-extension.png';
import rejectedTableExtension from '../assets/data-model/30-rejected-table-extension.png';
import acceptedDeployingTableExtension from '../assets/data-model/31-accepted-deploying-table-extension.png';
import rejectedAttributeDetail from '../assets/data-model/32-rejected-attribute-detail.png';
import dataPolicies from '../assets/data-model/33-data-policies.png';
import proceduresFunctions from '../assets/data-model/34-procedures-functions.png';
import activityLogs from '../assets/data-model/35-activity-logs.png';
import activityVersioning from '../assets/data-model/36-activity-versioning.png';
import enableState from '../assets/data-model/37-enable-state.png';
import enabledSuccessVersioning from '../assets/data-model/38-enabled-success-versioning.png';
import enableActivityVersioning from '../assets/data-model/39-enable-activity-versioning.png';

const MASTER_FIGMA = 'https://www.figma.com/design/WXSEM3SB3nXwGD8cVaYCxd/Data-Model?m=auto&node-id=1288-147905&t=j4HlwZ0LxC0h40TF-1';

const CHAPTERS: Chapter[] = [
  { id: 'context', num: '01', label: 'Context' },
  { id: 'challenge', num: '02', label: 'Challenge' },
  { id: 'plain-language', num: '03', label: 'Plain English' },
  { id: 'model', num: '04', label: 'System' },
  { id: 'explore', num: '05', label: 'Understand' },
  { id: 'enable', num: '06', label: 'Turn On' },
  { id: 'extend', num: '07', label: 'Change' },
  { id: 'review', num: '08', label: 'Approve' },
  { id: 'govern', num: '09', label: 'Accountability' },
  { id: 'impact', num: '10', label: 'Outcome' },
];

const OBJECTS = [
  ['Data model', 'A shared map of the important data in one part of the product.'],
  ['Domain', 'A packaged area of the business, such as population health, claims, lab data, HR, or supply chain.'],
  ['Table', 'A group of related records, like Allergies, Appointments, Claims, or Encounters.'],
  ['Field', 'One piece of information inside a table. Engineers may call this an attribute.'],
  ['Relationship', 'The way two tables connect, like a map line between related records.'],
  ['Policy', 'A rule that controls who can see or use sensitive information.'],
  ['Procedure', 'Backend logic that prepares data before it can safely move downstream.'],
  ['Request', 'A proposed change that still needs checking, review, or deployment.'],
  ['Version', 'A deployed model state that users can trust as the current truth.'],
];

const ROLES = [
  ['Viewer', 'Can I trust this model before I use it?'],
  ['Contributor', 'Can I request a new table or field without breaking something downstream?'],
  ['Admin / Reviewer', 'Can I approve this change without hunting through tickets, SQL, and comments?'],
];

const PRINCIPLES = [
  ['Proposed is not live', 'A pending change should never look the same as the model people are already using.'],
  ['Progress is part of the product', 'Turning on a model, deploying a change, or failing validation all need visible states and recovery paths.'],
  ['Technical input needs translation', 'Uploaded table definitions become readable tables, fields, privacy flags, warnings, and review notes.'],
  ['Review belongs in context', 'A reviewer should see intent, fields, sensitive-data flags, comments, and deployment state together.'],
];

const UNTANGLED_ITEMS = [
  ['Available vs. enabled', 'People could inspect a packaged model before it became part of their workspace.'],
  ['Request vs. version', 'Pending work needed a separate place from deployed history.'],
  ['Field name vs. field meaning', 'A name like member_ref was not enough; users needed description, type, privacy, and policy context.'],
  ['Upload vs. reviewable request', 'A file was only an input. It had to become understandable work before review.'],
  ['Approval vs. deployment', 'A reviewer saying yes did not mean the model was live yet.'],
  ['Failure vs. dead end', 'Parsing errors, rejected requests, and failed deployments needed clear next actions.'],
];

const TRUST_MODEL = [
  ['Visibility', 'Show what exists: domains, tables, fields, and relationship maps.'],
  ['Meaning', 'Explain what it means: descriptions, sensitive-data flags, categories, and policies.'],
  ['Control', 'Make changes deliberate: validated requests, review states, and explicit submission.'],
  ['Accountability', 'Keep history visible: versions, logs, comments, failures, and reviewer decisions.'],
];

const BEFORE_FLOW = ['SQL files', 'Docs', 'Tickets', 'Backend checks', 'Review comments', 'Release notes'];
const AFTER_FLOW = ['Explore model', 'Submit checked request', 'Review in context', 'Deploy', 'Version', 'Audit log'];

type CaseSlide = {
  src: string;
  label: string;
  title: string;
  body: string;
  focus?: string;
  contain?: boolean;
  tall?: boolean;
  portrait?: boolean;
};

const EXPLORE_SCREENS: CaseSlide[] = [
  {
    src: domainTableView,
    label: 'Tables explorer',
    title: 'Start with a readable inventory',
    body: 'The first screen answers the simplest question: what tables exist here, what are they for, and how many fields do they contain?',
    focus: 'This view avoids starting with a technical diagram. It begins with a familiar table list, then adds keys and counts for people who need deeper detail.',
  },
  {
    src: attributeExplorer,
    label: 'Field explorer',
    title: 'Move from table names to field meaning',
    body: 'Fields are searchable across tables, so users can understand what each piece of data means without opening every table one by one.',
    focus: 'This is where the product becomes useful to non-engineers: field names get descriptions, types, and meaning.',
  },
  {
    src: entityDiagramOverview,
    label: 'Relationship map',
    title: 'Show how the data is connected',
    body: 'The relationship map helps people see how tables depend on each other without reading database code first.',
    focus: 'Cards and connector lines make the model spatial: users can see the shape of the system before inspecting details.',
  },
  {
    src: erdCardInteractions,
    label: 'Card interactions',
    title: 'Make the canvas teach itself',
    body: 'Tooltips explain add and expand actions directly on the table cards, so the user learns the interaction where it happens.',
    focus: 'The important detail is not the full screenshot. It is the tiny teaching moment attached to the exact control.',
  },
  {
    src: fieldDetail,
    label: 'Field detail',
    title: 'Explain one field deeply',
    body: 'The detail panel connects one selected field to its table, format, quality rules, meaning, and sensitive-data settings.',
    focus: 'A single selected field becomes a decision object: users can see what it means, how it is protected, and where rules apply.',
  },
];

const ENABLEMENT_STATES: CaseSlide[] = [
  {
    src: productOverview,
    label: 'Before turning on',
    title: 'A model can be previewed before it is active',
    body: 'The Population Health model is available to inspect, but it is not part of the workspace yet.',
    focus: 'The product separates preview from ownership: users can learn before they commit.',
  },
  {
    src: enableState,
    label: 'Turning on',
    title: 'A backend process becomes visible',
    body: 'The header shows progress, estimated time, and an abort action while the user can still understand what is happening.',
    focus: 'The status line turns invisible system work into a visible product state.',
  },
  {
    src: abortModal,
    label: 'Abort confirmation',
    title: 'Risky interruption gets a real decision',
    body: 'The modal explains the consequence in plain language: stopping now means the progress is lost.',
    focus: 'This is consequence copy, not generic confirmation. The user knows what they are choosing.',
    contain: true,
  },
  {
    src: enabledSuccessVersioning,
    label: 'Success',
    title: 'The model moves into the working set',
    body: 'The success toast confirms that the model is active and points users toward the activity history.',
    focus: 'The toast does more than celebrate. It gives the next verification step.',
  },
  {
    src: enableActivityVersioning,
    label: 'Version proof',
    title: 'Activity confirms deployed truth',
    body: 'After the model is active, the version history proves what was deployed and when.',
    focus: 'Versions are intentionally separate from pending requests. They represent deployed truth.',
  },
];

const TABLE_EXTENSION_STEPS: CaseSlide[] = [
  {
    src: extendModelMenu,
    label: 'Entry point',
    title: 'One affordance, two extension paths',
    body: 'Extend model separates new table and new field flows while keeping both inside the same workspace.',
    focus: 'The dropdown is small, but it is the product fork: add a whole table or add fields to an existing one.',
  },
  {
    src: addTableUpload,
    label: 'Upload or manual',
    title: 'Meet both technical habits',
    body: 'Some contributors start from an uploaded table definition or CSV. Others enter the table manually. The side panel supports both.',
    focus: 'The right side sheet is the action surface. The table list stays visible as context.',
  },
  {
    src: addTableFileSelected,
    label: 'File selected',
    title: 'A file is not a request yet',
    body: 'The selected file is shown as an input state. It is not treated as submitted work until the system checks it and the user submits.',
    focus: 'The file row is intentionally an input state; Submit is still the explicit request boundary.',
  },
  {
    src: addTableParseError,
    label: 'Check failure',
    title: 'Errors stay attached to the input',
    body: 'Validation feedback appears inside the side panel and as a visible toast, giving the contributor a clear retry path.',
    focus: 'The error appears twice: local to the file and globally as a toast, so recovery is hard to miss.',
  },
  {
    src: addTableManualPanel,
    label: 'Manual path',
    title: 'Manual entry follows the same rules',
    body: 'Manual entry keeps the same submission mechanics, so uploaded and hand-entered definitions converge into one governed request flow.',
    focus: 'The side sheet preserves one mental model even when the input method changes.',
  },
];

const DEEP_DIVE_STEPS: CaseSlide[] = [
  {
    src: parsedTableReview,
    label: 'Parsed table review',
    title: 'The request becomes inspectable before submission',
    body: 'The review state shows table information, fields, category chips, sensitive-data markings, key flags, generated backend logic, and the generated table definition. This is the handoff from raw input to governed product work.',
    focus: 'This is the main transformation: an uploaded definition becomes a reviewable table, metadata, warnings, and generated code package.',
    tall: true,
  },
  {
    src: procedureWarning,
    label: 'Procedure optionality',
    title: 'Optional does not mean consequence-free',
    body: 'When the backend procedure is turned off, the product explains what may break: the system may not create reliable unique records, so data can fail before it reaches downstream products.',
    focus: 'The blue and orange warnings explain consequence before the request is submitted.',
    tall: true,
  },
];

const ATTRIBUTE_EXTENSION_STEPS: CaseSlide[] = [
  {
    src: addAttributeEmptyModal,
    label: 'Empty state',
    title: 'Choose the table before adding fields',
    body: 'The flow makes the table decision explicit because one request can add fields to one table only.',
    focus: 'The table selection comes first because the request scope must be clear before field details appear.',
    tall: true,
  },
  {
    src: addAttributeTypeDropdown,
    label: 'Type selection',
    title: 'Data type is a design control',
    body: 'The dropdown nudges users toward known types, reducing ambiguity when the system later checks and deploys the change.',
    focus: 'The dropdown replaces free text with supported data types, which makes review and deployment safer.',
    tall: true,
  },
  {
    src: addAttributeInvalidDisabled,
    label: 'Invalid / disabled',
    title: 'Submission waits for valid metadata',
    body: 'Disabled actions and validation states keep incomplete or malformed fields from entering review.',
    focus: 'The disabled primary action is the story: invalid metadata cannot move forward.',
    tall: true,
  },
  {
    src: addAttributeReady,
    label: 'Ready to add',
    title: 'A valid field can enter the draft set',
    body: 'The modal confirms the field shape before it becomes part of the larger extension request.',
    focus: 'A valid field can now be added, but it is still draft work until the extension request is submitted.',
    tall: true,
  },
  {
    src: addAttributeValidation,
    label: 'Side panel validation',
    title: 'The larger panel supports richer metadata',
    body: 'Name rules, description, type, format, nullable state, health-information flags, and sensitive-code flags are gathered before review.',
    focus: 'This panel makes privacy and validity part of field creation, not something reviewers discover late.',
    portrait: true,
  },
];

const REVIEW_STATES: CaseSlide[] = [
  {
    src: inReviewTableExtension,
    label: 'In review',
    title: 'Pending work appears in the model context',
    body: 'The proposed Employment details table is visible on the relationship map with an in-review status and a request detail panel.',
    focus: 'The proposed table appears in the relationship map with a status, so pending work is visible but not mistaken for deployed truth.',
  },
  {
    src: acceptedDeployingTableExtension,
    label: 'Accepted / deploying',
    title: 'Approval is not the same as live',
    body: 'The table shows reviewer acceptance and deployment progress separately, making backend state visible.',
    focus: 'The right panel separates reviewed from deploying. Approval is a step, not the finish line.',
  },
  {
    src: rejectedTableExtension,
    label: 'Rejected table',
    title: 'Reviewer comments stay actionable',
    body: 'The rejection explains why the request failed and gives the requestor a discard action in the same context.',
    focus: 'The reviewer comment is the usable part of rejection: it tells the requestor exactly what to fix or discard.',
  },
  {
    src: rejectedAttributeDetail,
    label: 'Rejected field',
    title: 'Field-level governance gets the same clarity',
    body: 'A rejected field is marked directly in the table card and in the side panel with reviewer feedback.',
    focus: 'Field rejection is visible at the list row and in the detail panel, so the problem is easy to locate.',
  },
];

const GOVERNANCE_SCREENS: CaseSlide[] = [
  {
    src: dataPolicies,
    label: 'Data policies',
    title: 'Policies are visible product objects',
    body: 'Users can see what each policy protects, how many fields it touches, the standard behind it, and the role it applies to.',
    focus: 'The policy table makes compliance operational: purpose, field count, standard, category, and role.',
  },
  {
    src: proceduresFunctions,
    label: 'Procedures and functions',
    title: 'Backend logic moves into the model',
    body: 'Stored procedures and functions become first-class objects, not hidden implementation details owned by another team.',
    focus: 'Procedures sit beside tables and fields because backend data preparation is part of the model contract.',
  },
  {
    src: activityLogs,
    label: 'Activity logs',
    title: 'Events become traceable',
    body: 'Approvals, failures, submissions, policy edits, and rejected requests are recorded in a browsable audit trail.',
    focus: 'Logs answer who changed what and what happened next, including failed and rejected paths.',
  },
  {
    src: activityVersioning,
    label: 'Versioning',
    title: 'Versions show deployed history',
    body: 'The versioning table records the current and past deployed states, separating live model history from request noise.',
    focus: 'Versioning is intentionally cleaner than logs: it records deployed model states and summaries.',
  },
];

function StoryDeck({ label, slides }: { label: string; slides: CaseSlide[] }) {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const previous = () => setActive((current) => (current === 0 ? slides.length - 1 : current - 1));
  const next = () => setActive((current) => (current === slides.length - 1 ? 0 : current + 1));

  return (
    <article
      className={[
        'dmx-deck',
        slide.tall ? 'dmx-deck--tall' : '',
        slide.portrait ? 'dmx-deck--portrait' : '',
        slide.contain ? 'dmx-deck--contain' : '',
      ].filter(Boolean).join(' ')}
      data-rise
    >
      <div className="dmx-deck-head">
        <div>
          <span className="csx-label">{label}</span>
          <strong>{slide.title}</strong>
        </div>
        <div className="dmx-deck-controls" aria-label={`${label} navigation`}>
          <button type="button" onClick={previous} aria-label="Previous state">{'<'}</button>
          <span>{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
          <button type="button" onClick={next} aria-label="Next state">{'>'}</button>
        </div>
      </div>

      <div className="dmx-deck-body">
        <div className="dmx-deck-stage">
          <div className="dmx-deck-canvas">
            <img src={slide.src} alt={slide.title} loading="lazy" decoding="async" />
          </div>
        </div>

        <aside className="dmx-deck-note">
          <span>{slide.label}</span>
          <h3>{slide.title}</h3>
          <p>{slide.body}</p>
          {slide.focus ? <p className="dmx-focus-note">{slide.focus}</p> : null}
        </aside>
      </div>

      <div className="dmx-deck-steps" role="tablist" aria-label={`${label} states`}>
        {slides.map((item, index) => (
          <button
            type="button"
            key={item.label}
            className={index === active ? 'is-active' : ''}
            onClick={() => setActive(index)}
            aria-selected={index === active}
            role="tab"
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>
    </article>
  );
}

function DecisionCard({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <article className="csx-card" data-rise>
      <div>
        <span className="csx-label">{label}</span>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}

function StepCard({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <article className="dmx-step-card" data-rise>
      <span>{String(index).padStart(2, '0')}</span>
      <strong>{title}</strong>
      <p>{children}</p>
    </article>
  );
}

export default function CaseDataModelExplorerImproved() {
  const rootRef = useRef<HTMLDivElement>(null);
  useExperience(rootRef, { chapters: CHAPTERS, title: 'Data Model Explorer' });

  return (
    <div className="csx-root dmx-case" ref={rootRef}>
      <ExperienceChrome chapters={CHAPTERS} tag="Data Model Explorer · Gravity" />

      <main className="csx-main">
        <section className="csx-hero dmx-hero" aria-labelledby="dmx-hero-title">
          <span className="csx-hero-ghost" aria-hidden="true">DM</span>
          <div className="csx-hero-inner dmx-hero-grid">
            <div className="dmx-hero-copy">
              <Eyebrow>Case Study Draft · Product Story Edit · Enterprise UX</Eyebrow>
              <H id="dmx-hero-title" level={1} className="csx-hero-h">Data Model Explorer</H>
              <p className="csx-hero-lede" data-rise>
                A shared map for healthcare platform teams to understand what data exists, what it means, how it connects, and how to safely change it without relying on scattered docs, SQL files, or team memory.
              </p>
              <div className="csx-hero-meta" data-stagger>
                {[
                  ['Product', 'Innovaccer Gravity'],
                  ['Role', 'Product / UX Designer'],
                  ['Users', 'Engineers · Stewards · Analysts · Admins'],
                  ['Scope', 'Understand · Turn on · Request changes · Approve · Track history'],
                ].map(([k, v]) => (
                  <div className="csx-meta-pill" data-rise key={k}><span>{k}</span><strong>{v}</strong></div>
                ))}
              </div>
            </div>

            <figure className="dmx-hero-shot" data-rise>
              <img src={domainTableView} alt="Gravity Data Model Explorer showing the Population Health Management table inventory" />
              <figcaption>PHM table inventory with enabled model controls.</figcaption>
            </figure>
          </div>
          <div className="csx-scrollcue" aria-hidden="true"><span /><p>Scroll</p></div>
        </section>

        <Marquee items={['BROWSE', 'UNDERSTAND', 'ENABLE', 'EXTEND', 'REVIEW', 'DEPLOY', 'VERSION']} />

        <section className="csx-section" id="context" aria-labelledby="dmx-context-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">01</span>
          <div className="csx-inner">
            <Eyebrow>01 · Product context</Eyebrow>
            <H id="dmx-context-title">A data model is a shared map for a complex product</H>
            <p className="csx-lede" data-rise>
              For a non-technical reader, think of a data model as the product&apos;s map of its data. It explains what information exists, what each field means, how tables connect, what rules protect sensitive information, and what changes are safe to make.
            </p>
            <p data-rise>
              Gravity needed that map to work across healthcare and operations domains. The challenge was not just showing tables. Each domain carried hundreds of fields, privacy rules, backend data preparation, and downstream product dependencies.
            </p>

            <div className="dmx-role-grid" data-stagger>
              {ROLES.map(([title, body]) => (
                <article className="dmx-role" data-rise key={title}>
                  <span>{title}</span>
                  <p>{body}</p>
                </article>
              ))}
            </div>

            <div className="csx-stat-grid" data-stagger>
              <div className="csx-stat" data-rise><strong>23</strong><span>Tables visible in the Population Health model.</span></div>
              <div className="csx-stat" data-rise><strong>665</strong><span>Fields made searchable and explainable.</span></div>
              <div className="csx-stat" data-rise><strong>5 min</strong><span>Estimated turn-on time made visible to users.</span></div>
              <div className="csx-stat" data-rise><strong>1</strong><span>Workspace replacing docs, SQL files, tickets, and release-note hunting.</span></div>
            </div>
          </div>
        </section>

        <section className="csx-section" id="challenge" aria-labelledby="dmx-challenge-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">02</span>
          <div className="csx-inner">
            <Eyebrow>02 · Design challenge</Eyebrow>
            <H id="dmx-challenge-title">The hard part was making safe change feel understandable</H>
            <p className="csx-lede" data-rise>
              This was not a screenshot problem. It was a trust problem. Users needed to know what was real, what was only proposed, what was risky, and what could be safely approved.
            </p>
            <p className="csx-quote" data-rise>How might we turn backend data complexity into a product experience that mixed technical and non-technical users can trust?</p>

            <div className="csx-grid-3" data-stagger>
              <DecisionCard label="Visibility" title="The source of truth was fragmented">
                Users depended on docs, SQL files, tickets, release notes, and team memory to understand the current model.
              </DecisionCard>
              <DecisionCard label="Meaning" title="Metadata needed business language">
                Field names alone did not explain what the data meant, whether it was sensitive, or how it should be used.
              </DecisionCard>
              <DecisionCard label="Risk" title="Every change could affect multiple systems">
                A new table or field could affect backend data preparation, analytics, compliance, and downstream workflows.
              </DecisionCard>
              <DecisionCard label="Operations" title="Enablement was a backend lifecycle">
                Turning on a model needed progress, failure, retry, abort, success, and proof that the model was live.
              </DecisionCard>
              <DecisionCard label="Governance" title="Review needed context, not just approval buttons">
                Admins needed the request, fields, warnings, reviewer comments, and deployment state in one place.
              </DecisionCard>
              <DecisionCard label="Traceability" title="Requests and versions were different truths">
                Proposed work, deployed history, and audit events needed separation so users could tell what was live.
              </DecisionCard>
            </div>

            <div className="dmx-coverage-grid" data-stagger>
              <article data-rise>
                <span className="csx-label">Before</span>
                <div className="dmx-flowline">
                  {BEFORE_FLOW.map((item, index) => (
                    <div className="dmx-flowitem" key={item}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{item}</strong>
                    </div>
                  ))}
                </div>
              </article>
              <article data-rise>
                <span className="csx-label">After</span>
                <div className="dmx-flowline">
                  {AFTER_FLOW.map((item, index) => (
                    <div className="dmx-flowitem" key={item}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{item}</strong>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="csx-section" id="plain-language" aria-labelledby="dmx-plain-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">03</span>
          <div className="csx-inner">
            <Eyebrow>03 · Plain-English primer</Eyebrow>
            <H id="dmx-plain-title">First, translate the system into everyday objects</H>
            <p className="csx-lede" data-rise>
              The case study needs to work for people who do not live in healthcare data systems. So the product story starts with plain nouns before showing the detailed screens.
            </p>

            <div className="dmx-object-map" data-stagger>
              {OBJECTS.map(([title, body], i) => (
                <article className="dmx-object" data-rise key={title}>
                  <i>{String(i + 1).padStart(2, '0')}</i>
                  <strong>{title}</strong>
                  <span>{body}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="csx-section" id="model" aria-labelledby="dmx-model-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">04</span>
          <div className="csx-inner">
            <Eyebrow>04 · Product model</Eyebrow>
            <H id="dmx-model-title">The product became a trust system, not just a browser</H>
            <p className="csx-lede" data-rise>
              The design model was simple: help users see what exists, understand what it means, control how it changes, and prove what happened.
            </p>

            <div className="dmx-principles" data-stagger>
              {TRUST_MODEL.map(([title, body]) => (
                <article className="dmx-principle" data-rise key={title}>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </article>
              ))}
            </div>

            <h3>What I had to untangle</h3>
            <div className="dmx-journey-map" data-stagger>
              {UNTANGLED_ITEMS.map(([title, body], i) => (
                <StepCard key={title} index={i + 1} title={title}>{body}</StepCard>
              ))}
            </div>

            <h3>Design decisions</h3>
            <div className="dmx-principles" data-stagger>
              {PRINCIPLES.map(([title, body]) => (
                <article className="dmx-principle" data-rise key={title}>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="csx-section" id="explore" aria-labelledby="dmx-explore-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">05</span>
          <div className="csx-inner">
            <Eyebrow>05 · Proof moment 1: Understand what exists</Eyebrow>
            <H id="dmx-explore-title">Before users change data, they need to understand the map</H>
            <p className="csx-lede" data-rise>
              Exploration needed three levels: the table inventory, the field inventory, and the relationship map. Each one answers a different question and builds confidence before anyone makes a change.
            </p>

            <div className="dmx-flowline" data-stagger>
              {['Open model', 'Scan tables', 'Inspect fields', 'Map relationships', 'Open field detail', 'Check policy context'].map((item, i) => (
                <div className="dmx-flowitem" data-rise key={item}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>

            <StoryDeck label="Explore walkthrough" slides={EXPLORE_SCREENS} />
          </div>
        </section>

        <section className="csx-section" id="enable" aria-labelledby="dmx-enable-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">06</span>
          <div className="csx-inner">
            <Eyebrow>06 · Proof moment 2: Turn a model on safely</Eyebrow>
            <H id="dmx-enable-title">Turning on a model is not one button. It is a visible process.</H>
            <p className="csx-lede" data-rise>
              Turning on Population Health moves it from an available package into the organization&apos;s working model list. The UI had to make the long-running backend operation visible without hiding the model itself.
            </p>

            <div className="dmx-state-machine" data-stagger>
              {['Available', 'Initiated', 'In progress', 'Abort / recover', 'Enabled', 'Versioned'].map((state, i) => (
                <div className="dmx-state" data-rise key={state}>
                  <i>{String(i + 1).padStart(2, '0')}</i>
                  <b>{state}</b>
                </div>
              ))}
            </div>

            <StoryDeck label="Turn-on walkthrough" slides={ENABLEMENT_STATES} />
          </div>
        </section>

        <section className="csx-section" id="extend" aria-labelledby="dmx-extend-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">07</span>
          <div className="csx-inner">
            <Eyebrow>07 · Proof moment 3: Request safe changes</Eyebrow>
            <H id="dmx-extend-title">The change flow turns raw technical input into reviewable product work</H>
            <p className="csx-lede" data-rise>
              This was the largest UX shift. A contributor should not just upload a table definition and hope. The product should check the table, expose the fields, collect metadata, warn about downstream risks, and package the final request for review.
            </p>

            <div className="dmx-journey-map" data-stagger>
              {[
                ['Choose change type', 'New table or new field'],
                ['Provide source', 'Upload a table definition or enter details manually'],
                ['Check input', 'Catch file, syntax, and validation errors early'],
                ['Enrich metadata', 'Descriptions, categories, keys, sensitive-data flags, and required fields'],
                ['Handle backend logic', 'Include data-preparation logic when unique records depend on it'],
                ['Submit request', 'Move the complete package into review'],
              ].map(([title, body], i) => (
                <StepCard key={title} index={i + 1} title={title}>{body}</StepCard>
              ))}
            </div>

            <h3>Add a New Table</h3>
            <p data-rise>
              The table flow intentionally starts narrow: pick the source method, check the file or manual input, then expand into a richer review workspace only after the system can understand the input.
            </p>
            <StoryDeck label="Table extension walkthrough" slides={TABLE_EXTENSION_STEPS} />

            <StoryDeck label="Parsed request deep dive" slides={DEEP_DIVE_STEPS} />

            <h3>Add New Fields</h3>
            <p data-rise>
              Field extension needed a faster path than a full table extension, but it still had to collect enough metadata for privacy, meaning, and review.
            </p>
            <StoryDeck label="Field extension walkthrough" slides={ATTRIBUTE_EXTENSION_STEPS} />
          </div>
        </section>

        <section className="csx-section" id="review" aria-labelledby="dmx-review-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">08</span>
          <div className="csx-inner">
            <Eyebrow>08 · Proof moment 4: Approve with context</Eyebrow>
            <H id="dmx-review-title">The reviewer experience had to preserve context and consequence</H>
            <p className="csx-lede" data-rise>
              The review flow was designed around a simple rule: never ask someone to approve a change without showing the table, fields, request history, reviewer comments, and deployment state together.
            </p>

            <div className="dmx-review-strip" data-stagger>
              {['Submitted', 'Initializing', 'In review', 'Approved', 'Deploying', 'Deployed', 'Rejected', 'Discarded'].map((state, i) => (
                <div className="dmx-review-pill" data-rise key={state}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <strong>{state}</strong>
                </div>
              ))}
            </div>

            <StoryDeck label="Review walkthrough" slides={REVIEW_STATES} />

            <div className="dmx-split-table" data-rise>
              <div>
                <h3>Request</h3>
                <p>Shows what someone proposed, who submitted it, reviewer comments, current status, and available actions.</p>
              </div>
              <div>
                <h3>Version</h3>
                <p>Shows only deployed model states. This is the live history users can trust.</p>
              </div>
              <div>
                <h3>Log</h3>
                <p>Shows operational events, failures, approvals, rejected work, policy edits, and change summaries.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="csx-section" id="govern" aria-labelledby="dmx-govern-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">09</span>
          <div className="csx-inner">
            <Eyebrow>09 · Proof moment 5: Show accountability</Eyebrow>
            <H id="dmx-govern-title">The product needed more than tables. It needed a record of trust.</H>
            <p className="csx-lede" data-rise>
              The final structure gives policies, backend procedures, logs, and version history the same weight as tables. That matters because in healthcare data, compliance and traceability are not secondary features.
            </p>

            <StoryDeck label="Governance walkthrough" slides={GOVERNANCE_SCREENS} />

            <div className="dmx-coverage-grid" data-stagger>
              <article data-rise>
                <span className="csx-label">What became clear</span>
                <ul>
                  <li>Table browsing alone does not explain model trust.</li>
                  <li>Field metadata is where governance becomes concrete.</li>
                  <li>Backend procedures should be reviewed with tables when data preparation depends on them.</li>
                  <li>Rejected work should remain visible until the requestor discards or fixes it.</li>
                </ul>
              </article>
              <article data-rise>
                <span className="csx-label">Known gaps to design next</span>
                <ul>
                  <li>Standalone Requests tab list for all pending, failed, rejected, and deployed requests.</li>
                  <li>Deployment failed state after reviewer approval.</li>
                  <li>Rollback confirmation, data-loss warning, progress, and failed rollback states.</li>
                  <li>Procedure detail side sheet and policy detail view.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="csx-closing-band" id="impact" aria-labelledby="dmx-impact-title">
          <div className="csx-inner">
            <Eyebrow>10 · Outcome</Eyebrow>
            <H id="dmx-impact-title">From scattered schema knowledge to a governed model workspace</H>
            <div className="csx-closing-versus" data-stagger>
              <article className="csx-closing-card" data-rise>
                <span className="csx-label">Before</span>
                <strong>Fragmented</strong>
                <p>Users depended on SQL files, docs, release notes, tickets, and team handoffs to understand model state.</p>
              </article>
              <span className="csx-closing-arrow" aria-hidden="true">&rarr;</span>
              <article className="csx-closing-card csx-closing-card--accent" data-rise>
                <span className="csx-label">After</span>
                <strong>Governed</strong>
                <p>Tables, fields, relationships, policies, procedures, requests, versions, failures, and audit logs live in one inspectable experience.</p>
              </article>
            </div>
            <div className="csx-closing-stats" data-stagger>
              {[
                ['Clearer mental model', 'Available models, active models, requests, versions, and logs each have a separate job.'],
                ['Safer activation', 'Turning on a model shows timing, progress, retry, abort, success, and post-activation verification.'],
                ['Stronger governance', 'Data changes become metadata-rich, reviewable work instead of raw technical input with late feedback.'],
              ].map(([title, body]) => (
                <div className="csx-closing-stat" data-rise key={title}><strong>{title}</strong><span>{body}</span></div>
              ))}
            </div>
            <p className="dmx-figma-note" data-rise>
              Source board: <a href={MASTER_FIGMA} target="_blank" rel="noreferrer">Data Model Figma</a>
            </p>
          </div>
        </section>

        <section className="csx-section csx-impact-after" aria-labelledby="dmx-learned-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">LD</span>
          <div className="csx-inner">
            <Eyebrow>Design learning</Eyebrow>
            <H id="dmx-learned-title">Good enterprise UX does not hide complexity. It sequences it.</H>
            <p data-rise>
              The hardest part was not drawing a table list or relationship map. It was naming the real system states behind them: pending work, deployed truth, backend preparation, sensitive-data rules, request ownership, and recovery risk.
            </p>
            <p className="csx-quote" data-rise>When the backend workflow is complex, the UX must clarify state, ownership, and consequence at every step.</p>

            <div className="csx-closing-stats" data-stagger>
              {[
                ['Can people find the right field?', 'Search success, time to locate a table or field, and fewer questions sent to engineering.'],
                ['Can contributors submit cleaner requests?', 'Validation errors, missing metadata, review cycles, and rejected requests caused by unclear privacy or key information.'],
                ['Can reviewers decide with confidence?', 'Approval time, comment quality, failed deployments, and how often reviewers need outside context.'],
              ].map(([title, body]) => (
                <div className="csx-closing-stat" data-rise key={title}><strong>{title}</strong><span>{body}</span></div>
              ))}
            </div>
          </div>
        </section>

        <Marquee items={['DATA MODEL EXPLORER', 'AVAILABLE IS NOT ENABLED', 'REQUESTS ARE NOT VERSIONS', 'STATE IS PRODUCT LANGUAGE']} />
      </main>

      <ExperienceFooter>Innovaccer Gravity · Data Model Explorer · Enterprise data platform UX</ExperienceFooter>
    </div>
  );
}
