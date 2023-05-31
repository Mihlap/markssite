import React, { useEffect, useRef, useState } from "react";
import styles from "./Company.module.css";
import Company_Slider from "../UI/Company_Slider/Company_Slider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SliderMobile from '../UI/SliderHeader/SliderMobile';

import bracket from "../icons/bracket.svg";


export default function Company() {
  const [countPercent, setCountPercent] = useState(0);
  const [countHuman, setCountHuman] = useState(0);
  const [countProject, setCountProject] = useState(0)
  const blockSlider = useRef(null);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      if (countPercent < 80) {
        setCountPercent(countPercent + 2);
      }
      if (countHuman < 700) {
        setCountHuman(countHuman + 20);
      }
      if (countProject < 200) {
        setCountProject(countProject + 5);
      }
    }, 80);
    return () => clearTimeout(timer1);
  }, [countPercent, countHuman, countProject]);
  
  useEffect(() => {
    window.scrollTo(20, 0);

    gsap.registerPlugin(ScrollTrigger);

    const { elementsRight } = {elementsRight: [blockSlider.current],};

      gsap.from(elementsRight, {
        x: "-100%",
        opacity: 0,
        duration: 1.5,
        delay: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: elementsRight,
          start: "top 80%",
        },
      });
     }, []);

  

  return (
    <div className={styles.company_main}>
      <Company_Slider />
      <div ref={blockSlider} className={styles.underSlider_text_wrapper}>
        <span className={styles.span_underSlider_text1}>
          Самые крутые проекты! самой крутой командой
        </span>
        <span className={styles.span_underSlider_text2}>О компании</span>
        <div className={styles.div_counter_wrapper}>
          <div className={styles.container_text}>
            <div className={styles.div_underSlider_text}>
              <div className={styles.text_svg}>
                <img src={bracket} alt="bracket" />
              </div>
              <p>{countPercent}%</p>
            </div>
            <span className={styles.span_underSlider_text}>
              Объем работ выполняем собственными силами
            </span>
          </div>
          <div className={styles.container_text}>
          <div className={styles.div_underSlider_text}>
            <div className={styles.text_svg}>
              <img src={bracket} alt="bracket" />
            </div>
            <p>{countHuman}</p>
          </div>
          <span className={styles.span_underSlider_text}>
            Квалифицированных сотрудников
          </span>
          </div>
          <div className={styles.container_text}>
          <div className={styles.div_underSlider_text}>
            <div className={styles.text_svg}>
              <img src={bracket} alt="bracket" />
            </div>
            <p>{countProject}</p>
          </div>
          <span className={styles.span_underSlider_text}>
            Проектов реализовано
          </span>
          </div>
        </div>
      </div>
      <div className={styles.sliderMobile_wrapper}>
      <div className={styles.icon_partner}>
        <img src="./assets/D1.png" alt="logo" />
        <img src="./assets/D2.png" alt="logo" />
        <img src="./assets/D3.png" alt="logo" />
        <img src="./assets/D4.png" alt="logo" />
        <img src="./assets/D5.png" alt="logo" />
        <img src="./assets/D6.png" alt="logo" />
        <img src="./assets/D7.png" alt="logo" />
        <img src="./assets/D8.png" alt="logo" />
        <img src="./assets/D9.png" alt="logo" />
      </div>
        <SliderMobile/>
      </div>
    </div>
  );
}