import React from "react";
import { useSelector } from "react-redux";
import benefitsData from "./utils"
// import styles from "./BenefitsVacancy.module.scss";
import styles from "../VacanciesMainCard/VacanciesMainCard.module.scss";

const BenefitsVacancy = () => {
  const vacancies = useSelector((state) => state.vacancies.vacancies);
  
  return vacancies.map((vacancy, index) => (
    <div key={index} className={styles.frameBlockRight}>
      {vacancy.advantages.split(',').map((advantage, idx) => {
        const trimmedAdvantage = advantage.trim();
        const benefit = benefitsData.find(b => b.title === trimmedAdvantage);
        return benefit ? (
          <div key={idx} className={styles.main_vacancyWrapper__frameBlock_frame}>
            <img   className={styles.main_vacancyWrapper__frame} src={benefit.icon} alt={benefit.title} />
            <span className={styles.main_vacancyWrapper__frameSpan}>{benefit.title}</span>
          </div>
        ) : null;
      })}
    </div>
  ));
};

export default BenefitsVacancy;
