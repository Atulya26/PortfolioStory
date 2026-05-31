import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../case-study.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ---------------------------------------------------------------------------
// Shared case-study system — light/editorial chrome, GSAP motion, and
// draw-on-scroll ECharts. Every case study imports these so the style and
// motion stay identical across the set.
// ---------------------------------------------------------------------------

export const FONT = "'Inter', system-ui, sans-serif";
export const P = {
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
export const chartText = { color: P.body, fontFamily: FONT };
export const tooltip = {
  trigger: 'axis',
  backgroundColor: P.tip,
  borderColor: 'rgba(255,255,255,0.12)',
  borderWidth: 1,
  borderRadius: 12,
  padding: [10, 12],
  textStyle: { color: P.white, fontSize: 13, fontFamily: FONT },
  axisPointer: { type: 'none' },
};

export type ChartDef = { id: string; option: Record<string, unknown> };

// Heading with a clip-up reveal mask.
export function H({ id, level = 2, children }: { id?: string; level?: 1 | 2; children: ReactNode }) {
  const Tag = level === 1 ? 'h1' : 'h2';
  return (
    <Tag id={id} className="cs-h">
      <span className="cs-h-inner" data-h-inner>{children}</span>
    </Tag>
  );
}

// Sticky top bar + scroll progress (self-contained).
export function CaseChrome({ tag }: { tag: string }) {
  const progressRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const update = () => {
      const bar = progressRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0})`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return (
    <>
      <div className="cs-progress" aria-hidden="true"><span ref={progressRef} /></div>
      <header className="cs-topbar">
        <a className="cs-back" href="#/work">
          <span className="cs-back-arrow" aria-hidden="true">←</span>
          <span>All work</span>
        </a>
        <span className="cs-topbar-tag">{tag}</span>
      </header>
    </>
  );
}

export function CaseFooter({ children }: { children?: ReactNode }) {
  return (
    <footer className="cs-footer">
      <div className="cs-inner cs-footer-grid">
        <p>{children ?? 'Atulya · Selected work'}</p>
        <button className="cs-back-link" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button>
      </div>
    </footer>
  );
}

// Masked headings + mass-rise stagger + depth parallax + count-ups.
export function useCaseStudyMotion(rootRef: React.RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      gsap.set(root.querySelectorAll('[data-h-inner],[data-rise]'), { clearProps: 'all', autoAlpha: 1, y: 0 });
      return;
    }

    gsap.utils.toArray<HTMLElement>('[data-h-inner]').forEach((inner) => {
      gsap.from(inner, { yPercent: 116, duration: 1.15, ease: 'expo.out', scrollTrigger: { trigger: inner.parentElement, start: 'top 88%' } });
    });

    const claimed = new Set<HTMLElement>();
    gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
      const items = gsap.utils.toArray<HTMLElement>('[data-rise]', group);
      items.forEach((i) => claimed.add(i));
      gsap.from(items, { y: 54, autoAlpha: 0, scale: 0.985, duration: 0.9, ease: 'power3.out', stagger: 0.085, scrollTrigger: { trigger: group, start: 'top 82%' } });
    });

    gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
      if (claimed.has(el)) return;
      gsap.from(el, { y: 44, autoAlpha: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } });
    });

    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const depth = parseFloat(el.dataset.parallax || '1');
      gsap.fromTo(el, { yPercent: 9 * depth }, { yPercent: -9 * depth, ease: 'none', scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    });

    gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
      const end = parseFloat(el.dataset.count || '0');
      const suffix = el.dataset.suffix ?? '';
      const obj = { v: 0 };
      gsap.to(obj, { v: end, duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 86%' }, onUpdate: () => { el.textContent = `${Math.round(obj.v)}${suffix}`; }, onComplete: () => { el.textContent = `${end}${suffix}`; } });
    });
  }, { scope: rootRef });
}

// Draw-on-scroll ECharts. Charts stay empty until scrolled into view, then
// build in with a per-series stagger. Lazy-loaded so the home bundle is lean.
export function useECharts(rootRef: React.RefObject<HTMLElement | null>, charts: ChartDef[]) {
  useEffect(() => {
    if (!charts.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = rootRef.current;
    let disposed = false;
    const built: Array<{ node: HTMLElement; chart: { resize: () => void; setOption: (o: unknown, b?: boolean) => void; dispose: () => void }; opt: Record<string, unknown>; drawn: boolean }> = [];
    const observers: IntersectionObserver[] = [];
    let resizeTimer = 0;
    const onResize = () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => built.forEach((c) => c.chart.resize()), 120); };

    import('echarts').then((echarts) => {
      if (disposed || !root) return;
      charts.forEach(({ id, option }) => {
        const node = root.querySelector<HTMLElement>(`[data-chart="${id}"]`);
        if (!node) return;
        const opt: Record<string, unknown> = { textStyle: chartText, animation: !reduce, animationDuration: 1150, animationEasing: 'cubicOut', animationDelay: (i: number) => i * 60, ...option };
        const chart = echarts.init(node, null, { renderer: 'svg' });
        built.push({ node, chart, opt, drawn: false });
      });
      const draw = (rec: typeof built[number]) => { if (rec.drawn) return; rec.drawn = true; rec.chart.resize(); (rec.chart.setOption as (o: unknown) => void)(rec.opt); };
      if (!reduce && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => { if (!entry.isIntersecting) return; const rec = built.find((c) => c.node === entry.target); if (rec) draw(rec); obs.unobserve(entry.target); });
        }, { threshold: 0.28, rootMargin: '0px 0px -8% 0px' });
        built.forEach((c) => io.observe(c.node));
        observers.push(io);
      } else {
        built.forEach((c) => { (c.chart.setOption as (o: unknown) => void)({ ...c.opt, animation: false }); c.drawn = true; });
      }
      window.addEventListener('resize', onResize);
    });

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      observers.forEach((o) => o.disconnect());
      built.forEach((c) => c.chart.dispose());
    };
  }, [charts]);
}

// Tiny helper for the per-page mount side-effects.
export function useCasePage(title: string) {
  useEffect(() => { window.scrollTo(0, 0); document.title = `${title} — Atulya`; }, [title]);
}
