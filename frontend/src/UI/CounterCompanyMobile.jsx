import React, { useEffect, useRef, useState } from 'react';
import gsap from "gsap";
import styles from "../Company/Company.module.css";

import bracket from "../icons/bracket.svg";

const CounterCompanyMobile = () => {
  const [countPercentM, setCountPercentM] = useState(0);
  const [countHumanM, setCountHumanM] = useState(0);
  const [countProjectM, setCountProjectM] = useState(0);
  const [activeCounter, setActiveCounter] = useState(0);
  const [finishedCounters, setFinishedCounters] = useState([]);
  const blockSlider = useRef();
    

  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (countPercentM < 96 && activeCounter === 0) {
        setCountPercentM(countPercentM + 2);
      }
      if (countHumanM < 1000 && activeCounter === 1) {
        setCountHumanM(countHumanM + 20);
      }
      if (countProjectM < 200 && activeCounter === 2) {
        setCountProjectM(countProjectM + 5);
      }
    }, 50);
  
   
    const delayTimer = setTimeout(() => {
      if (countPercentM >= 96 && !finishedCounters.includes(0)) {
        setActiveCounter(1);
        setFinishedCounters([...finishedCounters, 0]);
      }
      if (countHumanM >= 1000 && !finishedCounters.includes(1)) {
        setActiveCounter(2);
        setFinishedCounters([...finishedCounters, 1]);
      }
      if (countProjectM >= 200 && !finishedCounters.includes(2)) {
        setFinishedCounters([...finishedCounters, 2]);
      }
    }, 500); 
  
    return () => {
      clearTimeout(timer1);
      clearTimeout(delayTimer);
    };
  }, [countPercentM, countHumanM, countProjectM, activeCounter, finishedCounters]);
  

  useEffect(() => {
    const elements = blockSlider.current.children;

    gsap.from(elements, {
      x: "-100%",
      duration: 1,
      stagger: 0.5,
      ease: "power2.out"
    });
  }, [activeCounter]);

  return (
    <div className={styles.div_counter_wrapper}>
      <div ref={blockSlider} className={styles.container_text}>
        <div className={styles.div_underSlider_text}>
          <div className={styles.text_svg}>
            <img src={bracket} alt="bracket" />
          </div>
          {activeCounter === 0 && <p>{countPercentM}%</p>}
          {activeCounter === 1 && <p>{countHumanM}</p>}
          {activeCounter === 2 && <p>{countProjectM}</p>}
        </div>
        <span className={styles.span_underSlider_text}>
          {activeCounter === 0 && "Объем работ выполняем собственными силами"}
          {activeCounter === 1 && "Квалифицированных сотрудников"}
          {activeCounter === 2 && "Проектов реализовано"}
        </span>
      </div>
    </div>
  );
};

export default CounterCompanyMobile;
