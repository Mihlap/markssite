import { matchPath } from 'react-router';

export const isRouteActive = (pathname, hash, targetPath) => {
  if (!targetPath) return false;
  if (targetPath.includes('#')) {
    return `${pathname}${hash}` === targetPath;
  }

  return !!matchPath({ path: targetPath, end: false }, pathname);
};

export const resolveCompanyTarget = (path, fallbackId) => {
  if (typeof path === 'string' && path.includes('#')) {
    return path.split('#')[1];
  }

  if (fallbackId != null) {
    return `section${fallbackId}`;
  }

  return null;
};

export const handleCompanyAwareNavigation = ({
  event,
  path,
  fallbackId,
  isCompany,
  navigate,
  goToCompanySection,
}) => {
  if (!path) return;

  if (isCompany) {
    event?.preventDefault?.();

    if (path === '/journalPage' || path === '/publication') {
      navigate?.(path);
      return;
    }

    const target = resolveCompanyTarget(path, fallbackId);

    if (target) {
      goToCompanySection?.(target);
      return;
    }
  }

  navigate?.(path);
};
