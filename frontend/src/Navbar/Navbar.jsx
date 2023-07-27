import React, { useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";

// тетс гита на сливание с новой веткой

const Navbar = ({ handleClickScroll, navOpen, setNavOpen }) => {
  const [clicked, setClicked] = useState(false);
  const [isChecked, setIsChecked] = useState(() => {
    const activeNavItem = localStorage.getItem("activeNavItem");
    return activeNavItem
      ? localStorage.getItem(`${activeNavItem}_isChecked`) === "true"
      : false;
  });
  const [activeLink, setActiveLink] = useState(() => {
    const activeNavItem = localStorage.getItem("activeNavItem");
    return activeNavItem ? activeNavItem : null;
  });

  function handleClick(to) {
    const activeNavItem = document.querySelector(".navbar_item.active");
    if (activeNavItem) {
      activeNavItem.classList.remove("active");
    }
    setClicked(!clicked);
    setActiveLink(to);
    setIsChecked(localStorage.getItem(`${to}_isChecked`) === "true");
    localStorage.setItem("activeNavItem", to);
  }

  function handleCheckboxChange(event) {
    const { checked } = event.target;
    setIsChecked(checked);
    localStorage.setItem(`${activeLink}_isChecked`, checked.toString());
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
  const scrollPos = useRef(0);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    if (currentScrollPos > scrollPos.current) {
      setScrollDirection("down");
      setIsVisible(false);
    } else if (currentScrollPos < scrollPos.current) {
      setScrollDirection("up");
      setIsVisible(true);
    }
    scrollPos.current = currentScrollPos;
  };

  useEffect(() => {
    const activeNavItem = document.querySelector(".navbar_item.active");
    if (activeNavItem) {
      activeNavItem.classList.remove("active");
    }
    const newActiveItem = document.querySelector(
      `.navbar_item[href="${activeLink}"]`
    );
    if (newActiveItem) {
      newActiveItem.classList.add("active");
    }
  }, [activeLink]);

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
            <Link to="/" onClick={handleClick}>
              <h1 className={styles.navbar_title}>MARKS GROUP</h1>
            </Link>
          </div>
          <ul className={styles.navbar_list}>
            <Link className={styles.navbar_item} to="/signup">
              <div>signup</div>
            </Link>
            <Link className={styles.navbar_item} to="/login">
              <div>login</div>
            </Link>

            <Link
              exact="true"
              className={`${styles.navbar_item} ${
                activeLink === "/competention" ? styles.active : ""
              }`}
              to="/competention"
              onClick={() => handleClick("/competention")}
              smooth={"true"}
            >
              <li>Компетенции</li>
            </Link>
            <Link
              exact="true"
              className={`${styles.navbar_item} ${
                activeLink === "/project" ? styles.active : ""
              }`}
              to="/project"
              onClick={() => handleClick("/project")}
              smooth={"true"}
            >
              <li>Проекты</li>
            </Link>
            <Link
              exact="true"
              className={`${styles.navbar_item} ${
                activeLink === "/publication" ? styles.active : ""
              }`}
              to="/publication"
              onClick={() => handleClick("/publication")}
              smooth={"true"}
            >
              <li>Публикации</li>
            </Link>
            <Link
              exact="true"
              className={`${styles.navbar_item} ${
                activeLink === "/company" ? styles.active : ""
              }`}
              to="/company"
              onClick={() => handleClick("/company")}
              smooth={"true"}
            >
              <li>О Компании</li>
            </Link>
            <Link
              exact="true"
              className={`${styles.navbar_item} ${
                activeLink === "/contacts" ? styles.active : ""
              }`}
              to="/contacts"
              onClick={() => handleClick("/contacts")}
              smooth={"true"}
            >
              <li>Контакты</li>
            </Link>
          </ul>
        </div>
      </nav>
      <div className={styles.navDesktop_container}>
        <nav>
          <div className={styles.navbar}>
            <div className={styles.logo}>
              <Link className={styles.logo_heading} to="/">
                <h1 className={styles.navbar_title}>MARKS GROUP</h1>
              </Link>
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
                    <Link
                      className={styles.menu_item}
                      to="/"
                      onClick={closeNavBar}
                    >
                      Главная
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="/competention"
                      smooth={"true"}
                    >
                      Компетенции
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="/project"
                      smooth={"true"}
                    >
                      Проекты
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="/public"
                      smooth={"true"}
                    >
                      Публикации
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="/company"
                      smooth={"true"}
                    >
                      О Компании
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="contacts"
                      smooth={"true"}
                      duration={500}
                    >
                      Контакты
                    </Link>
                  </li>
                </ul>
                <div className={styles.contact_info}>
                  <div className={styles.contact_info_block}>
                    {/* <div className={styles.contact_info_language}>EN | CN</div> */}
                    <Link
                      className={styles.contact_info_mail}
                      to="mailto:mail@marksgroup.ru"
                    >
                      mail@marksgroup.ru
                    </Link>
                    <Link
                      to={"tel:+74951201226"}
                      className={styles.contact_info_phone}
                      style={{ fontVariantNumeric: "lining-nums" }}
                    >
                      +7(495) 120-12-26
                    </Link>
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
