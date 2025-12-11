import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './Add.module.scss';
import AddNavbar from './add-navbar/AddNavbar';
// import Snowfall from './Snowfall/Snowfall';

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

      if (restrictedPaths.includes(location.pathname) || restrictedPaths.some(path => location.pathname.startsWith(path))) {
        navigate('/admin/add-hr-portal', { replace: true });
      }
    }
  }, [location.pathname, isHr778User, navigate]);

  if (!user) {
    return null;
  }

  return (
    <>
      {/* <Snowfall /> */}
      <div className={styles.add_container}>
        <AddNavbar handleReturn={handleReturn} user={user} />
        <Outlet />
      </div>
    </>
  );
}
