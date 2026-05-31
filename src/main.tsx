import { createRoot } from 'react-dom/client';
import { useEffect, useState, lazy, Suspense, type LazyExoticComponent, type ComponentType } from 'react';
import App from './App';
import './styles.css';

// Lightweight hash routing — no router dependency. Home (the intro) is the
// default; case studies and the works index lazy-load so they never weigh
// down the home bundle.
const CaseIndex = lazy(() => import('./cases/CaseIndex'));

const caseComponents: Record<string, LazyExoticComponent<ComponentType>> = {
  'mds-accessibility': lazy(() => import('./CaseStudy')),
  'charting-library': lazy(() => import('./cases/CaseChartingLibrary')),
  'mds-color-refresh': lazy(() => import('./cases/CaseColorRefresh')),
  'wcag-pr': lazy(() => import('./cases/CaseWcagPr')),
  'design-mind': lazy(() => import('./cases/CaseDesignMind')),
};

function Root() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (hash.startsWith('#/case/')) {
    const slug = hash.slice('#/case/'.length).split(/[?#/]/)[0];
    const Case = caseComponents[slug];
    if (Case) return <Suspense fallback={null}><Case /></Suspense>;
  }
  if (hash.startsWith('#/work')) {
    return <Suspense fallback={null}><CaseIndex /></Suspense>;
  }
  return <App />;
}

createRoot(document.getElementById('root')!).render(<Root />);
