import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './navbar/Navbar';
import { UiMarksButton } from './ui';
import styles from './Add.module.scss';

export default function Add({ user, onPageChange, handleReturn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHr778User = user?.name === 'hr778';

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

  return (
    <section className={styles.main}>
      <UiMarksButton className={styles.btn} onClick={() => navigate('/')}>
        Предпросмотр
      </UiMarksButton>
      <Navbar user={user} />
      <div className={styles.wrap}>
        <Outlet />
      </div>
    </section>
  );
}
