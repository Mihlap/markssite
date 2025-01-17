import React, { useEffect, useState } from 'react';
import styles from './VacanciesMap.module.scss';

const VacanciesMap = () => {
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  
  const cities = ['msk', 'spb', 'vzh', 'obg', 'chbk'];

  useEffect(() => {
    const handleWheel = (event) => {
      setActiveCityIndex((prevIndex) => {
        if (event.deltaY > 0) {       
          return (prevIndex + 1) % cities.length;
        } else {       
          return (prevIndex - 1 + cities.length) % cities.length;
        }
      });
    };

    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section className={styles.VacanciesMap}>
      <div className={styles.VacanciesMap__text}>
        <h2>
          Вакансии
          <br />
          по&nbsp;всему миру!
        </h2>
        <p>
          5&nbsp;офисов в&nbsp;России и&nbsp;один в&nbsp;Узбекистане. Если ты&nbsp;крутой специалист, мы&nbsp;готовы
          помочь с&nbsp;переездом и&nbsp;поиском жилья
        </p>
      </div>
      <div className={styles.VacanciesMap__map}>
        {cities.map((city, index) => (
          <div
            key={city}
            className={`${styles.VacanciesMap__city} ${styles[`VacanciesMap__city_${city}`]} ${
              index === activeCityIndex ? styles.VacanciesMap__city_active : ''
            }`}>
            <div className={styles.VacanciesMap__box}>
              <span>{cityNames[city]}</span>
              <div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_m}`}></div>
              <div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_s}`}></div>
              <div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_xs}`}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const cityNames = {
  msk: 'Москва',
  spb: 'Санкт-Петербург',
  vzh: 'Воронеж',
  obg: 'Оренбург',
  chbk: 'Челябинск',
};

export default VacanciesMap;
