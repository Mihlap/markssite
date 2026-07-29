import React, { useRef, useLayoutEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/Slice/authSlice';
import { resetCurrentPage } from '../../store/Slice/userSlice';
import { Icon7, Icon8 } from './icon';
import { useAdminUser } from '../hooks/useAdminUser';
import MENU_ITEMS from './const/items';

import styles from './Navbar.module.scss';

export default function AddNavbar({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const itemRefs = useRef({});
  const indicatorRef = useRef(null);

  const { role } = useAdminUser(user);
  const visibleItems = MENU_ITEMS.filter((item) => item.roles.includes(role));

  const activeItem = visibleItems.find((item) => pathname.startsWith(item.path))?.name;

  useLayoutEffect(() => {
    const item = itemRefs.current[activeItem];
    if (!item || !indicatorRef.current) return;

    indicatorRef.current.style.top = `${item.offsetTop + 10}px`;
  }, [activeItem]);

  const handleLogout = async () => {
    navigate('/', { replace: true });
    dispatch(resetCurrentPage());
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error('Ошибка при выходе из системы', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Icon8 />
      </div>
      <ul className={styles.list}>
        {visibleItems.map(({ name, path, Icon, label }) => (
          <li key={name}>
            <NavLink
              ref={(el) => (itemRefs.current[name] = el)}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              to={path}
              end>
              <Icon />
              <p>{label}</p>
            </NavLink>
          </li>
        ))}
        <div className={styles.indicator} ref={indicatorRef} />
      </ul>
      <button className={styles.logout} type="button" onClick={handleLogout}>
        <Icon7 />
        <p>Выйти из аккаунта</p>
      </button>
    </nav>
  );
}
