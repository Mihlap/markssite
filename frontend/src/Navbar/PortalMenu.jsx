import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { handleScroll, handleItemClick, handlePath, handleStoredClass } from './utils/navbarUtils';
import PortalMenuMobile from './NavBarPhone/PortalMenuMobile';

export default function PortalMenu({ user, handleMouseEnter, handleMouseLeave }) {
  const [activeClass, setActiveClass] = useState('');
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollDelta, setScrollDelta] = useState(0);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    const delta = currentScrollPos - prevScrollPos; // Сколько пикселей прокрутились

    if (window.innerWidth > 1024) {
      if (prevScrollPos > currentScrollPos || currentScrollPos <= 0) {
        // Если пользователь прокручивает вверх или прокручивает в самый верх
        setVisible(true);
        setScrollDelta(0); // сбросите scrollDelta
      } else {
        // Иначе, пользователь прокручивает вниз
        setScrollDelta((prevDelta) => prevDelta + delta); // Обновляем scrollDelta

        if (scrollDelta > 100) {
          // Проверяем, превышает ли scrollDelta 100 пикселей
          setVisible(false);
        }
      }
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

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
              className={` ${styles.Navbar__title} ${activeClass === '/portal/vacanciesMain'}`}
              to="/portal/vacanciesMain"
              onClick={() => handleItemClick('/portal/vacanciesMain')}
            >
              <h1>MARKS GROUP</h1>

              <p className={styles.Navbar__title__hr}>HR</p>
            </Link>
          </div>
          <ul className={styles.Navbar__list}>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${
                activeClass === '/portal/vacanciesMain' ? styles.Navbar__item_open : ''
              }`}
              to="/portal/vacanciesMain"
              onClick={() => handleItemClick('/portal/vacanciesMain')}
            >
              <div>Главная</div>
            </Link>

            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${
                activeClass === '/portal/vacancies' ? styles.Navbar__item_open : ''
              }`}
              to="/portal/vacancies"
              onClick={() => handleItemClick('/portal/vacancies')}
            >
              <div>Работа у нас</div>
            </Link>

            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${
                activeClass === '/portal/internships' ? styles.Navbar__item_open : ''
              }`}
              to="/portal/internships"
              onClick={() => handleItemClick('/portal/internships')}
            >
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
