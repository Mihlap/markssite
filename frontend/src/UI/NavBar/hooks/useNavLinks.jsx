// useNavLinks.jsx
import { useLocation, matchPath } from 'react-router-dom';
import { useMemo } from 'react';
import { baseNavConfig, hrNavConfig } from '../const/routes';

// frontend/src/UI/NavBar/hooks/useNavLinks.jsx
const sections = [
  { match: (p) => !!matchPath({ path: '/hr/*', end: false }, p), config: hrNavConfig },
  { match: () => true, config: baseNavConfig },
];

export function useNavLinks() {
  const { pathname } = useLocation();
  return useMemo(() => sections.find((s) => s.match(pathname))?.config ?? baseNavConfig, [pathname]);
}
