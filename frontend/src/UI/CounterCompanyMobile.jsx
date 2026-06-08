import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from '../Company/Company.module.scss';

import bracket from '../icons/bracket.svg';

const TARGETS = {
  specialists: 1300,
  projects: 200,
  years: 20,
};

const CounterCompanyMobile = ({ armed = false }) => {
  const [countPercentM, setCountPercentM] = useState(0);
  const [countHumanM, setCountHumanM] = useState(0);
  const [countProjectM, setCountProjectM] = useState(0);
  const [activeCounter, setActiveCounter] = useState(0);
  const [finishedCounters, setFinishedCounters] = useState([]);
  const blockSlider = useRef(null);

  useEffect(() => {
    if (!armed) return;

    const timer1 = setTimeout(() => {
      if (countPercentM < TARGETS.specialists && activeCounter === 0) {
        setCountPercentM((value) => value + 20);
      }
      if (countProjectM < TARGETS.projects && activeCounter === 1) {
        setCountProjectM((value) => value + 5);
      }
      if (countHumanM < TARGETS.years && activeCounter === 2) {
        setCountHumanM((value) => value + 1);
      }
    }, 50);

    const delayTimer = setTimeout(() => {
      if (countPercentM >= TARGETS.specialists && !finishedCounters.includes(0)) {
        setActiveCounter(1);
        setFinishedCounters((prev) => [...prev, 0]);
      }
      if (countProjectM >= TARGETS.projects && !finishedCounters.includes(1)) {
        setActiveCounter(2);
        setFinishedCounters((prev) => [...prev, 1]);
      }
      if (countHumanM >= TARGETS.years - 1 && !finishedCounters.includes(2)) {
        setFinishedCounters((prev) => [...prev, 2]);
      }
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(delayTimer);
    };
  }, [armed, countPercentM, countHumanM, countProjectM, activeCounter, finishedCounters]);

  useEffect(() => {
    if (!armed || !blockSlider.current) return;

    const elements = blockSlider.current.children;

    gsap.from(elements, {
      x: '-100%',
      duration: 1,
      stagger: 0.5,
      ease: 'power2.out',
    });
  }, [armed, activeCounter]);

  return (
    <div className={styles.div_counter_wrapper}>
      <div ref={blockSlider} className={styles.container_text}>
        <div className={styles.div_underSlider_text}>
          <div className={styles.text_svg}>
            <img src={bracket} alt="bracket" />
          </div>
          {activeCounter === 0 && <p>{countPercentM}</p>}
          {activeCounter === 1 && <p>{countProjectM}</p>}
          {activeCounter === 2 && <p>{countHumanM}</p>}
        </div>
        <span className={styles.span_underSlider_text}>
          {activeCounter === 0 && ' Квалифицированных специалистов'}
          {activeCounter === 1 && 'Проектов реализовано'}
          {activeCounter === 2 && 'Лет на рынке'}
        </span>
      </div>
    </div>
  );
};

export default CounterCompanyMobile;
