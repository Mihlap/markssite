import React, { memo, useState, useEffect, useCallback } from 'react';
import styles from './Navbar.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { handleScroll, handleItemClick, handlePath, handleStoredClass } from './utils/navbarUtils';
import NavBarPhone from './NavBarPhone/NavBarPhone';

const Navbar = memo(({ handleMouseEnter, handleMouseLeave }) => {
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

  const handleItemClick = useCallback((path) => {
    setActiveClass(path);
    localStorage.setItem('activeClass', path);
  }, []);

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
              className={` ${styles.Navbar__title} ${activeClass === '/'}`}
              to="/"
              onClick={() => handleItemClick('/')}>
              <h1>MARKS GROUP</h1>
            </Link>
          </div>
          <ul className={styles.Navbar__list}>
            {/* <Link
              className={`${styles.Navbar__item} ${
                activeClass === "/signup" ? styles.Navbar__item_open : ""
              }`}
              to="/signup"
              onClick={() => handleItemClick("/signup")}
            >
              <div>signup</div>
            </Link>
            <Link
              className={`${styles.Navbar__item} ${
                activeClass === "/login" ? styles.Navbar__item_open : ""
              }`}
              to="/login"
              onClick={() => handleItemClick("/login")}
            >
              <div>login</div>
            </Link> */}
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${activeClass === '/' ? styles.Navbar__item_open : ''}`}
              to="/"
              onClick={() => handleItemClick('/')}>
              <div>Главная</div>
            </Link>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${activeClass === '/project' ? styles.Navbar__item_open : ''}`}
              to="/project"
              onClick={() => handleItemClick('/project')}>
              <div>Проекты</div>
            </Link>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${activeClass === '/publication' ? styles.Navbar__item_open : ''}`}
              to="/publication"
              onClick={() => handleItemClick('/publication')}>
              <div>Публикации</div>
            </Link>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${activeClass === '/company' ? styles.Navbar__item_open : ''}`}
              to="/company"
              onClick={() => handleItemClick('/company')}>
              <div>О Компании</div>
            </Link>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${
                activeClass === '/portal/vacanciesMain' ? styles.Navbar__item_open : ''
              }`}
              to="/portal/vacanciesMain"
              target="_blank"
              onClick={() => handleItemClick('/portal/vacanciesMain')}>
              <div>HR портал</div>
            </Link>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${activeClass === '/contacts' ? styles.Navbar__item_open : ''}`}
              to="/contacts"
              onClick={() => handleItemClick('/contacts')}>
              <div>Контакты</div>
            </Link>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.Navbar__item} ${activeClass === '/marksgroup' ? styles.Navbar__item_open : ''}`}
              to="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = 'https://marksgroup.org/';
              }}>
              <div>EN</div>
            </Link>
          </ul>
        </div>
      </nav>
      <div className={styles.Navbar__phone}>
        <NavBarPhone />
      </div>
    </header>
  );
});

export default Navbar;
