import React, { useState, useEffect, useCallback } from 'react';
import styles from './Navbar.module.scss';
import { Link, useLocation } from 'react-router-dom';
// import { handleScroll, handleItemClick, handlePath, handleStoredClass } from './utils/navbarUtils';
import PortalMenuMobile from './NavBarPhone/PortalMenuMobile';

export default function PortalMenu({ user, handleMouseEnter, handleMouseLeave }) {
  const [activeClass, setActiveClass] = useState('');
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollDelta, setScrollDelta] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    const delta = currentScrollPos - prevScrollPos;

    if (window.innerWidth > 1024) {
      if (prevScrollPos > currentScrollPos || currentScrollPos <= 0) {
        setVisible(true);
        setScrollDelta(0);
      } else {
        setScrollDelta((prevDelta) => prevDelta + delta);

        if (scrollDelta > 100) {
          setVisible(false);
        }
      }
    }

    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos, scrollDelta]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    setActiveClass(currentPath);
  }, [location]);

  const handleItemClick = (path) => {
    setActiveClass(path);
    localStorage.setItem('activeClass', path);
  };

  useEffect(() => {
    const storedActiveClass = localStorage.getItem('activeClass');
    if (storedActiveClass) {
      setActiveClass(storedActiveClass);
    }
  }, []);
  return (
    <header className={`${styles.Navbar} ${visible ? '' : styles.hidden}`}>
      <nav className={styles.Navbar__nav}>
        <div className={styles.Navbar__container}>
          <div className={styles.Navbar__logo}>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={` ${styles.Navbar__title} ${activeClass === '/hr/vacanciesMain'}`}
              to="/hr/vacanciesMain"
              onClick={() => handleItemClick('/hr/vacanciesMain')}>
              <h1>MARKS GROUP</h1>

              <p className={styles.Navbar__title__hr}>HR</p>
            </Link>
          </div>
          <ul className={styles.Navbar__list}>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${
                activeClass === '/hr/vacanciesMain' ? styles.Navbar__item_open : ''
              }`}
              to="/hr/vacanciesMain"
              onClick={() => handleItemClick('/hr/vacanciesMain')}>
              <div>Главная</div>
            </Link>

            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${activeClass === '/hr/vacancies' ? styles.Navbar__item_open : ''}`}
              to="/hr/vacancies"
              onClick={() => handleItemClick('/hr/vacancies')}>
              <div>Работа у нас</div>
            </Link>

            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${activeClass === '/hr/internships' ? styles.Navbar__item_open : ''}`}
              to="/hr/internships"
              onClick={() => handleItemClick('/hr/internships')}>
              <div>Стажировки</div>
            </Link>
          </ul>
        </div>
      </nav>
      <div className={styles.Navbar__phone}>
        <PortalMenuMobile />
      </div>
    </header>
  );
}
