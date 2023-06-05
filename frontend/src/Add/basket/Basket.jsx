import React from 'react'
import styles from './Basket.module.scss'

export default function Basket() {
  return (
    <button
      className={styles.buttom_del}
    >
      <label htmlfor="delete" className={styles.label}>
        <div className={`${styles.wrapper}`}>
          <div className={`${styles.lid}`}></div>
          <div className={`${styles.can}`}></div>
          <span>delete</span>
        </div>
      </label>
    </button>
  );
}
