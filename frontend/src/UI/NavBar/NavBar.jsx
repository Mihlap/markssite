import { useState, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import clsx from 'clsx';
import { useNavLinks } from './hooks/useNavLinks';
import { useHrNavMeta } from './hooks/useHrNavMeta';

import styles from './style.module.scss';
import Logo from './logo/Logo';
import { handleCompanyAwareNavigation, isRouteActive } from './utils/navigation';
const SideBar = lazy(() => import('./sidebar/SideBar'));

gsap.registerPlugin(useGSAP, ScrollToPlugin);

const NavBar = () => {
  const navigate = useNavigate();

  const [linkChildren, setLinkChildren] = useState(false);
  const [openDropDownId, setOpenDropDownId] = useState(null);
  const [showDropdownContent, setShowDropdownContent] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const container = useRef();
  const burgerRef = useRef(null);

  // сustom hooks 
  const { pathname, hash, isCompany, isVacancyDetail, isInternship, linkBack, textBack, isHrPortal } = useHrNavMeta();
  const { primary, cta } = useNavLinks();

  // console.log(linkBack, textBack);
  // console.log(isInternship);

  const goToCompanySection = (hashOrId) => {
    if (!hashOrId) return;
    const hash = hashOrId.startsWith('#') ? hashOrId : `#${hashOrId}`;

    const doScroll = () => {
      gsap.to(window, {
        duration: 0.6,
        ease: 'power2.out',
        scrollTo: { y: hash, offsetY: 120 },
      });
    };

    if (pathname !== '/company') {
      closeDropdown(() => navigate(`/company${hash}`));
      return;
    }
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
    const FADE_MS = 100;
    setShowDropdownContent(false);

    if (!container.current) {
      setTimeout(finish, FADE_MS);
      return;
    }

    gsap.to(container.current, {
      delay: FADE_MS / 1000,
      duration: 0.1,
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

  const closeMenu = () => {
    burgerRef.current?.focus();
    setIsMenuOpen(false);
  };

  const handleSidebarNavigate = (path) => {
    if (!path) return;
    closeMenu();
    handlerLink(path);
  };

  const handleSidebarCompanySection = (hashOrId) => {
    if (!hashOrId) return;
    closeMenu();
    goToCompanySection(hashOrId);
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
        {isVacancyDetail ? (
          <Link className={styles['navbar-link_back']} to={linkBack}>
            Все {textBack}
          </Link>
        ) : (
          <Logo />
        )}
        <ul className={styles['navbar-list']}>
          {primary.map((item) => {
            if (item.children) {
              const isParentActive = item.children.some((el) => isRouteActive(pathname, hash, el.path));
              return (
                <li style={{ position: 'relative' }} key={item.id}>
                  <button
                    key={item.id}
                    className={clsx(styles['navbar-item'], isParentActive && styles['navbar-item-active'])}
                    onClick={() => {
                      if (openDropDownId === item.id) {
                        closeDropdown();
                      } else if (linkChildren) {
                        closeDropdown(() => reopenDropdown(item.id));
                      } else {
                        openDropdown(item.id);
                      }
                    }}>
                    <p>{item.label}</p>
                    <span aria-hidden="true" className={styles['navbar-item-arrow']}>
                      <span
                        className={clsx(
                          styles['navbar-item-arrow-icon'],
                          styles['navbar-item-arrow-icon--down'],
                          openDropDownId === item.id && styles['navbar-item-arrow-icon--hidden']
                        )}
                      />
                      <span
                        className={clsx(
                          styles['navbar-item-arrow-icon'],
                          styles['navbar-item-arrow-icon--up'],
                          openDropDownId !== item.id && styles['navbar-item-arrow-icon--hidden']
                        )}
                      />
                    </span>
                  </button>
                  {openDropDownId === item.id && (
                    <ul
                      className={styles['navbar-dropdown']}
                      style={{ opacity: showDropdownContent ? 1 : 0, transition: 'opacity 200ms ease' }}>
                      {item.children.map((el) => (
                        <li className={styles['navbar-dropdown-item']} key={el.id} role="menuitem">
                          <NavLink
                            to={el.path}
                            onClick={(event) =>
                              handleCompanyAwareNavigation({
                                event,
                                path: el.path,
                                fallbackId: el.id,
                                isCompany,
                                navigate: handlerLink,
                                goToCompanySection,
                              })
                            }
                            className={({ isActive }) => (isActive ? `${styles['navbar-item-active']}` : undefined)}>
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
                  {item.external ? (
                    item.path.startsWith('/hr/') && isHrPortal ? (
                      <NavLink
                        className={({ isActive }) => (isActive ? `${styles['navbar-item-active']}` : undefined)}
                        to={item.path}
                        end>
                        {item.label}
                      </NavLink>
                    ) : (
                      <a href={item.path} target="_blank" rel="noreferrer">
                        {item.label}
                      </a>
                    )
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={() => handlerLink(item.path)}
                      className={({ isActive }) => (isActive ? `${styles['navbar-item-active']}` : undefined)}
                      end>
                      {item.label}
                    </NavLink>
                  )}
                </li>
              );
            }
          })}
        </ul>
        <>
          <div className={styles['navbar-cta']}>
            {cta.map(({ id, label, path, external, variant }) => {
              const baseClasses = clsx(styles['navbar-link'], variant && styles[`navbar-link--${variant}`]);
              return external ? (
                <a key={id} href={path} className={styles['navbar-item-en']} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ) : (
                <NavLink
                  style={{ opacity: `${isVacancyDetail ? 0 : 1}` }}
                  key={id}
                  to={path}
                  className={({ isActive }) => clsx(baseClasses, isActive && styles['navbar-link--active'])}>
                  {label}
                </NavLink>
              );
            })}
          </div>
          <button
            ref={burgerRef}
            type="button"
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMenuOpen}
            className={clsx(styles['navbar-burger'], isMenuOpen && styles['navbar-burger--open'])}
            onClick={() => setIsMenuOpen((prev) => !prev)}>
            <span />
            <span />
            <span />
          </button>
        </>
      </div>
      <Suspense fallback={null}>
        <SideBar
          isMenuOpen={isMenuOpen}
          primary={primary}
          cta={cta}
          isCompany={isCompany}
          onNavigate={handleSidebarNavigate}
          onGoToCompanySection={handleSidebarCompanySection}
          onCloseMenu={closeMenu}
        />
      </Suspense>
    </nav>
  );
};

export default NavBar;
