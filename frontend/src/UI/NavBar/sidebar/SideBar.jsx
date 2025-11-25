import React, { useRef, useState, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { Link, NavLink, useLocation } from 'react-router-dom';

import styles from '../style.module.scss';
import { handleCompanyAwareNavigation, isRouteActive } from '../utils/navigation';

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
  const { pathname, hash } = useLocation();
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
          zIndex: 1,
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
        <nav className={styles['navbar-sidebar-nav']}>
          <ul className={styles['navbar-sidebar-list']}>
            {primary.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const parentActive =
                hasChildren && item.children.some((child) => isRouteActive(pathname, hash, child.path))
                  ? true
                  : isRouteActive(pathname, hash, item.path);

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
                    <li className={styles['navbar-sidebar-cta--contact-item']}>
                      <a href={path} target="_blank" rel="noreferrer" onClick={handleExternalClick}>
                        {label}
                      </a>
                    </li>
                    <li className={styles['navbar-sidebar-cta--contact-item']}>
                      <a href="mailto:mail@marksgroup.ru">mail@marksgroup.ru</a>
                    </li>
                    <li className={styles['navbar-sidebar-cta--contact-item']}>
                      <a href="tel:+74951201226">+7 (495) 120-12-26</a>
                    </li>
                  </ul>
                );
              }

              return (
                <Link key={id} to={path} className={styles['navbar-sidebar-cta--btn']} onClick={handleNavigate(path)}>
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
