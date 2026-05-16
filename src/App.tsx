import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, DrawSVGPlugin);

type Runtime = {
  revert: () => void;
  timeline: gsap.core.Timeline | null;
};

type IntroSound = {
  unlock: () => void;
  hit: (strength?: number) => void;
  cascade: () => void;
  bloom: () => void;
  resolve: () => void;
  xylophoneStep: (step: number, total: number, direction?: 'up' | 'down') => void;
  ctaHover: () => void;
  ctaSelect: () => void;
  dispose: () => void;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SPIRAL_SCROLL_DISTANCE = '+=420%';
const SPIRAL_TIMING_REMAP = 300 / 420;

const createIntroSound = (): IntroSound => {
  type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;

  const getContext = () => {
    if (!ctx) {
      const AudioCtor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
      if (!AudioCtor) return null;

      ctx = new AudioCtor();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }

    return ctx;
  };

  const unlock = () => {
    const audio = getContext();
    if (!audio || audio.state === 'running') return;
    void audio.resume();
  };

  const tone = (
    frequency: number,
    start: number,
    duration: number,
    gain: number,
    type: OscillatorType = 'sine',
  ) => {
    const audio = getContext();
    if (!audio || !master || audio.state !== 'running') return;

    const osc = audio.createOscillator();
    const envelope = audio.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(gain, start + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(envelope);
    envelope.connect(master);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  };

  const hit = (strength = 1) => {
    const audio = getContext();
    if (!audio || audio.state !== 'running') return;

    const now = audio.currentTime + 0.01;
    tone(880, now, 0.34, 0.04 * strength);
    tone(1320, now + 0.012, 0.24, 0.018 * strength, 'triangle');
    tone(1760, now + 0.028, 0.16, 0.01 * strength);
  };

  const cascade = () => {
    const audio = getContext();
    if (!audio || audio.state !== 'running') return;

    const now = audio.currentTime + 0.01;
    [740, 860, 1020, 1210, 1460].forEach((frequency, i) => {
      tone(frequency, now + i * 0.075, 0.12, 0.018 - i * 0.0016, i % 2 ? 'triangle' : 'sine');
    });
  };

  const bloom = () => {
    const audio = getContext();
    if (!audio || !master || audio.state !== 'running') return;

    const now = audio.currentTime + 0.01;
    const osc = audio.createOscillator();
    const envelope = audio.createGain();
    const filter = audio.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(96, now);
    osc.frequency.exponentialRampToValueAtTime(168, now + 1.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, now);
    filter.frequency.exponentialRampToValueAtTime(1700, now + 1.08);
    filter.Q.value = 0.65;

    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.028, now + 0.18);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 1.18);

    osc.connect(filter);
    filter.connect(envelope);
    envelope.connect(master);
    osc.start(now);
    osc.stop(now + 1.24);

    tone(380, now + 0.08, 0.75, 0.011, 'triangle');
    tone(760, now + 0.24, 0.56, 0.008);
  };

  const resolve = () => {
    const audio = getContext();
    if (!audio || audio.state !== 'running') return;

    const now = audio.currentTime + 0.01;
    tone(1240, now, 0.22, 0.012, 'triangle');
    tone(1860, now + 0.045, 0.18, 0.009);
  };

  const xylophoneStep = (step: number, total: number, direction: 'up' | 'down' = 'up') => {
    const audio = getContext();
    if (!audio || audio.state !== 'running') return;

    const isDown = direction === 'down';
    const notes = [196, 247, 294, 370, 440, 554, 659, 784, 988];
    const noteIndex = clamp(
      Math.round((step / Math.max(total - 1, 1)) * (notes.length - 1)),
      0,
      notes.length - 1,
    );
    const frequency = notes[noteIndex];
    const now = audio.currentTime + 0.01;
    const lift = step / Math.max(total - 1, 1);
    const gain = isDown ? 0.018 + (1 - lift) * 0.004 : 0.022 + lift * 0.006;

    if (isDown) {
      tone(frequency, now, 0.2, gain, 'triangle');
      tone(frequency * 1.5, now + 0.006, 0.12, gain * 0.18, 'sine');
      tone(frequency * 0.5, now + 0.018, 0.18, gain * 0.22, 'sine');
      return;
    }

    tone(frequency, now, 0.24, gain, 'triangle');
    tone(frequency * 2.01, now + 0.006, 0.15, gain * 0.32, 'sine');
    tone(frequency * 3.02, now + 0.01, 0.09, gain * 0.11, 'sine');
  };

  const ctaHover = () => {
    const audio = getContext();
    if (!audio || audio.state !== 'running') return;

    const now = audio.currentTime + 0.01;
    tone(740, now, 0.16, 0.018, 'triangle');
    tone(1110, now + 0.035, 0.18, 0.013, 'sine');
    tone(1480, now + 0.07, 0.12, 0.007, 'sine');
  };

  const ctaSelect = () => {
    const audio = getContext();
    if (!audio || audio.state !== 'running') return;

    const now = audio.currentTime + 0.01;
    tone(392, now, 0.18, 0.028, 'triangle');
    tone(784, now + 0.025, 0.2, 0.018, 'triangle');
    tone(1568, now + 0.065, 0.16, 0.01, 'sine');
  };

  const dispose = () => {
    void ctx?.close();
    ctx = null;
    master = null;
  };

  return { unlock, hit, cascade, bloom, resolve, xylophoneStep, ctaHover, ctaSelect, dispose };
};

// Split a string into character spans. We deliberately don't wrap each char
// in its own overflow:hidden mask — the parent .word-mask handles clipping,
// and keeping the chars inside a single text run preserves kerning.
function SplitChars({ text, className }: { text: string; className: string }) {
  const chars = useMemo(() => Array.from(text), [text]);
  return (
    <span className={className}>
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className={`intro-char${ch === ' ' ? ' intro-char-space' : ''}`}
          aria-hidden="true"
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

// Real work screenshots — served from /public/cards/. Keep each screenshot's
// source aspect ratio so UI text is never cropped or resampled into a forced
// frame shape.
const cardImages = [
  { src: '/cards/card-1.png', aspect: '1800 / 1102' },
  { src: '/cards/card-2.png', aspect: '1800 / 1250' },
  { src: '/cards/card-3.png', aspect: '4 / 3' },
  { src: '/cards/card-4.png', aspect: '4 / 3' },
  { src: '/cards/card-5.png', aspect: '4 / 3' },
  { src: '/cards/card-6.png', aspect: '4 / 3' },
  { src: '/cards/card-7.png', aspect: '4 / 3' },
  { src: '/cards/card-8.png', aspect: '4 / 3' },
];

const SpiralCards = ({ innerRef }: { innerRef: RefObject<HTMLDivElement | null> }) => {
  return (
    <div className="spiral-cards" ref={innerRef}>
      {cardImages.map((image, i) => (
        <div key={image.src} className="spiral-card" data-index={i} style={{ aspectRatio: image.aspect }}>
          <img
            src={image.src}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority={i < 4 ? 'high' : 'auto'}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const shellRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const ballCoreRef = useRef<HTMLSpanElement>(null);
  const heyMaskRef = useRef<HTMLDivElement>(null);
  const nameMaskRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const lightPortalRef = useRef<HTMLDivElement>(null);
  const lightPortalGridRef = useRef<HTMLDivElement>(null);
  const lightPortalRippleRef = useRef<HTMLCanvasElement>(null);
  const worksTitleRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const spiralSectionRef = useRef<HTMLElement>(null);
  const spiralCardsRef = useRef<HTMLDivElement>(null);
  const experienceCtaRef = useRef<HTMLAnchorElement>(null);
  const experienceLabelRef = useRef<HTMLSpanElement>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const scrollSetupRef = useRef<boolean>(false);
  const manifestoSetupRef = useRef<boolean>(false);
  const experienceSetupRef = useRef<boolean>(false);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);
  const soundRef = useRef<IntroSound | null>(null);
  const spiralSoundStepRef = useRef<number>(-1);
  const ctaHoverSoundAtRef = useRef<number>(0);
  const scrambleTweenRef = useRef<gsap.core.Tween | null>(null);

  const scrambleExperienceLabel = useCallback(() => {
    const label = experienceLabelRef.current;
    if (!label) return;

    scrambleTweenRef.current?.kill();
    scrambleTweenRef.current = gsap.to(label, {
      duration: 0.72,
      ease: 'none',
      scrambleText: {
        text: 'experience more',
        chars: 'lowerCase',
        speed: 0.42,
        revealDelay: 0.05,
        delimiter: '',
      },
    });
  }, []);

  const handleExperienceEnter = useCallback(() => {
    scrambleExperienceLabel();

    const now = performance.now();
    if (now - ctaHoverSoundAtRef.current < 480) return;
    ctaHoverSoundAtRef.current = now;
    soundRef.current?.ctaHover();
  }, [scrambleExperienceLabel]);

  const handleExperienceClick = useCallback(() => {
    soundRef.current?.ctaSelect();
  }, []);

  // ---------- INTRO -------------------------------------------------------
  const runIntro = useCallback(() => {
    const shell = shellRef.current;
    const stage = stageRef.current;
    const ball = ballRef.current;
    const ballCore = ballCoreRef.current;
    const heyMask = heyMaskRef.current;
    const nameMask = nameMaskRef.current;
    const gradient = gradientRef.current;
    const impact = impactRef.current;
    const ring = ringRef.current;
    const flash = flashRef.current;

    if (!shell || !stage || !ball || !ballCore || !heyMask || !nameMask || !gradient || !impact || !ring || !flash) {
      return;
    }

    runtimeRef.current?.revert();
    document.body.dataset.intro = 'playing';
    window.scrollTo(0, 0);

    const heyChars = heyMask.querySelectorAll<HTMLElement>('.intro-char:not(.intro-char-space)');
    const nameChars = nameMask.querySelectorAll<HTMLElement>('.intro-char:not(.intro-char-space)');

    const rect = stage.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const ballSize = clamp(rect.width * 0.02, 24, 44);
    const maxGradientRadius = Math.hypot(rect.width, rect.height) * 1.18;

    const restY = clamp(rect.height * 0.22, 140, 220);
    const apexY = clamp(rect.height * -0.2, -220, -130);
    const firstContactY = clamp(rect.height * -0.06, -64, -42);
    const secondContactY = clamp(rect.height * -0.052, -56, -38);
    const reboundY = clamp(rect.height * -0.22, -240, -150);
    const finalY = rect.height * 0.62; // off-screen below

    const setGradientOrigin = (y: number, radius: number) => {
      gradient.style.setProperty('--gradient-x', `${centerX.toFixed(2)}px`);
      gradient.style.setProperty('--gradient-y', `${(centerY + y).toFixed(2)}px`);
      gradient.style.setProperty('--gradient-radius', `${radius.toFixed(2)}px`);
    };

    const ctx = gsap.context(() => {
      gsap.set(ball, {
        width: ballSize,
        height: ballSize,
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: restY,
        opacity: 1,
        scale: 1,
      });
      gsap.set(ballCore, { scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });
      gsap.set([heyMask, nameMask], { autoAlpha: 0 });
      gsap.set([heyChars, nameChars], { yPercent: 115, rotationX: -55, opacity: 0 });
      gsap.set(impact, { autoAlpha: 0, xPercent: -50, yPercent: -50, x: centerX, y: centerY + firstContactY, scale: 0.6 });
      gsap.set(ring, { autoAlpha: 0, xPercent: -50, yPercent: -50, x: centerX, y: centerY + firstContactY, scale: 0.3 });
      gsap.set(flash, { autoAlpha: 0 });
      gsap.set(gradient, { opacity: 0 });
      setGradientOrigin(finalY, 0);

      const finalize = () => {
        document.body.dataset.intro = 'done';
        // Make sure the gradient sits at full bloom for the scroll phase.
        setGradientOrigin(finalY, maxGradientRadius);
        gsap.set(gradient, { opacity: 1 });
        // Refresh ScrollTrigger so it picks up any layout changes.
        ScrollTrigger.refresh();
      };

      if (prefersReducedMotion()) {
        gsap.set(nameMask, { autoAlpha: 1 });
        gsap.set(nameChars, { yPercent: 0, rotationX: 0, opacity: 1 });
        gsap.set(ball, { opacity: 0 });
        finalize();
        return;
      }

      const fireImpact = (y: number, strength = 1) => {
        gsap.killTweensOf(impact);
        gsap.set(impact, { autoAlpha: 0.55 * strength, x: centerX, y: centerY + y, scale: 0.65 });
        gsap.to(impact, { autoAlpha: 0, scale: 2.1, duration: 0.5, ease: 'power3.out' });
        gsap.killTweensOf(ring);
        gsap.set(ring, { autoAlpha: 0.78 * strength, x: centerX, y: centerY + y, scale: 0.25 });
        gsap.to(ring, { autoAlpha: 0, scale: 2.5 * strength, duration: 0.55, ease: 'power3.out' });
        gsap.fromTo(stage, { y: -3 * strength }, { y: 0, duration: 0.32, ease: 'elastic.out(1, 0.35)' });
      };

      const tl = gsap.timeline({ defaults: { overwrite: 'auto' }, onComplete: finalize });

      // PHASE 1 — anticipation + "hey!" reveal + first impact
      tl
        .to(ballCore, { scaleX: 1.18, scaleY: 0.74, duration: 0.18, ease: 'power2.out' }, 0)
        .to(ballCore, { scaleX: 1, scaleY: 1, duration: 0.12, ease: 'power2.in' }, 0.18)
        .set(heyMask, { autoAlpha: 1 }, 0.22)
        .to(ball, { y: apexY, duration: 0.6, ease: 'power2.out' }, 0.22)
        .to(ballCore, { scaleX: 0.88, scaleY: 1.18, duration: 0.22, ease: 'power2.out' }, 0.22)
        .to(ballCore, { scaleX: 1, scaleY: 1, duration: 0.22, ease: 'power2.in' }, 0.58)
        .to(heyChars, { yPercent: 0, rotationX: 0, opacity: 1, duration: 0.55, ease: 'expo.out', stagger: 0.04 }, 0.3)
        .to(ball, { y: firstContactY, duration: 0.44, ease: 'power2.in' }, 0.82)
        .to(ballCore, { scaleX: 0.9, scaleY: 1.15, duration: 0.3, ease: 'power2.in' }, 0.9)
        .call(() => {
          fireImpact(firstContactY, 0.85);
          soundRef.current?.hit(0.78);
        }, [], 1.26)
        .to(ballCore, { scaleX: 1.5, scaleY: 0.52, duration: 0.07, ease: 'power3.out' }, 1.25)
        .to(heyChars, { yPercent: -4, duration: 0.08, ease: 'power2.out', stagger: 0.005 }, 1.26)
        .to(ballCore, { scaleX: 1, scaleY: 1, duration: 0.34, ease: 'elastic.out(1, 0.48)' }, 1.32)
        .to(heyChars, { yPercent: 0, duration: 0.26, ease: 'elastic.out(1, 0.5)', stagger: 0.004 }, 1.34);

      // PHASE 2 — continuous arc, no pause
      tl
        .to(ball, { y: reboundY, duration: 0.48, ease: 'power2.out' }, 1.3)
        .to(ballCore, { scaleX: 0.9, scaleY: 1.14, duration: 0.22, ease: 'power2.out' }, 1.3)
        .to(ballCore, { scaleX: 1, scaleY: 1, duration: 0.22, ease: 'power2.in' }, 1.58)
        .to(heyChars, { yPercent: -115, rotationX: 55, opacity: 0, duration: 0.38, ease: 'power3.in', stagger: 0.025 }, 1.34)
        .set(nameMask, { autoAlpha: 1 }, 1.62)
        .to(nameChars, { yPercent: 0, rotationX: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.035 }, 1.66)
        .to(ball, { y: secondContactY, duration: 0.6, ease: 'power2.in' }, 1.78)
        .to(ballCore, { scaleX: 0.88, scaleY: 1.2, duration: 0.34, ease: 'power2.in' }, 1.92)
        .call(() => {
          fireImpact(secondContactY, 1);
          soundRef.current?.hit(0.9);
        }, [], 2.38)
        .to(ballCore, { scaleX: 1.55, scaleY: 0.5, duration: 0.07, ease: 'power3.out' }, 2.37)
        .to(nameChars, { yPercent: -4, duration: 0.08, ease: 'power2.out', stagger: 0.004 }, 2.38)
        .to(ballCore, { scaleX: 1, scaleY: 1, duration: 0.32, ease: 'elastic.out(1, 0.5)' }, 2.44)
        .to(nameChars, { yPercent: 0, duration: 0.26, ease: 'elastic.out(1, 0.5)', stagger: 0.004 }, 2.46);

      // PHASE 3 — final fall off-screen + bloom
      tl
        .to(ball, { y: -110, duration: 0.36, ease: 'power2.out' }, 2.44)
        .to(ballCore, { scaleX: 0.92, scaleY: 1.12, duration: 0.22, ease: 'power2.out' }, 2.44)
        .to(nameChars, { yPercent: -115, rotationX: 55, opacity: 0, duration: 0.44, ease: 'power3.in', stagger: 0.022 }, 2.56)
        .to(ball, { y: finalY, duration: 1.0, ease: 'power2.in' }, 2.78)
        .to(ballCore, { scaleX: 0.84, scaleY: 1.28, duration: 0.55, ease: 'power2.in' }, 2.86)
        .call(() => soundRef.current?.cascade(), [], 3.46)
        .call(() => setGradientOrigin(finalY, 0), [], 3.7)
        .to(flash, { autoAlpha: 0.85, duration: 0.14, ease: 'power2.out' }, 3.72)
        .to(flash, { autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, 3.86)
        .to(ball, { scale: 5.6, opacity: 0, duration: 0.7, ease: 'power3.out' }, 3.74)
        .call(() => soundRef.current?.bloom(), [], 3.74)
        .to(gradient, { opacity: 1, duration: 0.35, ease: 'power2.out' }, 3.74)
        .to(
          { radius: 0 },
          {
            radius: maxGradientRadius,
            duration: 1.2,
            ease: 'power3.out',
            onUpdate() {
              setGradientOrigin(finalY, this.targets()[0].radius);
            },
            onComplete() {
              soundRef.current?.resolve();
            },
          },
          3.74,
        );

      runtimeRef.current = { revert: () => ctx.revert(), timeline: tl };
    }, shell);

    if (!runtimeRef.current) {
      runtimeRef.current = { revert: () => ctx.revert(), timeline: null };
    }
  }, []);

  // Keep an internal skip (used by reduced-motion + keyboard escape hatch).
  const skip = useCallback(() => {
    const tl = runtimeRef.current?.timeline;
    if (tl) tl.progress(1);
  }, []);

  // ---------- SCROLL PHASE (spiral + gradient drain + grid emerge) ---------
  const setupScrollPhase = useCallback(() => {
    const section = spiralSectionRef.current;
    const cardsRoot = spiralCardsRef.current;
    const gradient = gradientRef.current;
    const grid = gridRef.current;
    const worksTitle = worksTitleRef.current;
    if (!section || !cardsRoot || !gradient || !grid || !worksTitle) return;

    if (scrollSetupRef.current) return;
    scrollSetupRef.current = true;

    const cards = Array.from(cardsRoot.querySelectorAll<HTMLElement>('.spiral-card'));
    const total = cards.length;

    // Pre-position cards off-screen below.
    gsap.set(cards, { xPercent: -50, yPercent: -50, opacity: 0, force3D: true });
    gsap.set(grid, { opacity: 0, y: 80 });
    const worksTitleChars = worksTitle.querySelectorAll<HTMLElement>('.intro-char:not(.intro-char-space)');
    gsap.set(worksTitle, { autoAlpha: 0 });
    gsap.set(worksTitleChars, { yPercent: 115, rotationX: -34, opacity: 0 });

    const placeCards = (t: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // ---- Cylinder model -------------------------------------------------
      // All cards live on a single vertical cylinder. The cylinder rotates
      // around its Y axis AND translates upward as scroll progresses.
      // - radius: how wide the carousel is (cards orbit this far from axis)
      // - spacing: vertical distance between cards on the cylinder
      // - rotations: total turns of the cylinder over the full scroll
      const radius = clamp(vw * 0.17, 200, 340);
      // Generous vertical spacing so neighbouring cards never crowd each
      // other — they sit clearly apart on the cylinder.
      const spacing = vh * 0.55;
      const rotations = 1.1;

      const cylinderHeight = (total - 1) * spacing;
      // Smaller entry buffer = first card arrives ~20% sooner after scrolling.
      const entryBuffer = vh * 0.56;
      const exitBuffer = vh * 0.7;
      const totalTravel = entryBuffer + cylinderHeight + exitBuffer;

      // At t=0 the bottom card sits just below the viewport. At t=1 the top
      // card has just left through the top.
      const cylinderTranslateY = entryBuffer - t * totalTravel;
      const cylinderRotation = t * rotations * Math.PI * 2;
      const snapPixel = (value: number) => Math.round(value * 2) / 2;

      for (let i = 0; i < total; i += 1) {
        const card = cards[i];

        // Each card has a permanent angular slot on the cylinder.
        const baseAngle = (i / total) * Math.PI * 2;
        // Card 0 lives at the BOTTOM of the cylinder so it enters first.
        const baseY = (total - 1 - i) * spacing;

        const worldTheta = baseAngle + cylinderRotation;
        const worldY = baseY + cylinderTranslateY;

        // Cylinder math: card sits on the cylinder's surface, facing outward.
        // theta = 0  → card directly in front of camera (z = +radius)
        // theta = π  → card directly behind (z = -radius)
        const x = Math.sin(worldTheta) * radius;
        const z = Math.cos(worldTheta) * radius;
        // CSS rotateY in degrees so card's face always points outward.
        const rotationY = (worldTheta * 180) / Math.PI;

        // Subtle organic wobble — tied to angular position so it varies card
        // to card but is deterministic (no scroll-jitter).
        const rotationZ = Math.sin(worldTheta * 1.3 + i) * 2.25;

        // Depth-based styling. depthFactor: 0 (back of cylinder) → 1 (front)
        const depthFactor = (z + radius) / (2 * radius);
        // Keep scale below 1 so screenshots are never compositor-upscaled.
        // The CSS card width is larger now, preserving visual size while
        // keeping text and UI edges noticeably crisper.
        const scale = 0.62 + depthFactor * 0.36;
        const baseOpacity = 0.2 + depthFactor * 0.8;

        // Fade cards once they're clearly past the viewport (the section
        // already overflow-clips, but this saves overdraw).
        const visibilityFade =
          worldY > vh * 0.65 || worldY < -vh * 0.65
            ? clamp(1 - (Math.abs(worldY) - vh * 0.55) / (vh * 0.25), 0, 1)
            : 1;
        // NOTE: we used to set `filter: blur(...)` per card per scroll frame
        // for depth-haze. With real photo content that forced a full image
        // re-rasterize every frame → visible scroll jitter. Depth is now
        // carried by scale + opacity alone (the back-of-cylinder cards still
        // recede visually because they're smaller and dimmer).
        gsap.set(card, {
          x: snapPixel(x),
          y: snapPixel(worldY),
          z,
          rotationY,
          rotationZ,
          scale,
          opacity: baseOpacity * visibilityFade,
          // Help browsers sort the 3D stacking when cards cross each other.
          zIndex: Math.round((z + radius) * 10),
        });
      }
    };

    placeCards(0);
    spiralSoundStepRef.current = -1;

    // ---- Trigger A: gradient drain + grid emerge -----------------------
    // Starts as soon as the spiral section enters the viewport from below
    // (so the drain begins while the user is still scrolling out of the
    // intro pin) and finishes ~halfway through the pinned spiral. This
    // overlaps the manifesto-to-spiral handoff so there's no dead zone.
    const drainTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',  // spiral top enters viewport from below
      end: 'top top',       // ends exactly when the spiral pin engages
      scrub: 0.7,
      onUpdate: (self) => {
        const t = self.progress;
        // Smoother drain curve — gentle ease-in via squared progress
        const drainCurve = t * t;
        gradient.style.opacity = String(Math.max(0, 1 - drainCurve));

        // CRITICAL: the intro left the gradient origin at centerY + finalY
        // = 1.12 × vh (below the viewport). The drain MUST start from there,
        // not from 0.62 × vh, otherwise the bright bloom teleports upward
        // into the viewport on the first drain frame.
        // Origin descends further as drain progresses → "the blue is sinking".
        const cx = window.innerWidth / 2;
        const drainY = window.innerHeight * (1.12 + t * 0.55);
        gradient.style.setProperty('--gradient-x', `${cx}px`);
        gradient.style.setProperty('--gradient-y', `${drainY}px`);

        // Grid rises in tandem — by the time gradient is gone, grid is set.
        const gridT = clamp(t * 1.15, 0, 1);
        grid.style.opacity = String(gridT * 0.66);
        grid.style.transform = `translateY(${(1 - gridT) * 80}px)`;
      },
    });
    scrollTriggersRef.current.push(drainTrigger);

    const worksTitleTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top top',
        scrub: 0.7,
      },
    });

    // Balanced placement: pre-gap (manifesto→title) and post-gap (title→spiral)
    // are both ~0.20 of the approach scroll. Title is fully visible roughly
    // in the middle 60% of the approach. With 13 chars in "some of my works",
    // the stagger maths land:
    //   reveal:  0.20  →  0.46   (last char tween ends at 0.20 + 12·0.010 + 0.14)
    //   hold:    0.46  →  0.56   (~10% read window)
    //   exit:    0.56  →  0.78   (last char tween ends at 0.56 + 12·0.008 + 0.12)
    //   gone:    0.80
    worksTitleTl
      .set(worksTitle, { autoAlpha: 1 }, 0.20)
      .to(worksTitleChars, {
        yPercent: 0,
        rotationX: 0,
        opacity: 1,
        ease: 'none',
        stagger: 0.010,
        duration: 0.14,
      }, 0.20)
      .to(worksTitleChars, {
        yPercent: -115,
        rotationX: 34,
        opacity: 0,
        ease: 'none',
        stagger: 0.008,
        duration: 0.12,
      }, 0.56)
      .set(worksTitle, { autoAlpha: 0 }, 0.80);

    if (worksTitleTl.scrollTrigger) {
      scrollTriggersRef.current.push(worksTitleTl.scrollTrigger);
    }

    // ---- Trigger B: card placement on the cylinder (pinned) ------------
    const cardFinishProgress = 0.80 * SPIRAL_TIMING_REMAP;
    const cardsTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: SPIRAL_SCROLL_DISTANCE,
      pin: true,
      pinSpacing: true,
      // Slightly more lag in the scrub = smoother card motion on heavier
      // raster content. Anything <0.5 felt jittery once images replaced the
      // gradient placeholders.
      scrub: 0.9,
      onUpdate: (self) => {
        const cardProgress = clamp(self.progress / cardFinishProgress, 0, 1);
        placeCards(cardProgress);

        const soundStep = clamp(Math.round(cardProgress * (total - 1)), 0, total - 1);
        if (self.direction >= 0 && soundStep > spiralSoundStepRef.current) {
          soundRef.current?.xylophoneStep(soundStep, total, 'up');
          spiralSoundStepRef.current = soundStep;
        } else if (self.direction < 0 && soundStep < spiralSoundStepRef.current) {
          soundRef.current?.xylophoneStep(soundStep, total, 'down');
          spiralSoundStepRef.current = soundStep;
        }
      },
    });
    scrollTriggersRef.current.push(cardsTrigger);
  }, []);

  // ---------- MANIFESTO (overlay inside intro-shell, scroll-driven) -------
  const setupManifestoPhase = useCallback(() => {
    const intro = introRef.current;
    if (!intro) return;
    if (manifestoSetupRef.current) return;
    manifestoSetupRef.current = true;

    const words = Array.from(intro.querySelectorAll<HTMLElement>('.manifesto-overlay .m-word'));
    if (!words.length) return;

    gsap.set(words, { yPercent: 115, rotationX: -28, opacity: 0 });

    // Pin the intro-shell for a short scroll range. The manifesto overlay
    // lives inside it, so the text reveals on the SAME viewport that already
    // shows the bloomed gradient — no scroll-jump to a new section.
    const tween = gsap.to(words, {
      yPercent: 0,
      rotationX: 0,
      opacity: 1,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.18,
      scrollTrigger: {
        trigger: intro,
        start: 'top top',
        end: '+=60%',
        pin: intro,
        pinSpacing: true,
        scrub: 0.6,
      },
    });

    if (tween.scrollTrigger) {
      scrollTriggersRef.current.push(tween.scrollTrigger);
    }

    // Fade the scroll cue out as the manifesto reveal begins, so the
    // "SCROLL" prompt doesn't sit on top of the manifesto text.
    const cue = intro.querySelector<HTMLElement>('.scroll-cue');
    if (cue) {
      const cueTween = gsap.to(cue, {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: intro,
          start: 'top top',
          end: '+=12%',
          scrub: true,
        },
      });
      if (cueTween.scrollTrigger) {
        scrollTriggersRef.current.push(cueTween.scrollTrigger);
      }
    }
  }, []);

  // ---------- EXPERIENCE CTA (near the final spiral beat) ----------------
  const setupExperienceCtaPhase = useCallback(() => {
    const section = spiralSectionRef.current;
    const cardsRoot = spiralCardsRef.current;
    const experienceCta = experienceCtaRef.current;
    const experienceLabel = experienceLabelRef.current;
    const lightPortal = lightPortalRef.current;
    const lightPortalGrid = lightPortalGridRef.current;
    const lightPortalRipple = lightPortalRippleRef.current;
    const experienceFill = experienceCta?.querySelector<HTMLElement>('.experience-cta-fill');
    const experienceStroke = experienceCta?.querySelector<SVGPathElement>('.experience-cta-stroke');
    const experienceDot = experienceCta?.querySelector<HTMLElement>('.experience-cta-dot');

    if (
      !section ||
      !cardsRoot ||
      !experienceCta ||
      !experienceLabel ||
      !lightPortal ||
      !lightPortalGrid ||
      !lightPortalRipple ||
      !experienceFill ||
      !experienceStroke ||
      !experienceDot
    ) return;

    if (experienceSetupRef.current) return;
    experienceSetupRef.current = true;

    gsap.set(experienceCta, {
      opacity: 0,
      xPercent: -50,
      yPercent: -50,
      pointerEvents: 'none',
      force3D: true,
    });
    gsap.set(experienceFill, { scaleX: 0, transformOrigin: '100% 50%' });
    gsap.set(experienceStroke, { drawSVG: '0% 0%' });
    gsap.set(experienceLabel, { autoAlpha: 0, textContent: '' });
    gsap.set(experienceDot, { autoAlpha: 0, scale: 0.35 });
    gsap.set(lightPortal, { autoAlpha: 0 });
    gsap.set(lightPortalGrid, { autoAlpha: 0 });
    gsap.set(lightPortalRipple, { autoAlpha: 0 });

    const drawRippleGrid = (progress: number) => {
      const canvas = lightPortalRipple;
      const context = canvas.getContext('2d');
      if (!context) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvasWidth = Math.round(width * dpr);
      const canvasHeight = Math.round(height * dpr);

      if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      if (progress <= 0.001 || progress >= 0.995) return;

      const centerX = width / 2;
      const centerY = height / 2;
      const gridSize = 72;
      const sample = 10;
      const maxRadius = Math.hypot(width, height) * 0.78;
      const radius = progress * maxRadius;
      const energy = Math.sin(progress * Math.PI);
      const bandWidth = 118;
      const amplitude = 9 * energy;
      const frequency = 0.05;
      const firstX = centerX % gridSize;
      const firstY = centerY % gridSize;

      const waveAt = (x: number, y: number) => {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.hypot(dx, dy) || 1;
        const ring = distance - radius;
        const envelope = Math.exp(-(ring * ring) / (2 * bandWidth * bandWidth));
        const secondary = Math.exp(-((ring + 78) * (ring + 78)) / (2 * (bandWidth * 0.82) ** 2));
        const oscillation = Math.sin(ring * frequency);
        const trailing = Math.sin((ring + 78) * frequency * 0.72) * secondary * 0.42;
        const displacement = (oscillation * envelope + trailing) * amplitude;
        const alpha = clamp((envelope * 0.82 + secondary * 0.42) * energy, 0, 1);

        return {
          x: x + (dx / distance) * displacement,
          y: y + (dy / distance) * displacement,
          alpha,
        };
      };

      const drawLine = (points: Array<[number, number]>) => {
        if (points.length < 2) return;
        context.lineCap = 'butt';
        context.lineJoin = 'round';

        for (let i = 1; i < points.length; i += 1) {
          const [x1, y1] = points[i - 1];
          const [x2, y2] = points[i];
          const start = waveAt(x1, y1);
          const end = waveAt(x2, y2);
          const alpha = (start.alpha + end.alpha) / 2;
          if (alpha < 0.012) continue;

          context.lineWidth = 1.2 + alpha * 0.55;
          context.strokeStyle = `rgba(56, 149, 255, ${0.035 + alpha * 0.13})`;
          context.beginPath();
          context.moveTo(start.x, start.y);
          context.lineTo(end.x, end.y);
          context.stroke();

          context.lineWidth = 0.7;
          context.strokeStyle = `rgba(5, 18, 36, ${alpha * 0.022})`;
          context.beginPath();
          context.moveTo(start.x, start.y);
          context.lineTo(end.x, end.y);
          context.stroke();
        }
      };

      for (let x = firstX - gridSize * 2; x <= width + gridSize * 2; x += gridSize) {
        const points: Array<[number, number]> = [];
        for (let y = -gridSize * 2; y <= height + gridSize * 2; y += sample) {
          points.push([x, y]);
        }
        drawLine(points);
      }

      for (let y = firstY - gridSize * 2; y <= height + gridSize * 2; y += gridSize) {
        const points: Array<[number, number]> = [];
        for (let x = -gridSize * 2; x <= width + gridSize * 2; x += sample) {
          points.push([x, y]);
        }
        drawLine(points);
      }
    };

    drawRippleGrid(0);

    const ctaStartProgress = 0.545;
    const ctaFillProgress = 0.67;
    const ctaContentProgress = 0.72;
    const ctaInteractiveProgress = 0.755;
    const portalStartProgress = 0.88;
    const portalScale = Math.max(
      window.innerWidth / Math.max(experienceCta.offsetWidth, 1),
      window.innerHeight / Math.max(experienceCta.offsetHeight, 1),
    ) * 1.42;
    const rippleState = { progress: 0 };

    const ctaTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: SPIRAL_SCROLL_DISTANCE,
        scrub: true,
      },
    });

    ctaTl
      .set(experienceCta, { opacity: 1 }, ctaStartProgress)
      .to(experienceStroke, {
        drawSVG: '0% 100%',
        duration: 0.12,
        ease: 'none',
      }, ctaStartProgress)
      .to(experienceFill, {
        scaleX: 1,
        duration: 0.04,
        ease: 'none',
      }, ctaFillProgress)
      .to(experienceDot, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.035,
        ease: 'none',
      }, ctaContentProgress + 0.01)
      .to(experienceLabel, {
        autoAlpha: 1,
        duration: 0.04,
        ease: 'none',
        scrambleText: {
          text: 'experience more',
          chars: 'lowerCase',
          speed: 0.3,
          revealDelay: 0.02,
          delimiter: '',
        },
      }, ctaContentProgress)
      .set(experienceCta, { pointerEvents: 'auto' }, ctaInteractiveProgress)
      .set(experienceCta, { pointerEvents: 'none' }, portalStartProgress)
      .to(cardsRoot, {
        autoAlpha: 0,
        duration: 0.06,
        ease: 'none',
      }, portalStartProgress - 0.05)
      .to(experienceLabel, {
        autoAlpha: 0,
        x: -34,
        duration: 0.04,
        ease: 'none',
      }, portalStartProgress)
      .to(experienceDot, {
        autoAlpha: 0,
        x: 28,
        scale: 0.3,
        duration: 0.04,
        ease: 'none',
      }, portalStartProgress + 0.005)
      .to(experienceStroke, {
        autoAlpha: 0,
        duration: 0.04,
        ease: 'none',
      }, portalStartProgress + 0.008)
      .to(experienceCta, {
        scale: portalScale,
        duration: 0.075,
        ease: 'none',
      }, portalStartProgress + 0.012)
      .to(lightPortal, {
        autoAlpha: 1,
        duration: 0.045,
        ease: 'none',
      }, portalStartProgress + 0.018)
      .to(lightPortalGrid, {
        autoAlpha: 1,
        duration: 0.05,
        ease: 'none',
      }, portalStartProgress + 0.04)
      .to(lightPortalRipple, {
        autoAlpha: 1,
        duration: 0.012,
        ease: 'none',
      }, portalStartProgress + 0.075)
      .to(rippleState, {
        progress: 1,
        duration: 0.047,
        ease: 'none',
        onUpdate: () => {
          drawRippleGrid(rippleState.progress);
        },
      }, portalStartProgress + 0.073)
      .to(lightPortalRipple, {
        autoAlpha: 0,
        duration: 0.015,
        ease: 'none',
      }, portalStartProgress + 0.105)
      .to(experienceCta, {
        autoAlpha: 0,
        duration: 0.025,
        ease: 'none',
      }, portalStartProgress + 0.078)
      .set({}, {}, 1);

    if (ctaTl.scrollTrigger) {
      scrollTriggersRef.current.push(ctaTl.scrollTrigger);
    }
  }, []);

  // ---------- LIFECYCLE ---------------------------------------------------
  useEffect(() => {
    soundRef.current = createIntroSound();

    const unlockSound = () => {
      soundRef.current?.unlock();
    };

    window.addEventListener('pointerdown', unlockSound, { passive: true });
    window.addEventListener('keydown', unlockSound);

    runIntro();
    setupManifestoPhase();
    setupScrollPhase();
    setupExperienceCtaPhase();

    let resizeTimer = 0;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        runIntro();
        ScrollTrigger.refresh();
      }, 160);
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === ' ') {
        // Only skip if the intro is still playing — otherwise let space scroll.
        if (document.body.dataset.intro === 'playing') {
          event.preventDefault();
          skip();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('pointerdown', unlockSound);
      window.removeEventListener('keydown', unlockSound);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKey);
      window.clearTimeout(resizeTimer);
      runtimeRef.current?.revert();
      scrambleTweenRef.current?.kill();
      scrollTriggersRef.current.forEach((t) => t.kill());
      scrollTriggersRef.current = [];
      scrollSetupRef.current = false;
      manifestoSetupRef.current = false;
      experienceSetupRef.current = false;
      soundRef.current?.dispose();
      soundRef.current = null;
      document.body.dataset.intro = '';
    };
  }, [runIntro, setupManifestoPhase, setupScrollPhase, setupExperienceCtaPhase, skip]);

  return (
    <div className="app-shell" ref={shellRef}>
      <div className="gradient-field" ref={gradientRef} />
      <div className="grid-field" ref={gridRef} />
      <div className="grain-layer" />
      <div className="flash-layer" ref={flashRef} aria-hidden="true" />
      <div className="works-title" ref={worksTitleRef} aria-hidden="true">
        <div className="works-title-mask">
          <SplitChars text="some of my works" className="works-title-text" />
        </div>
      </div>
      <main className="intro-shell" ref={introRef} data-state="playing">
        <section className="stage" ref={stageRef} aria-label="Atulya animated intro">
          <div className="copy-stage" aria-live="polite">
            <div className="word-mask" ref={heyMaskRef} aria-label="hey!">
              <SplitChars text="hey!" className="intro-word intro-word-hey" />
            </div>
            <div className="word-mask" ref={nameMaskRef} aria-label="i'm atulya">
              <SplitChars text="i'm atulya" className="intro-word intro-word-name" />
            </div>
          </div>

          <div className="text-impact" ref={impactRef} aria-hidden="true" />
          <div className="shock-ring" ref={ringRef} aria-hidden="true" />

          <div className="ball" ref={ballRef} aria-hidden="true">
            <span className="ball-core" ref={ballCoreRef} />
          </div>
        </section>

        {/* Manifesto overlay lives INSIDE intro-shell so it reveals on the
            same viewport as the bloomed gradient. */}
        <div className="manifesto-overlay" aria-label="Introduction">
          <div className="manifesto-inner">
            <div className="m-line m-eyebrow">
              <span className="m-word">atulya — 2026</span>
            </div>

            <h2 className="m-line m-display">
              <span className="m-word">product</span>{' '}
              <span className="m-word">designer.</span>
            </h2>

            <h2 className="m-line m-display">
              <span className="m-word">visual</span>{' '}
              <span className="m-word">experience</span>{' '}
              <span className="m-word">designer.</span>
            </h2>

            <h2 className="m-line m-display m-display-accent">
              <span className="m-word">designer</span>{' '}
              <span className="m-word">who</span>{' '}
              <span className="m-word">codes.</span>
            </h2>

            <p className="m-line m-sub">
              <span className="m-word">
                building interfaces that feel considered, alive, and inevitable.
              </span>
            </p>
          </div>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span>scroll</span>
          <div className="scroll-cue-line" />
        </div>
      </main>

      <section className="spiral-section" ref={spiralSectionRef} aria-label="Selected work spiral">
        <div className="spiral-stage">
          <SpiralCards innerRef={spiralCardsRef} />
        </div>

        <div className="light-portal" ref={lightPortalRef} aria-hidden="true">
          <div className="light-portal-grid" ref={lightPortalGridRef} />
          <canvas className="light-portal-ripple" ref={lightPortalRippleRef} />
        </div>

        <a
          className="experience-cta"
          ref={experienceCtaRef}
          href="https://designsnaps.vercel.app/"
          target="_blank"
          rel="noreferrer"
          aria-label="Experience more"
          onMouseEnter={handleExperienceEnter}
          onFocus={handleExperienceEnter}
          onClick={handleExperienceClick}
        >
          <span className="experience-cta-fill" aria-hidden="true" />
          <svg className="experience-cta-outline" viewBox="0 0 680 204" preserveAspectRatio="none" aria-hidden="true">
            <path
              className="experience-cta-stroke"
              d="M 678 102 C 678 46.77 633.23 2 578 2 H 102 C 46.77 2 2 46.77 2 102 C 2 157.23 46.77 202 102 202 H 578 C 633.23 202 678 157.23 678 102"
            />
          </svg>
          <span className="experience-cta-label" ref={experienceLabelRef}>
            experience more
          </span>
          <span className="experience-cta-dot" aria-hidden="true" />
        </a>
      </section>

    </div>
  );
}
