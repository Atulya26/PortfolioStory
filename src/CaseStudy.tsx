import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import './case-experience.css';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// ---------------------------------------------------------------------------
// THE SIGNAL — experimental redesign of #/case/mds-accessibility.
// Ten-chapter scroll narrative: pinned hero, tick-rail chapter index,
// horizontal architecture gallery, and a dark pinned impact scene at 100%.
// Fully scoped to this route: new csx-* namespace, own stylesheet.
// ---------------------------------------------------------------------------

const P = {
  ink: '#0a0b0d',
  body: '#5b5e66',
  muted: '#9498a0',
  hairline: '#e7e5df',
  surface: '#ffffff',
  blue: '#2f7bff',
  blueDeep: '#0a5cff',
  red: '#e5484d',
  orange: '#f5871f',
  yellow: '#dca400',
  green: '#16a34a',
  slate: '#9aa3b5',
  slateSoft: '#c3cad6',
  white: '#ffffff',
  tip: '#0b0e13',
};

const FONT = "'Inter', system-ui, sans-serif";
const chartText = { color: P.body, fontFamily: FONT };
const tooltip = {
  trigger: 'axis',
  backgroundColor: P.tip,
  borderColor: 'rgba(255,255,255,0.12)',
  borderWidth: 1,
  borderRadius: 12,
  padding: [10, 12],
  textStyle: { color: P.white, fontSize: 13, fontFamily: FONT },
  axisPointer: { type: 'none' },
};

type ChartDef = { id: string; option: Record<string, unknown> };

const CHARTS: ChartDef[] = [
  {
    id: 'auditChart',
    option: {
      color: [P.slate, P.blue], tooltip,
      legend: { top: 0, right: 0, textStyle: chartText, itemWidth: 12, itemHeight: 12 },
      grid: { left: 156, right: 34, top: 56, bottom: 28 },
      xAxis: { type: 'value', splitLine: { lineStyle: { color: P.hairline, type: 'dashed' } }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: P.body } },
      yAxis: { type: 'category', inverse: true, data: ['Non-Text Contrast', 'Name, Role, Value', 'Headings & Labels', 'Label in Name', 'Contrast (min)', 'Info & Relationships', 'Keyboard', 'Target size', 'Focus visible', 'Focus obscured', 'Dragging alternatives', 'Other SC'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: P.body, width: 132, overflow: 'break' } },
      series: [
        { name: 'Deque axe', type: 'bar', data: [44, 29, 25, 19, 17, 9, 6, 7, 4, 1, 1, 31], barWidth: 10, barGap: '24%', itemStyle: { borderRadius: [0, 8, 8, 0] }, emphasis: { focus: 'series' } },
        { name: 'Source-aware audit', type: 'bar', data: [22, 64, 0, 0, 0, 87, 38, 12, 22, 6, 4, 72], barWidth: 10, itemStyle: { borderRadius: [0, 8, 8, 0] }, emphasis: { focus: 'series' } },
      ],
    },
  },
  {
    id: 'severityChart',
    option: {
      color: [P.red, P.orange, P.yellow],
      tooltip: { trigger: 'item', backgroundColor: P.tip, borderWidth: 0, textStyle: { color: P.white, fontFamily: FONT } },
      legend: { bottom: 8, left: 'center', textStyle: chartText, itemWidth: 12, itemHeight: 12 },
      graphic: [
        { type: 'text', left: 'center', top: '37%', style: { text: '327', textAlign: 'center', textVerticalAlign: 'middle', fill: P.ink, fontSize: 30, fontWeight: 700, fontFamily: FONT }, z: 10 },
        { type: 'text', left: 'center', top: '49%', style: { text: 'issues', textAlign: 'center', textVerticalAlign: 'middle', fill: P.body, fontSize: 13, fontWeight: 600, fontFamily: FONT }, z: 10 },
      ],
      series: [{
        type: 'pie', radius: ['58%', '78%'], center: ['50%', '43%'], padAngle: 3,
        itemStyle: { borderColor: P.surface, borderWidth: 4, borderRadius: 10 },
        label: { color: P.ink, formatter: '{b}\n{c}', fontWeight: 600, fontFamily: FONT },
        labelLine: { length: 12, length2: 8, lineStyle: { color: P.muted } },
        emphasis: { focus: 'self', scale: true, scaleSize: 6 },
        blur: { itemStyle: { opacity: 0.35 } },
        data: [{ value: 34, name: 'P0 Critical' }, { value: 144, name: 'P1 High' }, { value: 149, name: 'P2 Medium' }],
      }],
    },
  },
  {
    id: 'componentChart',
    option: {
      color: [P.red, P.orange, P.yellow], tooltip, legend: { top: 0, right: 0, textStyle: chartText, itemWidth: 12, itemHeight: 12 }, grid: { left: 126, right: 46, top: 56, bottom: 28 },
      xAxis: { type: 'value', splitLine: { lineStyle: { color: P.hairline, type: 'dashed' } }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: P.body } },
      yAxis: { type: 'category', inverse: true, data: ['Dropdown', 'Menu', 'DatePicker', 'Table', 'Listbox', 'Select', 'Combobox', 'FullscreenModal', 'Calendar', 'Input'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: P.body } },
      series: [
        { name: 'P0', type: 'bar', stack: 'total', data: [0, 0, 1, 2, 1, 0, 0, 1, 4, 0], barWidth: 18, emphasis: { focus: 'series' } },
        { name: 'P1', type: 'bar', stack: 'total', data: [5, 5, 3, 5, 3, 4, 4, 5, 1, 4], barWidth: 18, emphasis: { focus: 'series' } },
        { name: 'P2', type: 'bar', stack: 'total', data: [5, 5, 5, 1, 5, 4, 4, 1, 3, 3], barWidth: 18, itemStyle: { borderRadius: [0, 10, 10, 0] }, label: { show: true, position: 'right', formatter: (params: { dataIndex: number }) => [10, 10, 9, 8, 9, 8, 8, 7, 8, 7][params.dataIndex], color: P.ink, fontWeight: 700, fontFamily: FONT }, emphasis: { focus: 'series' } },
      ],
    },
  },
  {
    id: 'impactChart',
    option: {
      color: [P.blue, P.slate], tooltip,
      legend: { top: 12, left: 'center', orient: 'horizontal', itemGap: 52, itemWidth: 16, itemHeight: 10, padding: [10, 16, 14, 16], icon: 'roundRect', textStyle: { color: P.ink, fontSize: 13, fontFamily: FONT }, inactiveColor: P.muted },
      grid: { left: 22, right: 36, top: 82, bottom: 34, containLabel: true },
      xAxis: { type: 'category', data: ["Jan '26", "Feb '26", "Mar '26", "Apr '26"], axisLine: { lineStyle: { color: P.hairline } }, axisTick: { show: false }, axisLabel: { color: P.body } },
      yAxis: [
        { type: 'value', name: 'Compliance %', min: 0, max: 100, nameTextStyle: { color: P.body, padding: [0, 0, 10, 0] }, axisLabel: { color: P.body, formatter: '{value}%' }, splitLine: { lineStyle: { color: P.hairline, type: 'dashed' } } },
        { type: 'value', name: 'Open issues', min: 0, max: 600, nameTextStyle: { color: P.body, padding: [0, 0, 10, 0] }, axisLabel: { color: P.body }, splitLine: { show: false } },
      ],
      series: [
        { name: 'Compliance %', type: 'line', smooth: true, yAxisIndex: 0, data: [27.6, 52, 84, 100], symbol: 'circle', symbolSize: 11, lineStyle: { width: 5 }, areaStyle: { opacity: 0.12 }, itemStyle: { borderWidth: 3, borderColor: P.surface }, emphasis: { focus: 'series', scale: 1.4, lineStyle: { width: 7 } }, blur: { lineStyle: { opacity: 0.25 }, areaStyle: { opacity: 0.04 } }, endLabel: { show: true, formatter: '100%', color: P.ink, fontWeight: 700, fontFamily: FONT } },
        { name: 'Open issues', type: 'line', smooth: true, yAxisIndex: 1, data: [520, 248, 83, 0], symbol: 'circle', symbolSize: 11, lineStyle: { width: 5 }, areaStyle: { opacity: 0.10 }, itemStyle: { borderWidth: 3, borderColor: P.surface }, emphasis: { focus: 'series', scale: 1.4, lineStyle: { width: 7 } }, blur: { lineStyle: { opacity: 0.25 }, areaStyle: { opacity: 0.04 } }, endLabel: { show: true, formatter: '0 open', color: P.ink, fontWeight: 700, fontFamily: FONT } },
      ],
    },
  },
  {
    id: 'crossProductChart',
    option: {
      color: [P.blue, P.slateSoft], tooltip, legend: { top: 0, right: 0, textStyle: chartText, itemWidth: 12, itemHeight: 12 }, grid: { left: 18, right: 32, top: 58, bottom: 46, containLabel: true },
      xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: P.hairline, type: 'dashed' } }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: P.body, formatter: '{value}%' } },
      yAxis: { type: 'category', inverse: true, data: ['Case & Care Mgmt', 'Outreach Module', 'DAP & Analytics'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: P.body, width: 116, overflow: 'break' } },
      series: [
        { name: 'MDS-fixable', type: 'bar', stack: 'total', data: [61.5, 51.3, 36.1], barWidth: 30, itemStyle: { borderRadius: [14, 0, 0, 14] }, emphasis: { focus: 'series' }, blur: { itemStyle: { opacity: 0.4 } }, label: { show: true, position: 'insideLeft', formatter: '{c}%', color: P.white, fontWeight: 700, fontFamily: FONT } },
        { name: 'Product-team', type: 'bar', stack: 'total', data: [38.5, 48.7, 63.9], barWidth: 30, itemStyle: { borderRadius: [0, 14, 14, 0] }, emphasis: { focus: 'series' }, blur: { itemStyle: { opacity: 0.4 } }, label: { show: true, position: 'insideRight', formatter: '{c}%', color: '#475063', fontWeight: 700, fontFamily: FONT } },
      ],
      graphic: [{ type: 'text', right: 24, bottom: 8, style: { text: 'Share of downstream audit issues', fill: P.muted, fontSize: 12, fontFamily: FONT } }],
    },
  },
  {
    id: 'cannotFixChart',
    option: {
      color: [P.blue], tooltip, grid: { left: 128, right: 30, top: 18, bottom: 20 },
      xAxis: { type: 'value', splitLine: { lineStyle: { color: P.hairline, type: 'dashed' } }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: P.body } },
      yAxis: { type: 'category', inverse: true, data: ['Image alts', 'Page titles', 'App contrast', 'Custom ARIA'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: P.body } },
      series: [{
        name: 'Instances', type: 'bar', data: [153, 50, 132, 75], barWidth: 22,
        itemStyle: { borderRadius: [0, 12, 12, 0] },
        emphasis: { focus: 'self' }, blur: { itemStyle: { opacity: 0.4 } },
        label: { show: true, position: 'right', color: P.ink, fontFamily: FONT },
      }],
    },
  },
];

// --- Chapter registry (drives the rail + section meta) ---------------------
const CHAPTERS = [
  { id: 'stakes', num: '01', label: 'Stakes' },
  { id: 'audits', num: '02', label: 'Audits' },
  { id: 'method', num: '03', label: 'Method' },
  { id: 'inventory', num: '04', label: 'Inventory' },
  { id: 'architecture', num: '05', label: 'Architecture' },
  { id: 'design', num: '06', label: 'Design' },
  { id: 'proof', num: '07', label: 'Proof' },
  { id: 'impact', num: '08', label: 'Impact' },
  { id: 'ripple', num: '09', label: 'Ripple' },
  { id: 'notes', num: '10', label: 'Notes' },
];

const ARCH_CARDS: Array<[string, string, string, string]> = [
  ['01', 'Auto-labelled clear buttons', 'Derived clear-button names from labels developers already wrote, avoiding a new prop every consumer would forget.', 'Input · Chip · Combobox'],
  ['02', 'useAccessibilityProps', 'Interactive attributes are gated behind real interaction, preventing decorative icons from becoming fake controls.', 'Icon · StatusHint · Card'],
  ['03', 'OverlayManager', 'A singleton stack lets overlays ask whether they are on top before handling Escape.', 'Modal · Tooltip · Dropdown'],
  ['04', 'Focus trap respecting inert', 'The trap skips inert ancestors, supports static heading focus, and avoids restoring focus under newer dialogs.', 'Modal · Sidesheet · Popper'],
  ['05', 'View-aware calendar labels', 'Chevron labels now change by calendar view: month, year, or year block.', 'Calendar · DatePicker'],
  ['06', 'Hydration-safe unique IDs', 'Lazy refs created stable IDs without random churn, module counters, or a React 18 dependency.', 'Input · Radio · Switch'],
  ['07', 'Adaptive touch-target padding', "Small glyphs stay visually delicate while the interactive target reaches WCAG's 24 by 24 minimum.", 'Input · Tabs · Select'],
  ['08', 'Native checkbox, switch semantics', 'SwitchInput keeps native form behavior while presenting as a WAI-ARIA switch — no custom div breaking name, value, labels, or form submission.', 'role="switch" · SwitchInput'],
  ['09', 'Forced-colors fallbacks', 'Box-shadow affordances became real borders and outlines in Windows High Contrast Mode.', '19 CSS modules · +421 lines'],
];

// --- Sound layer — tiny WebAudio synth, no assets ---------------------------
// Continues the site's xylophone-ish interaction sounds. The context unlocks
// on first user gesture (pointer/key/touch); everything degrades silently.
let audioCtx: AudioContext | null = null;

function ensureAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) {
    try { audioCtx = new AC(); } catch { return null; }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

function tone(ctx: AudioContext, freq: number, at: number, dur: number, peak: number, type: OscillatorType = 'sine') {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(peak, at + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

function soundsAllowed() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Soft ascending major triad — the 100% completion chime. */
function playSuccess() {
  if (!soundsAllowed()) return;
  const ctx = ensureAudio();
  if (!ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime;
  tone(ctx, 523.25, t, 0.6, 0.04);          // C5
  tone(ctx, 659.25, t + 0.09, 0.6, 0.04);   // E5
  tone(ctx, 783.99, t + 0.18, 1.05, 0.05);  // G5
  tone(ctx, 1567.98, t + 0.18, 0.5, 0.012); // G6 shimmer
}

/** Tiny xylophone tick for rail navigation. */
function playTick() {
  if (!soundsAllowed()) return;
  const ctx = ensureAudio();
  if (!ctx || ctx.state !== 'running') return;
  tone(ctx, 1318.5, ctx.currentTime, 0.09, 0.016, 'triangle');
}

// --- Split heading: SplitText target -----------------------------------------
function H({ id, level = 2, className, children }: { id?: string; level?: 1 | 2; className?: string; children: ReactNode }) {
  const Tag = level === 1 ? 'h1' : 'h2';
  return <Tag id={id} className={`csx-h${className ? ` ${className}` : ''}`} data-split>{children}</Tag>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="csx-eyebrow" data-rise><span className="csx-eyebrow-dot" aria-hidden="true" />{children}</p>;
}

function Marquee({ items }: { items: string[] }) {
  const row = items.join('  ·  ') + '  ·  ';
  return (
    <div className="csx-marquee" aria-hidden="true">
      <div className="csx-marquee-track">
        <span>{row}</span><span>{row}</span>
      </div>
    </div>
  );
}

export default function CaseStudy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const railFillRef = useRef<HTMLSpanElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const archRef = useRef<HTMLElement>(null);
  const archTrackRef = useRef<HTMLDivElement>(null);
  const archCountRef = useRef<HTMLSpanElement>(null);
  const impactRef = useRef<HTMLElement>(null);
  const impactCountRef = useRef<HTMLSpanElement>(null);

  // ---- Motion system -------------------------------------------------------
  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      gsap.set(root.querySelectorAll('[data-rise],[data-split],.csx-hero-inner'), { clearProps: 'all', autoAlpha: 1 });
      const counter = impactCountRef.current;
      if (counter) counter.textContent = '100%';
      return;
    }

    const mm = gsap.matchMedia();

    // -- 100% completion ripple: event-fired (not scrubbed) so it always
    //    plays as a crisp one-shot the moment the counter lands.
    const completionEl = root.querySelector<HTMLElement>('.csx-impact-completion');
    const counterWrapEl = root.querySelector<HTMLElement>('.csx-impact-counter');
    let rippleArmed = true;
    const fireRipple = () => {
      if (!rippleArmed) return;
      rippleArmed = false;
      if (completionEl) {
        gsap.fromTo(completionEl,
          { scale: 0.55, autoAlpha: 0.95 },
          { scale: 1.7, autoAlpha: 0, duration: 1.2, ease: 'power2.out', overwrite: true });
      }
      if (counterWrapEl) {
        gsap.fromTo(counterWrapEl,
          { scale: 1 },
          { scale: 1.03, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.inOut', overwrite: 'auto' });
      }
      playSuccess();
    };
    const armRipple = () => { rippleArmed = true; };

    // ======================================================================
    // DESKTOP — full experience (pins, rail, horizontal gallery)
    // ======================================================================
    mm.add('(min-width: 921px)', () => {
      const hero = heroRef.current;

      // -- 1) HERO PIN: headline holds, then calmly drifts away -------------
      if (hero) {
        const heroTl = gsap.timeline({
          scrollTrigger: { trigger: hero, start: 'top top', end: '+=70%', pin: true, scrub: 0.9 },
        });
        heroTl
          .to(hero.querySelector('.csx-hero-inner'), { yPercent: -14, autoAlpha: 0, ease: 'power1.in' }, 0)
          .to(hero.querySelector('.csx-hero-ghost'), { yPercent: -26, autoAlpha: 0, ease: 'none' }, 0)
          .to(hero.querySelector('.csx-scrollcue'), { autoAlpha: 0 }, 0);
      }

      // -- 2) Rail progress fill ---------------------------------------------
      if (railFillRef.current) {
        gsap.fromTo(railFillRef.current, { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
        });
      }

      // -- 3) ARCHITECTURE: pinned horizontal gallery ------------------------
      const arch = archRef.current;
      const track = archTrackRef.current;
      if (arch && track) {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -distance(), ease: 'none',
          scrollTrigger: {
            trigger: arch, start: 'top top', end: () => `+=${distance()}`,
            pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (self) => {
              const counter = archCountRef.current;
              if (counter) {
                const idx = Math.min(ARCH_CARDS.length, Math.max(1, Math.round(self.progress * (ARCH_CARDS.length - 1)) + 1));
                counter.textContent = String(idx).padStart(2, '0');
              }
            },
          },
        });
        gsap.utils.toArray<HTMLElement>('.csx-arch-card', track).forEach((card, i) => {
          gsap.from(card, {
            y: 60, autoAlpha: 0, duration: 0.7, ease: 'power3.out', delay: 0.06 * i,
            scrollTrigger: { trigger: arch, start: 'top 70%' },
          });
        });
      }

      // -- 4) IMPACT: pinned dark detonation ---------------------------------
      const impact = impactRef.current;
      if (impact) {
        const counter = impactCountRef.current;
        const num = { v: 27.6 };
        const impactTl = gsap.timeline({
          scrollTrigger: { trigger: impact, start: 'top top', end: '+=160%', pin: true, scrub: 0.8, anticipatePin: 1 },
        });
        impactTl
          .fromTo(impact.querySelector('.csx-impact-veil'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: 'none' }, 0)
          .fromTo(num, { v: 27.6 }, {
            v: 100, duration: 0.55, ease: 'none',
            onUpdate: () => {
              if (counter) counter.textContent = `${num.v.toFixed(num.v < 100 ? 1 : 0)}%`;
              if (num.v >= 99.4) fireRipple();
              else if (num.v < 92) armRipple();
            },
          }, 0.08)
          .fromTo(impact.querySelectorAll('.csx-impact-ring'), { scale: 0.55, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power1.inOut', stagger: 0.08 }, 0.06)
          .fromTo(impact.querySelector('.csx-impact-baseline'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.05)
          .fromTo(impact.querySelector('.csx-impact-caption'), { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.2 }, 0.46)
          .fromTo(impact.querySelectorAll('.csx-impact-stat'), { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.24, stagger: 0.06 }, 0.62);
      }

      // -- 5) Rail chapter sync (single active item, robust across pins) -----
      const railItems = gsap.utils.toArray<HTMLElement>('[data-rail]');
      const setActive = (id: string | null) => {
        root.classList.toggle('is-dark-rail', id === 'impact');
        const activeIdx = CHAPTERS.findIndex((c) => c.id === id);
        railItems.forEach((el) => {
          const idx = CHAPTERS.findIndex((c) => c.id === el.dataset.rail);
          const dist = activeIdx === -1 || idx === -1 ? Infinity : Math.abs(idx - activeIdx);
          el.classList.toggle('is-active', dist === 0);
          el.classList.toggle('is-near', dist === 1);
        });
      };
      CHAPTERS.forEach((ch, i) => {
        const section = root.querySelector<HTMLElement>(`#${ch.id}`);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActive(ch.id),
          onEnterBack: () => setActive(ch.id),
          onLeaveBack: i === 0 ? () => setActive(null) : undefined,
        });
      });

      // -- 6) Magnetic pills --------------------------------------------------
      const magnets = gsap.utils.toArray<HTMLElement>('.csx-magnetic');
      const cleanups = magnets.map((el) => {
        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo(gsap.utils.clamp(-7, 7, (e.clientX - (r.left + r.width / 2)) * 0.18));
          yTo(gsap.utils.clamp(-5, 5, (e.clientY - (r.top + r.height / 2)) * 0.18));
        };
        const leave = () => { xTo(0); yTo(0); };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
      });

      return () => cleanups.forEach((fn) => fn());
    });

    // ======================================================================
    // ALL VIEWPORTS — kinetic type + rises (mobile gets these, minus pins)
    // ======================================================================
    mm.add('(min-width: 0px)', () => {
      // SplitText char reveals on every heading.
      const splits: SplitText[] = [];
      document.fonts.ready.then(() => {
        gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
          const split = new SplitText(el, { type: 'lines,chars', linesClass: 'csx-line' });
          splits.push(split);
          gsap.from(split.chars, {
            yPercent: 112, duration: 0.9, ease: 'expo.out', stagger: 0.016,
            scrollTrigger: { trigger: el, start: 'top 86%' },
          });
        });
        ScrollTrigger.refresh();
      });

      // Grouped + lone rises.
      const claimed = new Set<HTMLElement>();
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>('[data-rise]', group);
        items.forEach((i) => claimed.add(i));
        gsap.from(items, {
          y: 38, autoAlpha: 0, duration: 0.85, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: group, start: 'top 86%' },
        });
      });
      gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
        if (claimed.has(el)) return;
        gsap.from(el, {
          y: 30, autoAlpha: 0, duration: 0.78, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });

      // Depth parallax on ghosts.
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const depth = parseFloat(el.dataset.parallax || '1');
        gsap.fromTo(el,
          { yPercent: 10 * depth },
          { yPercent: -10 * depth, ease: 'none', scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
        );
      });

      // Count-ups.
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = parseFloat(el.dataset.count || '0');
        const suffix = el.dataset.suffix ?? '';
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end, duration: 1.5, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
          onUpdate: () => { el.textContent = `${Math.round(obj.v)}${suffix}`; },
          onComplete: () => { el.textContent = `${end}${suffix}`; },
        });
      });

      return () => splits.forEach((s) => s.revert());
    });

    // Mobile: impact counter has no pin — give it a simple in-view count-up.
    mm.add('(max-width: 920px)', () => {
      const counter = impactCountRef.current;
      if (!counter) return;
      const num = { v: 27.6 };
      gsap.to(num, {
        v: 100, duration: 1.8, ease: 'power2.inOut',
        scrollTrigger: { trigger: counter, start: 'top 80%' },
        onUpdate: () => { counter.textContent = `${num.v.toFixed(num.v < 100 ? 1 : 0)}%`; },
        onComplete: () => { counter.textContent = '100%'; fireRipple(); },
      });
    });

    return () => mm.revert();
  }, { scope: rootRef });

  // ---- Scroll progress + lazy ECharts --------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Compliance for Masala Design System — Atulya';

    // Unlock WebAudio on the first real gesture so the completion chime can play.
    const unlockAudio = () => { ensureAudio(); };
    window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = rootRef.current;
    let disposed = false;
    const charts: Array<{ node: HTMLElement; chart: { resize: () => void; setOption: (o: unknown, b?: boolean) => void; dispose: () => void }; built: Record<string, unknown>; drawn: boolean }> = [];
    const observers: IntersectionObserver[] = [];

    const updateProgress = () => {
      const bar = progressRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0})`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => charts.forEach((c) => c.chart.resize()), 120);
    };

    import('echarts').then((echarts) => {
      if (disposed || !root) return;
      CHARTS.forEach(({ id, option }) => {
        const node = root.querySelector<HTMLElement>(`[data-chart="${id}"]`);
        if (!node) return;
        const built: Record<string, unknown> = {
          textStyle: chartText,
          animation: !reduce,
          animationDuration: 1150,
          animationEasing: 'cubicOut',
          animationDelay: (i: number) => i * 60,
          ...option,
        };
        const chart = echarts.init(node, null, { renderer: 'svg' });
        charts.push({ node, chart, built, drawn: false });
      });

      const draw = (rec: typeof charts[number]) => {
        if (rec.drawn) return;
        rec.drawn = true;
        rec.chart.resize();
        (rec.chart.setOption as (o: unknown) => void)(rec.built);
      };

      if (!reduce && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const rec = charts.find((c) => c.node === entry.target);
            if (rec) draw(rec);
            obs.unobserve(entry.target);
          });
        }, { threshold: 0.28, rootMargin: '0px 0px -8% 0px' });
        charts.forEach((c) => io.observe(c.node));
        observers.push(io);
      } else {
        charts.forEach((c) => { (c.chart.setOption as (o: unknown) => void)({ ...c.built, animation: false }); c.drawn = true; });
      }

      window.addEventListener('resize', onResize);
    });

    return () => {
      disposed = true;
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      observers.forEach((o) => o.disconnect());
      charts.forEach((c) => c.chart.dispose());
    };
  }, []);

  const jumpTo = (id: string) => {
    playTick();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="csx-root" ref={rootRef}>
      <div className="csx-progress" aria-hidden="true"><span ref={progressRef} /></div>

      {/* Chapter rail (desktop): index ticks + scroll progress */}
      <nav className="csx-rail" aria-label="Chapters">
        <span className="csx-rail-line" aria-hidden="true"><span ref={railFillRef} /></span>
        <ul>
          {CHAPTERS.map((ch) => (
            <li key={ch.id}>
              <button type="button" data-rail={ch.id} onClick={() => jumpTo(ch.id)}>
                <i className="csx-rail-tick" aria-hidden="true" />
                <span className="csx-rail-num">{ch.num}</span>
                <span className="csx-rail-label">{ch.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <header className="csx-topbar">
        <a className="csx-back csx-magnetic" href="#/">
          <span aria-hidden="true">←</span><span>Back to portfolio</span>
        </a>
        <span className="csx-topbar-tag">Masala Design System</span>
      </header>

      <main className="csx-main">
        {/* ================= HERO — ARRIVAL ================= */}
        <section className="csx-hero" ref={heroRef} aria-labelledby="csx-hero-title">
          <span className="csx-hero-ghost" aria-hidden="true">AA</span>
          <div className="csx-hero-inner">
            <Eyebrow>WCAG 2.2 AA · Section 508 · Case study</Eyebrow>
            <H id="csx-hero-title" level={1} className="csx-hero-h">Compliance for Masala Design System</H>
            <p className="csx-hero-lede" data-rise>
              How a small team took Innovaccer's design system from
              <strong> 27.6%</strong> to <strong className="csx-blue">100%</strong> accessibility compliance —
              and pulled 20+ healthcare products along with it.
            </p>
            <div className="csx-hero-meta" data-stagger>
              {[['Role', 'Product Designer'], ['Surface', '110+ components'], ['Duration', 'Oct 2025 – Apr 2026'], ['Stack', 'React · TS · jest-axe']].map(([k, v]) => (
                <div className="csx-meta-pill" data-rise key={k}><span>{k}</span><strong>{v}</strong></div>
              ))}
            </div>
          </div>
          <div className="csx-scrollcue" aria-hidden="true"><span /><p>Scroll</p></div>
        </section>

        <Marquee items={['WCAG 2.2 AA', 'SECTION 508', '110+ COMPONENTS', '20+ PRODUCTS', '520+ ISSUES', '119 AXE BASELINES']} />

        {/* ================= 01 STAKES ================= */}
        <section className="csx-section" id="stakes" aria-labelledby="csx-stakes-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">01</span>
          <div className="csx-inner csx-split csx-split--sticky">
            <div className="csx-copy">
              <Eyebrow>01 · The stakes</Eyebrow>
              <H id="csx-stakes-title">Why 27.6% was worse than it sounded</H>
              <p className="csx-lede" data-rise>Healthcare products carry statutory accessibility obligations. Every Innovaccer product is built on MDS, so a single missing ARIA state can ship to every customer.</p>
              <p data-rise>A Deque audit flagged 193 issues on MDS and 3,823 more across three flagship products. We added a parallel source-aware audit that could trace prop flows, refs, composition, and ARIA relationships inside the design system codebase.</p>
            </div>
            <aside className="csx-panel" data-rise>
              <div className="csx-panel-title"><span className="csx-label">Baseline ledger</span><h3>Before the rebuild</h3></div>
              <div className="csx-ledger" role="list" aria-label="Baseline metrics">
                <div className="csx-ledger-hero" role="listitem"><span className="csx-label">Compliance</span><strong>27.6%</strong></div>
                <div role="listitem"><span className="csx-label">MDS Deque audit</span><strong>193</strong></div>
                <div role="listitem"><span className="csx-label">AI-skill audit</span><strong>327</strong></div>
                <div role="listitem"><span className="csx-label">Products at risk</span><strong>20+</strong></div>
              </div>
              <p className="csx-note">One focus-ring token change closed 262 downstream violations across audited products.</p>
            </aside>
          </div>
        </section>

        {/* ================= 02 AUDITS ================= */}
        <section className="csx-section" id="audits" aria-labelledby="csx-audits-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">02</span>
          <div className="csx-inner">
            <Eyebrow>02 · Audit depth</Eyebrow>
            <H id="csx-audits-title">Two audits, two vantage points</H>
            <div className="csx-versus" data-stagger>
              <article className="csx-versus-card" data-rise>
                <span className="csx-label">Deque axe auditor</span>
                <div className="csx-versus-num"><span data-count="193">193</span></div>
                <p>Across 14 success criteria on MDS, strongest on what the rendered page exposes: contrast, labels, heading semantics.</p>
              </article>
              <span className="csx-versus-vs" data-rise aria-hidden="true">vs</span>
              <article className="csx-versus-card csx-versus-blue" data-rise>
                <span className="csx-label">Source-aware audit</span>
                <div className="csx-versus-num"><span data-count="327">327</span></div>
                <p>Across 54 success criteria, tagged to exact code paths and strongest on ARIA, keyboard, focus, and composition invariants.</p>
              </article>
            </div>
            <div className="csx-panel" data-rise>
              <div className="csx-panel-title"><span className="csx-label">Issues by success criterion</span><h3>Rendered audit vs source-aware audit</h3></div>
              <div className="csx-chart csx-chart-tall" data-chart="auditChart" role="img" aria-label="Bar chart comparing Deque and source-aware audit findings by WCAG success criterion." />
              <p className="csx-note">The source-aware audit found the largest gaps in Info &amp; Relationships, Name Role Value, and Keyboard, while Deque was stronger on rendered contrast and heading issues.</p>
            </div>
          </div>
        </section>

        {/* ================= 03 METHOD ================= */}
        <section className="csx-section" id="method" aria-labelledby="csx-method-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">03</span>
          <div className="csx-inner">
            <Eyebrow>03 · Method</Eyebrow>
            <H id="csx-method-title">A code-aware audit pipeline</H>
            <div className="csx-steps" data-stagger>
              {[
                ['01', 'Custom Claude skills', <>Component-specific prompts read <code>core/components/**</code> directly, following composition, prop plumbing, ref flows, and portal boundaries.</>],
                ['02', 'Automated contrast script', <>Every SCSS and TSX token pair was checked across default, hover, active, focus, and disabled states against a WCAG AA contrast budget.</>],
                ['03', 'AI-reviewed exceptions', <>Decorative, disabled, and icon-as-text cases were routed through a context-aware classifier instead of a blunt contrast heuristic.</>],
                ['04', 'Design research pass', <>Spectrum, Carbon, Material, Polaris, and WAI-ARIA patterns were compared before choosing remediation patterns.</>],
                ['05', 'Design → Figma MCP → Codex review', <>Design moved to code, PRs were reviewed for ARIA and keyboard gaps, and the cycle repeated until no review flags remained.</>],
              ].map(([idx, title, body]) => (
                <article className="csx-step" data-rise key={idx as string}>
                  <span className="csx-step-num">{idx}</span>
                  <div><h3>{title}</h3><p>{body}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 04 INVENTORY ================= */}
        <section className="csx-section" id="inventory" aria-labelledby="csx-inventory-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">04</span>
          <div className="csx-inner">
            <Eyebrow>04 · Inventory</Eyebrow>
            <H id="csx-inventory-title">327 issues, classified and prioritised</H>
            <p className="csx-lede" data-rise>Every finding was tagged by severity, component, success criterion, and fix path. The work became an engineering backlog, not a vague accessibility wishlist — 54 success criteria, 55 components, 100% tracked to closure.</p>
            <div className="csx-duo" data-stagger>
              <div className="csx-panel" data-rise>
                <div className="csx-panel-title"><span className="csx-label">Severity split</span><h3>P0, P1, P2 distribution</h3></div>
                <div className="csx-chart csx-chart-short" data-chart="severityChart" role="img" aria-label="Donut chart showing 34 P0 critical, 144 P1 high, and 149 P2 medium findings." />
                <p className="csx-note">P0s blocked core interaction and received first-pass priority.</p>
              </div>
              <div className="csx-panel" data-rise>
                <div className="csx-panel-title"><span className="csx-label">Top components</span><h3>Issue count by severity</h3></div>
                <div className="csx-chart csx-chart-short" data-chart="componentChart" role="img" aria-label="Stacked bar chart showing the top ten components by accessibility issue count." />
                <p className="csx-note">Fixing the shared ListBody primitive closed P0 issues in Select, Combobox, Menu, and Listbox together.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 05 ARCHITECTURE — horizontal gallery ================= */}
        <section className="csx-arch" id="architecture" ref={archRef} aria-labelledby="csx-arch-title">
          <div className="csx-arch-head">
            <div className="csx-inner">
              <Eyebrow>05 · Architecture</Eyebrow>
              <H id="csx-arch-title">Nine choices that repaid themselves</H>
            </div>
            <span className="csx-arch-count" aria-hidden="true"><span ref={archCountRef}>01</span>/09</span>
          </div>
          <div className="csx-arch-track" ref={archTrackRef}>
            {ARCH_CARDS.map(([idx, title, body, chip]) => (
              <article className="csx-arch-card" key={idx}>
                <span className="csx-arch-num">{idx}</span>
                <div><h3>{title}</h3><p>{body}</p></div>
                <span className="csx-chip">{chip}</span>
              </article>
            ))}
          </div>
        </section>

        {/* ================= 06 DESIGN ================= */}
        <section className="csx-section" id="design" aria-labelledby="csx-design-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">06</span>
          <div className="csx-inner">
            <Eyebrow>06 · Design changes</Eyebrow>
            <H id="csx-design-title">Not just code. Design had to move too.</H>
            <p className="csx-lede" data-rise>A lot of the compliance gap sat in visual language: focus rings, selection states, disabled states, and calendar colors.</p>
            <div className="csx-grid-3" data-stagger>
              {[
                ['Focus', 'Box-shadow to outline with offset', 'Outline survives forced-colors mode and reads cleaner at 200% zoom.', 'SC 2.4.7 · 1.4.11'],
                ['Token', 'Focus token darkened', 'Old #F8F8F8 measured 1.06:1 on white. New #00509f reaches 7.93:1.', '2px offset'],
                ['Selection', 'Corner marker on options', 'Selected state is identifiable without relying on color alone.', 'Select · Menu · Listbox'],
                ['Chips', 'Outline + background + accent', 'Selected and focused chips now carry independent visual cues.', 'SC 1.4.1 · 2.4.7'],
                ['Links', 'Default, subtle, disabled states', 'Hover underline and disabled affordances reduce confusion with body text.', 'SC 1.4.1 · 3.3.1'],
                ['Calendar', 'Palette refresh', 'Today, hover, and selected cells were recomputed against the new contrast budget.', 'Calendar · DatePicker'],
                ['Listbox', 'Sticky drag states', 'Persistent activated states keep selection stable during keyboard and pointer interaction.', 'zero-drift UI'],
              ].map(([label, title, body, chip]) => (
                <article className="csx-card" data-rise key={title}>
                  <div><span className="csx-label">{label}</span><h3>{title}</h3><p>{body}</p></div>
                  <span className="csx-chip">{chip}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 07 PROOF ================= */}
        <section className="csx-section" id="proof" aria-labelledby="csx-proof-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">07</span>
          <div className="csx-inner">
            <Eyebrow>07 · Proof</Eyebrow>
            <H id="csx-proof-title">Benchmarked, tested, and federal-ready</H>
            <p className="csx-lede" data-rise>The goal was not to copy large design systems — it was to identify where MDS could exceed them in developer ergonomics and accessibility resilience.</p>
            <div className="csx-bench" role="table" aria-label="Benchmark comparison across design systems" data-rise>
              <div className="csx-bench-row csx-bench-head" role="row">
                <div role="columnheader">Pattern</div><div role="columnheader">Spectrum</div><div role="columnheader">Carbon</div><div role="columnheader">Material</div><div role="columnheader">Polaris</div><div role="columnheader">MDS now</div>
              </div>
              {[
                ['Auto-labelled clear buttons', 'manual prop', 'manual prop', 'manual prop', 'manual prop', ['Yes', 'mds']],
                ['Overlay stack across full overlay family', 'per primitive', 'No', 'Modal only', 'No', ['Yes', 'mds']],
                ['Native checkbox with switch semantics', ['Yes', 'win'], 'button-based', ['Yes', 'win'], 'No primitive', ['Yes', 'mds']],
                ['Forced-colors coverage across stateful components', 'partial', 'partial', 'minimal', 'minimal', ['19 components', 'mds']],
                ['Repo-shipped custom audit skill', 'No', 'No', 'No', 'No', ['Yes', 'mds']],
              ].map((row, ri) => (
                <div className="csx-bench-row" role="row" key={ri}>
                  {row.map((cell, ci) => {
                    const [text, cls] = Array.isArray(cell) ? cell : [cell, ''];
                    return <div key={ci} className={cls ? `csx-bench-${cls}` : undefined}>{text}</div>;
                  })}
                </div>
              ))}
            </div>
            <div className="csx-split csx-proof-split">
              <div className="csx-copy">
                <h3 data-rise>Every component carries a jest-axe baseline</h3>
                <p data-rise>119 test files call <code>toHaveNoViolations</code>. Every shipping component has an axe baseline, and the rule runs in <code>npm test</code>. The wrapper disables the region rule inside isolated RTL tests and toggles real timers around the async engine so Jest fake timers do not deadlock it.</p>
                <p data-rise>And because the 2017 ICT Refresh adopts WCAG by direct reference, conforming MDS components satisfy Section 508's E205.4 for web content — with role, state, and name exposed via platform accessibility APIs (502), no visual-only cues (503), and full keyboard reach with adaptive touch targets (302).</p>
              </div>
              <div className="csx-panel csx-proof-stat" data-rise>
                <span className="csx-label">Guardrail</span>
                <strong><span data-count="119">119</span></strong>
                <p className="csx-note">axe-tested components and test files. Next milestone: an explicit CI rule blocking new components without coverage.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 08 IMPACT — pinned dark detonation ================= */}
        <section className="csx-impact" id="impact" ref={impactRef} aria-labelledby="csx-impact-title">
          <div className="csx-impact-veil" aria-hidden="true" />
          <div className="csx-impact-rings" aria-hidden="true">
            <i className="csx-impact-ring" /><i className="csx-impact-ring" /><i className="csx-impact-ring" />
            <i className="csx-impact-completion" />
          </div>
          <div className="csx-impact-stage">
            <p className="csx-impact-eyebrow">08 · Impact</p>
            <h2 className="csx-visually-hidden" id="csx-impact-title">Compliance, measured</h2>
            <p className="csx-impact-baseline"><span>Baseline</span><strong>27.6%</strong><i aria-hidden="true">→</i></p>
            <div className="csx-impact-counter" aria-label="Compliance rose from 27.6% to 100%"><span ref={impactCountRef}>27.6%</span></div>
            <p className="csx-impact-caption">WCAG 2.2 AA &amp; Section 508 · four months · zero open defects</p>
            <div className="csx-impact-stats">
              {[
                ['Open defects', '327 → 0', 'Every source-aware finding closed.'],
                ['Products inheriting', '20+', 'Shared compliance foundation.'],
                ['Axe baselines', '119', 'Regression checks in every test run.'],
              ].map(([k, v, hint]) => (
                <div className="csx-impact-stat" key={k}><span className="csx-label">{k}</span><strong>{v}</strong><p>{hint}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="csx-section csx-impact-after" aria-label="Impact over time">
          <div className="csx-inner">
            <div className="csx-panel" data-rise>
              <div className="csx-panel-title"><span className="csx-label">Jan 2026 → Apr 2026</span><h3>Compliance rose as open issues fell</h3></div>
              <div className="csx-chart" data-chart="impactChart" role="img" aria-label="Line chart showing compliance rising from 27.6 to 100 percent while open issues fall from 520 to 0." />
              <p className="csx-note">Compliance moved from 27.6% to 100% while open issues dropped from 520 to zero over four months.</p>
            </div>
          </div>
        </section>

        {/* ================= 09 RIPPLE ================= */}
        <section className="csx-section" id="ripple" aria-labelledby="csx-ripple-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">09</span>
          <div className="csx-inner">
            <Eyebrow>09 · The ripple</Eyebrow>
            <H id="csx-ripple-title">One release resolves 51% of downstream findings</H>
            <p className="csx-lede" data-rise>Of 3,823 accessibility issues across three audited Innovaccer products, 1,951 traced to MDS root causes and close automatically when a product upgrades.</p>
            <div className="csx-panel" data-rise>
              <div className="csx-panel-title"><span className="csx-label">Attribution</span><h3>MDS-fixable vs product-team work</h3></div>
              <div className="csx-chart" data-chart="crossProductChart" role="img" aria-label="Stacked bar chart showing MDS-fixable and product-team accessibility issues by product." />
              <p className="csx-note">Case &amp; Care Management had the largest MDS-owned share at 61.5%; DAP had more product-owned data visualization and custom-pane work.</p>
            </div>
            <div className="csx-duo csx-ripple-duo" data-stagger>
              <div className="csx-panel" data-rise>
                <div className="csx-panel-title"><span className="csx-label">Top 5 single-fix-many-wins</span><h3>Largest shared closures</h3></div>
                <ul className="csx-fixes">
                  {[
                    ['01', 'Focus-ring token darkened', '262'],
                    ['02', 'Icon-button accessible names', '191'],
                    ['03', 'Listbox / Combobox ARIA nesting', '142'],
                    ['04', 'Tooltip dismiss-on-Esc + hover-persist', '123'],
                    ['05', 'Keyboard reach on Grid, Stepper, Slider, Combobox', '107'],
                  ].map(([rank, label, val]) => (
                    <li key={rank}><span className="csx-rank">{rank}</span><span>{label}</span><span className="csx-resolved">{val}</span></li>
                  ))}
                </ul>
              </div>
              <div className="csx-panel" data-rise>
                <div className="csx-panel-title"><span className="csx-label">Still product-owned</span><h3>What MDS cannot fix</h3></div>
                <div className="csx-chart csx-chart-short" data-chart="cannotFixChart" role="img" aria-label="Bar chart showing product-owned accessibility issue categories that MDS cannot fix." />
              </div>
            </div>
          </div>
        </section>

        {/* ================= 10 NOTES ================= */}
        <section className="csx-section" id="notes" aria-labelledby="csx-notes-title">
          <span className="csx-ghost" data-parallax="1.3" aria-hidden="true">10</span>
          <div className="csx-inner">
            <Eyebrow>10 · Notes</Eyebrow>
            <H id="csx-notes-title">What we would do again — and what we do not claim</H>
            <div className="csx-grid-2" data-stagger>
              {[
                'We claim WCAG 2.2 AA, not AAA.',
                'We claim 51% of downstream product issues resolve by MDS upgrade, not 100%.',
                'jest-axe baselines exist; a CI block for new components is the next milestone.',
                'The AI-skill audit complemented Deque. It did not replace it.',
              ].map((text, i) => (
                <article className="csx-card csx-card-limit" data-rise key={i}><span className="csx-label">Limit</span><p>{text}</p></article>
              ))}
            </div>
            <div className="csx-reflections" data-stagger>
              {[
                ['01', 'Audit your own code.', 'Deque found what paint reveals: contrast, labels, heading semantics. Source access found what props hide: ARIA relationships, keyboard invariants, ref flows.'],
                ['02', 'Make the wrong thing harder.', 'Auto-labelled clear buttons fixed the issue and removed the prop everyone would have forgotten. API design is accessibility design.'],
                ['03', 'Test like it is an invariant.', '119 axe baselines means no one has to remember the rule manually. The CI does, and regressions get caught before shipping.'],
              ].map(([n, title, body]) => (
                <article className="csx-reflection" data-rise key={n}>
                  <span className="csx-reflection-num">{n}</span>
                  <p><strong>{title}</strong> {body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Marquee items={['27.6% → 100%', '327 → 0 OPEN DEFECTS', '99 COMPONENTS REBUILT', '51% DOWNSTREAM RESOLVED']} />
      </main>

      <footer className="csx-footer">
        <div className="csx-inner csx-footer-grid">
          <p>Innovaccer · Masala Design System · WCAG 2.2 AA · Section 508</p>
          <div className="csx-footer-actions">
            <a className="csx-back csx-magnetic" href="#/work">More case studies →</a>
            <button className="csx-top-link" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
