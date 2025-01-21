import React, { useEffect, useRef } from 'react';
import styles from './DirectionsGrid.module.scss';

import directionImg1 from '../icons/directions-1.svg';
import directionImg2 from '../icons/directions-2.svg';
import directionImg3 from '../icons/directions-3.svg';
import directionImg4 from '../icons/directions-4.svg';
import directionImg5 from '../icons/directions-5.svg';

const DirectionsGrid = () => {
  const itemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Функция обратного вызова вызывается при каждом пересечении элемента с viewport.
        entries.forEach((entry) => {
          // Проверка, пересекается ли элемент и если да - добавляем класс
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.4 }
    );

    itemsRef.current.forEach((item) => {
      // Начинаем наблюдение за элементами
      if (item) observer.observe(item);
    });

    // Очистка при размонтировании
    return () => {
      if (itemsRef.current) {
        itemsRef.current.forEach((item) => {
          if (item) observer.unobserve(item);
        });
      }
    };
  }, []);

  return (
    <>
      <section className={styles.DirectionsGrid}>
        <div
          ref={(el) => (itemsRef.current[0] = el)}
          className={`${styles.DirectionsGrid__item} ${styles.DirectionsGrid__item_header}`}>
          <div className={styles.DirectionsGrid__text}>
            <h2 className={styles.DirectionsGrid__subtitle}>Выбери свое направление!</h2>
            <p>
              MARKS GROUP&nbsp;&mdash; многопрофильная компания,<br></br> мы&nbsp;приглашаем специалистов самых разных
              <br></br>
              сфер&nbsp;деятельности
            </p>
          </div>
        </div>
        <div ref={(el) => (itemsRef.current[1] = el)} className={styles.DirectionsGrid__item}>
          <div className={styles.DirectionsGrid__text}>
            <h2 className={styles.DirectionsGrid__subtitle}>Архитектура</h2>
            <p>Разработка уникальной авторской архитектуры, проектная и&nbsp;рабочая документация</p>
          </div>
          <img src={directionImg1}></img>
        </div>
        <div ref={(el) => (itemsRef.current[2] = el)} className={styles.DirectionsGrid__item}>
          <div className={styles.DirectionsGrid__text}>
            <h2 className={styles.DirectionsGrid__subtitle}>Конструктив</h2>
            <p>
              Разработка нестандартных <br></br>конструктивных решений
            </p>
          </div>
          <img src={directionImg2}></img>
        </div>
        <div
          ref={(el) => (itemsRef.current[3] = el)}
          className={`${styles.DirectionsGrid__item} ${styles.DirectionsGrid__item_it}`}>
          <div className={styles.DirectionsGrid__text}>
            <h2 className={styles.DirectionsGrid__subtitle}>IT</h2>
            <p>
              Цифровизация процессов строительства,<br></br> проектирования, девелопмента
            </p>
            <p>
              Разработка ПО&nbsp;и&nbsp;решений для автоматизации<br></br> процессов информационного моделирования
            </p>
            <p>Разработка&nbsp;VR и&nbsp;дополненной реальности</p>
          </div>
          <img src={directionImg3}></img>
        </div>
        <div ref={(el) => (itemsRef.current[4] = el)} className={styles.DirectionsGrid__item}>
          <div className={styles.DirectionsGrid__text}>
            <h2 className={styles.DirectionsGrid__subtitle}>Наука</h2>
            <p>Научные исследования в&nbsp;проектировании и&nbsp;строительстве</p>
          </div>
          <img src={directionImg4}></img>
        </div>
        <div ref={(el) => (itemsRef.current[5] = el)} className={styles.DirectionsGrid__item}>
          <div className={styles.DirectionsGrid__text}>
            <h2 className={styles.DirectionsGrid__subtitle}>Инженерия</h2>
            <p>
              Разработка внутренних <br></br>и&nbsp;наружных инженерных систем
            </p>
          </div>
          <img src={directionImg5}></img>
        </div>
      </section>
    </>
  );
};

export default DirectionsGrid;
