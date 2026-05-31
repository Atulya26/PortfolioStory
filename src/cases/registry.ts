// Case-study registry — metadata only (no component imports), used by the
// works index. Routing maps these slugs to components in main.tsx.
export type CaseMeta = {
  slug: string;
  num: string;
  title: string;
  blurb: string;
  tag: string;
  year: string;
};

export const CASES: CaseMeta[] = [
  {
    slug: 'mds-accessibility',
    num: '01',
    title: 'Compliance for Masala Design System',
    blurb: 'Taking MDS from 27.6% to 100% WCAG 2.2 AA and Section 508 — and pulling 20+ healthcare products along with it.',
    tag: 'Accessibility · Design System',
    year: '2026',
  },
  {
    slug: 'charting-library',
    num: '02',
    title: 'A Charting Library for MDS',
    blurb: 'The missing charting layer for Innovaccer — 12 chart types, 3 color families, one shared source for components and AI-legible props.',
    tag: 'Design System · Charts',
    year: '2026',
  },
  {
    slug: 'mds-color-refresh',
    num: '03',
    title: 'Rebuilding MDS Color',
    blurb: 'An OKLCH-based color system rebuilt for contrast and longevity — without a rebrand.',
    tag: 'Color · Tokens',
    year: '2026',
  },
  {
    slug: 'wcag-pr',
    num: '04',
    title: 'WCAG into Component Contracts',
    blurb: 'Turning WCAG 2.2 criteria into reusable component patterns across 44 PR and branch contributions.',
    tag: 'Accessibility · Engineering',
    year: '2026',
  },
  {
    slug: 'design-mind',
    num: '05',
    title: 'Design Mind — An AI-Native Design System',
    blurb: 'A design system rebuilt as a format machines can read, reason about, and extend.',
    tag: 'AI · Design Systems',
    year: '2026',
  },
];
