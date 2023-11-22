import React from 'react';
import styles from './Vacancies.module.css';

const Vacancies = () => {
  return (
    <div className={styles.main_vacancies}>
     <div className={styles.wrapper_vacancies}>
      <div className={styles.vacancies_header_wrapper}>
      <div className={styles.vacancies_header1}>Мы ищем специалистов в наш дружный коллектив</div>
      <div className={styles.vacancies_header2}>Вакансии</div>
      </div>
      <div className={styles.rocket_image}>
     <img src="/assets/rocket.png" alt="rocket.png" />
     </div>
     </div>
    </div>
  )
}

export default Vacancies;