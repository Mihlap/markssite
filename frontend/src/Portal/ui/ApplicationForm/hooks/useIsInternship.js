import { useLocation } from 'react-router';

export function useIsInternship() {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);

  return pathname === '/hr/internships' || params.get('type') === 'internship';
}
