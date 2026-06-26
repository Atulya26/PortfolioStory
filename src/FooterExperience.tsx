import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './footer-experience.css';

// ===========================================================================
// FooterExperience — "The Pull"
//
// A self-contained footer the visitor physically drags into view past the
// bottom of the page. Normal scroll "resists" (velocity damped ~0.5×); once
// ~140px of over-pull accumulates the white room snaps up with a spring. The
// room shows a real-time ASCII brainwave field (Gamma + high-Beta) that
// parts around the cursor.
//
// Design rules followed (from docs/DESIGN_GUIDE.md):
//  - GSAP only, no new scroll-smoothing library.
//  - Honors prefers-reduced-motion and the (max-width: 700px) mobile fork.
//  - Inert until body[data-intro]==='done' (don't fight the intro lock).
//  - Full cleanup: remove listeners, cancel rAF, kill tweens.
//  - No ScrollTrigger used for the pull — raw listeners + gsap tweens, so it
//    is immune to ScrollTrigger.refresh() elsewhere in the app.
// ===========================================================================

const MOBILE_QUERY = '(max-width: 700px)';
const PULL_THRESHOLD = 140;          // px of accumulated over-pull before snap
const PULL_DAMPING = 0.5;            // ~0.5× velocity damping during the pull
const RELEASE_LAG = 130;             // ms of wheel silence before springing back
const SNAP_DURATION = 0.82;
const CLOSE_DURATION = 0.62;

const RAMP = ' .:-=+*#%@';           // luminance → glyph ramp (low → high amplitude)
const TAU = Math.PI * 2;

const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// At-document-bottom test with a small epsilon for sub-pixel jitter. The
// page has no active GSAP pins at the bottom (intro/spiral pins release
// upstream and their pinSpacing is already in scrollHeight), so this is
// reliable. See exploration notes.
const atDocumentBottom = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return window.scrollY >= max - 1;
};

export default function FooterExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const hint = hintRef.current;
    const progressBar = progressBarRef.current;
    const room = roomRef.current;
    const canvas = canvasRef.current;
    const content = contentRef.current;
    if (!root || !hint || !progressBar || !room || !canvas || !content) return;

    const reduce = prefersReducedMotion();
    const ctx2d = canvas.getContext('2d', { alpha: false });
    if (!ctx2d) return;

    // ---- mutable state -------------------------------------------------
    type Mode = 'idle' | 'pulling' | 'revealed' | 'closing';
    const state = {
      mode: 'idle' as Mode,
      pullPx: 0,                 // 0 = room fully hidden, vh = room fully shown
      vh: window.innerHeight,
      releaseTimer: 0,
      // cursor push (Linear/Praveen move). x/y in CSS px relative to room.
      pointer: { x: -9999, y: -9999, active: false, radius: 150 },
    };

    const setProgress = gsap.quickSetter(progressBar, 'scaleX');
    const setRoomY = gsap.quickSetter(room, 'y', 'px');
    let activeTweens: gsap.core.Tween[] = [];

    const killTweens = () => {
      activeTweens.forEach((t) => t.kill());
      activeTweens = [];
    };

    const applyRoomTransform = () => {
      // pullPx 0 → translateY(vh); pullPx vh → translateY(0).
      setRoomY(state.vh - state.pullPx);
      const p = Math.min(1, state.pullPx / PULL_THRESHOLD);
      setProgress(p);
      // Hint fades out as the pull begins.
      gsap.set(hint, { opacity: reduce ? 0 : Math.max(0, 1 - p * 2.2) });
    };

    // =====================================================================
    // BRAINWAVE FIELD  (defined first so reveal/close can start/stop it)
    // Two summed spatial sine drivers: gamma (short wavelength, tight
    // ripples) + beta (mid wavelength), drifting calmly in t. A slow
    // envelope creates breathing density pockets → reads as millions of
    // neurons firing in sync. Amplitude → glyph via the RAMP.
    // =====================================================================

    // Pre-bake each glyph to an offscreen atlas cell — drawImage is far
    // cheaper than fillText per cell, and keeps the field at 60fps.
    const cellSize = isMobile() ? 11 : 14;     // CSS px per glyph cell
    const glyphAtlas = document.createElement('canvas');

    const buildAtlas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cols = RAMP.length;
      glyphAtlas.width = Math.round(cellSize * cols * dpr);
      glyphAtlas.height = Math.round(cellSize * dpr);
      const a = glyphAtlas.getContext('2d');
      if (!a) return;
      a.scale(dpr, dpr);
      a.fillStyle = '#ffffff';
      a.fillRect(0, 0, cellSize * cols, cellSize);
      a.fillStyle = '#050509';
      const fontPx = Math.round(cellSize * 0.92);
      a.font = `${fontPx}px 'SF Mono','Menlo','Consolas','Roboto Mono',ui-monospace,monospace`;
      a.textBaseline = 'middle';
      a.textAlign = 'center';
      for (let i = 0; i < cols; i++) {
        a.fillText(RAMP[i], i * cellSize + cellSize / 2, cellSize / 2 + 0.5);
      }
    };
    buildAtlas();

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = room.clientWidth;
      const h = room.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx2d.fillStyle = '#ffffff';
      ctx2d.fillRect(0, 0, w, h);
    };
    resizeCanvas();

    // Wavelengths chosen so gamma reads as tight, dense ripples and beta as
    // the broader underlying wave.
    const GAMMA_WL = isMobile() ? 26 : 34;
    const BETA_WL = isMobile() ? 96 : 130;

    let raf = 0;
    let rafRunning = false;
    let lastFrame = 0;
    const FRAME_BUDGET = 1000 / 40;            // throttle to ~40fps

    const sampleField = (x: number, y: number, t: number, applyPointer: boolean) => {
      const gamma = Math.sin((x / GAMMA_WL) * TAU + t * 2.2) *
                    Math.cos((y / GAMMA_WL) * TAU - t * 1.7);
      const beta = Math.sin((x / BETA_WL) * TAU + t * 0.9) *
                   Math.cos((y / BETA_WL) * TAU + t * 0.6);
      const envelope = 0.5 + 0.5 * Math.sin((x + y) * 0.006 + t * 0.7);
      let amp = (gamma * 0.6 + beta * 0.4) * 0.5 + 0.5; // → 0..1
      amp = amp * (0.55 + envelope * 0.45);

      if (applyPointer) {
        const dx = x - state.pointer.x;
        const dy = y - state.pointer.y;
        const pr = state.pointer.radius;
        const d2 = dx * dx + dy * dy;
        if (d2 < pr * pr) {
          const d = Math.sqrt(d2);
          const falloff = 1 - d / pr;
          amp *= 1 - falloff * falloff * falloff; // cubic: void at center
        }
      }
      return amp;
    };

    const renderField = (t: number, applyPointer: boolean) => {
      const w = room.clientWidth;
      const h = room.clientHeight;
      const cols = Math.ceil(w / cellSize) + 1;
      const rows = Math.ceil(h / cellSize) + 1;
      ctx2d.fillStyle = '#ffffff';
      ctx2d.fillRect(0, 0, w, h);
      const atlasCellW = glyphAtlas.width / RAMP.length;
      const atlasCellH = glyphAtlas.height;
      for (let row = 0; row < rows; row++) {
        const y = row * cellSize + cellSize * 0.5;
        for (let col = 0; col < cols; col++) {
          const x = col * cellSize + cellSize * 0.5;
          const amp = sampleField(x, y, t, applyPointer);
          if (amp < 0.04) continue;
          const idx = Math.min(RAMP.length - 1, Math.floor(amp * RAMP.length));
          ctx2d.drawImage(
            glyphAtlas,
            idx * atlasCellW, 0, atlasCellW, atlasCellH,
            col * cellSize, row * cellSize, cellSize, cellSize,
          );
        }
      }
    };

    const drawField = (time: number) => {
      raf = requestAnimationFrame(drawField);
      if (time - lastFrame < FRAME_BUDGET) return;
      lastFrame = time;
      const t = time * 0.00035;                // slow temporal drift
      renderField(t, state.pointer.active);
    };

    const ensureRaf = (run: boolean) => {
      if (run && !rafRunning && !reduce) {
        rafRunning = true;
        lastFrame = 0;
        raf = requestAnimationFrame(drawField);
      } else if (!run && rafRunning) {
        rafRunning = false;
        cancelAnimationFrame(raf);
      }
    };

    // ---- reveal / close (call ensureRaf directly) ----------------------
    const revealRoom = () => {
      state.mode = 'revealed';
      room.style.visibility = 'visible';
      root.style.pointerEvents = 'auto';
      killTweens();
      ensureRaf(true);
      activeTweens.push(
        gsap.to(state, {
          pullPx: state.vh,
          duration: SNAP_DURATION,
          ease: 'power4.out',
          onUpdate: applyRoomTransform,
        }),
        gsap.fromTo(content, { autoAlpha: 0, y: 26, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)', delay: 0.18 }),
      );
    };

    const closeRoom = () => {
      if (state.mode !== 'revealed' && state.mode !== 'pulling') return;
      state.mode = 'closing';
      killTweens();
      activeTweens.push(
        gsap.to(content, { autoAlpha: 0, y: 12, duration: 0.28, ease: 'power2.in' }),
        gsap.to(state, {
          pullPx: 0,
          duration: CLOSE_DURATION,
          ease: 'power3.inOut',
          onUpdate: applyRoomTransform,
          onComplete: () => {
            state.mode = 'idle';
            room.style.visibility = 'hidden';
            root.style.pointerEvents = 'none';
            ensureRaf(false);
            const max = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo({ top: Math.max(0, max), behavior: reduce ? 'auto' : 'smooth' });
          },
        }),
      );
    };

    // ---- the pull: wheel ------------------------------------------------
    // Fires only at the document boundary, and only after the intro is done.
    const onWheel = (e: WheelEvent) => {
      if (document.body.dataset.intro !== 'done') return;

      if (state.mode === 'idle' || state.mode === 'pulling') {
        if (!atDocumentBottom() || e.deltaY <= 0) return;
        // At the bottom + scrolling down → hijack into the pull.
        e.preventDefault();
        if (reduce) { revealRoom(); return; }

        state.mode = 'pulling';
        killTweens();
        state.pullPx = Math.min(PULL_THRESHOLD * 1.4, state.pullPx + e.deltaY * PULL_DAMPING);
        applyRoomTransform();

        window.clearTimeout(state.releaseTimer);
        state.releaseTimer = window.setTimeout(() => {
          if (state.mode !== 'pulling') return;
          if (state.pullPx >= PULL_THRESHOLD) revealRoom();
          else {
            state.mode = 'idle';
            activeTweens.push(
              gsap.to(state, { pullPx: 0, duration: 0.5, ease: 'back.out(2)',
                onUpdate: applyRoomTransform }),
            );
          }
        }, RELEASE_LAG);
      } else if (state.mode === 'revealed') {
        // Scrolling up inside the revealed room starts the close.
        if (e.deltaY < 0 && state.pullPx >= state.vh - PULL_THRESHOLD) {
          e.preventDefault();
          closeRoom();
        }
      }
    };

    // ---- the pull: touch ------------------------------------------------
    let touchStartY = 0;
    let touchPullBase = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (document.body.dataset.intro !== 'done') return;
      touchStartY = e.touches[0].clientY;
      touchPullBase = state.pullPx;
      const t = e.touches[0];
      const rect = room.getBoundingClientRect();
      state.pointer.x = t.clientX - rect.left;
      state.pointer.y = t.clientY - rect.top;
      state.pointer.active = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (document.body.dataset.intro !== 'done') return;
      const dy = touchStartY - e.touches[0].clientY; // +ve = finger up = pull
      if ((state.mode === 'idle' || state.mode === 'pulling') && atDocumentBottom() && dy > 0) {
        e.preventDefault();
        if (reduce && state.mode === 'idle') { revealRoom(); return; }
        state.mode = 'pulling';
        killTweens();
        state.pullPx = Math.min(state.vh, touchPullBase + dy * PULL_DAMPING);
        applyRoomTransform();
      } else if (state.mode === 'pulling' && dy <= 0) {
        state.pullPx = Math.max(0, touchPullBase + dy * PULL_DAMPING);
        applyRoomTransform();
      } else if (state.mode === 'revealed' && dy < -PULL_THRESHOLD) {
        closeRoom();
      }
      const t = e.touches[0];
      const rect = room.getBoundingClientRect();
      state.pointer.x = t.clientX - rect.left;
      state.pointer.y = t.clientY - rect.top;
      state.pointer.active = true;
    };
    const onTouchEnd = () => {
      if (state.mode === 'pulling') {
        if (state.pullPx >= PULL_THRESHOLD) revealRoom();
        else {
          state.mode = 'idle';
          activeTweens.push(
            gsap.to(state, { pullPx: 0, duration: 0.5, ease: 'back.out(2)',
              onUpdate: applyRoomTransform }),
          );
        }
      }
      state.pointer.active = false;
    };

    // ---- pointer (cursor push) -----------------------------------------
    const onPointerMove = (e: PointerEvent) => {
      if (state.mode !== 'revealed') return;
      const rect = room.getBoundingClientRect();
      state.pointer.x = e.clientX - rect.left;
      state.pointer.y = e.clientY - rect.top;
      state.pointer.active = true;
    };
    const onPointerLeave = () => { state.pointer.active = false; };

    // ---- keyboard exit --------------------------------------------------
    const onKey = (e: KeyboardEvent) => {
      if (state.mode !== 'revealed') return;
      if (e.key === 'Escape' || e.key === 'ArrowUp') {
        e.preventDefault();
        closeRoom();
      }
    };

    // ---- hint visibility via scroll (anticipation tail) -----------------
    // The .case-footer-landing has ~125vh of empty space below the button.
    // As the user descends into that tail, the "keep pulling" hint fades in.
    const onScroll = () => {
      if (state.mode !== 'idle') return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const remaining = max - window.scrollY; // 0 at the very bottom
      // Fade hint in over the last ~70vh of the tail.
      const tail = Math.min(1, Math.max(0, 1 - remaining / (window.innerHeight * 0.7)));
      if (!reduce) gsap.set(hint, { opacity: tail });
    };

    // ---- reduced-motion: paint one static frame, reveal via opacity -----
    if (reduce) {
      renderField(1.234, false);
      room.style.visibility = 'visible';
      gsap.set(room, { autoAlpha: 0, y: 0 });
    }

    // ---- listener attach ------------------------------------------------
    // wheel/touchmove need passive:false so preventDefault works.
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerLeave, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        state.vh = window.innerHeight;
        if (state.mode === 'revealed') resizeCanvas();
        applyRoomTransform();
      }, 160);
    };
    window.addEventListener('resize', onResize);

    // ---- the back button ------------------------------------------------
    const backBtn = root.querySelector<HTMLButtonElement>('.fe-back');
    const onBack = () => {
      if (state.mode === 'revealed' || state.mode === 'pulling') closeRoom();
    };
    backBtn?.addEventListener('click', onBack);

    // ---- cleanup --------------------------------------------------------
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerLeave);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(state.releaseTimer);
      window.clearTimeout(resizeTimer);
      backBtn?.removeEventListener('click', onBack);
      ensureRaf(false);
      killTweens();
    };
  }, []);

  return (
    <div className="fe-root" ref={rootRef}>
      {/* Anticipation cues — visible over the main page while pulling */}
      <div className="fe-hint" ref={hintRef} aria-hidden="true">
        <span className="fe-hint-arrow">↓</span>
        <span>keep pulling</span>
      </div>
      <div className="fe-progress" aria-hidden="true">
        <span className="fe-progress-bar" ref={progressBarRef} />
      </div>

      {/* The white room */}
      <div className="fe-room" ref={roomRef} aria-hidden="true">
        <canvas className="fe-room-canvas" ref={canvasRef} />
        <div className="fe-room-scrim" />

        <div className="fe-top">
          <button className="fe-back" type="button" aria-label="Back to work">
            <span className="fe-back-arrow" aria-hidden="true">↑</span>
            <span>back to work</span>
          </button>
        </div>

        <div className="fe-content" ref={contentRef}>
          <p className="fe-name-sub">portfolio · 2026</p>
          <h2 className="fe-name">Atulya</h2>
          <p className="fe-caption">
            <em>ASCII / Dither particle field</em> — Gamma (30–100 Hz) with high Beta (12–30 Hz).
            The rhythmic, synchronized electrical impulses of millions of neurons firing at once.
          </p>
        </div>
      </div>
    </div>
  );
}
