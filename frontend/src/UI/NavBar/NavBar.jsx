import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useNavLinks } from './hooks/useNavLinks';

import styles from './style.module.scss';
import Logo from './logo/Logo';
gsap.registerPlugin(useGSAP, ScrollToPlugin);

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCompany = location.pathname.startsWith('/company');
  const [linkChildren, setLinkChildren] = useState(false);
  const [openDropDownId, setOpenDropDownId] = useState(null);
  const [showDropdownContent, setShowDropdownContent] = useState(false);
  const { primary, cta } = useNavLinks();

  const container = useRef();

  // Smoothly navigate to a section on the Company page (hash-aware)
  const goToCompanySection = (hashOrId) => {
    if (!hashOrId) return;
    const hash = hashOrId.startsWith('#') ? hashOrId : `#${hashOrId}`;

    const doScroll = () => {
      // close dropdown first, then scroll
      gsap.to(window, {
        duration: 0.6,
        ease: 'power2.out',
        scrollTo: { y: hash, offsetY: 120 },
      });
    };

    if (location.pathname !== '/company') {
      // navigate to Company with hash; Company component will also honor the hash
      closeDropdown(() => navigate(`/company${hash}`));
      return;
    }
    // Already on /company: close dropdown and scroll
    closeDropdown(doScroll);
  };

  const closeDropdown = (afterClose) => {
    const finish = () => {
      setShowDropdownContent(false);
      setLinkChildren(false);
      setOpenDropDownId(null);
      if (typeof afterClose === 'function') {
        afterClose();
      }
    };
    const FADE_MS = 200; // keep in sync with CSS opacity transition
    setShowDropdownContent(false);

    if (!container.current) {
      setTimeout(finish, FADE_MS);
      return;
    }

    gsap.to(container.current, {
      delay: FADE_MS / 1000,
      duration: 0.3,
      ease: 'none',
      height: 60,
      onComplete: finish,
    });
  };

  const openDropdown = (id) => {
    setOpenDropDownId(id);
    setLinkChildren(true);
    setShowDropdownContent(false);
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
          duration: 0.3,
          height: `${openDropDownId === 3 ? '216px' : '260px'}`,
          ease: 'none',
          onStart: () => setShowDropdownContent(false),
          onComplete: () => setShowDropdownContent(true),
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
                    <ul
                      className={styles['navbar-dropdown']}
                      style={{ opacity: showDropdownContent ? 1 : 0, transition: 'opacity 200ms ease' }}>
                      {item.children.map((el) => (
                        <li className={styles['navbar-dropdown-item']} key={el.id} role="menuitem">
                          <NavLink
                            to={el.path}
                            onClick={(e) => {
                              if (isCompany) {
                                e.preventDefault();
                                const anchorFromPath = el.path && el.path.includes('#') ? el.path.split('#')[1] : null;
                                goToCompanySection(anchorFromPath || `section${el.id}`);
                              } else {
                                handlerLink(el.path);
                              }
                            }}>
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
                          </NavLink>
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
