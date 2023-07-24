import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./HomeAdmin.module.scss";
import { searchPublicationOne, setFoundObject } from "../store/Slice/searchPublicationSlice";

export default function HomeAdmin() {
  const [searchId, setSearchId] = useState(""); // Состояние для хранения введенного значения id
  const projects = useSelector((state) => state.project.projects); // Получение массива проектов из Redux store
  const dispatch = useDispatch();
  // Обработчик изменения значения в инпуте поиска
  const handleSearchChange = (event) => {
    setSearchId(event.target.value);
  };

  // Функция для фильтрации проектов по введенному id
  const filterProjectsById = () => {
    const filteredProject = projects.find(
      (project) => project.id === parseInt(searchId, 10)
    );
    if (filteredProject) {
      console.log("Найденный проект:", filteredProject);
      // dispatch(setFoundObject(filteredProject)); // Отправляем найденный объект в наш Slice
      dispatch(searchPublicationOne(filteredProject)); // Отправляем найденный объект на сервер
    } else {
      console.log("Проект с таким id не найден");
    }
  };
  return (
    <section className={styles.home_admin_section}>
      <div className={styles.home_admin_section__title}>Публикации</div>

      <div>
        <div>
          <input
            style={{ background: "orange" }}
            type="number"
            value={searchId}
            onChange={handleSearchChange}
          />
          <button onClick={filterProjectsById}>Найти проект по ID</button>
        </div>
        <div>
          <div>
            <input
              style={{ background: "tomato" }}
              type="number"
              name=""
              id=""
            />
            <button>добавить на главную</button>
          </div>
        </div>
      </div>

      <div className={styles.home_admin_section__title}>Проекты</div>
      <div>
        <div>
          <input style={{ background: "orange" }} type="number" name="" id="" />
          <button>добавить на главную</button>
        </div>
        <div>
          <div>
            <input
              style={{ background: "tomato" }}
              type="number"
              name=""
              id=""
            />
            <button>добавить на главную</button>
          </div>
        </div>
      </div>
    </section>
  );
}
