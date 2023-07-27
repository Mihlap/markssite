import React, { useEffect, useState } from "react";
import styles from "./AddNavbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddNavbar({ user, setNavBarOpen, setShowFooter }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const serverHost = process.env.REACT_APP_SERVER_HOST;
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

  const openNavbarHandler = () => {
    setNavBarOpen(true);
    setShowFooter(true);
  }

const logouthandler = async () => {
  try {
    const response = await axios.get(`${serverHost}/api/auth/logout`, {
      withCredentials: true,
    }); // Убедитесь, что вы отправляете запрос с куками

    if (response.status === 200) {
      navigate("/login"); // Перенаправьте пользователя на страницу входа
      setNavBarOpen(true);
      setShowFooter(true);
      window.location.reload();
    }
  } catch (error) {
    console.error("Ошибка при выходе из системы", error);
  }
};

  return (
    <>
      <nav className={styles.add_navbar_container}>
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
                    selectedItem === "add-a-project" ? styles.active : ""
                  }`}
                  to="./add-a-project"
                  onClick={(event) =>
                    handleItemClick(event, "add-a-project", "./add-a-project")
                  }
                >
                  Проекты
                </Link>
              </li>
              <li>
                <Link
                  className={`${styles.add_navbar_container__item} ${
                    selectedItem === "add-a-articles" ? styles.active : ""
                  }`}
                  to="./add-a-articles"
                  onClick={(event) =>
                    handleItemClick(event, "add-a-articles", "./add-a-articles")
                  }
                >
                  Публикации
                </Link>
              </li>
              <li>
                <Link
                  className={`${styles.add_navbar_container__item} ${
                    selectedItem === "add-a-company" ? styles.active : ""
                  }`}
                  to="./add-a-company"
                  onClick={(event) =>
                    handleItemClick(event, "add-a-company", "./add-a-company")
                  }
                >
                  О компании
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.exit_container}>
          <div className={styles.exit_container__user}>
            Пользователь cookies <strong>{user}👋</strong>
          </div>
                <button className={styles.btn_exit} type="button" onClick={() => logouthandler()}>
                  Выход
                </button>

          </div>
        </div>
      </nav>
      <Link
        className={styles.preview}
        to="/"
        onClick={() => openNavbarHandler()}
      >
        Предпросмотр
      </Link>
    </>
  );
}
