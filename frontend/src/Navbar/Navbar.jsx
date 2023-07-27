import React, { useState, useEffect } from "react";
import styles from "./Navbar.module.scss";
import { Link, useLocation } from "react-router-dom";
import NavBarPhone from "./NavBarPhone/NavBarPhone";

export default function Navbar() {
  // State для хранения активного класса
  const [activeClass, setActiveClass] = useState("");

  // Hook useLocation для получения текущего пути страницы
  const location = useLocation();
  // Эффект, который будет срабатывать при изменении пути
  useEffect(() => {
    // Получаем путь из location объекта
    const currentPath = location.pathname;
    // Обновляем состояние активного класса, основываясь на текущем пути
    setActiveClass(currentPath);
  }, [location]);

  // Функция для обработки клика на элементе меню
  const handleItemClick = (path) => {
    // Обновляем состояние активного класса при клике на элемент меню
    setActiveClass(path);
    // Сохраняем состояние в localStorage
    localStorage.setItem("activeClass", path);
  };

  // Получаем значение активного класса из localStorage при загрузке компонента
  useEffect(() => {
    const storedActiveClass = localStorage.getItem("activeClass");
    if (storedActiveClass) {
      setActiveClass(storedActiveClass);
    }
  }, []);
  return (
    <header>
      <nav className={styles.navbar}>
        <div className={styles.navbar__container}>
          <div className={styles.navbar__title_block}>
            <Link
              className={`${styles.navbar__title} ${
                activeClass === "/"
              }`}
              to="/"
              onClick={() => handleItemClick("/")}
            >
              <h1 className={styles.navbar__title}>MARKS GROUP</h1>
            </Link>
          </div>
          <ul className={styles.navbar__list}>
            <Link
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
            </Link>
            <Link
              className={`${styles.navbar__item} ${
                activeClass === "/competention" ? styles.navbar__item_open : ""
              }`}
              to="/competention"
              onClick={() => handleItemClick("/competention")}
            >
              <div>Компетенции</div>
            </Link>
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
