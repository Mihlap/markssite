import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import styles from "./AddNavbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
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

import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/Slice/authSlice";
import { resetCurrentPage } from "../../store/Slice/userSlice";

export default function AddNavbar({ user, handleReturn }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("home");
  const [indicatorX, setIndicatorX] = useState(0);
  const [indicatorY, setIndicatorY] = useState(0);
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

  const updateIndicatorPosition = useCallback((itemName) => {
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
  }, []);

  useEffect(() => {
    if (indicatorRef.current) {
      indicatorRef.current.style.transform = `translate(${indicatorX}px, ${indicatorY}px)`;
    }
  }, [indicatorX, indicatorY]);

  const handleItemClick = useCallback((event, itemName, itemPath) => {
    event.preventDefault();
    setSelectedItem(itemName);
    localStorage.setItem("selectedItem", itemName);
    navigate(itemPath);
  }, [navigate]);

  const logouthandler = useCallback(async () => {
    try {
      dispatch(logoutUser());
      dispatch(resetCurrentPage());
      navigate("/");
    } catch (error) {
      console.error("Ошибка при выходе из системы", error);
    }
  }, [dispatch, navigate]);

  const menuItems = useMemo(() => [
    {
      name: "home",
      path: "./home",
      icon: pencilIcon,
      label: "Главная",
      visible: isPokemonUser || isObezyankaaUser || isManagerUser,
    },
    {
      name: "add-a-project",
      path: "./add-a-project",
      icon: fireIcon,
      label: "Проекты",
      visible: isPokemonUser || isObezyankaaUser || isManagerUser,
    },
    {
      name: "add-a-articles",
      path: "./add-a-articles",
      icon: projectorIcon,
      label: "Публикации",
      visible: isPokemonUser || isObezyankaaUser || isManagerUser,
    },
    {
      name: "add-a-company",
      path: "./add-a-company",
      icon: caseIcon,
      label: "О компании",
      visible: isPokemonUser || isObezyankaaUser || isManagerUser,
    },
    {
      name: "add-hr-portal",
      path: "./add-hr-portal",
      icon: hrIcon,
      label: "HR портал",
      visible: isPokemonUser || isObezyankaaUser || isHr778User,
    },
    {
      name: "add-a-applications",
      path: "./add-a-applications",
      icon: settingIcon,
      label: "Управление",
      visible: isPokemonUser || isObezyankaaUser,
    },
  ], [isPokemonUser, isObezyankaaUser, isManagerUser, isHr778User]);

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
              {menuItems.map(
                (item) =>
                  item.visible && (
                    <li key={item.name} className={styles.add_navbar_container__item_li}>
                      <Link
                        ref={(el) => (itemRefs.current[item.name] = el)}
                        className={`${styles.add_navbar_container__item} ${
                          selectedItem === item.name ? styles.active : ""
                        }`}
                        to={item.path}
                        onClick={(event) => handleItemClick(event, item.name, item.path)}
                      >
                        <img
                          className={styles.add_navbar_container__item__icons}
                          src={item.icon}
                          alt={item.icon}
                        />
                        <p className={styles.add_navbar_container__title__ipad}>
                          {item.label}
                        </p>
                      </Link>
                    </li>
                  )
              )}
            </ul>
          </div>
          <li className={styles.add_navbar_container__item_li}>
            <button
              className={styles.add_navbar_container__item_exit}
              type="button"
              onClick={logouthandler}
            >
              <img
                className={styles.add_navbar_container__item__icons_exit}
                src={exit}
                alt={exit}
              />
              <p className={styles.add_navbar_container__exit_ipad}>
                Выйти из аккаунта
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
    </>
  );
}
