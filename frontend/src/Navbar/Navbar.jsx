import React, { memo, useState, useEffect, useCallback } from 'react';
import styles from './Navbar.module.scss';
import { NavLink } from 'react-router-dom';
import NavBarPhone from './NavBarPhone/NavBarPhone';


const Navbar = memo(({ handleMouseEnter, handleMouseLeave }) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollDelta, setScrollDelta] = useState(0);  

const handleScroll = useCallback(() => {
  const currentScrollPos = window.scrollY;
  const delta = currentScrollPos - prevScrollPos; 

  if (window.innerWidth > 1200) {
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
  
  return (
    <header className={`${styles.Navbar} ${visible ? '' : styles.hidden}`}>
      <nav className={styles.Navbar__nav}>
        <div className={styles.Navbar__container}>
          <div className={styles.Navbar__logo}>
            <NavLink
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              to="/"
              className={styles.Navbar__title}>
              <h1>MARKS GROUP</h1>
            </NavLink>
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
            <NavLink
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={({ isActive }) => `${styles.Navbar__item} ${isActive ? styles.Navbar__item_open : ''}`}
              to="/">
              <div>Главная</div>
            </NavLink>
            <NavLink
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={({ isActive }) => `${styles.Navbar__item} ${isActive ? styles.Navbar__item_open : ''}`}
              to="/project">
              <div>Проекты</div>
            </NavLink>
            <NavLink
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={({ isActive }) => `${styles.Navbar__item} ${isActive ? styles.Navbar__item_open : ''}`}
              to="/publication">
              <div>Публикации</div>
            </NavLink>
            {/* <NavLink
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={({ isActive }) => `${styles.Navbar__item} ${isActive ? styles.Navbar__item_open : ''}`}
              to="/journalPage">
              <div>MARKS journal</div>
            </NavLink> */}
            <NavLink
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={({ isActive }) => `${styles.Navbar__item} ${isActive ? styles.Navbar__item_open : ''}`}
              to="/company">
              <div>О Компании</div>
            </NavLink>
            <NavLink
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={({ isActive }) => `${styles.Navbar__item} ${isActive ? styles.Navbar__item_open : ''}`}
              to="/portal/vacanciesMain"
              target="_blank">
              <div>HR портал</div>
            </NavLink>
            <NavLink
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={({ isActive }) => `${styles.Navbar__item} ${isActive ? styles.Navbar__item_open : ''}`}
              to="/contacts">
              <div>Контакты</div>
            </NavLink>
            <NavLink
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              to="https://marksgroup.org/"
              className={({ isActive }) => `${styles.Navbar__item} ${isActive ? styles.Navbar__item_open : ''}`}>
              <div>EN</div>
            </NavLink>
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
