import { useLocation, matchPath } from 'react-router-dom';
import { useMemo } from 'react';

const VACANCY_DETAIL_MATCHER = { path: '/hr/vacancies/:id', end: true };
const PROJECT_DETAIL_MATCHER = { path: '/projects/:id', end: true };
const ARTICLE_DETAIL_MATCHER = { path: '/publication/:id', end: true };
const JOURNAL_DETAIL_MATCHER = { path: '/journal/:id', end: true };

const HR_LIST_ROUTES = ['/hr/home', '/hr/internships', '/hr/vacancies'];

export function useHrNavMeta() {
  const { pathname, search, hash } = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(search);
    const isInternship = params.get('type') === 'internship';
    const isHrPortal = pathname.startsWith('/hr/');
    const isCompany = pathname.startsWith('/company');
    const isVacancyDetail = !!matchPath(VACANCY_DETAIL_MATCHER, pathname);
    const isProjectDetail = !!matchPath(PROJECT_DETAIL_MATCHER, pathname);
    const isArticleDetail = !!matchPath(ARTICLE_DETAIL_MATCHER, pathname);
    const isJournalDetail = !!matchPath(JOURNAL_DETAIL_MATCHER, pathname);
    const linkBack = isInternship ? '/hr/internships' : '/hr/vacancies';
    const textBack = isInternship ? 'стажировки' : 'вакансии';
    const showSidebarLogo = HR_LIST_ROUTES.includes(pathname) || isInternship;

    return {
      pathname,
      hash,
      isCompany,
      isInternship,
      isVacancyDetail,
      isProjectDetail,
      isArticleDetail,
      isJournalDetail,
      linkBack,
      textBack,
      showSidebarLogo,
      isHrPortal,
    };
  }, [hash, pathname, search]);
}
