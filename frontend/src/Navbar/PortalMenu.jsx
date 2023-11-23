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

export default function PortalMenu({ handleMouseEnter, handleMouseLeave }) {
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
              className={`${styles.navbar__title} ${activeClass === "/"}`}
              to="/"
              onClick={() => handleItemClick("/")}
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
                activeClass === "/" ? styles.navbar__item_open : ""
              }`}
              to=""
              onClick={() => handleItemClick("/vacancies")}
            >
              <div>Главная</div>
            </Link>           
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.navbar__item} ${
                activeClass === "/vacancies" ? styles.navbar__item_open : ""
              }`}
              to="vacancies"
              onClick={() => handleItemClick("/vacancies")}
            >
              <div>Вакансии</div>
            </Link>
            {/* <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.navbar__item} ${
                activeClass === "/internships" ? styles.navbar__item_open : ""
              }`}
              to="/internships"
              onClick={() => handleItemClick("/internships")}
            >
              <div>Стажировки</div>
            </Link>
            <Link
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`${styles.navbar__item} ${
                activeClass === "/office" ? styles.navbar__item_open : ""
              }`}
              to="/office"
              onClick={() => handleItemClick("/office")}
            >
              <div>Офис</div>
            </Link> */}
           </ul>
        </div>
      </nav>
      <div className={styles.navbar_phone}>
        <PortalMenuMobile />
      </div>
    </header>
  );
};


