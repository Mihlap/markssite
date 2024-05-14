import React from 'react';
import styles from './VacanciesMainCard.module.css';

const VacanciesMainCard = ({
  handleMouseEnter,
  handleMouseLeave,
  handleMouseHover,
}) => {
  return (
    <div className={styles.main} >
      <h1 className={styles.title} >Здесь будет страница каждой вакансии</h1>
    </div>
  )
}

export default VacanciesMainCard;