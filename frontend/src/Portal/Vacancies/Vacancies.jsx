import React from 'react';
import styles from './Vacancies.module.css';

const Vacancies = () => {
  return (
    <div className={styles.main_vacancies}>
     <div className={styles.wrapper_vacancies}>
      <div className={styles.rocket_image}>
     <img src="/assets/rocket.png" alt="rocket.png" />
     </div>
     </div>
    </div>
  )
}

export default Vacancies;