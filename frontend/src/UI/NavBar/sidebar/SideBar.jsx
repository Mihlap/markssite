import React, { useRef, useState, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { Link, NavLink, useLocation, matchPath } from 'react-router-dom';

import styles from '../style.module.scss';
import { handleCompanyAwareNavigation, isRouteActive } from '../utils/navigation';

import iconLogo from '../icon/logo.svg';
import iconHr from '../icon/hr.svg';

export default function SideBar({
  isMenuOpen,
  primary = [],
  cta = [],
  isCompany,
  onNavigate,
  onGoToCompanySection,
  onCloseMenu,
}) {
  const sidebarRef = useRef(null);
  const location = useLocation();
  const { pathname, hash } = location;
  const search = new URLSearchParams(location.search);
  const isInternship = search.get('type') === 'internship' || search.get('type') === 'vacancy';
  const isVacancyDetail = !!matchPath({ path: '/hr/vacancies/:id', end: true }, pathname);
  const showSidebarLogo = pathname === '/hr/home' || pathname === '/hr/internships' || pathname === '/hr/vacancies' || search.get('type') === 'internship' || search.get('type') === 'vacancy';
  const linkBack = isInternship ? '/hr/internships' : '/hr/vacancies';
  const textBack = isInternship ? 'стажировки' : 'вакансии';
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const activeDropdownId = useMemo(() => {
    const dropdown = primary.find(
      (item) => Array.isArray(item.children) && item.children.some((child) => isRouteActive(pathname, hash, child.path))
    );
    return dropdown?.id ?? null;
  }, [primary, pathname, hash]);

  useEffect(() => {
    if (isMenuOpen) {
      setOpenDropdownId((prev) => prev ?? activeDropdownId);
    } else {
      setOpenDropdownId(null);
    }
  }, [isMenuOpen, activeDropdownId]);

  useGSAP(
    () => {
      if (!sidebarRef.current) return;

      if (isMenuOpen) {
        gsap.fromTo(
          sidebarRef.current,
          { x: '-100%', autoAlpha: 0 },
          { x: '0%', autoAlpha: 1, duration: 0.4, ease: 'power2.out' }
        );
      } else {
        gsap.to(sidebarRef.current, {
          x: '-100%',
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    },
    { dependencies: [isMenuOpen] }
  );

  const toggleDropdown = (id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  const handleNavigate = (path) => (event) => {
    if (!path) return;
    event.preventDefault();
    onNavigate?.(path);
  };

  const handleChildNavigate = (child) => (event) => {
    handleCompanyAwareNavigation({
      event,
      path: child?.path,
      fallbackId: child?.id,
      isCompany,
      navigate: onNavigate,
      goToCompanySection: onGoToCompanySection,
    });
  };

  const handleExternalClick = () => {
    onCloseMenu?.();
  };

  return (
    <div
      ref={sidebarRef}
      className={clsx(styles['navbar-sidebar'], isMenuOpen && styles['navbar-sidebar--visible'])}
      aria-hidden={!isMenuOpen}>
      <div className={styles['navbar-sidebar-content']}>
        {showSidebarLogo && (
            <div className={styles['navbar-sidebar-logo']}>
              <img src={iconLogo} alt="iconLogo" />
              <img src={iconHr} alt="iconHr" />
            </div>
          )}
        <nav className={styles['navbar-sidebar-nav']}>
          <ul
            className={clsx(
              styles['navbar-sidebar-list'],
              showSidebarLogo && styles['navbar-sidebar-list--with-logo']
            )}>
            {primary.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const parentActive =
                hasChildren && item.children.some((child) => isRouteActive(pathname, hash, child.path))
                  ? true
                  : isRouteActive(pathname, hash, item.path);
              const openInNewTab = item?.external || item?.path === '/hr/home';
              const isActive = isRouteActive(pathname, hash, item.path);

              if (hasChildren) {
                return (
                  <li key={item.id} className={styles['navbar-sidebar-item']}>
                    <button
                      type="button"
                      className={clsx(
                        styles['navbar-sidebar-button'],
                        parentActive && styles['navbar-sidebar-button--active']
                      )}
                      onClick={() => toggleDropdown(item.id)}>
                      <span>{item.label}</span>
                      <span aria-hidden="true" className={styles['navbar-item-arrow']}>
                        <span
                          className={clsx(
                            styles['navbar-item-arrow-icon'],
                            styles['navbar-item-arrow-icon--down'],
                            openDropdownId === item.id && styles['navbar-item-arrow-icon--hidden']
                          )}
                        />
                        <span
                          className={clsx(
                            styles['navbar-item-arrow-icon'],
                            styles['navbar-item-arrow-icon--up'],
                            openDropdownId !== item.id && styles['navbar-item-arrow-icon--hidden']
                          )}
                        />
                      </span>
                    </button>
                    {openDropdownId === item.id && (
                      <ul className={styles['navbar-sidebar-sublist']}>
                        {item.children.map((child) => {
                          const cut = child.description.replace(/(статьи).*/i, '$1');
                          return (
                            <li key={child.id} className={styles['navbar-sidebar-subitem']}>
                              <NavLink
                                to={child.path}
                                className={({ isActive }) =>
                                  clsx(styles['navbar-sidebar-link'], isActive && styles['navbar-sidebar-link--active'])
                                }
                                onClick={handleChildNavigate(child)}>
                                <div className={styles['navbar-sidebar-linkLabel']}>{child.label}</div>

                                {child.description ? (
                                  <div className={styles['navbar-sidebar-linkDescription']}>{cut}</div>
                                ) : null}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              if (openInNewTab) {
                return (
                  <li key={item.id} className={styles['navbar-sidebar-item']}>
                    <a
                      href={item.path}
                      className={clsx(styles['navbar-sidebar-link'], isActive && styles['navbar-sidebar-link--active'])}
                      target="_blank"
                      rel="noreferrer"
                      onClick={handleExternalClick}>
                      {item.label}
                    </a>
                  </li>
                );
              }

              return (
                <li key={item.id} className={styles['navbar-sidebar-item']}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      clsx(styles['navbar-sidebar-link'], isActive && styles['navbar-sidebar-link--active'])
                    }
                    end
                    onClick={handleNavigate(item.path)}>
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
        {cta.length > 0 && (
          <div className={styles['navbar-sidebar-cta']}>
            {cta.map(({ id, label, path, external, variant }) => {
              if (external) {
                return (
                  <ul key={id} className={styles['navbar-sidebar-cta--contact-list']}>
                    {!isVacancyDetail && (
                      <li className={styles['navbar-sidebar-cta--contact-item']}>
                        <a href={path} target="_blank" rel="noreferrer" onClick={handleExternalClick}>
                          {label}
                        </a>
                      </li>
                    )}
                    <li className={styles['navbar-sidebar-cta--contact-item']}>
                      <a href="mailto:mail@marksgroup.ru">mail@marksgroup.ru</a>
                    </li>
                    <li className={styles['navbar-sidebar-cta--contact-item']}>
                      <a href="tel:+74951201226">+7 (495) 120-12-26</a>
                    </li>
                  </ul>
                );
              }
              // вот эта кнопка
              if (isVacancyDetail) {
                return (
                  <React.Fragment key={id}>
                    <Link to={linkBack} className={styles['navbar-link_back']} onClick={handleNavigate(linkBack)}>
                      Все {textBack}
                    </Link>
                    <ul className={styles['navbar-sidebar-cta--contact-list']}>
                      <li className={styles['navbar-sidebar-cta--contact-item']}>
                        <a href="mailto:mail@marksgroup.ru">mail@marksgroup.ru</a>
                      </li>
                      <li className={styles['navbar-sidebar-cta--contact-item']}>
                        <a href="tel:+74951201226">+7 (495) 120-12-26</a>
                      </li>
                    </ul>
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={id}>
                  <Link key={id} to={path} className={styles['navbar-sidebar-cta--btn']} onClick={handleNavigate(path)}>
                    {label}
                  </Link>
                  <ul className={styles['navbar-sidebar-cta--contact-list']}>
                    <li className={styles['navbar-sidebar-cta--contact-item']}>
                      <a href="mailto:mail@marksgroup.ru">mail@marksgroup.ru</a>
                    </li>
                    <li className={styles['navbar-sidebar-cta--contact-item']}>
                      <a href="tel:+74951201226">+7 (495) 120-12-26</a>
                    </li>
                  </ul>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
