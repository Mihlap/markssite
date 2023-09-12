import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import styles from "../Company/Company.module.css";

import {
  incrementDepartment,
  incrementGap,
  incrementScient,
  incrementScienceDegree,
} from "../store/Slice/counterSlice";

import bracket_dark from "../icons/bracket_dark.svg";

const CounterCompanyMobile2 = () => {
  const [counting, setCounting] = useState(true);
  const dispatch = useDispatch();
  const countDepartment = useSelector((state) => state.counter.countDepartment);
  const countGap = useSelector((state) => state.counter.countGap);
  const countScient = useSelector((state) => state.counter.countScient);
  const countScienceDegree = useSelector(
    (state) => state.counter.countScienceDegree
  );
  
  const [inViewRef, inView] = useInView({ threshold: 0.5 });
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  useEffect(() => {
    let timer1;
  let timer2;
  
  const runCounters = async () => {
    if (inView) {
      timer1 = setTimeout(() => {
        dispatch(incrementDepartment());
        dispatch(incrementScient());
        
        timer2 = setTimeout(() => {
          dispatch(incrementGap());
          dispatch(incrementScienceDegree());
          setCounting(false);
        }, 200);
      }, 150);
    }
  };

  runCounters();

  return () => {
    clearTimeout(timer1);
    clearTimeout(timer2);
  };
  }, [
    dispatch,
    countDepartment,
    countGap,
    countScient,
    countScienceDegree,
    inView,
  ]);
      
  useEffect(() => {
    if (inView) {
      gsap.from(ref1.current, { x: -100, opacity: 0,  stagger: 0.5,
        ease: "power2.out", duration: 0.5});
      if (!counting) {
       gsap.from(ref2.current, { x: -100, opacity: 0, stagger: 0.5,
        ease: "power2.out",  duration: 0.5});
   
      }
    }
  }, [counting]);

 
  return (
    <div className={styles.right_counter_wrapper} ref={inViewRef}>
      {counting ? (
        <div ref={ref1}>
          <div className={styles.container_text_right}>
            <div className={styles.div_underSlider_text_right}>
              <div className={styles.text_svg_right}>
                <img src={bracket_dark} alt="bracket_dark" />
              </div>
              <p className={styles.number}>{countDepartment}</p>
            </div>
            <span className={styles.span_underSlider_text_right}>
              Департаментов
            </span>
          </div>
          <div className={styles.container_text_right}>
            <div
              className={`${styles.div_underSlider_text_right} ${styles.div_underSlider_text_right_last}`}
            >
              <div className={styles.text_svg_right}>
                <img src={bracket_dark} alt="bracket_dark" />
              </div>
              <p className={styles.number}>{countScient}</p>
            </div>
            <span className={styles.span_underSlider_text_right}>
              Научных работ
            </span>
          </div>
        </div>
      ) : (
        <div ref={ref2}>
          <div className={styles.container_text_right}>
            <div className={styles.div_underSlider_text_right}>
              <div className={styles.text_svg_right}>
                <img src={bracket_dark} alt="bracket_dark" />
              </div>
              <p className={styles.number}>{countGap}</p>
            </div>
            <span className={styles.span_underSlider_text_right}>
              Проектов в качестве ГАП
            </span>
          </div>
          <div className={styles.container_text_right}>
            <div
              className={`${styles.div_underSlider_text_right} ${styles.div_underSlider_text_right_last}`}
            >
              <div className={styles.text_svg_right}>
                <img src={bracket_dark} alt="bracket_dark" />
              </div>
              <p className={styles.number}>{countScienceDegree}%</p>
            </div>
            <span className={styles.span_underSlider_text_right}>
              Сотрудников с научной степенью
            </span>
          </div>
          </div>
      )}
    </div>
  );
};

export default CounterCompanyMobile2;
