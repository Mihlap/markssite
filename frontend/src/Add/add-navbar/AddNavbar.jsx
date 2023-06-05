import React, { useState } from "react";
import styles from "./AddNavbar.module.scss";
import { Link } from "react-router-dom";

export default function AddNavbar() {

     const [activeIndex, setActiveIndex] = useState(0); // начальный индекс активного элемента

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className={styles.add_navbar_container}>
      <div className={styles.add_navbar_container__block}>
        <div className={styles.add_navbar_container__management}>
          <div className={styles.add_navbar_container__title}>MARKS GROUP</div>
          <ul className={styles.add_navbar_container__list}>
            <li
              className={`${styles.add_navbar_container__item} ${
                activeIndex === 0 ? styles.active : ""
              }`}
              onClick={() => handleItemClick(0)}
            >
              <Link to="#">Главная</Link>
            </li>
            <li
              className={`${styles.add_navbar_container__item} ${
                activeIndex === 1 ? styles.active : ""
              }`}
              onClick={() => handleItemClick(1)}
            >
              <Link to="#">Проекты</Link>
            </li>
            <li
              className={`${styles.add_navbar_container__item} ${
                activeIndex === 2 ? styles.active : ""
              }`}
              onClick={() => handleItemClick(2)}
            >
              <Link to="#">Публикации</Link>
            </li>
            <li
              className={`${styles.add_navbar_container__item} ${
                activeIndex === 3 ? styles.active : ""
              }`}
              onClick={() => handleItemClick(3)}
            >
              <Link to="#">О компании</Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
