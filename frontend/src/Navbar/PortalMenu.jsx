import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.scss";
import { Link, useLocation } from "react-router-dom";
import {
  handleScroll,
  handleItemClick,
  handlePath,
  handleStoredClass,
} from "./utils/navbarUtils";
import PortalMenuMobile from "./NavBarPhone/PortalMenuMobile";

export default function PortalMenu({ user, handleMouseEnter, handleMouseLeave }) {
  const [activeClass, setActiveClass] = useState("");
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    setActiveClass(currentPath);
  }, [location]);

  const handleItemClick = (path) => {
    setActiveClass(path);
    localStorage.setItem("activeClass", path);
  };

  useEffect(() => {
    const storedActiveClass = localStorage.getItem("activeClass");
    if (storedActiveClass) {
      setActiveClass(storedActiveClass);
    }
  }, []);
  return (
    <header className={visible ? styles.header_visible : styles.header_hidden}>
      <nav className={styles.navbar}>
        <div className={styles.navbar__container}>
          <div className={styles.navbar__title_block}>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.navbar__title} ${activeClass === "/portal/vacanciesMain"}`}
              to="/portal/vacanciesMain"
              onClick={() => handleItemClick("/portal/vacanciesMain")}
            >
              <h1 className={styles.navbar__title} style={{display: 'flex', alignItems: 'center'}}>
                <span>MARKS GROUP</span>
                <p className={styles.navbar__title__hr} style={{marginLeft: '0.5rem'}}>HR</p>
              </h1>
            </Link>
          </div>
          <ul className={styles.navbar__list}> 
          <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.navbar__item} ${
                activeClass === "/portal/vacanciesMain" ? styles.navbar__item_open : ""
              }`}
              to="portal/vacanciesMain"
              onClick={() => handleItemClick("/portal/vacanciesMain")}
            >
              <div>Главная</div>
            </Link>           
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.navbar__item} ${
                activeClass === "/portal/vacancies" ? styles.navbar__item_open : ""
              }`}
              to="/portal/vacancies"
              onClick={() => handleItemClick("/portal/vacancies")}
              >
              <div>Работа у нас</div>
            </Link>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.navbar__item} ${
                activeClass === "/portal/internships" ? styles.navbar__item_open : ""
              }`}
              to="/portal/internships"
              onClick={() => handleItemClick("/portal/internships")}
            >
              <div>Стажировки</div>
            </Link>
           </ul>
        </div>
      </nav>
      <div className={styles.navbar_phone}>
        <PortalMenuMobile />
      </div>
    </header>
  );
};


