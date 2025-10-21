import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import logo from './icon/logo.svg';
import iconhr from './icon/hr.svg';
import iconmg from './icon/mg.svg';

import styles from './style.module.scss';

export default function Logo() {
  const location = useLocation();
  const isHrRoute = location.pathname.startsWith('/hr/');
  const isMjRoute = location.pathname.startsWith('/publication');
  return (
    <div className={styles['navbar-logo-block']}>
      <div className={styles['navbar-logo-circle']}></div>
      <img src={logo} alt="логотип компании MarksGroup" loading="lazy" />
      <div className={styles['navbar-logo-circle-blue']}></div>
      <img src={iconhr} alt="дополнительный логотип для MarksGroup HR portal" />
    </div>
  );
}
