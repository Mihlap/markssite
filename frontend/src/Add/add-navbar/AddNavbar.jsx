import React, { useState } from "react";
import styles from "./AddNavbar.module.scss";
import { Link, Route, Routes } from "react-router-dom";
import HomeAdmin from "../HomeAdmin";
import AddProject from "../add-project/AddProject";
import AddArticles from "../add-articles/AddArticles";
import AddCompany from "../add-about-the-company/AddCompany";

export default function AddNavbar() {
  console.log("AddNavbar component is rendered"); // временный console.log

  const [activeIndex, setActiveIndex] = useState(0); // начальный индекс активного элемента

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <>
      <section className={styles.add_navbar_container}>
        <div className={styles.add_navbar_container__block}>
          <div className={styles.add_navbar_container__management}>
            <div className={styles.add_navbar_container__title}>
              MARKS GROUP
            </div>
            <ul className={styles.add_navbar_container__list}>
              <li>
                <Link
                  className={`${styles.add_navbar_container__item} ${
                    activeIndex === 0 ? styles.active : ""
                  }`}
                  onClick={() => handleItemClick(0)}
                  to="./"
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  className={`${styles.add_navbar_container__item} ${
                    activeIndex === 1 ? styles.active : ""
                  }`}
                  onClick={() => handleItemClick(1)}
                  to="./add-a-project"
                >
                  Проекты
                </Link>
              </li>
              <li>
                <Link
                  className={`${styles.add_navbar_container__item} ${
                    activeIndex === 2 ? styles.active : ""
                  }`}
                  onClick={() => handleItemClick(2)}
                  to="./add-a-articles"
                >
                  Публикации
                </Link>
              </li>
              <li>
                <Link
                  className={`${styles.add_navbar_container__item} ${
                    activeIndex === 3 ? styles.active : ""
                  }`}
                  onClick={() => handleItemClick(3)}
                  to="./add-a-company"
                >
                  О компании
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Link className={styles.preview} to="/">
        Предпросмотр
      </Link>
      {/* <Routes>
        <Route path="home" element={<HomeAdmin />} />
        <Route path="add-a-project" element={<AddProject />} />
        <Route path="add-a-articles" element={<AddArticles />} />
        <Route path="add-a-company" element={<AddCompany />} />
      </Routes> */}
    </>
  );
}
