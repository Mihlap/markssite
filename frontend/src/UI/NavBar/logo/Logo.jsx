import { Link, useLocation } from 'react-router';
import clsx from 'clsx';
import logo from '../icon/logo.svg';
import iconhr from '../icon/hr.svg';
import iconmg from '../icon/mj.svg';

import styles from '../logo/style.module.css';
import { useEffect, useState } from 'react';

export default function Logo({ isSideBar = false }) {
  const location = useLocation();
  // маршрутные флаги нужны, чтобы включать компактную версию и нужный набор анимаций
  const isHrRoute = location.pathname.startsWith('/hr/');
  const isMjRoute = location.pathname.startsWith('/journalPage');
  const shouldCompactLogo = isHrRoute || isMjRoute;
  const [animate, setAnimate] = useState(shouldCompactLogo);

  useEffect(() => {
    // синхронизируем включение/выключение анимации при смене страницы
    setAnimate(shouldCompactLogo);
  }, [shouldCompactLogo]);

  // выбираем доп.иконку, alt и ссылку домой под соответствующий раздел
  const animatedIcon = isHrRoute ? iconhr : isMjRoute ? iconmg : null;
  const animatedAlt = isHrRoute
    ? 'дополнительный логотип для MarksGroup HR portal'
    : isMjRoute
      ? 'дополнительный логотип для MarksGroup Media & Journalism'
      : '';
  const homePath = isHrRoute ? '/hr/home' : isMjRoute ? '/journalPage' : '/';

  return (
    <Link
      to={homePath}
      data-is-sidebar={isSideBar}
      className={clsx(styles['logo-block'], shouldCompactLogo && styles['logo-block--compact'])}>
      {/* <div className={styles['navbar-logo-circle']} /> */}
      <div
        className={clsx(styles['logo-circle'], {
          [styles['logo-circle-animate']]: animate,
        })}
      />
      <img
        className={clsx(styles['logo-image'], {
          [styles['logo-image-animate']]: animate,
        })}
        src={logo}
        alt="логотип компании MarksGroup"
        loading="lazy"
      />
      {animatedIcon && (
        <img
          key={animatedIcon}
          className={clsx(styles['logo-hr'], {
            [styles['logo-hr-animate']]: animate,
            [styles['logo-hr-sidebar']]: isSideBar,
          })}
          src={animatedIcon}
          alt={animatedAlt}
        />
      )}
    </Link>
  );
}
