import React, { useEffect, useRef, useState } from 'react';
import styles from './VacanciesMap.module.scss';

const cities = ['spb', 'msk', 'vzh', 'obg', 'chbk'];

const cityNames = {
  spb: 'Санкт-Петербург',
  msk: 'Москва',
  vzh: 'Воронеж',
  obg: 'Оренбург',
  chbk: 'Челябинск',
};

const VacanciesMap = () => {
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [scrollLocked, setScrollLocked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationDuration = 300;
  const mapRef = useRef(null);
  const timerRef = useRef(null);
  const scrollDelay = 100;

   const centerComponent = () => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect(); 
      const elementTop = window.scrollY + rect.top;
      const elementHeight = rect.height;     
      const targetScrollY = elementTop + elementHeight / 2 - window.innerHeight / 2;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  };

   const checkIfCentered = () => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const centerY = window.innerHeight / 2;    
      if (centerY >= rect.top && centerY <= rect.bottom) {
        if (!timerRef.current) {
          timerRef.current = setTimeout(() => {
            setScrollLocked(true);
            centerComponent();
          }, scrollDelay);
        }
      } else {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setScrollLocked(false);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {   
        setActiveCityIndex(1);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


 
  useEffect(() => {
    checkIfCentered();
    window.addEventListener('scroll', checkIfCentered);
    return () => {
      window.removeEventListener('scroll', checkIfCentered);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);


  useEffect(() => {
    const handleWheel = (event) => {
      if (window.innerWidth <= 1024) return;
      if (!scrollLocked) return;
      event.preventDefault();

      if (isAnimating) return;
      setIsAnimating(true);

      setActiveCityIndex((prevIndex) => {
        let newIndex = prevIndex;
        if (event.deltaY > 0) {
          newIndex = prevIndex + 1;
          if (newIndex >= cities.length) {
            newIndex = cities.length - 1;
            setScrollLocked(false);
          }
        } else {
          newIndex = prevIndex - 1;
          if (newIndex < 0) {
            newIndex = 0;
            setScrollLocked(false);
          }
        }
        return newIndex;
      });
      setTimeout(() => setIsAnimating(false), animationDuration);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel, { passive: false });
    };
  }, [scrollLocked, isAnimating, animationDuration]);

  return (
    <section ref={mapRef} className={styles.VacanciesMap}>
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

export default VacanciesMap;
