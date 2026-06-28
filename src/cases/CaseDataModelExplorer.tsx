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
  { id: 'problem', num: '02', label: 'Problem' },
  { id: 'model', num: '03', label: 'Model' },
  { id: 'explore', num: '04', label: 'Explore' },
  { id: 'enable', num: '05', label: 'Enable' },
  { id: 'extend', num: '06', label: 'Extend' },
  { id: 'review', num: '07', label: 'Review' },
  { id: 'govern', num: '08', label: 'Govern' },
  { id: 'impact', num: '09', label: 'Impact' },
];

const OBJECTS = [
  ['Domain', 'A packaged healthcare area, such as PHM, RCM, LIS, HR, or TMS.'],
  ['Table', 'A business object inside a domain, such as Allergies, Claims, Encounters, or Appointments.'],
  ['Attribute', 'A field inside a table, with type, description, semantics, quality context, and privacy flags.'],
  ['Relationship', 'How tables connect through primary keys, foreign keys, and shared identifiers.'],
  ['Policy', 'Governance rules such as PHI masking, PII hashing, and role-based visibility.'],
  ['Procedure', 'Executable logic that ingestion pipelines use for keys, transforms, and validations.'],
  ['Request', 'A proposed change moving through validation, review, rejection, deployment, or discard.'],
  ['Version', 'A deployed model state that users can trust as live history.'],
  ['Log', 'The audit record of who changed what, when, and what happened next.'],
];

const ROLES = [
  ['Viewer', 'Needs to understand what exists before using or enabling a model.'],
  ['Contributor', 'Needs to add a table or attribute without breaking governance, ingestion, or downstream trust.'],
  ['Admin / Reviewer', 'Needs enough context to approve, reject, deploy, or explain a change safely.'],
];

const PRINCIPLES = [
  ['Available is not enabled', 'Users can inspect a packaged model before activation, but active workspace operations remain gated until enablement completes.'],
  ['Requests are not versions', 'Requests show proposed or transient work. Versions show deployed truth only. Logs preserve everything that happened between them.'],
  ['AI suggests, humans confirm', 'Metadata suggestions reduce manual effort, but privacy, relationships, and governance decisions stay explicitly reviewable.'],
  ['Review belongs in context', 'A reviewer should see table intent, attributes, DDL, procedure logic, comments, and deployment state in the same place.'],
];

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
    title: 'Start with the domain inventory',
    body: 'The table view gives a readable entry point: name, description, attribute count, primary-key logic, and foreign-key context.',
    focus: 'Notice the table rows: the first read is not a diagram, it is a familiar inventory with keys and counts.',
  },
  {
    src: attributeExplorer,
    label: 'Attribute explorer',
    title: 'Move from table names to field meaning',
    body: 'Attributes are scannable across tables, so users can understand field purpose and semantic mapping without opening every table.',
    focus: 'The important moment is the field-level table: hundreds of attributes become searchable and comparable.',
  },
  {
    src: entityDiagramOverview,
    label: 'Entity diagram',
    title: 'Use the ERD as a map, not decoration',
    body: 'The ERD makes relationships, dependencies, and table shape visible for people who do not think in SQL first.',
    focus: 'The canvas teaches relationship shape: cards, connectors, counts, and navigation controls in one spatial view.',
  },
  {
    src: erdCardInteractions,
    label: 'Card interactions',
    title: 'Make the canvas teach itself',
    body: 'Tooltips explain add and expand actions directly on table cards, reducing the need for separate instruction text.',
    focus: 'Only the tooltip moments matter here: add attributes and expand a card are taught directly where the action happens.',
  },
  {
    src: fieldDetail,
    label: 'Field detail',
    title: 'Turn field inspection into governance',
    body: 'The detail panel connects one selected field to its table, semantics, quality rules, format, PHI flags, and nullable state.',
    focus: 'The right panel turns one selected field into a governance object with semantics, flags, and quality-rule entry points.',
  },
];

const ENABLEMENT_STATES: CaseSlide[] = [
  {
    src: productOverview,
    label: 'Before enablement',
    title: 'PHM is inspectable but not owned yet',
    body: 'The model sits under Available Models. Users can evaluate it, but Activity remains unavailable until activation.',
    focus: 'The left navigation is the key: PHM is available to inspect, but it is not yet in the owned model list.',
  },
  {
    src: enableState,
    label: 'Enablement in progress',
    title: 'Activation becomes a visible system operation',
    body: 'The header carries progress, estimated time, and an abort affordance while the table list stays readable.',
    focus: 'The top-right status line makes the backend operation visible: in progress, estimated time, and abort.',
  },
  {
    src: abortModal,
    label: 'Abort confirmation',
    title: 'Risky interruption gets a real decision',
    body: 'The modal explains that aborting stops enablement and loses progress, so the user can continue or intentionally abort.',
    focus: 'This is consequence copy, not generic confirmation: the modal says progress will be lost completely.',
    contain: true,
  },
  {
    src: enabledSuccessVersioning,
    label: 'Success',
    title: 'The model moves into the working set',
    body: 'The success toast confirms activation and points to Activity, helping users verify what was created.',
    focus: 'The success toast does the next-step work: confirmation plus a path into Activity.',
  },
  {
    src: enableActivityVersioning,
    label: 'Version proof',
    title: 'Activity confirms deployed truth',
    body: 'After enablement, the versioning tab shows the first deployed PHM version and the summary of what was deployed.',
    focus: 'Versioning is proof of deployment. It is deliberately separate from transient request states.',
  },
];

const TABLE_EXTENSION_STEPS: CaseSlide[] = [
  {
    src: extendModelMenu,
    label: 'Entry point',
    title: 'One affordance, two extension paths',
    body: 'Extend model separates new table and new attribute flows while keeping both anchored in the same model workspace.',
    focus: 'The dropdown is small, but it is the product fork: new table versus new attribute.',
  },
  {
    src: addTableUpload,
    label: 'Upload or manual',
    title: 'Meet both technical habits',
    body: 'Some contributors start from DDL or CSV. Others paste or write manually. The side panel supports both without leaving the table list.',
    focus: 'The right side sheet is the action surface. The table list stays visible as context.',
  },
  {
    src: addTableFileSelected,
    label: 'File selected',
    title: 'A file is not a request yet',
    body: 'The selected file is shown as an input state, not treated as submitted work until validation and review steps complete.',
    focus: 'The file row is intentionally an input state; Submit is still the explicit request boundary.',
  },
  {
    src: addTableParseError,
    label: 'Parse failure',
    title: 'Errors stay attached to the input',
    body: 'Validation feedback appears inside the side panel and as a visible toast, giving the contributor a clear retry path.',
    focus: 'The error appears twice: local to the file and globally as a toast, so recovery is hard to miss.',
  },
  {
    src: addTableManualPanel,
    label: 'Manual path',
    title: 'The same review model supports hand-authored SQL',
    body: 'Manual entry keeps the same submission mechanics, so upload and typed DDL converge into one governed request flow.',
    focus: 'The side sheet preserves one mental model even when the input method changes.',
  },
];

const DEEP_DIVE_STEPS: CaseSlide[] = [
  {
    src: parsedTableReview,
    label: 'Parsed DDL review',
    title: 'The request becomes inspectable before submission',
    body: 'The parsed review state shows table information, every parsed attribute, category chips, PHI/PII markings, primary-key flags, generated procedure code, and generated DDL. This is the handoff from raw technical input to governed product work.',
    focus: 'This is the main transformation: raw DDL becomes a reviewable table, metadata, procedure, and generated code package.',
    tall: true,
  },
  {
    src: procedureWarning,
    label: 'Procedure optionality',
    title: 'Optional does not mean consequence-free',
    body: 'When the procedure is turned off, the product explains what breaks: Snowflake primary-key metadata does not enforce deduplication, so ingestion may fail before data reaches L2.',
    focus: 'The blue and orange warnings explain pipeline consequence in plain language before the request is submitted.',
    tall: true,
  },
];

const ATTRIBUTE_EXTENSION_STEPS: CaseSlide[] = [
  {
    src: addAttributeEmptyModal,
    label: 'Empty state',
    title: 'Choose the table before adding fields',
    body: 'The flow makes the table decision explicit because a request can add new attributes to one table only.',
    focus: 'The table selection comes first because the request can only add attributes to one table.',
    tall: true,
  },
  {
    src: addAttributeTypeDropdown,
    label: 'Type selection',
    title: 'Data type is a design control, not a free text field',
    body: 'The dropdown nudges users toward known types, reducing downstream parsing and ingestion ambiguity.',
    focus: 'The dropdown replaces free text with supported data types, which makes review and deployment safer.',
    tall: true,
  },
  {
    src: addAttributeInvalidDisabled,
    label: 'Invalid / disabled',
    title: 'Submission waits for valid metadata',
    body: 'Disabled actions and validation states keep incomplete or malformed attributes from entering review.',
    focus: 'The disabled primary action is the story: invalid metadata cannot move forward.',
    tall: true,
  },
  {
    src: addAttributeReady,
    label: 'Ready to add',
    title: 'A valid attribute can be added into the draft set',
    body: 'The modal confirms the field shape before it becomes part of the larger extension request.',
    focus: 'A valid field can now be added, but it is still draft work until the extension request is submitted.',
    tall: true,
  },
  {
    src: addAttributeValidation,
    label: 'Side panel validation',
    title: 'The larger panel supports richer metadata',
    body: 'Name rules, description, type, format, nullable, PHI, and sensitive-code flags are gathered before review.',
    focus: 'This panel makes privacy and validity part of field creation, not something reviewers discover late.',
    portrait: true,
  },
];

const REVIEW_STATES: CaseSlide[] = [
  {
    src: inReviewTableExtension,
    label: 'In review',
    title: 'Pending work appears in the model context',
    body: 'The proposed Employment details table is visible on the ERD with an in-review status and a request detail panel.',
    focus: 'The proposed table appears on the ERD with a status, so pending work is visible but not mistaken for deployed truth.',
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
    label: 'Rejected attribute',
    title: 'Attribute-level governance gets the same clarity',
    body: 'A rejected attribute is marked directly in the table card and in the side panel with reviewer feedback.',
    focus: 'Attribute rejection is visible at the list row and in the detail panel, so the problem is easy to locate.',
  },
];

const GOVERNANCE_SCREENS: CaseSlide[] = [
  {
    src: dataPolicies,
    label: 'Data policies',
    title: 'Policies are visible product objects',
    body: 'Users can see what each policy protects, how many attributes it touches, the standard behind it, and the role it applies to.',
    focus: 'The policy table makes compliance operational: purpose, attribute count, standard, category, and role.',
  },
  {
    src: proceduresFunctions,
    label: 'Procedures and functions',
    title: 'Pipeline logic moves into the model',
    body: 'Stored procedures and functions become first-class objects, not hidden implementation details owned by another team.',
    focus: 'Procedures sit beside tables and attributes because ingestion logic is part of the model contract.',
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
    body: 'The versioning table records the current and past deployed states, separating live schema from request noise.',
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

export default function CaseDataModelExplorer() {
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
              <Eyebrow>Case Study · Enterprise UX · Healthcare Data Platform</Eyebrow>
              <H id="dmx-hero-title" level={1} className="csx-hero-h">Data Model Explorer</H>
              <p className="csx-hero-lede" data-rise>
                A governed workspace for healthcare platform teams to understand, enable, extend, review, and version complex data models without relying on scattered docs, SQL files, or backend tribal knowledge.
              </p>
              <div className="csx-hero-meta" data-stagger>
                {[
                  ['Product', 'Innovaccer Gravity'],
                  ['Role', 'Product / UX Designer'],
                  ['Users', 'Engineers · Stewards · Analysts · Admins'],
                  ['Scope', 'Explorer · ERD · Enablement · Extension · Governance'],
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
            <H id="dmx-context-title">A data model is the blueprint for how healthcare data becomes usable</H>
            <p className="csx-lede" data-rise>
              For a non-technical reader, think of a data model as a shared map. It explains what data exists, what each field means, how tables connect, what rules protect sensitive information, and what changes are safe to make.
            </p>
            <p data-rise>
              Gravity needed this map to work for healthcare domains like Population Health Management, Revenue Cycle Management, Laboratory Information Systems, Human Resources, and Supply Chain. The challenge was that each domain carries thousands of fields, compliance rules, ingestion logic, and downstream analytics dependencies.
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
              <div className="csx-stat" data-rise><strong>23</strong><span>PHM tables visible in the primary inventory.</span></div>
              <div className="csx-stat" data-rise><strong>665</strong><span>Attributes exposed for field-level understanding.</span></div>
              <div className="csx-stat" data-rise><strong>5 min</strong><span>Activation time made visible during enablement.</span></div>
              <div className="csx-stat" data-rise><strong>1</strong><span>Workspace replacing docs, SQL files, tickets, and release-note hunting.</span></div>
            </div>
          </div>
        </section>

        <section className="csx-section" id="problem" aria-labelledby="dmx-problem-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">02</span>
          <div className="csx-inner">
            <Eyebrow>02 · Problem</Eyebrow>
            <H id="dmx-problem-title">The interface had to answer a simple question from many angles</H>
            <p className="csx-quote" data-rise>What do we have, what does it mean, how is it connected, and how can we safely change it?</p>

            <div className="csx-grid-3" data-stagger>
              <DecisionCard label="Visibility" title="The source of truth was fragmented">
                Schema lived across SQL, docs, data dictionaries, release notes, and team memory. Users could not reliably tell what was current.
              </DecisionCard>
              <DecisionCard label="Meaning" title="Metadata needed business language">
                Field names alone did not explain semantic meaning, privacy sensitivity, data quality, or how a field should be used.
              </DecisionCard>
              <DecisionCard label="Risk" title="Every change could affect multiple systems">
                A table or attribute extension could touch ingestion, analytics, compliance, care workflows, and downstream applications.
              </DecisionCard>
              <DecisionCard label="Operations" title="Enablement was a backend lifecycle">
                Activation needed progress, failure, retry, abort, success, and post-enable proof instead of a simple button state.
              </DecisionCard>
              <DecisionCard label="Governance" title="Review needed context, not just approval buttons">
                Admins needed to inspect DDL, metadata, procedures, request history, comments, and deployment state in one place.
              </DecisionCard>
              <DecisionCard label="Traceability" title="Requests and versions were different truths">
                Proposed work, deployed schema, and audit events needed separation so users could tell what was live.
              </DecisionCard>
            </div>
          </div>
        </section>

        <section className="csx-section" id="model" aria-labelledby="dmx-model-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">03</span>
          <div className="csx-inner">
            <Eyebrow>03 · System model</Eyebrow>
            <H id="dmx-model-title">I turned backend objects into product objects</H>
            <p className="csx-lede" data-rise>
              The case study only works if the reader understands what each object does. I structured the product around clear nouns with clear responsibilities.
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
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">04</span>
          <div className="csx-inner">
            <Eyebrow>04 · Journey 1: Explore the model</Eyebrow>
            <H id="dmx-explore-title">Before users change a model, they need to understand it</H>
            <p className="csx-lede" data-rise>
              Exploration needed three levels: the domain inventory, the field inventory, and the relationship map. Each one answers a different question and supports a different level of confidence.
            </p>

            <div className="dmx-flowline" data-stagger>
              {['Open domain', 'Scan tables', 'Inspect attributes', 'Map relationships', 'Open field detail', 'Check policy context'].map((item, i) => (
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
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">05</span>
          <div className="csx-inner">
            <Eyebrow>05 · Journey 2: Enable a packaged model</Eyebrow>
            <H id="dmx-enable-title">Activation is not a moment. It is a state machine.</H>
            <p className="csx-lede" data-rise>
              Enabling PHM moves it from an available package into the organization&apos;s working model list. The UI had to make the long-running backend operation visible without blocking model exploration.
            </p>

            <div className="dmx-state-machine" data-stagger>
              {['Available', 'Initiated', 'In progress', 'Abort / recover', 'Enabled', 'Versioned'].map((state, i) => (
                <div className="dmx-state" data-rise key={state}>
                  <i>{String(i + 1).padStart(2, '0')}</i>
                  <b>{state}</b>
                </div>
              ))}
            </div>

            <StoryDeck label="Enablement walkthrough" slides={ENABLEMENT_STATES} />
          </div>
        </section>

        <section className="csx-section" id="extend" aria-labelledby="dmx-extend-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">06</span>
          <div className="csx-inner">
            <Eyebrow>06 · Journey 3: Extend the model</Eyebrow>
            <H id="dmx-extend-title">The extension flow turns raw schema into reviewable product work</H>
            <p className="csx-lede" data-rise>
              This was the largest UX shift. A contributor should not just upload DDL and hope. The product should parse the table, expose the fields, collect metadata, warn about pipeline risks, and package the final request for review.
            </p>

            <div className="dmx-journey-map" data-stagger>
              {[
                ['Choose extension type', 'New table or new attribute'],
                ['Provide source', 'Upload DDL/CSV or enter manually'],
                ['Validate', 'Parse SQL and catch file or syntax errors'],
                ['Enrich metadata', 'Descriptions, categories, keys, PHI/PII, required fields'],
                ['Handle procedure logic', 'Include pipeline logic when primary-key generation depends on it'],
                ['Submit request', 'Move the complete package into review'],
              ].map(([title, body], i) => (
                <StepCard key={title} index={i + 1} title={title}>{body}</StepCard>
              ))}
            </div>

            <h3>Add a New Table</h3>
            <p data-rise>
              The table flow intentionally starts narrow: pick the source method, validate the file or SQL, then expand into a richer review workspace only after the system can understand the input.
            </p>
            <StoryDeck label="Table extension walkthrough" slides={TABLE_EXTENSION_STEPS} />

            <StoryDeck label="Parsed request deep dive" slides={DEEP_DIVE_STEPS} />

            <h3>Add New Attributes</h3>
            <p data-rise>
              Attribute extension needed a faster path than a full table extension, but it still had to collect enough metadata for privacy, semantics, and review.
            </p>
            <StoryDeck label="Attribute extension walkthrough" slides={ATTRIBUTE_EXTENSION_STEPS} />
          </div>
        </section>

        <section className="csx-section" id="review" aria-labelledby="dmx-review-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">07</span>
          <div className="csx-inner">
            <Eyebrow>07 · Journey 4: Review, reject, deploy</Eyebrow>
            <H id="dmx-review-title">The reviewer experience had to preserve context and consequence</H>
            <p className="csx-lede" data-rise>
              The review flow was designed around a simple rule: never ask someone to approve a change without showing the table, attributes, request history, reviewer comments, and deployment state together.
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
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">08</span>
          <div className="csx-inner">
            <Eyebrow>08 · Governance surfaces</Eyebrow>
            <H id="dmx-govern-title">The product needed more than tables. It needed accountability.</H>
            <p className="csx-lede" data-rise>
              The final structure gives policy, procedure, log, and versioning the same dignity as tables. That matters because in healthcare data, compliance and traceability are not secondary features.
            </p>

            <StoryDeck label="Governance walkthrough" slides={GOVERNANCE_SCREENS} />

            <div className="dmx-coverage-grid" data-stagger>
              <article data-rise>
                <span className="csx-label">What became clear</span>
                <ul>
                  <li>Table browsing alone does not explain model trust.</li>
                  <li>Attribute metadata is where governance becomes concrete.</li>
                  <li>Procedures should be reviewed with tables when ingestion depends on them.</li>
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
            <Eyebrow>09 · Outcome</Eyebrow>
            <H id="dmx-impact-title">From scattered schema knowledge to a governed model workspace</H>
            <div className="csx-closing-versus" data-stagger>
              <article className="csx-closing-card" data-rise>
                <span className="csx-label">Before</span>
                <strong>Fragmented</strong>
                <p>Users depended on SQL files, docs, release notes, tickets, toasts, and team handoffs to understand model state.</p>
              </article>
              <span className="csx-closing-arrow" aria-hidden="true">&rarr;</span>
              <article className="csx-closing-card csx-closing-card--accent" data-rise>
                <span className="csx-label">After</span>
                <strong>Governed</strong>
                <p>Tables, attributes, relationships, policies, procedures, requests, versions, failures, and audit logs live in one inspectable experience.</p>
              </article>
            </div>
            <div className="csx-closing-stats" data-stagger>
              {[
                ['Clearer mental model', 'Available models, enabled models, requests, versions, and logs each have a separate job.'],
                ['Safer activation', 'Enablement shows timing, progress, retry, abort, success, and post-enable verification.'],
                ['Stronger governance', 'Schema extension becomes metadata-rich, reviewable work instead of raw DDL with late feedback.'],
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
              The hardest part was not drawing a table list or ERD. It was naming the real system states behind them: VCS branches, Liquibase deployment, Snowflake procedures, PHI/PII rules, domain lifecycle, request ownership, and rollback risk.
            </p>
            <p className="csx-quote" data-rise>When the backend workflow is complex, the UX must clarify state, ownership, and consequence at every step.</p>
          </div>
        </section>

        <Marquee items={['DATA MODEL EXPLORER', 'AVAILABLE IS NOT ENABLED', 'REQUESTS ARE NOT VERSIONS', 'STATE IS PRODUCT LANGUAGE']} />
      </main>

      <ExperienceFooter>Innovaccer Gravity · Data Model Explorer · Enterprise data platform UX</ExperienceFooter>
    </div>
  );
}
