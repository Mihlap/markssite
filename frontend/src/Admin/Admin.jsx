import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './navbar/Navbar';
import { UiMarksButton } from './ui';
import styles from './Admin.module.scss';

const PREVIEW_MAP = {
  '/admin/home': '/',
  '/admin/add-a-project': '/project',
  '/admin/add-a-company': '/company',
};

export default function Admin({ user, onPageChange, handleReturn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHr778User = user?.name === 'hr778';
  const [articlesPreview, setArticlesPreview] = useState('/publication');
  const [hrPortalPreview, setHrPortalPreview] = useState('/hr/vacancies');

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (onPageChange) {
      onPageChange('add');
    }
  }, [onPageChange]);

  useEffect(() => {
    const segment = location.pathname.replace('/admin/', '');
    if (segment) localStorage.setItem('selectedItem', segment);
  }, [location.pathname]);

  useEffect(() => {
    if (isHr778User) {
      const restrictedPaths = [
        '/admin',
        '/admin/',
        '/admin/home',
        '/admin/add-a-project',
        '/admin/add-a-articles',
        '/admin/add-a-company',
        '/admin/add-a-applications',
      ];

      if (
        restrictedPaths.includes(location.pathname) ||
        restrictedPaths.some((path) => location.pathname.startsWith(path))
      ) {
        navigate('/admin/add-hr-portal', { replace: true });
      }
    }
  }, [location.pathname, isHr778User, navigate]);

  if (!user) {
    return null;
  }

  const { pathname } = location;
  const previewUrl =
    pathname === '/admin/add-a-articles' ? articlesPreview :
    pathname === '/admin/add-hr-portal'  ? hrPortalPreview :
    PREVIEW_MAP[pathname];

  return (
    <section className={styles.main}>
      {previewUrl && (
        <UiMarksButton color='blue' className={styles.btn} onClick={() => navigate(previewUrl)}>
          Предпросмотр
        </UiMarksButton>
      )}
      <Navbar user={user} />
      <div className={styles.wrap}>
        <Outlet context={{ setArticlesPreview, setHrPortalPreview }} />
      </div>
    </section>
  );
}
