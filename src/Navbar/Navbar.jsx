import React, { useEffect, useState } from "react";
import logo from ".././icons/logo.svg";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = ({ handleClickScroll }) => {
  const [clicked, setClicked] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // const navigate = useNavigate();

  function handleClick() {
    setClicked(!clicked);
  }

  const openHandler = () => {
    setNavOpen(!navOpen);
  };

  return (
    <>
      <nav className={styles.navbar_desctop}>
        <Link
          to="/"
          className={`${styles.block} ${styles.block_logo}`}
          onClick={handleClick}
        >
          <img src={logo} alt="logo" />
        </Link>
        <Link to="/competention">
          <button
            className={`${styles.block} ${styles.block1}`}
            onClick={handleClick}
          >
            Компетенции
          </button>
        </Link>
        <Link to="/project">
          <button
            className={`${styles.block} ${styles.block2}`}
            onClick={handleClick}
          >
            Проекты
          </button>
        </Link>
        <Link to="/public">
          <button
            className={`${styles.block} ${styles.block3}`}
            onClick={handleClick}
          >
            Публикации
          </button>
        </Link>
        <Link to="/company">
          <button
            className={`${styles.block} ${styles.block4}`}
            onClick={handleClick}
          >
            О Компании
          </button>
        </Link>
        <Link to="/contacts">
          <button
            className={`${styles.block} ${styles.block5}`}
            onClick={handleClick}
          >
            Контакты
          </button>
        </Link>
        <Link to="/portal">
          <button
            className={`${styles.block} ${styles.block6}`}
            onClick={handleClick}
          >
            HR портал
          </button>
        </Link>
        <button className={`${styles.block} ${styles.block_lang}`}>
          <p>EN | CN</p>
        </button>
      </nav>

      <div className={styles.navDesktop_container}>
        {/* <div>
          <img src={logo} alt="logo" />
        </div> */}
        <nav>
          <div className={styles.navbar}>
            <div className={styles.logo}>
              <img className={styles.logo_img} src={logo} alt="logo" />
            </div>
            <div className={`${styles.container} ${styles.nav_container}`}>
              <input
                className={styles.checkbox}
                type="checkbox"
                name=""
                id=""
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
              {navOpen && (
                <>
                  <div className={styles.menu_items}>
                    <li>
                      <Link to="#">Главная</Link>
                    </li>
                    <li>
                      <Link to="#">Компетенции</Link>
                    </li>
                    <li>
                      <Link to="#">Кейсы</Link>
                    </li>
                    <li>
                      <Link to="#">Публикации</Link>
                    </li>
                    <li>
                      <Link to="#">О Компании</Link>
                    </li>
                    <li>
                      <Link to="#">Контакты</Link>
                    </li>
                    <li>
                      <Link to="#">HR портал</Link>
                    </li>
                    <div className={styles.contact_info}>
                      <div className={styles.contact_info_block}>
                        <div className={styles.contact_info_language}>
                          EN | CN
                        </div>
                        <div className={styles.contact_info_mail}>
                          mail@marksgroup.ru
                        </div>
                        <div className={styles.contact_info_phone}>
                          +7 (495) 120-12-26
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
