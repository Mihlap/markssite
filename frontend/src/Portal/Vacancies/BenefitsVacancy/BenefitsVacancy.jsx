import React from 'react';
import { useSelector } from 'react-redux';
import benefitsData from './utils';
import styles from './BenefitsVacancy.module.scss';

const BenefitsVacancy = () => {
  const vacancies = useSelector((state) => state.vacancies.vacancies);

  const processAdvantages = (advantages) => {
    if (!advantages) return [];
    if (Array.isArray(advantages)) return advantages;  
    const parts = advantages.split(',').map((item) => item.trim());
    let result = [];
    for (let i = 0; i < parts.length; i++) {
      let current = parts[i];
      if (benefitsData.some((b) => b.title === current)) {
        result.push(current);
      } else if (i < parts.length - 1) {   
        const combined = current + ', ' + parts[i + 1];
        if (benefitsData.some((b) => b.title === combined)) {
          result.push(combined);
          i++;
        } else {      
          result.push(current);
        }
      } else {
        result.push(current);
      }
    }
    return result;
  };

  return vacancies.map((vacancy, index) => {
    const advantagesArr = processAdvantages(vacancy.advantages);
    return (
      <div key={index} className={styles.frameBlockRight_benefits}>
        {advantagesArr.map((advantage, idx) => {
          const benefit = benefitsData.find((b) => b.title === advantage);
          return benefit ? (
            <div key={idx} className={styles.frameBlockRight_benefits__frameBlock_frame}>
              <img className={styles.frameBlockRight_benefits__frame} src={benefit.icon} alt={benefit.title} />
              <span
                className={styles.frameBlockRight_benefits__frameSpan}
                dangerouslySetInnerHTML={{
                  __html: benefit.typographed || benefit.title,
                }}
              />
            </div>
          ) : null;
        })}
      </div>
    );
  });
};

export default BenefitsVacancy;
