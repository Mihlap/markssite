import React from 'react';
import styles from './MiniLoading.module.scss';

export default function MiniLoading() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '55%',
        right: '45%',
      }}
    >
      <div className={styles.div_svg}>
        <svg
          className={styles.spinner}
          width="41.25px" // уменьшено ещё в 2 раза
          height="41.25px" // уменьшено ещё в 2 раза
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className={styles.path}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            cx="33"
            cy="33"
            r="26"
          ></circle>
        </svg>
      </div>
    </div>
  );
}
