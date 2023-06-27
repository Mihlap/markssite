import React, { useEffect, useState } from 'react';
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from 'react-redux';
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

  const [ref, inView] = useInView({
    threshold: 0.5, 
  });

  useEffect(() => {
    let timer1;
    let timer2;
    let timer3;
    if (inView) {
      timer1 = setTimeout(() => {
        dispatch(incrementDepartment());
        dispatch(incrementScient());
      }, 50);
      
      timer2 = setTimeout(() => {
        dispatch(incrementGap());
        dispatch(incrementScienceDegree());
        setCounting(false);
      }, 100);
      timer3 = setTimeout(() => {
         }, 500); 
      }
          
          return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
          };
  }, [
    dispatch,
    countDepartment,
    countGap,
    countScient,
    countScienceDegree,
    inView,
  ]);
  
 
  return (
    <div ref={ref} className={styles.right_counter_wrapper}>
    {counting ? (
        <>
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
      </>
    ) : (
      <>
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
        </>
        )}
        </div>
 
  );
};

export default CounterCompanyMobile2;


