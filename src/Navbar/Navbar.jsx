import React, { useState } from "react";
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';
import logo from ".././icons/logo.svg";
import styles from "./Navbar.module.css";
import { useEffect } from "react";

// тетс гита на сливание с новой веткой

const Navbar = ({ handleClickScroll, navOpen, setNavOpen }) => {
  const [clicked, setClicked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  function handleCheckboxChange() {
    setIsChecked(!isChecked);
  }
  function handleClick() {
    setClicked(!clicked);
  }

  const openHandler = () => {
    setNavOpen((prevNavOpen) => !prevNavOpen);
  };

  const closeNavBar = () => {
    setNavOpen((prevNavOpen) => !prevNavOpen);
    setClicked(!clicked);
    setIsChecked(!isChecked);
  };

  const [prevScrollpos, setPrevScrollpos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollpos > currentScrollPos;
      setVisible(visible);
      setPrevScrollpos(currentScrollPos);
    }, 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollpos]);

  return (
    <header
      className={`${styles.fixed} ${visible ? styles.visible : styles.hidden}`}
    >
      <nav className={styles.navbar_desctop}>
        <div className={styles.navbar_container}>
          <div className={styles.navbar_title_block}>
            <Link to="/">
              <h1 className={styles.navbar_title}>MARKS GROUP</h1>
            </Link>
          </div>
          <ul className={styles.navbar_list}>
            <Link
              className={styles.navbar_item}
              to="#"
            >
              <li>Компетенции</li>
            </Link>
            <Link
              className={styles.navbar_item}
              to="#"
            >
              <li>Проекты</li>
            </Link>
            <Link
              className={styles.navbar_item}
              to="#"
            >
              <li>Публикации</li>
            </Link>
            <Link
              className={`${styles.navbar_item} ${styles.navbar_item_last}`}
              to="#"
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
              <Link to="/">
                <img className={styles.logo_img} src={logo} alt="logo" />
              </Link>
            </div>
            <div className={`${styles.container} ${styles.nav_container}`}>
              <input
                className={styles.checkbox}
                type="checkbox"
                name=""
                id=""
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
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: navOpen ? 0 : "100%", // Скрытие элемента за пределами экрана
                  width: "100%",
                  height: "100vh",
                  backgroundColor: "#f6f6f6",
                  transition: "left 0.5s ease-in-out", // Анимация скрытия/показа
                  marginTop: "15%",
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
                      to="#"
                    >
                      Компетенции
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="#"
                    >
                      Кейсы
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="#"
                    >
                      Публикации
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.menu_item}
                      onClick={closeNavBar}
                      to="#"
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
