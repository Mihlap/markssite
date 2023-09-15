import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.scss";
import { Link, useLocation } from "react-router-dom";
import {
  handleScroll,
  handleItemClick,
  handlePath,
  handleStoredClass,
} from "./utils/navbarUtils";
import NavBarPhone from "./NavBarPhone/NavBarPhone";

export default function Navbar() {
  const [activeClass, setActiveClass] = useState("");
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrollDelta, setScrollDelta] = useState(0);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
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
              className={`${styles.navbar__title} ${activeClass === "/"}`}
              to="/"
              onClick={() => handleItemClick("/")}
            >
              <h1 className={styles.navbar__title}>MARKS GROUP</h1>
            </Link>
          </div>
          <ul className={styles.navbar__list}>
            {/* <Link
              className={`${styles.navbar__item} ${
                activeClass === "/signup" ? styles.navbar__item_open : ""
              }`}
              to="/signup"
              onClick={() => handleItemClick("/signup")}
            >
              <div>signup</div>
            </Link>
            <Link
              className={`${styles.navbar__item} ${
                activeClass === "/login" ? styles.navbar__item_open : ""
              }`}
              to="/login"
              onClick={() => handleItemClick("/login")}
            >
              <div>login</div>
            </Link> */}
            {/* <Link
              className={`${styles.navbar__item} ${
                activeClass === "/competention" ? styles.navbar__item_open : ""
              }`}
              to="/competention"
              onClick={() => handleItemClick("/competention")}
            >
              <div>Компетенции</div>
            </Link> */}
            <Link
              className={`${styles.navbar__item} ${
                activeClass === "/project" ? styles.navbar__item_open : ""
              }`}
              to="/project"
              onClick={() => handleItemClick("/project")}
            >
              <div>Проекты</div>
            </Link>
            <Link
              className={`${styles.navbar__item} ${
                activeClass === "/publication" ? styles.navbar__item_open : ""
              }`}
              to="/publication"
              onClick={() => handleItemClick("/publication")}
            >
              <div>Публикации</div>
            </Link>
            <Link
              className={`${styles.navbar__item} ${
                activeClass === "/company" ? styles.navbar__item_open : ""
              }`}
              to="/company"
              onClick={() => handleItemClick("/company")}
            >
              <div>О Компании</div>
            </Link>
            <Link
              className={`${styles.navbar__item} ${
                activeClass === "/contacts" ? styles.navbar__item_open : ""
              }`}
              to="/contacts"
              onClick={() => handleItemClick("/contacts")}
            >
              <div>Контакты</div>
            </Link>
          </ul>
        </div>
      </nav>
      <div className={styles.navbar_phone}>
        <NavBarPhone />
      </div>
    </header>
  );
}
