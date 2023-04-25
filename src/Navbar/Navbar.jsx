import React, { useState } from 'react';
import styles from './Navbar.module.css';
import logo from '.././icons/logo.svg';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {

  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  function handleClick() {
    setClicked(!clicked);

  }
  return (
    <>
      <div className={styles.navbar_desctop}>
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
          <p>EN</p>
        </button>
      </div>

      <div className={styles.navDesktop_container}>
        <div>
          <img src={logo} alt="logo" />
        </div>
        <nav>
          <div className={styles.navbar}>
            <div className={`${styles.container} ${styles.nav_container}`}>
              <input
                className={styles.checkbox}
                type="checkbox"
                name=""
                id=""
              />
              <div className={styles.hamburger_lines}>
                <span className={`${styles.line} ${styles.line1}`}></span>
                <span className={`${styles.line} ${styles.line2}`}></span>
                <span className={`${styles.line} ${styles.line3}`}></span>
              </div>
              <div className={styles.logo}>
              </div>
              <div className={styles.menu_items}>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">about</a>
                </li>
                <li>
                  <a href="#">blogs</a>
                </li>
                <li>
                  <a href="#">portfolio</a>
                </li>
                <li>
                  <a href="#">contact</a>
                </li>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
    }

export default Navbar