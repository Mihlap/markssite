import React, { useEffect, useState } from 'react';
import styles from "../Company/Company.module.css";

import bracket from "../icons/bracket.svg";

const CounterCompanyMobile = () => {
  const [countPercentM, setCountPercentM] = useState(0);
  const [countHumanM, setCountHumanM] = useState(0);
  const [countProjectM, setCountProjectM] = useState(0);
  const [activeCounter, setActiveCounter] = useState(0);
  const [finishedCounters, setFinishedCounters] = useState([]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (countPercentM < 80 && activeCounter === 0) {
        setCountPercentM(countPercentM + 2);
      }
      if (countHumanM < 700 && activeCounter === 1) {
        setCountHumanM(countHumanM + 20);
      }
      if (countProjectM < 200 && activeCounter === 2) {
        setCountProjectM(countProjectM + 5);
      }
    }, 70);
    return () => clearTimeout(timer1);
  }, [countPercentM, countHumanM, countProjectM, activeCounter]);

  useEffect(() => {
    if (countPercentM >= 80 && !finishedCounters.includes(0)) {
      setActiveCounter(1);
      setFinishedCounters([...finishedCounters, 0]);
    }
    if (countHumanM >= 700 && !finishedCounters.includes(1)) {
      setActiveCounter(2);
      setFinishedCounters([...finishedCounters, 1]);
    }
    if (countProjectM >= 200 && !finishedCounters.includes(2)) {
      setFinishedCounters([...finishedCounters, 2]);
    }
  }, [countPercentM, countHumanM, countProjectM, finishedCounters]);

  return (
    <div className={styles.div_counter_wrapper}>
      {activeCounter === 0 && (
        <div className={styles.container_text}>
          <div className={styles.div_underSlider_text}>
            <div className={styles.text_svg}>
              <img src={bracket} alt="bracket" />
            </div>
            <p>{countPercentM}%</p>
          </div>
          <span className={styles.span_underSlider_text}>
            Объем работ выполняем собственными силами
          </span>
        </div>
      )}
      {activeCounter === 1 && (
        <div className={styles.container_text}>
          <div className={styles.div_underSlider_text}>
            <div className={styles.text_svg}>
              <img src={bracket} alt="bracket" />
            </div>
            <p>{countHumanM}</p>
          </div>
          <span className={styles.span_underSlider_text}>
            Квалифицированных сотрудников
          </span>
        </div>
      )}
      {activeCounter === 2 && (
        <div className={styles.container_text}>
          <div className={styles.div_underSlider_text}>
            <div className={styles.text_svg}>
              <img src={bracket} alt="bracket" />
            </div>
            <p>{countProjectM}</p>
          </div>
          <span className={styles.span_underSlider_text}>
            Проектов реализовано
          </span>
        </div>
      )}
    </div>
  );
};

export default CounterCompanyMobile;
