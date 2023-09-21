import React, { useEffect, useState } from "react";
import styles from "./AddNavbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import icon1 from './icon/one.png';
import icon2 from "./icon/three.png";
import icon3 from "./icon/four.png";
import icon4 from "./icon/two.png";

import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/Slice/authSlice";
import { resetCurrentPage } from "../../store/Slice/userSlice";

export default function AddNavbar({ user, handleReturn }) {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const serverHost = process.env.REACT_APP_SERVER_HOST;
  const navigate = useNavigate();
  // console.log(user);

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

  const logouthandler = async () => {
    try {
      dispatch(logoutUser());
      dispatch(resetCurrentPage()); // Сбрасываем currentPage
      navigate("/"); // Перенаправьте пользователя на страницу входа
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
                      fillRule="evenodd"
                      clipRule="evenodd"
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
              {user?.name === "obezyankaa" ? (
                <li className={styles.add_navbar_container__item_li}>
                  <svg
                    className={`${
                      selectedItem === "add-a-company" ? styles.active : ""
                    } ${styles.add_navbar_container__item_svg} ${
                      selectedItem === "add-a-company" ? styles.activeIcon : ""
                    }`}
                    fill="none"
                    height="32"
                    width="32"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    // stroke="#F6F6F6"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <g>
                        {" "}
                        <g>
                          {" "}
                          <path d="M490.667,0H21.333C9.557,0,0,9.557,0,21.333v469.333C0,502.443,9.557,512,21.333,512h469.333 c11.776,0,21.333-9.557,21.333-21.333V21.333C512,9.557,502.443,0,490.667,0z M164.416,271.083l-42.667,42.667 c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251c-8.341-8.341-8.341-21.824,0-30.165L119.168,256 l-27.584-27.584c-8.341-8.341-8.341-21.824,0-30.165c8.341-8.341,21.824-8.341,30.165,0l42.667,42.667 C172.757,249.259,172.757,262.741,164.416,271.083z M234.667,384c0,11.776-9.557,21.333-21.333,21.333S192,395.776,192,384V128 c0-11.776,9.557-21.333,21.333-21.333s21.333,9.557,21.333,21.333V384z M362.667,405.333h-85.333 C265.557,405.333,256,395.776,256,384s9.557-21.333,21.333-21.333h85.333c11.776,0,21.333,9.557,21.333,21.333 S374.443,405.333,362.667,405.333z M405.333,320h-128C265.557,320,256,310.443,256,298.667s9.557-21.333,21.333-21.333h128 c11.776,0,21.333,9.557,21.333,21.333S417.109,320,405.333,320z M256,213.333c0-11.776,9.557-21.333,21.333-21.333h64 c11.776,0,21.333,9.557,21.333,21.333s-9.557,21.333-21.333,21.333h-64C265.557,234.667,256,225.109,256,213.333z M405.333,149.333h-128C265.557,149.333,256,139.776,256,128s9.557-21.333,21.333-21.333h128c11.776,0,21.333,9.557,21.333,21.333 S417.109,149.333,405.333,149.333z" />{" "}
                        </g>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                  <Link
                    className={`${styles.add_navbar_container__item} ${
                      selectedItem === "add-a-applications" ? styles.active : ""
                    }`}
                    to="./add-a-applications"
                    onClick={(event) =>
                      handleItemClick(
                        event,
                        "add-a-applications",
                        "./add-a-applications"
                      )
                    }
                  >
                    Пользователи
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
          <div className={styles.exit_container}>
            <div className={styles.exit_container__user}>
              Пользователь cookies <strong>{user?.name}👋</strong>
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
          <Link className={styles.button} to="/" onClick={handleReturn}>
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
