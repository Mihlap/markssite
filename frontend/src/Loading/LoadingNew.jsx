import React, { useEffect, useState } from 'react'
import styles from "./LoadingNew.module.css";
import logo from "../icons/logowhite.svg"


export default function Loading() {    
  const [percent, setPercent] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const loading = setInterval(() => {
      if (percent === 100 && progressWidth === 200) {
        clearInterval(loading);
      } else {
        setPercent((prevPercent) => prevPercent + 2);
        setProgressWidth((prevWidth) => prevWidth + 4);
      }
    }, 40);
// testfdfd
    // sdfsdf
    return () => clearInterval(loading);
  }, [percent, progressWidth]);

  return (
    <div className={styles.contentLoaderContainer}>
      <div className={styles.contentLoaderCircles}>
        <div className={`${styles.ellipseFirst} ${styles.ellipseAll}`}></div>
        <div className={`${styles.ellipseSecond} ${styles.ellipseAll}`}></div>
        <div className={`${styles.ellipseThird} ${styles.ellipseAll}`}></div>
        <div className={`${styles.ellipseFour} ${styles.ellipseAll}`}></div>
      </div>
      <div className={styles.contentLoaderBlock}>
        <div className={styles.conentLoaderLogo}>
          <img className={styles.itemLoaderLogo} src={logo} alt="marksgroup"/>
          <div className={styles.contentLoaderSubtitle}>
            ГЕНЕРАЛЬНОЕ&nbsp;ПРОЕКТИРОВАНИЕ
          </div>
        </div>
        <div className={styles.loadingContainer}>
          <div
            className={`${styles.percent} ${
              percent === 100 ? styles.textBlink : ""
            }`}
          >
            {percent}%
          </div>
          <div className={styles.contantDot}>
            <svg className={styles.filter} version="1.1">
              <defs>
                <filter id="gooeyness">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="gooeyness" />
                  <feComposite in="SourceGraphic" in2="gooeyness" operator="atop" />
                </filter>
              </defs>
            </svg>
            <div className={styles.dots}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>
          {/* <div className={styles.loadingProgresBar}>
            <div className={styles.loadingProgresBar}>
              <div
                className={styles.progress}
                style={{ width: `${progressWidth}px` }}
              ></div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
