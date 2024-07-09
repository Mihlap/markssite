
import React, { useState } from "react";
import styles from "./VacanciesProfileForm.module.scss";
import VacancyFormContact from "../../../UI/VacancyFormContact/VacancyFormContact";

const VacanciesProfileForm = ({ handleMouseEnter, handleMouseLeave, handleMouseHover }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	return (
		<>
      <div className={styles.temporaryText}>
        {windowWidth > 1024
          ? "Не нашли подходящую вакансию?"
          : "Мы ищем именно тебя!"}
      </div>
      <div className={styles.textUnderForm}>
        Оставьте ваши контакты, мы всегда в поиске талантливых
        профессионалов
      </div>
      <div className={styles.vacancyFormWrapper}>
        <VacancyFormContact
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          handleMouseHover={handleMouseHover}
        />
      </div>
		</>
	);
};

export default VacanciesProfileForm;