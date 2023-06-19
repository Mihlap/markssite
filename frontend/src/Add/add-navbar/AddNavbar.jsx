import React, { useEffect, useState } from "react";
import styles from "./AddNavbar.module.scss";
import { Link, useNavigate } from "react-router-dom";

export default function AddNavbar() {
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedSelectedItem = localStorage.getItem("selectedItem");
    if (storedSelectedItem) {
      setSelectedItem(storedSelectedItem);
    }
  }, []);

  const handleItemClick = (event, itemName, itemPath) => {
    event.preventDefault();
    setSelectedItem(itemName);
    localStorage.setItem("selectedItem", itemName);
    navigate(itemPath); // Выполняем переход по ссылке
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
                    selectedItem === "home" ? styles.active : ""
                  }`}
                  to="./"
                  onClick={(event) => handleItemClick(event, "home", "./")}
                >
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  className={`${styles.add_navbar_container__item} ${
                    selectedItem === "projects" ? styles.active : ""
                  }`}
                  to="./add-a-project"
                  onClick={(event) =>
                    handleItemClick(event, "projects", "./add-a-project")
                  }
                >
                  Проекты
                </Link>
              </li>
              <li>
                <Link
                  className={`${styles.add_navbar_container__item} ${
                    selectedItem === "articles" ? styles.active : ""
                  }`}
                  to="./add-a-articles"
                  onClick={(event) =>
                    handleItemClick(event, "articles", "./add-a-articles")
                  }
                >
                  Публикации
                </Link>
              </li>
              <li>
                <Link
                  className={`${styles.add_navbar_container__item} ${
                    selectedItem === "company" ? styles.active : ""
                  }`}
                  to="./add-a-company"
                  onClick={(event) =>
                    handleItemClick(event, "company", "./add-a-company")
                  }
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
    </>
  );
}
