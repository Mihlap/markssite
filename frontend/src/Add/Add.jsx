import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './Add.module.scss';
import AddNavbar from './add-navbar/AddNavbar';
// import Snowfall from './Snowfall/Snowfall';

export default function Add({ user, onPageChange, handleReturn }) {
  useEffect(() => {
    if (onPageChange) {
      onPageChange('add');
    }
  }, [onPageChange]);

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
