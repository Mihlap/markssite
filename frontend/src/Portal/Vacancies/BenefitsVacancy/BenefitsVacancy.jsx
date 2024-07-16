import React from "react";
import { useSelector } from "react-redux";
import benefitsData from "./utils";
import styles from "./BenefitsVacancy.module.scss";

const BenefitsVacancy = () => {
  const vacancies = useSelector((state) => state.vacancies.vacancies);
  
  return vacancies.map((vacancy, index) => (
    <div key={index} className={styles.frameBlockRight_benefits}>
      {vacancy.advantages.split(',').map((advantage, idx) => {
        const trimmedAdvantage = advantage.trim();
        const benefit = benefitsData.find(b => b.title === trimmedAdvantage);
        return benefit ? (
          <div key={idx} className={styles.frameBlockRight_benefits__frameBlock_frame}>
            <img className={styles.frameBlockRight_benefits__frame} src={benefit.icon} alt={benefit.title} />
            <span className={styles.frameBlockRight_benefits__frameSpan}>{benefit.title}</span>
          </div>
        ) : null;
      })}
    </div>
  ));
};

export default BenefitsVacancy;
