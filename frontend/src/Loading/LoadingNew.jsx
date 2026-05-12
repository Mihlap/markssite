import { useEffect, useRef, useState } from 'react';
import styles from './LoadingNew.module.css';
import logo from '../icons/logowhite.svg';

export default function LoadingNew({ isReady = false, onFinish }) {
  const [percent, setPercent] = useState(0);
  const finishCalledRef = useRef(false);

  useEffect(() => {
    if (finishCalledRef.current) return;

    const step = isReady ? 4 : 1;
    const delay = isReady ? 20 : 80;

    const timer = setTimeout(() => {
      setPercent((prev) => {
        let next = prev + step;
        if (next > 100) next = 100;

        if (isReady && next === 100 && !finishCalledRef.current) {
          finishCalledRef.current = true;
          setTimeout(() => {
            onFinish?.();
          }, 300);
        }

        return next;
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [percent, isReady, onFinish]);

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
          <img className={styles.itemLoaderLogo} src={logo} alt="marksgroup" />
          <div className={styles.contentLoaderSubtitle}>ГЕНЕРАЛЬНОЕ&nbsp;ПРОЕКТИРОВАНИЕ</div>
        </div>
        <div className={styles.loadingContainer}>
          <div className={`${styles.percent} ${percent === 100 ? styles.textBlink : ''}`}>{percent}%</div>
          <div className={styles.contantDot}>
            <svg className={styles.filter} version="1.1">
              <defs>
                <filter id="gooeyness">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                    result="gooeyness"
                  />
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
        </div>
      </div>
    </div>
  );
}
