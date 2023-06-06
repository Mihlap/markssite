import React, { useRef, useState } from "react";
import { Link } from "react-scroll";
// import debounce from 'lodash.debounce';

// import logo from ".././icons/logo.svg";
import styles from "./Navbar.module.css";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

// тетс гита на сливание с новой веткой

const Navbar = ({ handleClickScroll, navOpen, setNavOpen, user }) => {
  const [clicked, setClicked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  function handleCheckboxChange() {
    setIsChecked(!isChecked);
  }
  function handleClick(to) {
    const activeNavItem = document.querySelector(".navbar_item.active");
    if (activeNavItem) {
      activeNavItem.classList.remove("active");
    }
    setClicked(!clicked);
    setActiveLink(to);
  }

  const openHandler = () => {
    setNavOpen((prevNavOpen) => !prevNavOpen);
  };

  const closeNavBar = () => {
    setNavOpen((prevNavOpen) => !prevNavOpen);
    setClicked(!clicked);
    setIsChecked(!isChecked);
  };

  const [scrollDirection, setScrollDirection] = useState("none");
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos > scrollPos.current) {
      setScrollDirection("down");
      setIsVisible(false);
    } else if (currentScrollPos < scrollPos.current) {
      setScrollDirection("up");
      setIsVisible(true);
    }
    scrollPos.current = currentScrollPos;
  };

  const scrollPos = useRef(0);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`${styles.fixed} ${
        isVisible ? styles.visible : styles.hidden
      }`}
    >
      <nav className={styles.navbar_desctop}>
        <div className={styles.navbar_container}>
          <div className={styles.navbar_title_block}>
            <NavLink to="/" onClick={handleClick}>
              <h1 className={styles.navbar_title}>MARKS GROUP</h1>
            </NavLink>
          </div>
          <ul className={styles.navbar_list}>
            <NavLink className={styles.navbar_item} to="/login">
              <div>войти</div>
            </NavLink>
            {user ? (
              <NavLink className={styles.navbar_item} to="/admin">
                <div>Добавить (проект / статью )</div>
              </NavLink>
            ) : null}

            <Link
              exact="true"
              className={`${styles.navbar_item} ${
                activeLink === "/competencies" ? styles.active : ""
              }`}
              to="competencies"
              onClick={() => handleClick("/competencies")}
              smooth={"true"}
              duration={500}
            >
              <li>Компетенции</li>
            </Link>
            <Link
              exact="true"
              className={`${styles.navbar_item} ${
                activeLink === "/projects" ? styles.active : ""
              }`}
              to="projects"
              onClick={() => handleClick("/projects")}
              smooth={"true"}
              duration={500}
            >
              <li>Проекты</li>
            </Link>
            <Link
              exact="true"
              className={`${styles.navbar_item} ${
                activeLink === "/publications" ? styles.active : ""
              }`}
              to="publications"
              onClick={() => handleClick("/publications")}
              smooth={"true"}
              duration={500}
            >
              <li>Публикации</li>
            </Link>
            <NavLink
              exact="true"
              className={`${styles.navbar_item} ${
                activeLink === "/company" ? styles.active : ""
              }`}
              to="company"
              onClick={() => handleClick("/company")}
              smooth={"true"}
              duration={500}
            >
              <li>О Компании</li>
            </NavLink>
            <NavLink
              exact="true"
              className={`${styles.navbar_item} ${
                activeLink === "/contacts" ? styles.active : ""
              }`}
              to="contacts"
              onClick={() => handleClick("/contacts")}
              smooth={"true"}
              duration={500}
            >
              <li>Контакты</li>
            </NavLink>
          </ul>
        </div>
      </nav>
      <div className={styles.navDesktop_container}>
        <nav>
          <div className={styles.navbar}>
            <div className={styles.logo}>
              <NavLink className={styles.logo_heading} to="/">
                <h1 className={styles.navbar_title}>MARKS GROUP</h1>
              </NavLink>
            </div>
            <div className={`${styles.container} ${styles.nav_container}`}>
              <div className={styles.cross_container}>
                <div className={styles.cross_block}>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    onClick={() => {
                      openHandler();
                      handleClickScroll();
                    }}
                  />
                  <div className={styles.hamburger_lines}>
                    <span className={`${styles.line} ${styles.line1}`}></span>
                    <span className={`${styles.line} ${styles.line2}`}></span>
                    <span className={`${styles.line} ${styles.line3}`}></span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: navOpen ? 0 : "100%", // Скрытие элемента за пределами экрана
                  width: "100%",
                  height: "100vh",
                  backgroundColor: "#f6f6f6",
                  transition: "left 0.5s ease-in-out", // Анимация скрытия/показа
                  marginTop: "60px",
                  zIndex: "9999",
                }}
              >
                <ul className={styles.menu_list}>
                  <li>
                    <NavLink
                      className={styles.menu_item}
                      to="/"
                      onClick={closeNavBar}
                    >
                      Главная
                    </NavLink>
                  </li>
                  <li>
                    <Link
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="competencies"
                      smooth={"true"}
                      duration={500}
                    >
                      Компетенции
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="projects"
                      smooth={"true"}
                      duration={500}
                    >
                      Проекты
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="publications1"
                      smooth={"true"}
                      duration={500}
                    >
                      Публикации
                    </Link>
                  </li>
                  <li>
                    <NavLink
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="company"
                      smooth={"true"}
                      duration={500}
                    >
                      О Компании
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="contacts"
                      smooth={"true"}
                      duration={500}
                    >
                      Контакты
                    </NavLink>
                  </li>
                </ul>
                <div className={styles.contact_info}>
                  <div className={styles.contact_info_block}>
                    {/* <div className={styles.contact_info_language}>EN | CN</div> */}
                    <NavLink
                      className={styles.contact_info_mail}
                      to="mailto:mail@marksgroup.ru"
                    >
                      mail@marksgroup.ru
                    </NavLink>
                    <NavLink
                      to={"tel:+74951201226"}
                      className={styles.contact_info_phone}
                      style={{ fontVariantNumeric: "lining-nums" }}
                    >
                      +7(495) 120-12-26
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
