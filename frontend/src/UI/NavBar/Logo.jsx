import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import logo from './icon/logo.svg';
import iconhr from './icon/hr.svg';
import iconmg from './icon/mg.svg';

import styles from './style.module.scss';
import { useState } from 'react';

export default function Logo() {
  const location = useLocation();
  // const isHrRoute = location.pathname.startsWith('/hr/');
  // const isMjRoute = location.pathname.startsWith('/publication');
  // const shouldCompactLogo = isHrRoute || isMjRoute;
  const [shouldCompactLogo, setOpen] = useState(false);
  return (
    <>
      <div className={styles['navbar-logo-block']}>
        {/* <div className={styles['navbar-logo-circle']} /> */}
        <div
          className={clsx(styles['navbar-logo-circle'], {
            [styles['navbar-logo-circle-animate']]: shouldCompactLogo,
          })}
        />
        <img
          className={clsx(styles['navbar-logo-image'], {
            [styles['navbar-logo-image--shifted']]: shouldCompactLogo,
          })}
          src={logo}
          alt="логотип компании MarksGroup"
          loading="lazy"
        />
        <div
          className={clsx(styles['navbar-logo-circle-blue'], {
            [styles['navbar-logo-circle-blue-animate']]: shouldCompactLogo,
          })}
        />
        <img
          // className={styles['navbar-logo-hr']}
          className={clsx(styles['navbar-logo-hr'], {
            [styles['navbar-logo-hr-animate']]: shouldCompactLogo,
          })}
          src={iconhr}
          alt="дополнительный логотип для MarksGroup HR portal"
        />
      </div>
      <button style={{ border: '1px', backgroundColor: 'Highlight' }} onClick={() => setOpen((prev) => !prev)}>
        animate
      </button>
    </>
  );
}
