import React, { useEffect, useState } from 'react'
import styles from "./Loading.module.css";
export default function Loading() {

    
  const [percent, setPercent] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const loading = setInterval(() => {
      if (percent === 100 && progressWidth === 400) {
        clearInterval(loading);
      } else {
        setPercent((prevPercent) => prevPercent + 1);
        setProgressWidth((prevWidth) => prevWidth + 4);
      }
    }, 50);

    return () => clearInterval(loading);
  }, [percent, progressWidth]);

  return (
    <div className={styles.contentLoaderContainer}>
      <div className={styles.contentLoaderBlock}>
        <div className={`full ${styles.granimate}`}>
          <h1 className={styles.contentLoaderTitle}>MARKS GROUP</h1>
          <div className={styles.contentLoaderSubtitle}>
            ГЕНЕРАЛЬНОЕ ПРОЕКТИРОВАНИЕ
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
          <div className={styles.loadingProgresBar}>
            <div className={styles.loadingProgresBar}>
              <div
                className={styles.progress}
                style={{ width: `${progressWidth}px` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
