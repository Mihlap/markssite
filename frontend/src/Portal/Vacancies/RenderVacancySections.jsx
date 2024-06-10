import React from "react";
import { useSelector } from "react-redux";
import styles from "./VacanciesMainCard.module.scss";

const RenderVacancySections = () => {
  const vacancies = useSelector((state) => state.vacancies.vacancies);

  const formatContentWithSpans = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const listItems = doc.querySelectorAll("li");

    listItems.forEach((li) => {
      const span = document.createElement("span");
      span.innerHTML = li.innerHTML;
      li.innerHTML = "";
      li.appendChild(span);
    });

    return doc.body.innerHTML;
  };

  const formatSkills = (skills) => {
    return skills.split(",").map((skill) => `<span class="${styles.skillButton}">${skill.trim()}</span>`).join("");
  };

  return vacancies.map((vacancy, index) => (
    <div key={index}>
      <div className={styles.main_vacancyWrapper__wrapperTitle}>
        <h4>Вам предстоит:</h4>
      </div>
      <div
        className={styles.main_vacancyWrapper__textBlock}
        dangerouslySetInnerHTML={{
          __html: formatContentWithSpans(vacancy.haveToWork),
        }}
      />
      <div className={styles.main_vacancyWrapper__wrapperTitle}>
        <h4>Требования:</h4>
      </div>
      <div
        className={styles.main_vacancyWrapper__textBlock}
        dangerouslySetInnerHTML={{
          __html: formatContentWithSpans(vacancy.requirements),
        }}
      />
        <div className={styles.main_vacancyWrapper__wrapperTitle1}>
        <h4>Ключевые навыки</h4>
      </div>
      <div
        className={styles.main_vacancyWrapper__textBlock}
        dangerouslySetInnerHTML={{
          __html: formatSkills(vacancy.skills),
        }}
      />
    </div>
  ));
};

export default RenderVacancySections;
