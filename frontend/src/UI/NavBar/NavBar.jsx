import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useNavLinks } from './hooks/useNavLinks';

import styles from './style.module.scss';
import Logo from './Logo';

const NavBar = () => {
  const { primary, cta } = useNavLinks();
  return (
    <nav className={styles['navbar']}>
      <Logo />
      <ul className={styles['navbar-list']}>
        {primary.map((l) => (
          <li className={styles['navbar-item']} key={l.path}>
            <NavLink
              to={l.path}
              className={({ isActive }) => (isActive ? `${styles['navbar-item-active']}` : undefined)}
              end>
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className={styles['navbar-cta']}>
        {cta.map(({ label, path, external, variant }) => {
          const key = path || label;
          const baseClasses = clsx(styles['navbar-link'], variant && styles[`navbar-link--${variant}`]);
          return external ? (
            <a key={key} href={path} className={styles['navbar-item-en']} target="_blank" rel="noreferrer">
              {label}
            </a>
          ) : (
            <NavLink
              key={key}
              to={path}
              className={({ isActive }) => clsx(baseClasses, isActive && styles['navbar-link--active'])}>
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default NavBar;
