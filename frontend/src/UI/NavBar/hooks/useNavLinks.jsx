// useNavLinks.jsx
import { useLocation, matchPath } from 'react-router-dom';
import { useMemo } from 'react';
import { baseNavConfig, hrNavConfig } from '../const/routes';

// frontend/src/UI/NavBar/hooks/useNavLinks.jsx
const sections = [
  { match: (p) => !!matchPath({ path: '/hr/*', end: false }, p), config: hrNavConfig },
  { match: () => true, config: baseNavConfig },
];
const HR_FORM_ROUTES = new Set(['/hr/home', '/hr/vacancies', '/hr/internships']);

export function useNavLinks() {
  const { pathname } = useLocation();
  return useMemo(() => {
    const config = sections.find((s) => s.match(pathname))?.config ?? baseNavConfig;
    if (config !== hrNavConfig) return config;

    return {
      ...config,
      cta: config.cta.map((item) => {
        if (typeof item.label !== 'string' || !item.label.includes('|')) return item;
        const [vacancyLabel, internshipLabel] = item.label.split('|').map((part) => part.trim());
        const nextLabel = pathname === '/hr/internships' ? internshipLabel : vacancyLabel;
        const nextPath = HR_FORM_ROUTES.has(pathname) ? `${pathname}#form` : item.path;
        return { ...item, label: nextLabel, path: nextPath };
      }),
    };
  }, [pathname]);
}
