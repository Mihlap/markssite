import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useNavLinks } from './hooks/useNavLinks';

import styles from './style.module.scss';
import Logo from './logo/Logo';
gsap.registerPlugin(useGSAP);

const NavBar = () => {
  const navigate = useNavigate();
  const [linkChildren, setLinkChildren] = useState(false);
  const [openDropDownId, setOpenDropDownId] = useState(null);
  const { primary, cta } = useNavLinks();

  const container = useRef();

  const closeDropdown = (afterClose) => {
    const finish = () => {
      setLinkChildren(false);
      setOpenDropDownId(null);
      if (typeof afterClose === 'function') {
        afterClose();
      }
    };

    if (!container.current) {
      finish();
      return;
    }

    gsap.to(container.current, {
      duration: 0.2,
      ease: 'none',
      height: 60,
      onComplete: finish,
    });
  };

  const openDropdown = (id) => {
    setOpenDropDownId(id);
    setLinkChildren(true);
  };

  const reopenDropdown = (id) => {
    const reopen = () => openDropdown(id);
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(reopen);
    } else {
      setTimeout(reopen, 0);
    }
  };

  const handlerLink = (path) => {
    if (!path) return;
    closeDropdown(() => {
      navigate(path);
    });
  };

  useGSAP(
    () => {
      if (!container.current) return;

      if (linkChildren) {
        // Показать и опустить вниз
        gsap.to(container.current, {
          duration: 0.2,
          height: `${openDropDownId === 3 ? '216px' : '260px'}`,
          ease: 'none',
        });
      }
    },
    { dependencies: [linkChildren] }
  );

  return (
    <nav ref={container} className={styles['navbar']}>
      <div className={styles['navbar-top']}>
        <Logo />
        <ul className={styles['navbar-list']}>
          {primary.map((item) => {
            if (item.children) {
              return (
                <li style={{ position: 'relative' }} key={item.id}>
                  <button
                    key={item.id}
                    className={styles['navbar-item']}
                    onClick={() => {
                      if (openDropDownId === item.id) {
                        closeDropdown();
                      } else if (linkChildren) {
                        closeDropdown(() => reopenDropdown(item.id));
                      } else {
                        openDropdown(item.id);
                      }
                    }}>
                    {item.label}
                  </button>
                  {openDropDownId === item.id && (
                    <ul className={styles['navbar-dropdown']}>
                      {item.children.map((el) => (
                        <li className={styles['navbar-dropdown-item']} key={el.id} role="menuitem">
                          <div className={styles['navbar-dropdown-item_label']}>{el.label}</div>
                          <div className={styles['navbar-dropdown-item_description']}>
                            {el.description.includes('ведущих') ? (
                              <>
                                {el.description.split('ведущих')[0]}
                                <span className={styles['break']}>ведущих</span>
                                {el.description.split('ведущих')[1]}
                              </>
                            ) : (
                              el.description
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            } else {
              return (
                <li className={styles['navbar-item']} key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={() => handlerLink(item.path)}
                    className={({ isActive }) => (isActive ? `${styles['navbar-item-active']}` : undefined)}
                    end>
                    {item.label}
                  </NavLink>
                </li>
              );
            }
          })}
        </ul>
        <div className={styles['navbar-cta']}>
          {cta.map(({ id, label, path, external, variant }) => {
            const baseClasses = clsx(styles['navbar-link'], variant && styles[`navbar-link--${variant}`]);
            return external ? (
              <a key={id} href={path} className={styles['navbar-item-en']} target="_blank" rel="noreferrer">
                {label}
              </a>
            ) : (
              <NavLink
                key={id}
                to={path}
                className={({ isActive }) => clsx(baseClasses, isActive && styles['navbar-link--active'])}>
                {label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
