import { useState, useRef, lazy, Suspense, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { NavLink, useNavigate, Link } from 'react-router';
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
  const [isNavbarHidden, setIsNavbarHidden] = useState(false);
  const container = useRef();

  // сustom hooks 
  const { pathname, hash, isCompany, isVacancyDetail, isProjectDetail, isArticleDetail, isJournalDetail, isInternship, linkBack, textBack, isHrPortal } = useHrNavMeta();
  const { primary, cta } = useNavLinks();

  // Прокрутка к якорю или элементу на странице
  const scrollToAnchor = (hashOrId) => {
    if (!hashOrId || typeof window === 'undefined') return false;
    const targetHash = hashOrId.startsWith('#') ? hashOrId : `#${hashOrId}`;
    const target = document.querySelector(targetHash);
    if (!target) return false;

    gsap.to(window, {
      duration: 0.6,
      ease: 'power2.out',
      scrollTo: { y: target, offsetY: 120 },
    });
    return true;
  };

  // Делим путь на базовый маршрут и хеш
  const getPathParts = (path) => {
    if (typeof path !== 'string') return { basePath: '', hash: '' };
    const [basePath, rawHash] = path.split('#');
    return { basePath, hash: rawHash ? `#${rawHash}` : '' };
  };

  // Переход к нужному разделу компании с учетом текущей страницы
  const goToCompanySection = (hashOrId) => {
    if (!hashOrId) return;
    const targetHash = hashOrId.startsWith('#') ? hashOrId : `#${hashOrId}`;

    if (pathname !== '/company') {
      closeDropdown(() => navigate(`/company${targetHash}`));
      return;
    }
    closeDropdown(() => {
      navigate({ pathname, hash: targetHash }, { replace: true });
      scrollToAnchor(targetHash);
    });
  };

  // Закрытие дропдауна с плавной анимацией
  const closeDropdown = useCallback((afterClose) => {
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
  }, []);

  // Открываем дропдаун по id
  const openDropdown = (id) => {
    setOpenDropDownId(id);
    setLinkChildren(true);
    setShowDropdownContent(false);
  };

  // Переоткрываем дропдаун после закрытия для плавного перехода
  const reopenDropdown = (id) => {
    const reopen = () => openDropdown(id);
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(reopen);
    } else {
      setTimeout(reopen, 0);
    }
  };

  // Навигация по ссылкам с предварительным закрытием меню
  const handlerLink = (path) => {
    if (!path) return;
    closeDropdown(() => {
      navigate(path);
    });
  };

  // Закрытие бургер-меню
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Навигация с учетом хеша и возможной прокрутки
  const navigateWithHash = (path) => {
    if (!path) return;
    const { basePath, hash: targetHash } = getPathParts(path);
    const sameRoute = !basePath || basePath === pathname;
    if (targetHash && sameRoute && hash === targetHash) {
      scrollToAnchor(targetHash);
      return;
    }
    navigate(path);
  };

  // Навигация из сайдбара
  const handleSidebarNavigate = (path) => {
    if (!path) return;
    closeMenu();
    navigateWithHash(path);
  };

  // Переход к разделам компании из сайдбара
  const handleSidebarCompanySection = (hashOrId) => {
    if (!hashOrId) return;
    closeMenu();
    goToCompanySection(hashOrId);
  };

  const NAV_CLOSED_HEIGHT = 60;
  const dropdownRef = useRef(null);

  // Рассчитываем высоту раскрытого меню для анимации
  const getOpenHeight = () => {
    const dropdownHeight = dropdownRef.current?.getBoundingClientRect().height ?? 0;
    if (!dropdownHeight) {
      return openDropDownId === 3 ? 240 : 284; // fallback
    }
    return Math.ceil(NAV_CLOSED_HEIGHT + dropdownHeight);
  };

  // Анимируем изменение высоты навбара при раскрытии дропдауна
  useGSAP(
    () => {
      if (!container.current || !linkChildren) return;

      gsap.to(container.current, {
        duration: 0.3,
        height: getOpenHeight(),
        ease: 'none',
        onStart: () => setShowDropdownContent(false),
        onComplete: () => setShowDropdownContent(true),
      });
    },
    { dependencies: [linkChildren, openDropDownId] }
  );

  // Прокручиваем к форме после загрузки, если в адресе есть #form
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hash !== '#form') return;
    let attempts = 0;
    let retryId;
    const tryScroll = () => {
      if (scrollToAnchor(hash) || attempts >= 5) return;
      attempts += 1;
      retryId = window.setTimeout(tryScroll, 150);
    };
    tryScroll();
    return () => window.clearTimeout(retryId);
  }, [hash, pathname]);

  // Закрываем дропдаун при клике или тапе вне него
  useEffect(() => {
    if (openDropDownId === null) return;

    const handleClickOutside = (event) => {
      const dropdownEl = dropdownRef.current;
      if (dropdownEl && dropdownEl.contains(event.target)) return;
      closeDropdown();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [closeDropdown, openDropDownId]);


  // Прячем/показываем навбар при прокрутке (кроме страниц вакансии/стажировки)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isVacancyDetail || isInternship) {
      setIsNavbarHidden(false);
      return;
    }
    let lastScrollY = window.scrollY;
    const MIN_DELTA = 4;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < MIN_DELTA) return;
      const nextDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      setIsNavbarHidden(nextDirection === 'down');
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVacancyDetail, isInternship]);

  return (
    <nav ref={container} className={clsx(styles['navbar'], isNavbarHidden && styles['navbar--hidden'])}>
      <div className={styles['navbar-top']}>
        {isVacancyDetail ? (
          <Link className={styles['navbar-link_back']} to={linkBack}>
            Все {textBack}
          </Link>
        ) : isProjectDetail ? (
          <Link className={styles['navbar-link_back']} to="/project">
            Все проекты
          </Link>
        ) : (isArticleDetail || isJournalDetail) ? (
          <Link className={styles['navbar-link_back']} to="/publication">
            Все статьи
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
                      ref={dropdownRef}
                      className={styles['navbar-dropdown']}
                      style={{ opacity: showDropdownContent ? 1 : 0, transition: 'opacity 200ms ease' }}>
                      {item.children.map((el) => {
                        const isDropdownActive = isRouteActive(pathname, hash, el.path);

                        return (
                          <li key={el.id} role="menuitem">
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
                              className={clsx(
                                styles['navbar-dropdown-item'],
                                isDropdownActive && styles['navbar-item-active']
                              )}>
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
                        );
                      })}
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
                // кнопка тут
                <button
                  style={{ opacity: `${isVacancyDetail ? 0 : 1}` }}
                  key={id}
                  className={clsx(baseClasses, styles['navbar-link--active'])}
                  type="button"
                  onClick={() => closeDropdown(() => navigateWithHash(path))}>
                  {label}
                </button>
              );
            })}
          </div>
          <button
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
