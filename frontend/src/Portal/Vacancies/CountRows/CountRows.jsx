import React, { useEffect, useRef } from 'react';
import styles from "./CountRows.module.scss";

import StarsBack from '../StarsBack/StarsBack';

const CountRows = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add(styles.animate);
        } else {
          sectionRef.current.classList.remove(styles.animate);
        }
      },
      { threshold: 0.3 }
    );
  
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
  
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [sectionRef]);

  return (
    <section className={styles.CountRows} ref={sectionRef}>
      <StarsBack section='CountRows' styles={styles} />
      <div className={styles.CountRows__wrapper}>
        <h2 className={styles.CountRows__header}>Быть с&nbsp;MARKS &mdash;&nbsp;это</h2>
        <ul className={styles.CountRows__list}>
          <li>
            <div className={styles.CountRows__line}></div>
            <div className={styles.CountRows__count}></div>
            <div className={styles.CountRows__text}>Делать людей счастливыми, создавая смелые проекты лучшей командой</div>
          </li>
          <li>
            <div className={styles.CountRows__line}></div>
            <div className={styles.CountRows__count}></div>
            <div className={styles.CountRows__text}>Безусловно любить свою профессию</div>
          </li>
          <li>
            <div className={styles.CountRows__line}></div>
            <div className={styles.CountRows__count}></div>
            <div className={styles.CountRows__text}>Применять научный подход в&nbsp;практике</div>
          </li>
          <li>
            <div className={styles.CountRows__line}></div>
            <div className={styles.CountRows__count}></div>
            <div className={styles.CountRows__text}>Доверять и&nbsp;быть открытыми друг другу</div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default CountRows;