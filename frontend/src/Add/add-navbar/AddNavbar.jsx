import React, { useEffect, useState } from "react";
import styles from "./AddNavbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import icon1 from './icon/one.png';
import icon2 from "./icon/three.png";
import icon3 from "./icon/four.png";
import icon4 from "./icon/two.png";

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
      navigate("/"); // Перенаправьте пользователя на страницу входа
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
              <li className={styles.add_navbar_container__item_li}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${selectedItem === "home" ? styles.active : ""} ${
                    styles.add_navbar_container__item_svg
                  } ${selectedItem === "home" ? styles.activeIcon : ""}`}
                >
                  <g id="home">
                    <path
                      id="Vector"
                      d="M5.33337 28V12L16 4L26.6667 12V28H18.6667V18.6667H13.3334V28H5.33337Z"
                    />
                  </g>
                </svg>

                <Link
                  className={`${styles.add_navbar_container__item} ${
                    selectedItem === "home" ? styles.active : ""
                  }`}
                  to="./"
                  onClick={(event) => handleItemClick(event, "home", "./home")}
                >
                  Главная
                </Link>
              </li>
              <li className={styles.add_navbar_container__item_li}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${
                    selectedItem === "add-a-project" ? styles.active : ""
                  } ${styles.add_navbar_container__item_svg} ${
                    selectedItem === "add-a-project" ? styles.activeIcon : ""
                  }`}
                >
                  <g id="project">
                    <path
                      id="Vector"
                      d="M6 4C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6C4 6.53043 4.21071 7.03914 4.58579 7.41421C4.96086 7.78929 5.46957 8 6 8V17C6 18.3261 6.52678 19.5979 7.46447 20.5355C8.40215 21.4732 9.67392 22 11 22H15V26H11C10.7348 26 10.4804 26.1054 10.2929 26.2929C10.1054 26.4804 10 26.7348 10 27C10 27.2652 10.1054 27.5196 10.2929 27.7071C10.4804 27.8946 10.7348 28 11 28H21C21.2652 28 21.5196 27.8946 21.7071 27.7071C21.8946 27.5196 22 27.2652 22 27C22 26.7348 21.8946 26.4804 21.7071 26.2929C21.5196 26.1054 21.2652 26 21 26H17V22H21C22.3261 22 23.5979 21.4732 24.5355 20.5355C25.4732 19.5979 26 18.3261 26 17V8C26.5304 8 27.0391 7.78929 27.4142 7.41421C27.7893 7.03914 28 6.53043 28 6C28 5.46957 27.7893 4.96086 27.4142 4.58579C27.0391 4.21071 26.5304 4 26 4H6Z"
                    />
                  </g>
                </svg>

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
              <li className={styles.add_navbar_container__item_li}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${
                    selectedItem === "add-a-articles" ? styles.active : ""
                  } ${styles.add_navbar_container__item_svg} ${
                    selectedItem === "add-a-articles" ? styles.activeIcon : ""
                  }`}
                >
                  <g id="publication">
                    <path
                      id="Vector"
                      d="M25.3333 4H6.66667C5.2 4 4 5.2 4 6.66667V25.3333C4 26.8 5.2 28 6.66667 28H25.3333C26.8 28 28 26.8 28 25.3333V6.66667C28 5.2 26.8 4 25.3333 4ZM17.3333 22.6667H10.6667C9.93333 22.6667 9.33333 22.0667 9.33333 21.3333C9.33333 20.6 9.93333 20 10.6667 20H17.3333C18.0667 20 18.6667 20.6 18.6667 21.3333C18.6667 22.0667 18.0667 22.6667 17.3333 22.6667ZM21.3333 17.3333H10.6667C9.93333 17.3333 9.33333 16.7333 9.33333 16C9.33333 15.2667 9.93333 14.6667 10.6667 14.6667H21.3333C22.0667 14.6667 22.6667 15.2667 22.6667 16C22.6667 16.7333 22.0667 17.3333 21.3333 17.3333ZM21.3333 12H10.6667C9.93333 12 9.33333 11.4 9.33333 10.6667C9.33333 9.93333 9.93333 9.33333 10.6667 9.33333H21.3333C22.0667 9.33333 22.6667 9.93333 22.6667 10.6667C22.6667 11.4 22.0667 12 21.3333 12Z"
                    />
                  </g>
                </svg>

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
              <li className={styles.add_navbar_container__item_li}>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${
                    selectedItem === "add-a-company" ? styles.active : ""
                  } ${styles.add_navbar_container__item_svg} ${
                    selectedItem === "add-a-company" ? styles.activeIcon : ""
                  }`}
                >
                  <g id="company">
                    <path
                      id="Subtract"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M25.3333 4H6.66667C5.2 4 4 5.2 4 6.66667V25.3333C4 26.8 5.2 28 6.66667 28H25.3333C26.8 28 28 26.8 28 25.3333V6.66667C28 5.2 26.8 4 25.3333 4ZM7 21H10.3105V13.1609L14.8758 21H17.0985L21.7066 13.1609V21H25V10H20.045L16.0021 16.8709L12.0236 10H7V21Z"
                    />
                  </g>
                </svg>

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
            <button
              className={styles.btn_exit}
              type="button"
              onClick={() => logouthandler()}
            >
              Выход
            </button>
          </div>
        </div>
      </nav>
      <div className={styles.button_position}>
        <div className={styles.button_container}>
          <Link
            className={styles.button}
            to="/"
            onClick={() => openNavbarHandler()}
          >
            <span className={styles.button__text}>Предпросмотр</span>
            <img src={icon1} alt="1" className={styles.button__cone} />
            <img src={icon2} alt="2" className={styles.button__torus} />
            <img src={icon3} alt="3" className={styles.button__icosahedron} />
            <img src={icon4} alt="4" className={styles.button__sphere} />
          </Link>
        </div>
      </div>
    </>
  );
}
