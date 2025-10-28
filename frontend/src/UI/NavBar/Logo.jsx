import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import logo from './icon/logo.svg';
import iconhr from './icon/hr.svg';
import iconmg from './icon/mj.svg';

import styles from './style.module.scss';

export default function Logo() {
  const location = useLocation();
  const isHrRoute = location.pathname.startsWith('/hr/');
  const isMjRoute = location.pathname.startsWith('/publication');
  const shouldCompactLogo = isHrRoute || isMjRoute;
  const animatedIcon = isHrRoute ? iconhr : isMjRoute ? iconmg : null;
  const animatedAlt = isHrRoute
    ? 'дополнительный логотип для MarksGroup HR portal'
    : isMjRoute
    ? 'дополнительный логотип для MarksGroup Media & Journalism'
    : '';

  return (
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
      {animatedIcon && (
        <img
          key={animatedIcon}
          className={clsx(styles['navbar-logo-hr'], {
            [styles['navbar-logo-hr-animate']]: shouldCompactLogo,
          })}
          src={animatedIcon}
          alt={animatedAlt}
        />
      )}
    </div>
  );
}
