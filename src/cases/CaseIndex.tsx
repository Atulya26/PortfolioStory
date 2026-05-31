import { useRef } from 'react';
import { H, CaseFooter, useCaseStudyMotion, useCasePage } from './shared';
import { CASES } from './registry';

export default function CaseIndex() {
  const rootRef = useRef<HTMLDivElement>(null);
  useCasePage('Selected work');
  useCaseStudyMotion(rootRef);

  return (
    <div className="cs-root" ref={rootRef}>
      <header className="cs-topbar">
        <a className="cs-back" href="#/">
          <span className="cs-back-arrow" aria-hidden="true">←</span>
          <span>Back to portfolio</span>
        </a>
        <span className="cs-topbar-tag">Selected work</span>
      </header>

      <main>
        <section className="cs-section cs-hero" aria-labelledby="cw-title">
          <span className="cs-ghost" data-parallax="1.5" aria-hidden="true">05</span>
          <div className="cs-inner">
            <p className="cs-eyebrow" data-rise>Selected work · {CASES.length} case studies</p>
            <H id="cw-title" level={1}>Work</H>
            <p className="cs-lede cs-hero-lede" data-rise>Design-systems work for Innovaccer's Masala Design System — accessibility, color, charts, and an AI-native rebuild. Each one shipped.</p>

            <div className="cs-work-list" data-stagger>
              {CASES.map((c) => (
                <a className="cs-work-card" data-rise href={`#/case/${c.slug}`} key={c.slug}>
                  <span className="cs-work-num">{c.num}</span>
                  <div className="cs-work-body">
                    <h3>{c.title}</h3>
                    <p>{c.blurb}</p>
                    <div className="cs-work-meta"><span>{c.tag}</span><span>{c.year}</span></div>
                  </div>
                  <span className="cs-work-arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <CaseFooter>Atulya · Selected work</CaseFooter>
    </div>
  );
}
