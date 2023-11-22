import React from "react";
import styles from "./Vacancies.module.css";
import { Link } from "react-router-dom";

const Vacancies = ({ handleMouseEnter, handleMouseLeave }) => {
  return (
    <div className={styles.main_vacancies_block}>
      <div className={styles.wrapper_vacancies}>
        <div className={styles.rocket_image}>
          <img src="/assets/rocket.png" alt="rocket.png" />
        </div>
        <div className={styles.vacancies_header_wrapper}>
          <span className={styles.vacancies_header1}>
            Мы ищем специалистов в&nbsp;наш дружный коллектив
          </span>
          <span className={styles.vacancies_header2}>Вакансии</span>
        </div>
      </div>
      <div className={styles.vacancies_advertisingBlock}>
        <div className={styles.vacancies_advertisingBlock_text1}>
          Не отображаются вакансии?
        </div>
        <div className={styles.vacancies_advertisingBlock_text2}>
          Возможно у вас включен блокировщик рекламы
        </div>
      </div>
      <section className={styles.vacancies_section}>
        <div className={styles.vacancies_list}>Будут вкансии</div>
      </section>
      <div className={styles.vacancies_text_for_email}>
        Вы можете отправить резюме на&nbsp;почту:
        <Link
          className={styles.mail_link}
          to="mailto:ok@marksgroup.ru"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className={styles.span_mail_vacancies}>ok@marksgroup.ru</span>
        </Link>
      </div>
    </div>
  );
};

export default Vacancies;
