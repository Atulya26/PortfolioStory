import { useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import '../case-experience.css';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// ---------------------------------------------------------------------------
// THE SIGNAL — shared experience system (csx-* namespace).
//
// Extracted from the mds-accessibility case so every case study can be built
// on one set of chrome, motion, and chart helpers. A case supplies a CHAPTERS
// list, its content as csx-* markup, and (optionally) ECharts defs + a pinned
// dark impact scene. The hooks below find everything by class / data-attribute
// inside the rootRef, so cases stay declarative.
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
  slate: '#9aa3b5',
  slateSoft: '#c3cad6',
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
export type Chapter = { id: string; num: string; label: string };

// --- Sound layer — tiny WebAudio synth, no assets --------------------------
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

/** Soft ascending major triad — the impact completion chime. */
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

// --- Split heading: SplitText target ---------------------------------------
export function H({ id, level = 2, className, children }: { id?: string; level?: 1 | 2; className?: string; children: ReactNode }) {
  const Tag = level === 1 ? 'h1' : 'h2';
  return <Tag id={id} className={`csx-h${className ? ` ${className}` : ''}`} data-split>{children}</Tag>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="csx-eyebrow" data-rise><span className="csx-eyebrow-dot" aria-hidden="true" />{children}</p>;
}

export function Marquee({ items }: { items: string[] }) {
  const row = items.join('  ·  ') + '  ·  ';
  return (
    <div className="csx-marquee" aria-hidden="true">
      <div className="csx-marquee-track">
        <span>{row}</span><span>{row}</span>
      </div>
    </div>
  );
}

// --- Chrome: progress bar + chapter rail + topbar --------------------------
export function ExperienceChrome({ chapters, tag, backHref = '#/', backLabel = 'Back to portfolio' }: {
  chapters: Chapter[];
  tag: string;
  backHref?: string;
  backLabel?: string;
}) {
  const jumpTo = (id: string) => {
    playTick();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <>
      <div className="csx-progress" aria-hidden="true"><span data-progress /></div>

      <nav className="csx-rail" aria-label="Chapters">
        <span className="csx-rail-line" aria-hidden="true"><span data-rail-fill /></span>
        <ul>
          {chapters.map((ch) => (
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
        <a className="csx-back csx-magnetic" href={backHref}>
          <span aria-hidden="true">←</span><span>{backLabel}</span>
        </a>
        <span className="csx-topbar-tag">{tag}</span>
      </header>
    </>
  );
}

export function ExperienceFooter({ children, actions }: { children?: ReactNode; actions?: boolean }) {
  return (
    <footer className="csx-footer">
      <div className="csx-inner csx-footer-grid">
        <p>{children ?? 'Atulya · Selected work'}</p>
        <div className="csx-footer-actions">
          {actions !== false && <a className="csx-back csx-magnetic" href="#/work">More case studies →</a>}
          <button className="csx-top-link" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button>
        </div>
      </div>
    </footer>
  );
}

// --- Motion system ---------------------------------------------------------
// Drives every animated piece by selector inside the root: hero pin, rail
// fill + chapter sync, horizontal architecture gallery (if present), pinned
// dark impact scene (if present), kinetic headings, rises, parallax,
// count-ups, and magnetic pills.
export function useExperience(rootRef: React.RefObject<HTMLElement | null>, { chapters, title }: {
  chapters: Chapter[];
  title: string;
}) {
  // Page mount side-effects: title, scroll reset, audio unlock, progress bar.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${title} — Atulya`;

    const unlockAudio = () => { ensureAudio(); };
    window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });

    const bar = rootRef.current?.querySelector<HTMLElement>('[data-progress]') ?? null;
    const updateProgress = () => {
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0})`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [title, rootRef]);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const impactCounter = root.querySelector<HTMLElement>('[data-impact-counter]');
    const readNum = (el: HTMLElement | null, attr: string, fallback: number) => {
      const v = el ? parseFloat(el.dataset[attr] ?? '') : NaN;
      return Number.isFinite(v) ? v : fallback;
    };
    const impFrom = readNum(impactCounter, 'from', 0);
    const impTo = readNum(impactCounter, 'to', 100);
    const impSuffix = impactCounter?.dataset.suffix ?? '';
    const impDecimals = impactCounter ? parseInt(impactCounter.dataset.decimals ?? '0', 10) || 0 : 0;
    const fmt = (v: number) => `${v.toFixed(v >= impTo ? 0 : impDecimals)}${impSuffix}`;

    if (reduce) {
      gsap.set(root.querySelectorAll('[data-rise],[data-split],.csx-hero-inner'), { clearProps: 'all', autoAlpha: 1 });
      if (impactCounter) impactCounter.textContent = fmt(impTo);
      return;
    }

    const mm = gsap.matchMedia();

    // -- Impact completion ripple (event-fired one-shot) ---------------------
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
      // -- 1) HERO PIN -------------------------------------------------------
      const hero = root.querySelector<HTMLElement>('.csx-hero');
      if (hero) {
        const heroTl = gsap.timeline({
          scrollTrigger: { trigger: hero, start: 'top top', end: '+=70%', pin: true, scrub: 0.9 },
        });
        heroTl
          .to(hero.querySelector('.csx-hero-inner'), { yPercent: -14, autoAlpha: 0, ease: 'power1.in' }, 0)
          .to(hero.querySelector('.csx-hero-ghost'), { yPercent: -26, autoAlpha: 0, ease: 'none' }, 0)
          .to(hero.querySelector('.csx-scrollcue'), { autoAlpha: 0 }, 0);
      }

      // -- 2) Rail progress fill --------------------------------------------
      const railFill = root.querySelector<HTMLElement>('[data-rail-fill]');
      if (railFill) {
        gsap.fromTo(railFill, { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
        });
      }

      // -- 3) ARCHITECTURE: pinned horizontal gallery (optional) -------------
      const arch = root.querySelector<HTMLElement>('.csx-arch');
      const track = arch?.querySelector<HTMLElement>('.csx-arch-track');
      if (arch && track) {
        const cards = gsap.utils.toArray<HTMLElement>('.csx-arch-card', track);
        const countEl = arch.querySelector<HTMLElement>('.csx-arch-count span');
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -distance(), ease: 'none',
          scrollTrigger: {
            trigger: arch, start: 'top top', end: () => `+=${distance()}`,
            pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (self) => {
              if (countEl) {
                const idx = Math.min(cards.length, Math.max(1, Math.round(self.progress * (cards.length - 1)) + 1));
                countEl.textContent = String(idx).padStart(2, '0');
              }
            },
          },
        });
        cards.forEach((card, i) => {
          gsap.from(card, {
            y: 60, autoAlpha: 0, duration: 0.7, ease: 'power3.out', delay: 0.06 * i,
            scrollTrigger: { trigger: arch, start: 'top 70%' },
          });
        });
      }

      // -- 4) IMPACT: pinned dark detonation (optional) ----------------------
      const impact = root.querySelector<HTMLElement>('.csx-impact');
      if (impact && impactCounter) {
        const num = { v: impFrom };
        const range = impTo - impFrom || 1;
        const impactTl = gsap.timeline({
          scrollTrigger: { trigger: impact, start: 'top top', end: '+=160%', pin: true, scrub: 0.8, anticipatePin: 1 },
        });
        impactTl
          .fromTo(impact.querySelector('.csx-impact-veil'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: 'none' }, 0)
          .fromTo(num, { v: impFrom }, {
            v: impTo, duration: 0.55, ease: 'none',
            onUpdate: () => {
              impactCounter.textContent = fmt(num.v);
              const prog = (num.v - impFrom) / range;
              if (prog >= 0.97) fireRipple();
              else if (prog < 0.5) armRipple();
            },
          }, 0.08)
          .fromTo(impact.querySelectorAll('.csx-impact-ring'), { scale: 0.55, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'power1.inOut', stagger: 0.08 }, 0.06)
          .fromTo(impact.querySelector('.csx-impact-baseline'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.05)
          .fromTo(impact.querySelector('.csx-impact-caption'), { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.2 }, 0.46)
          .fromTo(impact.querySelectorAll('.csx-impact-stat'), { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.24, stagger: 0.06 }, 0.62);
      }

      // -- 5) Rail chapter sync ---------------------------------------------
      const railItems = gsap.utils.toArray<HTMLElement>('[data-rail]');
      const setActive = (id: string | null) => {
        const section = id ? root.querySelector<HTMLElement>(`#${id}`) : null;
        root.classList.toggle('is-dark-rail', !!section && section.classList.contains('csx-impact'));
        const activeIdx = chapters.findIndex((c) => c.id === id);
        railItems.forEach((el) => {
          const idx = chapters.findIndex((c) => c.id === el.dataset.rail);
          const dist = activeIdx === -1 || idx === -1 ? Infinity : Math.abs(idx - activeIdx);
          el.classList.toggle('is-active', dist === 0);
          el.classList.toggle('is-near', dist === 1);
        });
      };
      chapters.forEach((ch, i) => {
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

      // -- 6) Magnetic pills -------------------------------------------------
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
    // ALL VIEWPORTS — kinetic type + rises
    // ======================================================================
    mm.add('(min-width: 0px)', () => {
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

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const depth = parseFloat(el.dataset.parallax || '1');
        gsap.fromTo(el,
          { yPercent: 10 * depth },
          { yPercent: -10 * depth, ease: 'none', scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
        );
      });

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

    // Mobile: impact counter has no pin — simple in-view count-up.
    mm.add('(max-width: 920px)', () => {
      if (!impactCounter) return;
      const num = { v: impFrom };
      gsap.to(num, {
        v: impTo, duration: 1.8, ease: 'power2.inOut',
        scrollTrigger: { trigger: impactCounter, start: 'top 80%' },
        onUpdate: () => { impactCounter.textContent = fmt(num.v); },
        onComplete: () => { impactCounter.textContent = fmt(impTo); fireRipple(); },
      });
    });

    return () => mm.revert();
  }, { scope: rootRef });
}

// --- Draw-on-scroll ECharts ------------------------------------------------
export function useExperienceCharts(rootRef: React.RefObject<HTMLElement | null>, charts: ChartDef[]) {
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
  }, [charts, rootRef]);
}
