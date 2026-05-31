import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './case-study.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ---------------------------------------------------------------------------
// Chart theme — ECharts options on the light, editorial surface. Data is
// identical to the source brief; colours/axes/fonts re-skinned for light mode.
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
  slate: '#c2c5cc',
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
      color: [P.orange, P.blue], tooltip,
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
      color: [P.green, P.orange], tooltip,
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
      color: [P.blue, P.orange], tooltip, legend: { top: 0, right: 0, textStyle: chartText, itemWidth: 12, itemHeight: 12 }, grid: { left: 18, right: 32, top: 58, bottom: 46, containLabel: true },
      xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: P.hairline, type: 'dashed' } }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: P.body, formatter: '{value}%' } },
      yAxis: { type: 'category', inverse: true, data: ['Case & Care Mgmt', 'Outreach Module', 'DAP & Analytics'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: P.body, width: 116, overflow: 'break' } },
      series: [
        { name: 'MDS-fixable', type: 'bar', stack: 'total', data: [61.5, 51.3, 36.1], barWidth: 30, itemStyle: { borderRadius: [14, 0, 0, 14] }, emphasis: { focus: 'series' }, blur: { itemStyle: { opacity: 0.4 } }, label: { show: true, position: 'insideLeft', formatter: '{c}%', color: P.white, fontWeight: 700, fontFamily: FONT } },
        { name: 'Product-team', type: 'bar', stack: 'total', data: [38.5, 48.7, 63.9], barWidth: 30, itemStyle: { borderRadius: [0, 14, 14, 0] }, emphasis: { focus: 'series' }, blur: { itemStyle: { opacity: 0.4 } }, label: { show: true, position: 'insideRight', formatter: '{c}%', color: '#3a2607', fontWeight: 700, fontFamily: FONT } },
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

// --- Heading with clip-up reveal mask -------------------------------------
function H({ id, level = 2, children }: { id?: string; level?: 1 | 2; children: ReactNode }) {
  const Tag = level === 1 ? 'h1' : 'h2';
  return (
    <Tag id={id} className="cs-h">
      <span className="cs-h-inner" data-h-inner>{children}</span>
    </Tag>
  );
}

export default function CaseStudy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  // ---- Motion system (GSAP + ScrollTrigger) -------------------------------
  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      gsap.set(root.querySelectorAll('[data-h-inner],[data-rise]'), { clearProps: 'all', autoAlpha: 1, y: 0 });
      return;
    }

    // Masked heading reveal — text rises out from behind its clip.
    gsap.utils.toArray<HTMLElement>('[data-h-inner]').forEach((inner) => {
      gsap.from(inner, {
        yPercent: 116,
        duration: 1.15,
        ease: 'expo.out',
        scrollTrigger: { trigger: inner.parentElement, start: 'top 88%' },
      });
    });

    // Staggered "mass" rise for grouped content (grids, kpi rows…).
    const claimed = new Set<HTMLElement>();
    gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
      const items = gsap.utils.toArray<HTMLElement>('[data-rise]', group);
      items.forEach((i) => claimed.add(i));
      gsap.from(items, {
        y: 54, autoAlpha: 0, scale: 0.985,
        duration: 0.9, ease: 'power3.out', stagger: 0.085,
        scrollTrigger: { trigger: group, start: 'top 82%' },
      });
    });

    // Individual rises (eyebrows, ledes, lone panels).
    gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
      if (claimed.has(el)) return;
      gsap.from(el, {
        y: 44, autoAlpha: 0,
        duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' },
      });
    });

    // Depth parallax — decorative layers drift against the scroll.
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const depth = parseFloat(el.dataset.parallax || '1');
      gsap.fromTo(el,
        { yPercent: 9 * depth },
        { yPercent: -9 * depth, ease: 'none', scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
      );
    });

    // Count-up on big numerics.
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
  }, { scope: rootRef });

  // ---- Scroll progress + charts (lazy ECharts) ----------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Compliance for Masala Design System — Atulya';

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = rootRef.current;
    let disposed = false;
    const charts: Array<{ node: HTMLElement; chart: { resize: () => void; clear: () => void; setOption: (o: unknown, b?: boolean) => void; dispose: () => void }; built: Record<string, unknown>; drawn: boolean }> = [];
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

      // Init each chart EMPTY — it stays blank until scrolled into view, then
      // draws/grows in with a per-series stagger. Guarantees the "load up"
      // happens on screen, every time, instead of unseen on mount.
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
        // Reduced motion / no IO: draw everything statically up front.
        charts.forEach((c) => { (c.chart.setOption as (o: unknown) => void)({ ...c.built, animation: false }); c.drawn = true; });
      }

      window.addEventListener('resize', onResize);
    });

    return () => {
      disposed = true;
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      observers.forEach((o) => o.disconnect());
      charts.forEach((c) => c.chart.dispose());
    };
  }, []);

  return (
    <div className="cs-root" ref={rootRef}>
      <div className="cs-progress" aria-hidden="true"><span ref={progressRef} /></div>

      <header className="cs-topbar">
        <a className="cs-back" href="#/">
          <span className="cs-back-arrow" aria-hidden="true">←</span>
          <span>Back to portfolio</span>
        </a>
        <span className="cs-topbar-tag">Masala Design System</span>
      </header>

      <main className="cs-main">
        {/* ===== HERO ===== */}
        <section className="cs-section cs-hero" aria-labelledby="cs-hero-title">
          <span className="cs-ghost" data-parallax="1.6" aria-hidden="true">AA</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>WCAG 2.2 AA · Section 508</p>
            <H id="cs-hero-title" level={1}>Compliance for Masala Design System</H>
            <p className="cs-lede cs-hero-lede" data-rise>How a small team took Innovaccer's Masala Design System from 27.6% to 100% compliance and pulled 20+ healthcare products along with it.</p>

            <div className="cs-meta-grid" aria-label="Project metadata" data-stagger>
              <div className="cs-meta-item" data-rise><span className="cs-label">Role</span><span className="cs-meta-value">Product Designer</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Surface</span><span className="cs-meta-value">110+ components</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Duration</span><span className="cs-meta-value">Oct 2025 - Apr 2026</span></div>
              <div className="cs-meta-item" data-rise><span className="cs-label">Stack</span><span className="cs-meta-value">React · TS · jest-axe</span></div>
            </div>

            <div className="cs-kpi-grid" aria-label="Hero KPIs" data-stagger>
              <article className="cs-kpi-card cs-kpi-feature" data-rise>
                <span className="cs-label">Baseline to current</span>
                <div>
                  <div className="cs-kpi-value cs-kpi-range" aria-label="27.6% to 100%"><span>27.6%</span><span className="cs-range-sep" aria-hidden="true">→</span><strong>100%</strong></div>
                  <p className="cs-kpi-hint">WCAG 2.2 AA and Section 508 compliance.</p>
                </div>
              </article>
              <article className="cs-kpi-card" data-rise>
                <span className="cs-label">Issues catalogued</span>
                <div><div className="cs-kpi-value"><span data-count="520" data-suffix="+">520+</span></div><p className="cs-kpi-hint">193 Deque issues plus 327 source-aware findings.</p></div>
              </article>
              <article className="cs-kpi-card" data-rise>
                <span className="cs-label">Components rebuilt</span>
                <div><div className="cs-kpi-value"><span data-count="99">99</span></div><p className="cs-kpi-hint">Atoms, molecules, and organisms corrected at root.</p></div>
              </article>
              <article className="cs-kpi-card" data-rise>
                <span className="cs-label">Products inheriting</span>
                <div><div className="cs-kpi-value"><span data-count="20" data-suffix="+">20+</span></div><p className="cs-kpi-hint">Every Innovaccer product starts from the same foundation.</p></div>
              </article>
            </div>
          </div>
        </section>

        {/* ===== 02 CONTEXT ===== */}
        <section className="cs-section" id="context" aria-labelledby="cs-context-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">02</span>
          <div className="cs-inner cs-split">
            <div className="cs-copy">
              <p className="cs-eyebrow" data-rise>02 · Context</p>
              <H id="cs-context-title">Why 27.6% was worse than it sounded</H>
              <p className="cs-lede" data-rise>Healthcare products carry statutory accessibility obligations. Every Innovaccer product is built on MDS, so a single missing ARIA state can ship to every customer.</p>
              <p data-rise>A Deque audit flagged 193 issues on MDS and 3,823 more across three flagship products. We added a parallel source-aware audit that could trace prop flows, refs, composition, and ARIA relationships inside the design system codebase.</p>
            </div>
            <aside className="cs-panel" data-rise>
              <div className="cs-panel-header">
                <div className="cs-panel-title"><span className="cs-label">Baseline ledger</span><h3>Before the rebuild</h3></div>
              </div>
              <div className="cs-ledger-grid" role="list" aria-label="Baseline metrics">
                <div className="cs-ledger-hero" role="listitem"><span className="cs-label">Compliance</span><div className="cs-kpi-value">27.6%</div></div>
                <div className="cs-ledger-stat" role="listitem"><span className="cs-label">MDS Deque audit</span><div className="cs-kpi-value">193</div></div>
                <div className="cs-ledger-stat" role="listitem"><span className="cs-label">AI-skill audit</span><div className="cs-kpi-value">327</div></div>
                <div className="cs-ledger-stat" role="listitem"><span className="cs-label">Products at risk</span><div className="cs-kpi-value">20+</div></div>
              </div>
              <p className="cs-chart-summary">One focus-ring token change closed 262 downstream violations across audited products.</p>
            </aside>
          </div>
        </section>

        {/* ===== 03 AUDIT ===== */}
        <section className="cs-section" id="audit" aria-labelledby="cs-audit-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">03</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>03 · Audit Depth</p>
            <H id="cs-audit-title">Two audits, two vantage points</H>
            <div className="cs-audit-cards" data-stagger>
              <article className="cs-audit-card" data-rise>
                <span className="cs-label">Deque axe auditor</span>
                <div className="cs-audit-number"><span data-count="193">193</span></div>
                <p>Across 14 success criteria on MDS, strongest on what the rendered page exposes: contrast, labels, heading semantics.</p>
              </article>
              <article className="cs-audit-card" data-rise>
                <span className="cs-label">Source-aware audit</span>
                <div className="cs-audit-number"><span data-count="327">327</span></div>
                <p>Across 54 success criteria, tagged to exact code paths and strongest on ARIA, keyboard, focus, and composition invariants.</p>
              </article>
            </div>
            <div className="cs-panel" data-rise style={{ marginTop: 24 }}>
              <div className="cs-panel-header">
                <div className="cs-panel-title"><span className="cs-label">Issues by success criterion</span><h3>Rendered audit vs source-aware audit</h3></div>
              </div>
              <div className="cs-chart cs-chart-tall" data-chart="auditChart" role="img" aria-label="Bar chart comparing Deque and source-aware audit findings by WCAG success criterion." />
              <p className="cs-chart-summary">The source-aware audit found the largest gaps in Info &amp; Relationships, Name Role Value, and Keyboard, while Deque was stronger on rendered contrast and heading issues.</p>
            </div>
          </div>
        </section>

        {/* ===== 04 METHOD ===== */}
        <section className="cs-section" id="method" aria-labelledby="cs-method-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">04</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>04 · Method</p>
            <H id="cs-method-title">A code-aware audit pipeline</H>
            <div className="cs-method-list" data-stagger>
              {[
                ['01', 'Custom Claude skills', <>Component-specific prompts read <code>core/components/**</code> directly, following composition, prop plumbing, ref flows, and portal boundaries.</>],
                ['02', 'Automated contrast script', <>Every SCSS and TSX token pair was checked across default, hover, active, focus, and disabled states against a WCAG AA contrast budget.</>],
                ['03', 'AI-reviewed exceptions', <>Decorative, disabled, and icon-as-text cases were routed through a context-aware classifier instead of a blunt contrast heuristic.</>],
                ['04', 'Design research pass', <>Spectrum, Carbon, Material, Polaris, and WAI-ARIA patterns were compared before choosing remediation patterns.</>],
                ['05', 'Design to Figma MCP to Codex review', <>Design moved to code, PRs were reviewed for ARIA and keyboard gaps, and the cycle repeated until no review flags remained.</>],
              ].map(([idx, title, body]) => (
                <article className="cs-method-item" data-rise key={idx as string}>
                  <span className="cs-method-index">{idx}</span>
                  <div><h3>{title}</h3><p>{body}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 05 BENCHMARK ===== */}
        <section className="cs-section" id="benchmark" aria-labelledby="cs-benchmark-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">05</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>05 · Benchmark</p>
            <H id="cs-benchmark-title">We studied the best before fixing ours</H>
            <p className="cs-lede" data-rise>The goal was not to copy large design systems. It was to identify where MDS could exceed them in developer ergonomics and accessibility resilience.</p>
            <div className="cs-benchmark" role="table" aria-label="Benchmark comparison across design systems" data-rise>
              <div className="cs-bench-row cs-bench-head" role="row">
                <div role="columnheader">Pattern</div><div role="columnheader">Spectrum</div><div role="columnheader">Carbon</div><div role="columnheader">Material</div><div role="columnheader">Polaris</div><div role="columnheader">MDS now</div>
              </div>
              {[
                ['Auto-labelled clear buttons', 'manual prop', 'manual prop', 'manual prop', 'manual prop', ['Yes', 'mds']],
                ['Overlay stack across full overlay family', 'per primitive', 'No', 'Modal only', 'No', ['Yes', 'mds']],
                ['Native checkbox with switch semantics', ['Yes', 'win'], 'button-based', ['Yes', 'win'], 'No primitive', ['Yes', 'mds']],
                ['Forced-colors coverage across stateful components', 'partial', 'partial', 'minimal', 'minimal', ['19 components', 'mds']],
                ['Repo-shipped custom audit skill', 'No', 'No', 'No', 'No', ['Yes', 'mds']],
              ].map((row, ri) => (
                <div className="cs-bench-row" role="row" key={ri}>
                  {row.map((cell, ci) => {
                    const [text, cls] = Array.isArray(cell) ? cell : [cell, ''];
                    return <div key={ci} className={cls ? `cs-bench-${cls}` : undefined}>{text}</div>;
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 06 INVENTORY ===== */}
        <section className="cs-section" id="inventory" aria-labelledby="cs-inventory-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">06</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise><span className="cs-eyebrow-muted">06 ·</span> <span className="cs-eyebrow-accent">Inventory</span></p>
            <H id="cs-inventory-title"><span className="cs-head-stat">327</span> issues classified and prioritised</H>
            <p className="cs-lede" data-rise>Every finding was tagged by severity, component, success criterion, and fix path. The work became an engineering backlog, not a vague accessibility wishlist.</p>
            <p data-rise>54 success criteria, 55 components, and 100% tracked to closure.</p>
            <div className="cs-panel" data-rise style={{ marginTop: 32 }}>
              <div className="cs-panel-header"><div className="cs-panel-title"><span className="cs-label">Severity split</span><h3>P0, P1, P2 distribution</h3></div></div>
              <div className="cs-chart cs-chart-short" data-chart="severityChart" role="img" aria-label="Donut chart showing 34 P0 critical, 144 P1 high, and 149 P2 medium findings." />
              <p className="cs-chart-summary">P1 and P2 made up most of the backlog, but P0s blocked core interaction and received first-pass priority.</p>
            </div>
            <div className="cs-panel" data-rise style={{ marginTop: 24 }}>
              <div className="cs-panel-header"><div className="cs-panel-title"><span className="cs-label">Top components</span><h3>Issue count by severity</h3></div></div>
              <div className="cs-chart" data-chart="componentChart" role="img" aria-label="Stacked bar chart showing the top ten components by accessibility issue count." />
              <p className="cs-chart-summary">Shared primitive fixes mattered: fixing the shared ListBody primitive closed P0 issues in Select, Combobox, Menu, and Listbox together.</p>
            </div>
          </div>
        </section>

        {/* ===== 07 ARCHITECTURE ===== */}
        <section className="cs-section" id="architecture" aria-labelledby="cs-arch-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">07</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>07 · Architecture</p>
            <H id="cs-arch-title">Nine choices that repaid themselves across the system</H>
            <div className="cs-architecture-grid" data-stagger>
              {[
                ['01', 'Auto-labelled clear buttons', 'Derived clear-button names from labels developers already wrote, avoiding a new prop every consumer would forget.', 'Input · Chip · Combobox'],
                ['02', 'useAccessibilityProps', 'Interactive attributes are gated behind real interaction, preventing decorative icons from becoming fake controls.', 'Icon · StatusHint · Card'],
                ['03', 'OverlayManager', 'A singleton stack lets overlays ask whether they are on top before handling Escape.', 'Modal · Tooltip · Dropdown'],
                ['04', 'Focus trap respecting inert', 'The trap skips inert ancestors, supports static heading focus, and avoids restoring focus under newer dialogs.', 'Modal · Sidesheet · Popper'],
                ['05', 'View-aware calendar labels', 'Chevron labels now change by calendar view: month, year, or year block.', 'Calendar · DatePicker'],
                ['06', 'Hydration-safe unique IDs', 'Lazy refs created stable IDs without random churn, module counters, or a React 18 dependency.', 'Input · Radio · Switch'],
                ['07', 'Adaptive touch-target padding', "Small glyphs stay visually delicate while the interactive target reaches WCAG's 24 by 24 minimum.", 'Input · Tabs · Select'],
                ['08', 'Native checkbox with switch semantics', 'SwitchInput keeps native form behavior while presenting as a WAI-ARIA switch, avoiding a custom div that would break name, value, labels, and form submission.', 'role="switch" · SwitchInput'],
                ['09', 'Forced-colors fallbacks', 'Box-shadow affordances became real borders and outlines in Windows High Contrast Mode.', '19 CSS modules · +421 lines'],
              ].map(([idx, title, body, chip]) => (
                <article className="cs-architecture-card" data-rise key={idx}>
                  <div><span className="cs-label">{idx}</span><h3>{title}</h3><p>{body}</p></div>
                  <span className="cs-code-chip">{chip}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 08 DESIGN ===== */}
        <section className="cs-section" id="design" aria-labelledby="cs-design-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">08</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>08 · Design Changes</p>
            <H id="cs-design-title">Not just code. Design had to move too.</H>
            <p className="cs-lede" data-rise>A lot of the compliance gap sat in visual language: focus rings, selection states, disabled states, and calendar colors.</p>
            <div className="cs-design-grid" aria-label="Design remediation cards" data-stagger>
              {[
                ['Focus', 'Box-shadow to outline with offset', 'Outline survives forced-colors mode and reads cleaner at 200% zoom.', 'SC 2.4.7 · 1.4.11'],
                ['Token', 'Focus token darkened', 'Old #F8F8F8 measured 1.06:1 on white. New #00509f reaches 7.93:1.', '2px offset'],
                ['Selection', 'Corner marker on options', 'Selected state is identifiable without relying on color alone.', 'Select · Menu · Listbox'],
                ['Chips', 'Outline + background + accent', 'Selected and focused chips now carry independent visual cues.', 'SC 1.4.1 · 2.4.7'],
                ['Links', 'Default, subtle, disabled states', 'Hover underline and disabled affordances reduce confusion with body text.', 'SC 1.4.1 · 3.3.1'],
                ['Calendar', 'Palette refresh', 'Today, hover, and selected cells were recomputed against the new contrast budget.', 'Calendar · DatePicker'],
                ['Listbox', 'Sticky drag states', 'Persistent activated states keep selection stable during keyboard and pointer interaction.', 'zero-drift UI'],
              ].map(([label, title, body, chip]) => (
                <article className="cs-design-change" data-rise key={title}>
                  <div><span className="cs-label">{label}</span><h3>{title}</h3><p>{body}</p></div>
                  <span className="cs-code-chip">{chip}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 09 VERIFICATION ===== */}
        <section className="cs-section" id="verification" aria-labelledby="cs-verify-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">09</span>
          <div className="cs-inner cs-split">
            <div className="cs-copy">
              <p className="cs-eyebrow" data-rise>09 · Verification</p>
              <H id="cs-verify-title">Every component carries a jest-axe baseline</H>
              <p className="cs-lede" data-rise>119 test files call <code>toHaveNoViolations</code>. Every shipping component has an axe baseline, and the rule runs in <code>npm test</code>.</p>
              <p data-rise>The wrapper disables the region rule inside isolated RTL tests and toggles real timers around the async engine so Jest fake timers do not deadlock it.</p>
            </div>
            <div className="cs-panel cs-verify-panel" data-rise>
              <span className="cs-label">Guardrail</span>
              <div className="cs-verify-stat"><div className="cs-kpi-value"><span data-count="119">119</span></div></div>
              <p className="cs-chart-summary">axe-tested components and test files. The next milestone is an explicit CI rule blocking new components without coverage.</p>
            </div>
          </div>
        </section>

        {/* ===== 10 IMPACT ===== */}
        <section className="cs-section cs-impact-band" id="impact" aria-labelledby="cs-impact-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">10</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>10 · Impact</p>
            <H id="cs-impact-title">Compliance, measured</H>
            <div className="cs-kpi-grid" data-stagger>
              <article className="cs-kpi-card" data-rise><span className="cs-label">Compliance</span><div className="cs-kpi-value"><span data-count="100" data-suffix="%">100%</span></div><p className="cs-kpi-hint">WCAG 2.2 AA and Section 508.</p></article>
              <article className="cs-kpi-card" data-rise><span className="cs-label">Open defects</span><div className="cs-kpi-value">327 to 0</div><p className="cs-kpi-hint">Every source-aware finding closed.</p></article>
              <article className="cs-kpi-card" data-rise><span className="cs-label">Products inheriting</span><div className="cs-kpi-value"><span data-count="20" data-suffix="+">20+</span></div><p className="cs-kpi-hint">Shared compliance foundation.</p></article>
              <article className="cs-kpi-card" data-rise><span className="cs-label">Axe baselines</span><div className="cs-kpi-value"><span data-count="119">119</span></div><p className="cs-kpi-hint">Regression checks in tests.</p></article>
            </div>
            <div className="cs-panel" data-rise style={{ marginTop: 24 }}>
              <div className="cs-panel-header"><div className="cs-panel-title"><span className="cs-label">Jan 2026 to Apr 2026</span><h3>Compliance rose as open issues fell</h3></div></div>
              <div className="cs-chart" data-chart="impactChart" role="img" aria-label="Line chart showing compliance rising from 27.6 to 100 percent while open issues fall from 520 to 0." />
              <p className="cs-chart-summary">Compliance moved from 27.6% to 100% while open issues dropped from 520 to zero over four months.</p>
            </div>
          </div>
        </section>

        {/* ===== 11 SECTION 508 ===== */}
        <section className="cs-section" id="section-508" aria-labelledby="cs-508-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">11</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>11 · Compliance</p>
            <H id="cs-508-title">WCAG 2.2 AA to Section 508, by construction</H>
            <p className="cs-lede" data-rise>The 2017 ICT Refresh adopts WCAG success criteria by direct reference for web content. Conforming MDS components satisfy the shared foundation federal healthcare customers need.</p>
            <div className="cs-panel" data-rise style={{ marginTop: 32 }}>
              <div className="cs-method-list" data-stagger>
                {[
                  ['501', 'ICT scope', 'MDS components render in the browser and are covered under E205 web content requirements.'],
                  ['E205', 'Web content', 'WCAG 2.2 AA conformance satisfies E205.4 by direct reference.'],
                  ['502', 'AT interoperability', 'Interactive components expose role, state, and name via platform accessibility APIs.'],
                  ['503', 'No visual-only cues', 'Forced-colors work restores states that depended on box-shadow or color alone.'],
                  ['302', 'Keyboard and manipulation', 'Full keyboard reach, roving tabindex, skip-on-Esc, focus trap, and adaptive touch targets cover limited manipulation scenarios.'],
                  ['504', 'Authoring tool status', 'MDS is consumed by authoring tools, not an authoring tool itself, so 504 does not apply directly.'],
                ].map(([idx, title, body]) => (
                  <article className="cs-method-item" data-rise key={idx}>
                    <span className="cs-method-index">{idx}</span>
                    <div><h3>{title}</h3><p>{body}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 12 CROSS-PRODUCT ===== */}
        <section className="cs-section" id="cross-product" aria-labelledby="cs-cross-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">12</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>12 · Cross-Product</p>
            <H id="cs-cross-title">One DS release resolves 51% of downstream audit findings</H>
            <p className="cs-lede" data-rise>Of 3,823 accessibility issues across three audited Innovaccer products, 1,951 traced to MDS root causes and close automatically when a product upgrades.</p>
            <div className="cs-panel" data-rise style={{ marginTop: 32 }}>
              <div className="cs-panel-header"><div className="cs-panel-title"><span className="cs-label">Attribution</span><h3>MDS-fixable vs product-team work</h3></div></div>
              <div className="cs-chart" data-chart="crossProductChart" role="img" aria-label="Stacked bar chart showing MDS-fixable and product-team accessibility issues by product." />
              <p className="cs-chart-summary">Case &amp; Care Management had the largest MDS-owned share at 61.5%; DAP had more product-owned data visualization and custom-pane work.</p>
            </div>
            <div className="cs-split cs-cross-detail">
              <div className="cs-panel" data-rise>
                <div className="cs-panel-header"><div className="cs-panel-title"><span className="cs-label">Top 5 single-fix-many-wins</span><h3>Largest shared closures</h3></div></div>
                <ul className="cs-top-fixes">
                  {[
                    ['01', 'Focus-ring token darkened', '262'],
                    ['02', 'Icon-button accessible names', '191'],
                    ['03', 'Listbox / Combobox ARIA nesting', '142'],
                    ['04', 'Tooltip dismiss-on-Esc + hover-persist', '123'],
                    ['05', 'Keyboard reach on Grid, Stepper, Slider, Combobox', '107'],
                  ].map(([rank, label, val]) => (
                    <li key={rank}><span className="cs-rank">{rank}</span><span>{label}</span><span className="cs-resolved">{val}</span></li>
                  ))}
                </ul>
              </div>
              <div className="cs-panel" data-rise>
                <div className="cs-panel-header"><div className="cs-panel-title"><span className="cs-label">Still product-owned</span><h3>What MDS cannot fix</h3></div></div>
                <div className="cs-chart cs-chart-short" data-chart="cannotFixChart" role="img" aria-label="Bar chart showing product-owned accessibility issue categories that MDS cannot fix." />
              </div>
            </div>
          </div>
        </section>

        {/* ===== 13 NOTES ===== */}
        <section className="cs-section" id="notes" aria-labelledby="cs-notes-title">
          <span className="cs-ghost" data-parallax="1.3" aria-hidden="true">13</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>13 · Notes</p>
            <H id="cs-notes-title">What we would do again, and what we do not claim</H>
            <div className="cs-limits-grid" data-stagger>
              {[
                'We claim WCAG 2.2 AA, not AAA.',
                'We claim 51% of downstream product issues resolve by MDS upgrade, not 100%.',
                'jest-axe baselines exist; a CI block for new components is the next milestone.',
                'The AI-skill audit complemented Deque. It did not replace it.',
              ].map((text, i) => (
                <article className="cs-limit-card" data-rise key={i}><span className="cs-label">Limit</span><p>{text}</p></article>
              ))}
            </div>
            <p className="cs-eyebrow" data-rise style={{ marginTop: 32 }}>Reflections</p>
            <div className="cs-limits-grid" data-stagger style={{ marginTop: 24 }}>
              {[
                ['Reflection 01', <><strong>Audit your own code.</strong> Deque found what paint reveals: contrast, labels, and heading semantics. Source access found what props hide: ARIA relationships, keyboard invariants, and ref flows.</>],
                ['Reflection 02', <><strong>Make the wrong thing harder.</strong> Auto-labelled clear buttons fixed the issue and removed the prop everyone would have forgotten. API design is accessibility design.</>],
                ['Reflection 03', <><strong>Test like it is an invariant.</strong> 119 axe baselines means no one has to remember the rule manually. The CI does, and regressions get caught before shipping.</>],
              ].map(([label, body]) => (
                <article className="cs-limit-card" data-rise key={label as string}><span className="cs-label">{label}</span><p>{body}</p></article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="cs-footer">
        <div className="cs-inner cs-footer-grid">
          <p>Innovaccer · Masala Design System · WCAG 2.2 AA · Section 508</p>
          <button className="cs-back-link" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button>
        </div>
      </footer>
    </div>
  );
}
