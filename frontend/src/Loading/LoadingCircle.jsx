import React from 'react'
import styles from "./Loading.module.css";

export default function LoadingCircle() {
  return (
    <div className={styles.loader_container}>
      <div className={styles.loader}></div>
    </div>
  );
}
