import React, { useEffect, useState } from 'react'
import styles from "./NavBarPhone.module.scss";
import { Link } from 'react-router-dom';

export default function NavBarPhone() {
const [isMenuActive, setMenuActive] = useState(false);
    
// этот useEffect выключает скрол и включает обратно когда ты переключаем меню бургер
 useEffect(() => {
   if (isMenuActive) {
     document.body.style.overflow = "hidden";
   } else {
     document.body.style.overflow = "auto";
   }
   return () => {
     document.body.style.overflow = "auto";
   };
 }, [isMenuActive]);


  const handleBurgerClick = () => {
    setMenuActive((prevMenuActive) => !prevMenuActive);
  };

    return (
      <nav className={styles.navbar}>        
    <div className={styles.navbar_block}>
      <div className={styles.container}>
        <section className={styles.wrapper}>
          <Link to="/" className={styles.brand}>
            MARKS GROUP
          </Link>
          <button
            type="button"
            className={`${styles.burger} ${
              isMenuActive ? styles["is-active"] : ""
            }`}
            onClick={handleBurgerClick}
          >
            <span className={styles["burger-line"]}></span>
            <span className={styles["burger-line"]}></span>
            <span className={styles["burger-line"]}></span>
            <span className={styles["burger-line"]}></span>
          </button>
          <div
            className={`${styles.menu} ${
              isMenuActive ? styles["is-active"] : ""
            }`}
            style={
              isMenuActive
                ? { maxHeight: "1200px" }
                : { maxHeight: "0", visibility: "hidden", opacity: 0 }
            }
          >
            <ul className={styles["menu-inner"]}>
              <li className={styles["menu-item"]}>
                <Link
                  onClick={handleBurgerClick}
                  to="/"
                  className={styles["menu-link"]}
                >
                  Главная
                </Link>
              </li>
              <li className={styles["menu-item"]}>
                <Link
                  onClick={handleBurgerClick}
                  to="/competention"
                  className={styles["menu-link"]}
                >
                  Компетенции
                </Link>
              </li>
              <li className={styles["menu-item"]}>
                <Link
                  onClick={handleBurgerClick}
                  to="/publication"
                  className={styles["menu-link"]}
                >
                  Публикации
                </Link>
              </li>
              <li className={styles["menu-item"]}>
                <Link
                  onClick={handleBurgerClick}
                  to="/company"
                  className={styles["menu-link"]}
                >
                  О компании
                </Link>
              </li>
              <li className={styles["menu-item"]}>
                <Link
                  onClick={handleBurgerClick}
                  to="/contacts"
                  className={styles["menu-link"]}
                >
                  Контакты
                </Link>
              </li>
              {/* <li className={styles["menu-item"]}>
                <Link to="#" className={styles["menu-link"]}>
                  HR портал
                </Link>
              </li> */}
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
        </section>
      </div>
    </div>
      </nav>
  );
};
