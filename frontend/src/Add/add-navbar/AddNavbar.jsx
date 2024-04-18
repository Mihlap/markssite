import React, { useEffect, useRef, useState } from "react";
import styles from "./AddNavbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import icon1 from "./icon/one.png";
import icon2 from "./icon/three.png";
import icon3 from "./icon/four.png";
import icon4 from "./icon/two.png";
import caseIcon from "./icon/case.svg";
import fireIcon from "./icon/fire.svg";
import hrIcon from "./icon/hr.svg";
import pencilIcon from "./icon/pencil.svg";
import projectorIcon from "./icon/projector.svg";
import settingIcon from "./icon/setting.svg";
import exit from "./icon/exit.svg";

// import ChristmasTree from "./icon/ChristmastreewithbulbandsnowPNGImage.png";

import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/Slice/authSlice";
import { resetCurrentPage } from "../../store/Slice/userSlice";

export default function AddNavbar({ user, handleReturn }) {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("home");
  const [indicatorX, setIndicatorX] = useState(0);
  const [indicatorY, setIndicatorY] = useState(0);
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const itemRefs = useRef({});
  const indicatorRef = useRef(null);

  const isObezyankaaUser = user?.name === "obezyankaa";
  const isPokemonUser = user?.name === "Pokemon";
  const isHr778User = user?.name === "hr778";
  const isManagerUser = user?.name === "manager";

 useEffect(() => {
    const storedSelectedItem = localStorage.getItem("selectedItem");
    if (storedSelectedItem) {
      setSelectedItem(storedSelectedItem);
    }
  }, []);

  useEffect(() => {
    updateIndicatorPosition(selectedItem);
  }, [selectedItem]);

  const updateIndicatorPosition = (itemName) => {
    const item = itemRefs.current[itemName];
    if (item && indicatorRef.current) {
      let newIndicatorX = item.offsetLeft;
      let newIndicatorY = item.offsetTop + item.offsetHeight - 2;

      if (window.innerWidth <= 1600) {
        newIndicatorY = item.offsetTop + item.offsetHeight - 6;
      }

      if (window.innerWidth <= 1023) {
        newIndicatorY = item.offsetTop + item.offsetHeight + 16;
      }

      setIndicatorX(newIndicatorX);
      setIndicatorY(newIndicatorY);
    }
  };

  useEffect(() => {
    if (indicatorRef.current) {
      indicatorRef.current.style.transform = `translate(${indicatorX}px, ${indicatorY}px)`;
    }
  }, [indicatorX, indicatorY]);

  const handleItemClick = (event, itemName, itemPath) => {
    event.preventDefault();
    setSelectedItem(itemName);
    localStorage.setItem("selectedItem", itemName);
    navigate(itemPath);
  };

  const logouthandler = async () => {
    try {
      dispatch(logoutUser());
      dispatch(resetCurrentPage());
      navigate("/");
    } catch (error) {
      console.error("Ошибка при выходе из системы", error);
    }
  };

  return (
    <>
      <nav className={styles.add_navbar_container}>
        <div className={styles.add_navbar_container__block}>
          <div className={styles.selectedIndicator} ref={indicatorRef} />
          <div className={styles.add_navbar_container__management}>
            <div className={styles.add_navbar_container__title}>
              MARKS GROUP
            </div>
            <ul className={styles.add_navbar_container__list}>
              {isPokemonUser || isObezyankaaUser || isManagerUser ? (
                <>
                  <li className={styles.add_navbar_container__item_li}>
                    <Link
                      ref={(el) => (itemRefs.current["home"] = el)}
                      className={`${styles.add_navbar_container__item} ${
                        selectedItem === "home" ? styles.active : ""
                      }`}
                      to="./"
                      onClick={(event) =>
                        handleItemClick(event, "home", "./home")
                      }
                    >
                      <img
                        className={styles.add_navbar_container__item__icons}
                        src={pencilIcon}
                        alt={pencilIcon}
                      />
                      <p className={styles.add_navbar_container__title__ipad}>
                        Главная
                      </p>
                    </Link>
                  </li>
                  <li className={styles.add_navbar_container__item_li}>
                    <Link
                      ref={(el) => (itemRefs.current["add-a-project"] = el)}
                      className={`${styles.add_navbar_container__item} ${
                        selectedItem === "add-a-project" ? styles.active : ""
                      }`}
                      to="./add-a-project"
                      onClick={(event) =>
                        handleItemClick(
                          event,
                          "add-a-project",
                          "./add-a-project"
                        )
                      }
                    >
                      <img
                        className={styles.add_navbar_container__item__icons}
                        src={fireIcon}
                        alt={fireIcon}
                      />
                      <p className={styles.add_navbar_container__title__ipad}>
                        Проекты
                      </p>
                    </Link>
                  </li>
                  <li className={styles.add_navbar_container__item_li}>
                    <Link
                      ref={(el) => (itemRefs.current["add-a-articles"] = el)}
                      className={`${styles.add_navbar_container__item} ${
                        selectedItem === "add-a-articles" ? styles.active : ""
                      }`}
                      to="./add-a-articles"
                      onClick={(event) =>
                        handleItemClick(
                          event,
                          "add-a-articles",
                          "./add-a-articles"
                        )
                      }
                    >
                      <img
                        className={styles.add_navbar_container__item__icons}
                        src={projectorIcon}
                        alt={projectorIcon}
                      />
                      <p className={styles.add_navbar_container__title__ipad}>
                        Публикации
                      </p>
                    </Link>
                  </li>
                  <li className={styles.add_navbar_container__item_li}>
                    <Link
                      ref={(el) => (itemRefs.current["add-a-company"] = el)}
                      className={`${styles.add_navbar_container__item} ${
                        selectedItem === "add-a-company" ? styles.active : ""
                      }`}
                      to="./add-a-company"
                      onClick={(event) =>
                        handleItemClick(
                          event,
                          "add-a-company",
                          "./add-a-company"
                        )
                      }
                    >
                      <img
                        className={styles.add_navbar_container__item__icons}
                        src={caseIcon}
                        alt={caseIcon}
                      />
                      <p className={styles.add_navbar_container__title__ipad}>
                        О компании
                      </p>
                    </Link>
                  </li>
                </>
              ) : null}
              {(isPokemonUser || isObezyankaaUser || isHr778User) && (
                <li className={styles.add_navbar_container__item_li}>
                  <Link
                    ref={(el) => (itemRefs.current["add-hr-portal"] = el)}
                    className={`${styles.add_navbar_container__item} ${
                      selectedItem === "add-hr-portal" ? styles.active : ""
                    }`}
                    to="./add-hr-portal"
                    onClick={(event) =>
                      handleItemClick(event, "add-hr-portal", "./add-hr-portal")
                    }
                  >
                    <img
                      className={styles.add_navbar_container__item__icons}
                      src={hrIcon}
                      alt={hrIcon}
                    />
                    <p className={styles.add_navbar_container__title__ipad}>
                      HR портал
                    </p>
                  </Link>
                </li>
              )}
              {isPokemonUser || isObezyankaaUser ? (
                <li className={styles.add_navbar_container__item_li}>
                  <Link
                    ref={(el) => (itemRefs.current["add-a-applications"] = el)}
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
                    <img
                      className={styles.add_navbar_container__item__icons}
                      src={settingIcon}
                      alt={settingIcon}
                    />
                    <p className={styles.add_navbar_container__title__ipad}>
                      Управление
                    </p>
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
          <li className={styles.add_navbar_container__item_li}>
            {/* <div className={styles.exit_container}>
              <div className={styles.exit_container__user}>
                Пользователь <strong>{user?.name}👋</strong>
              </div>
            </div> */}
            <button
              className={styles.add_navbar_container__item_exit}
              type="button"
              onClick={() => logouthandler()}
            >
              <img
                className={styles.add_navbar_container__item__icons_exit}
                src={exit}
                alt={exit}
              />
              <p className={styles.add_navbar_container__exit_ipad}>
                Выйти из аккакунта
              </p>
            </button>
          </li>
        </div>
      </nav>
      <div className={styles.button_position}>
        <div className={styles.button_container}>
          {!isObezyankaaUser ? (
            <Link className={styles.button_xren} to="/" onClick={handleReturn}>
              <span className={styles.button_xren__text}>Предпросмотр</span>
            </Link>
          ) : (
            // Обычная кнопка для других пользователей
            <Link className={styles.button} to="/" onClick={handleReturn}>
              <span className={styles.button__text}>Предпросмотр</span>
              <img src={icon1} alt="1" className={styles.button__cone} />
              <img src={icon2} alt="2" className={styles.button__torus} />
              <img src={icon3} alt="3" className={styles.button__icosahedron} />
              <img src={icon4} alt="4" className={styles.button__sphere} />
            </Link>
          )}
        </div>
      </div>
      {/* <img
        style={{
          position: "absolute",
          bottom: 0,
          left: "10px",
          zIndex: "999",
          width: "10rem",
        }}
        src={ChristmasTree}
        alt="ChristmasTree"
      /> */}
    </>
  );
}
